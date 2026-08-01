import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const eventos = sqliteTable("eventos", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  titulo: text("titulo").notNull(),
  descripcion: text("descripcion"),
  fecha: text("fecha").notNull(),
  hora: text("hora").notNull(),
  ubicacion: text("ubicacion").notNull(),
  capacidadMaxima: integer("capacidad_maxima").default(30),
  activo: integer("activo", { mode: "boolean" }).default(true),
  requierePago: integer("requiere_pago", { mode: "boolean" }).default(false),
  precio: integer("precio").default(0),
  metodosPago: text("metodos_pago").default("qr"),
  creadoEn: text("creado_en")
    .notNull()
    .default(sql`(datetime('now', 'localtime'))`),
});

export const clientes = sqliteTable("clientes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  nombreCompleto: text("nombre_completo").notNull(),
  edad: integer("edad").notNull(),
  idiomas: text("idiomas").notNull(),
  telefono: text("telefono"),
  email: text("email"),
  creadoEn: text("creado_en")
    .notNull()
    .default(sql`(datetime('now', 'localtime'))`),
});

export const reservas = sqliteTable("reservas", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  eventoId: integer("evento_id")
    .notNull()
    .references(() => eventos.id),
  clienteId: integer("cliente_id")
    .notNull()
    .references(() => clientes.id),
  esUsuarioNuevo: integer("es_usuario_nuevo", { mode: "boolean" }).notNull(),
  comoSeEntero: text("como_se_entero").notNull(),
  notas: text("notas"),
  metodoPago: text("metodo_pago"),
  comprobanteUrl: text("comprobante_url"),
  estado: text("estado").default("pendiente"),
  registradoEn: text("registrado_en")
    .notNull()
    .default(sql`(datetime('now', 'localtime'))`),
});

export type Evento = typeof eventos.$inferSelect;
export type NuevoEvento = typeof eventos.$inferInsert;
export type Cliente = typeof clientes.$inferSelect;
export type NuevoCliente = typeof clientes.$inferInsert;
export type Reserva = typeof reservas.$inferSelect;
export type NuevaReserva = typeof reservas.$inferInsert;

export type EstadoReserva = "pendiente" | "confirmado" | "rechazado";

export type ReservaConDetalles = Reserva & {
  cliente: Cliente;
  evento: Evento;
};

export type EventoConReservas = Evento & {
  reservas: (Reserva & { cliente: Cliente })[];
  totalReservas: number;
};
