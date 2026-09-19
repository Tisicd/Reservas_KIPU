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

  const pendientes = evento.reservas.filter((r) => r.estado === "pendiente").length;
  const confirmados = evento.reservas.filter((r) => r.estado === "confirmado").length;
  const rechazados = evento.reservas.filter((r) => r.estado === "rechazado").length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <Link href="/admin" className="btn-ghost text-sm mb-6 inline-flex">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12,19 5,12 12,5" />
        </svg>
        Volver al dashboard
      </Link>

      <div className="card p-6 mb-8">
        <h1 className="font-display text-2xl font-bold text-warm-900 mb-2">{evento.titulo}</h1>
        {evento.descripcion && <p className="text-warm-500 mb-4 leading-relaxed">{evento.descripcion}</p>}

        <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-warm-500 mb-4">
          <span className="inline-flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
            {formatearFecha(evento.fecha)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12,6 12,12 16,14" /></svg>
            {formatearHora(evento.hora)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
            {evento.ubicacion}
          </span>
        </div>

        <div className="flex flex-wrap gap-4 pt-4 border-t border-warm-100">
          {[
            { label: "Total", value: evento.totalReservas, color: "text-primary-600" },
            { label: "Confirmadas", value: confirmados, color: "text-success-500" },
            { label: "Pendientes", value: pendientes, color: "text-warning-500" },
            { label: "Rechazadas", value: rechazados, color: "text-error-500" },
            { label: "Cupos libres", value: (evento.capacidadMaxima ?? 30) - evento.totalReservas, color: "text-warm-500" },
          ].map((s) => (
            <div key={s.label} className="text-center px-3">
              <p className={`text-xl font-bold font-display ${s.color}`}>{s.value}</p>
              <p className="text-xs text-warm-400">{s.label}</p>
            </div>
          ))}
        </div>

        {evento.requierePago && (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-4 pt-4 border-t border-warm-100">
            <span className="text-sm font-medium text-warm-600">Pago:</span>
            {evento.precio != null && evento.precio > 0 ? (
              <span className="badge badge-primary">${(evento.precio / 100).toFixed(2)}</span>
            ) : (
              <span className="badge badge-warning">Sin precio fijo</span>
            )}
            <span className="text-sm text-warm-500">
              {evento.metodosPago
                ?.split(",")
                .map((m) => m.trim())
                .map((m) => (m === "qr" ? "De Una!" : m === "stripe" ? "Stripe" : "Efectivo"))
                .join(", ")}
            </span>
          </div>
        )}
      </div>

      <div className="card overflow-hidden">
        <div className="p-5 border-b border-warm-100 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-warm-900">Asistentes ({evento.totalReservas})</h2>
        </div>

        {evento.reservas.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-warm-50 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a8a29e" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
            </div>
            <p className="text-warm-400 text-sm">Aún no hay reservas para este evento.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-warm-50 text-left">
                  <th className="px-5 py-3 font-medium text-warm-500">Nombre</th>
                  <th className="px-5 py-3 font-medium text-warm-500">Edad</th>
                  <th className="px-5 py-3 font-medium text-warm-500">Idiomas</th>
                  <th className="px-5 py-3 font-medium text-warm-500">Tipo</th>
                  <th className="px-5 py-3 font-medium text-warm-500">Pago</th>
                  <th className="px-5 py-3 font-medium text-warm-500">Estado</th>
                  <th className="px-5 py-3 font-medium text-warm-500">Contacto</th>
                  <th className="px-5 py-3 font-medium text-warm-500">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-warm-100">
                {evento.reservas.map((reserva) => (
                  <tr key={reserva.id} className="hover:bg-warm-50/50 transition-colors">
                    <td className="px-5 py-3 font-medium text-warm-800">{reserva.cliente.nombreCompleto}</td>
                    <td className="px-5 py-3 text-warm-500">{reserva.cliente.edad}</td>
                    <td className="px-5 py-3 text-warm-500">{reserva.cliente.idiomas}</td>
                    <td className="px-5 py-3">
                      <span className={reserva.esUsuarioNuevo ? "badge badge-success" : "badge badge-warning"}>
                        {reserva.esUsuarioNuevo ? "Nuevo" : "Frecuente"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-warm-500 text-xs">
                      {reserva.metodoPago === "qr" ? "De Una!" : reserva.metodoPago === "stripe" ? "Stripe" : reserva.metodoPago === "efectivo" ? "Efectivo" : "—"}
                    </td>
                    <td className="px-5 py-3">
                      <span className={
                        reserva.estado === "confirmado" ? "badge badge-success" :
                        reserva.estado === "pendiente" ? "badge badge-warning" : "badge badge-error"
                      }>
                        {reserva.estado === "confirmado" ? "Confirmado" : reserva.estado === "pendiente" ? "Pendiente" : "Rechazado"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-warm-500 text-xs">{reserva.cliente.telefono || reserva.cliente.email || "—"}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        {reserva.comprobanteUrl && (
                          <a href={reserva.comprobanteUrl} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-800 text-xs font-medium">
                            Ver
                          </a>
                        )}
                        {reserva.estado === "pendiente" && <BotonEstadoReserva reservaId={reserva.id} accion="aprobar" />}
                        {reserva.estado !== "rechazado" && <BotonEstadoReserva reservaId={reserva.id} accion="rechazar" />}
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
