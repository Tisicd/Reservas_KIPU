export const dynamic = "force-dynamic";

import { getEstadisticas, getTodosEventos } from "@/lib/actions";
import { formatearFecha, formatearHora } from "@/lib/constants";
import Link from "next/link";
import FormularioEvento from "@/components/FormularioEvento";
import { getReservasCount } from "@/lib/actions";

export default async function AdminPage() {
  const stats = await getEstadisticas();
  const eventos = await getTodosEventos();

  const eventosConReservas = await Promise.all(
    eventos.map(async (e) => ({
      ...e,
      reservas: await getReservasCount(e.id),
    }))
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-warm-900 mb-1">Dashboard</h1>
        <p className="text-warm-500">Gestiona eventos y revisa las reservas</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-10">
        {[
          { label: "Eventos totales", value: stats.totalEventos },
          { label: "Clientes registrados", value: stats.totalClientes },
          { label: "Reservas totales", value: stats.totalReservas },
        ].map((s, i) => (
          <div key={s.label} className={`card p-6 text-center animate-fade-in-up stagger-${i + 1}`}>
            <p className="text-3xl font-bold text-primary-600 font-display">{s.value}</p>
            <p className="text-sm text-warm-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2">
          <FormularioEvento />
        </div>

        <div className="lg:col-span-3">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-lg font-bold text-warm-900">Eventos</h2>
              <Link href="/admin/clientes" className="btn-ghost text-sm">
                Ver clientes
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12,5 19,12 12,19" />
                </svg>
              </Link>
            </div>

            {eventosConReservas.length === 0 ? (
              <div className="text-center py-10">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-warm-50 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a8a29e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
                <p className="text-warm-400 text-sm">Aún no hay eventos. Crea el primero.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {eventosConReservas.map((evento, idx) => (
                  <Link
                    key={evento.id}
                    href={`/admin/eventos/${evento.id}`}
                    className={`block p-4 rounded-xl border border-warm-200 hover:border-primary-300 hover:bg-primary-50/30 transition-all duration-200 animate-fade-in-up stagger-${Math.min(idx + 1, 6)}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-warm-800">
                          {evento.titulo}
                          {!evento.activo && (
                            <span className="ml-2 badge badge-error text-[10px]">Inactivo</span>
                          )}
                        </h3>
                        <p className="text-sm text-warm-500 mt-1">
                          {formatearFecha(evento.fecha)} · {formatearHora(evento.hora)}
                        </p>
                        <p className="text-sm text-warm-400 mt-0.5 flex items-center gap-1">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                          {evento.ubicacion}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="badge badge-primary">
                          {evento.reservas}/{evento.capacidadMaxima} reservas
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
