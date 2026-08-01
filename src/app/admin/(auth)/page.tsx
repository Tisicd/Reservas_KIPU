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
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-stone-900 mb-1">Administración</h1>
        <p className="text-stone-600">Gestiona eventos y revisa las reservas</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-10">
        <div className="card p-5 text-center">
          <p className="text-3xl font-bold text-violet-700">{stats.totalEventos}</p>
          <p className="text-sm text-stone-600 mt-1">Eventos totales</p>
        </div>
        <div className="card p-5 text-center">
          <p className="text-3xl font-bold text-violet-700">{stats.totalClientes}</p>
          <p className="text-sm text-stone-600 mt-1">Clientes registrados</p>
        </div>
        <div className="card p-5 text-center">
          <p className="text-3xl font-bold text-violet-700">{stats.totalReservas}</p>
          <p className="text-sm text-stone-600 mt-1">Reservas totales</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2">
          <FormularioEvento />
        </div>

        <div className="lg:col-span-3">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-stone-900">Eventos</h2>
              <Link
                href="/admin/clientes"
                className="text-sm text-violet-600 hover:text-violet-800 font-medium"
              >
                Ver clientes →
              </Link>
            </div>

            {eventosConReservas.length === 0 ? (
              <p className="text-stone-500 text-center py-8">
                Aún no hay eventos. Crea el primero.
              </p>
            ) : (
              <div className="space-y-3">
                {eventosConReservas.map((evento) => (
                  <Link
                    key={evento.id}
                    href={`/admin/eventos/${evento.id}`}
                    className="block p-4 rounded-xl border border-stone-200 hover:border-violet-300 hover:bg-violet-50/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-stone-900">
                          {evento.titulo}
                          {!evento.activo && (
                            <span className="ml-2 text-xs bg-stone-200 text-stone-600 px-2 py-0.5 rounded-full">
                              Inactivo
                            </span>
                          )}
                        </h3>
                        <p className="text-sm text-stone-600 mt-1">
                          {formatearFecha(evento.fecha)} · {formatearHora(evento.hora)}
                        </p>
                        <p className="text-sm text-stone-500 mt-0.5">
                          📍 {evento.ubicacion}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-sm font-medium text-violet-700">
                          {evento.reservas}/{evento.capacidadMaxima}
                        </span>
                        <p className="text-xs text-stone-500">reservas</p>
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
