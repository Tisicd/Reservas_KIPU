export const dynamic = "force-dynamic";

import { getEventoConReservas } from "@/lib/actions";
import { formatearFecha, formatearHora } from "@/lib/constants";
import { notFound } from "next/navigation";
import Link from "next/link";
import BotonEliminarReserva from "@/components/BotonEliminarReserva";
import BotonEstadoReserva from "@/components/BotonEstadoReserva";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EventoDetallePage({ params }: Props) {
  const { id } = await params;
  const evento = await getEventoConReservas(parseInt(id));

  if (!evento) notFound();

  const nuevos = evento.reservas.filter((r) => r.esUsuarioNuevo).length;
  const recurrentes = evento.reservas.length - nuevos;
  const pendientes = evento.reservas.filter((r) => r.estado === "pendiente").length;
  const confirmados = evento.reservas.filter((r) => r.estado === "confirmado").length;
  const rechazados = evento.reservas.filter((r) => r.estado === "rechazado").length;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <Link
        href="/admin"
        className="text-sm text-violet-600 hover:text-violet-800 font-medium mb-6 inline-block"
      >
        ← Volver a administración
      </Link>

      <div className="card p-6 mb-8">
        <h1 className="text-2xl font-bold text-stone-900 mb-2">{evento.titulo}</h1>
        {evento.descripcion && (
          <p className="text-stone-600 mb-4">{evento.descripcion}</p>
        )}
        <div className="flex flex-wrap gap-4 text-sm text-stone-600">
          <span>📅 {formatearFecha(evento.fecha)}</span>
          <span>🕐 {formatearHora(evento.hora)}</span>
          <span>📍 {evento.ubicacion}</span>
        </div>
        <div className="flex gap-4 mt-4 pt-4 border-t border-stone-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-violet-700">{evento.totalReservas}</p>
            <p className="text-xs text-stone-500">Total reservas</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-emerald-600">{confirmados}</p>
            <p className="text-xs text-stone-500">Confirmadas</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-amber-600">{pendientes}</p>
            <p className="text-xs text-stone-500">Pendientes</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-500">{rechazados}</p>
            <p className="text-xs text-stone-500">Rechazadas</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-stone-600">
              {(evento.capacidadMaxima ?? 30) - evento.totalReservas}
            </p>
            <p className="text-xs text-stone-500">Cupos libres</p>
          </div>
        </div>

        {(evento.requierePago) && (
          <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-stone-200">
            <span className="text-sm font-medium text-stone-700">Pago:</span>
            {evento.precio != null && evento.precio > 0 ? (
              <span className="text-sm font-bold text-violet-700">
                ${(evento.precio / 100).toFixed(2)}
              </span>
            ) : (
              <span className="text-sm text-stone-500">Sin precio fijo</span>
            )}
            <span className="text-stone-300">|</span>
            <span className="text-sm text-stone-600">
              Métodos:{" "}
              {evento.metodosPago
                ?.split(",")
                .map((m) => m.trim())
                .map((m) =>
                  m === "qr" ? "📱 De Una!" : m === "stripe" ? "💳 Stripe" : "🏷️ Efectivo"
                )
                .join(", ")}
            </span>
          </div>
        )}
      </div>

      <div className="card overflow-hidden">
        <div className="p-5 border-b border-stone-200">
          <h2 className="text-lg font-semibold text-stone-900">
            Lista de asistentes ({evento.totalReservas})
          </h2>
        </div>

        {evento.reservas.length === 0 ? (
          <p className="text-stone-500 text-center py-10">
            Aún no hay reservas para este evento.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-stone-50 text-left">
                  <th className="px-5 py-3 font-medium text-stone-600">Nombre</th>
                  <th className="px-5 py-3 font-medium text-stone-600">Edad</th>
                  <th className="px-5 py-3 font-medium text-stone-600">Idiomas</th>
                  <th className="px-5 py-3 font-medium text-stone-600">Tipo</th>
                  <th className="px-5 py-3 font-medium text-stone-600">Pago</th>
                  <th className="px-5 py-3 font-medium text-stone-600">Estado</th>
                  <th className="px-5 py-3 font-medium text-stone-600">Contacto</th>
                  <th className="px-5 py-3 font-medium text-stone-600">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {evento.reservas.map((reserva) => (
                  <tr key={reserva.id} className="hover:bg-stone-50">
                    <td className="px-5 py-3 font-medium text-stone-900">
                      {reserva.cliente.nombreCompleto}
                    </td>
                    <td className="px-5 py-3 text-stone-600">{reserva.cliente.edad}</td>
                    <td className="px-5 py-3 text-stone-600">{reserva.cliente.idiomas}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${
                          reserva.esUsuarioNuevo
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {reserva.esUsuarioNuevo ? "Nuevo" : "Frecuente"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-stone-600">
                      {reserva.metodoPago === "qr"
                        ? "📱 De Una!"
                        : reserva.metodoPago === "stripe"
                          ? "💳 Stripe"
                          : reserva.metodoPago === "efectivo"
                            ? "🏷️ Efectivo"
                            : "—"}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${
                          reserva.estado === "confirmado"
                            ? "bg-emerald-100 text-emerald-700"
                            : reserva.estado === "pendiente"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        {reserva.estado === "confirmado"
                          ? "Confirmado"
                          : reserva.estado === "pendiente"
                            ? "Pendiente"
                            : "Rechazado"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-stone-600">
                      {reserva.cliente.telefono || reserva.cliente.email || "—"}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        {reserva.comprobanteUrl && (
                          <a
                            href={reserva.comprobanteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-violet-600 hover:text-violet-800 text-xs font-medium"
                          >
                            Ver comprobante
                          </a>
                        )}
                        {reserva.estado === "pendiente" && (
                          <BotonEstadoReserva
                            reservaId={reserva.id}
                            accion="aprobar"
                          />
                        )}
                        {reserva.estado !== "rechazado" && (
                          <BotonEstadoReserva
                            reservaId={reserva.id}
                            accion="rechazar"
                          />
                        )}
                        <BotonEliminarReserva reservaId={reserva.id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
