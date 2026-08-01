import { db } from "@/db";
import { clientes, eventos, reservas } from "@/db/schema";
import { eq, desc, and, count, sql } from "drizzle-orm";
import type { EventoConReservas, EstadoReserva } from "@/db/schema";

export async function getEventosActivos() {
  return db
    .select()
    .from(eventos)
    .where(eq(eventos.activo, true))
    .orderBy(eventos.fecha, eventos.hora);
}

export async function getTodosEventos() {
  return db.select().from(eventos).orderBy(desc(eventos.fecha));
}

export async function getEventoById(id: number) {
  const [evento] = await db.select().from(eventos).where(eq(eventos.id, id));
  return evento ?? null;
}

export async function getEventoConReservas(id: number): Promise<EventoConReservas | null> {
  const evento = await getEventoById(id);
  if (!evento) return null;

  const reservasConClientes = await db
    .select({
      reserva: reservas,
      cliente: clientes,
    })
    .from(reservas)
    .innerJoin(clientes, eq(reservas.clienteId, clientes.id))
    .where(eq(reservas.eventoId, id))
    .orderBy(desc(reservas.registradoEn));

  return {
    ...evento,
    reservas: reservasConClientes.map((r) => ({
      ...r.reserva,
      cliente: r.cliente,
    })),
    totalReservas: reservasConClientes.length,
  };
}

export async function getReservasCount(eventoId: number) {
  const [result] = await db
    .select({ total: count() })
    .from(reservas)
    .where(eq(reservas.eventoId, eventoId));
  return result?.total ?? 0;
}

export async function getReservasConfirmadasCount(eventoId: number) {
  const [result] = await db
    .select({ total: count() })
    .from(reservas)
    .where(
      and(
        eq(reservas.eventoId, eventoId),
        eq(reservas.estado, "confirmado")
      )
    );
  return result?.total ?? 0;
}

export async function clienteHaAsistidoAntes(clienteId: number): Promise<boolean> {
  const [result] = await db
    .select({ total: count() })
    .from(reservas)
    .where(eq(reservas.clienteId, clienteId));
  return (result?.total ?? 0) > 0;
}

export async function buscarClientePorNombre(nombreCompleto: string) {
  const [cliente] = await db
    .select()
    .from(clientes)
    .where(sql`LOWER(${clientes.nombreCompleto}) = LOWER(${nombreCompleto.trim()})`);
  return cliente ?? null;
}

export async function getTodosClientes() {
  return db.select().from(clientes).orderBy(desc(clientes.creadoEn));
}

export async function getEstadisticas() {
  const [totalClientes] = await db.select({ total: count() }).from(clientes);
  const [totalEventos] = await db.select({ total: count() }).from(eventos);
  const [totalReservas] = await db.select({ total: count() }).from(reservas);

  const proximosEventos = await db
    .select()
    .from(eventos)
    .where(and(eq(eventos.activo, true), sql`${eventos.fecha} >= date('now')`))
    .orderBy(eventos.fecha)
    .limit(5);

  return {
    totalClientes: totalClientes?.total ?? 0,
    totalEventos: totalEventos?.total ?? 0,
    totalReservas: totalReservas?.total ?? 0,
    proximosEventos,
  };
}

export async function crearEvento(data: {
  titulo: string;
  descripcion?: string;
  fecha: string;
  hora: string;
  ubicacion: string;
  capacidadMaxima?: number;
  requierePago?: boolean;
  precio?: number;
  metodosPago?: string;
}) {
  const [evento] = await db
    .insert(eventos)
    .values({
      titulo: data.titulo,
      descripcion: data.descripcion,
      fecha: data.fecha,
      hora: data.hora,
      ubicacion: data.ubicacion,
      capacidadMaxima: data.capacidadMaxima ?? 30,
      requierePago: data.requierePago ?? false,
      precio: data.precio ?? 0,
      metodosPago: data.metodosPago ?? "qr",
    })
    .returning();
  return evento;
}

export async function actualizarEvento(
  id: number,
  data: Partial<{
    titulo: string;
    descripcion: string;
    fecha: string;
    hora: string;
    ubicacion: string;
    capacidadMaxima: number;
    activo: boolean;
    requierePago: boolean;
    precio: number;
    metodosPago: string;
  }>
) {
  const [evento] = await db
    .update(eventos)
    .set(data)
    .where(eq(eventos.id, id))
    .returning();
  return evento;
}

export async function crearReserva(data: {
  eventoId: number;
  nombreCompleto: string;
  edad: number;
  idiomas: string;
  comoSeEntero: string;
  telefono?: string;
  email?: string;
  notas?: string;
  metodoPago?: string;
  comprobanteUrl?: string;
}) {
  const evento = await getEventoById(data.eventoId);
  if (!evento) throw new Error("Evento no encontrado");
  if (!evento.activo) throw new Error("Este evento ya no acepta reservas");

  const reservasActuales = await getReservasCount(data.eventoId);
  if (reservasActuales >= (evento.capacidadMaxima ?? 30)) {
    throw new Error("El evento ha alcanzado su capacidad máxima");
  }

  let cliente = await buscarClientePorNombre(data.nombreCompleto);
  let esUsuarioNuevo = true;

  if (cliente) {
    esUsuarioNuevo = !(await clienteHaAsistidoAntes(cliente.id));
    await db
      .update(clientes)
      .set({
        edad: data.edad,
        idiomas: data.idiomas,
        telefono: data.telefono ?? cliente.telefono,
        email: data.email ?? cliente.email,
      })
      .where(eq(clientes.id, cliente.id));
  } else {
    const [nuevoCliente] = await db
      .insert(clientes)
      .values({
        nombreCompleto: data.nombreCompleto.trim(),
        edad: data.edad,
        idiomas: data.idiomas,
        telefono: data.telefono,
        email: data.email,
      })
      .returning();
    cliente = nuevoCliente;
  }

  const reservaExistente = await db
    .select()
    .from(reservas)
    .where(
      and(eq(reservas.eventoId, data.eventoId), eq(reservas.clienteId, cliente.id))
    );

  if (reservaExistente.length > 0) {
    throw new Error("Ya tienes una reserva para este evento");
  }

  const [reserva] = await db
    .insert(reservas)
    .values({
      eventoId: data.eventoId,
      clienteId: cliente.id,
      esUsuarioNuevo,
      comoSeEntero: data.comoSeEntero,
      notas: data.notas,
      metodoPago: data.metodoPago ?? null,
      comprobanteUrl: data.comprobanteUrl ?? null,
      estado: "pendiente",
    })
    .returning();

  return { reserva, cliente, esUsuarioNuevo, evento };
}

export async function aprobarReserva(id: number) {
  const [reserva] = await db
    .update(reservas)
    .set({ estado: "confirmado" })
    .where(eq(reservas.id, id))
    .returning();
  return reserva;
}

export async function rechazarReserva(id: number) {
  const [reserva] = await db
    .update(reservas)
    .set({ estado: "rechazado" })
    .where(eq(reservas.id, id))
    .returning();
  return reserva;
}

export async function eliminarReserva(id: number) {
  await db.delete(reservas).where(eq(reservas.id, id));
}
