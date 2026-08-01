export const dynamic = "force-dynamic";

import { getEventosActivos } from "@/lib/actions";
import { formatearFecha, formatearHora } from "@/lib/constants";
import Link from "next/link";
import { getReservasCount } from "@/lib/actions";

export default async function HomePage() {
  const eventos = await getEventosActivos();

  const eventosConCupos = await Promise.all(
    eventos.map(async (evento) => ({
      ...evento,
      reservas: await getReservasCount(evento.id),
    }))
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold text-stone-900 mb-3">
          Reserva tu lugar
        </h1>
        <p className="text-lg text-stone-600 max-w-2xl mx-auto">
          Únete a nuestros eventos de intercambio cultural. Conoce personas de
          diferentes países, practica idiomas y vive experiencias únicas.
        </p>
      </section>

      {eventosConCupos.length === 0 ? (
        <div className="card p-12 text-center">
          <span className="text-5xl mb-4 block">📅</span>
          <h2 className="text-xl font-semibold text-stone-800 mb-2">
            No hay eventos disponibles
          </h2>
          <p className="text-stone-500">
            Pronto publicaremos nuevos eventos. ¡Vuelve a visitarnos!
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {eventosConCupos.map((evento) => {
            const cuposDisponibles =
              (evento.capacidadMaxima ?? 30) - evento.reservas;
            const lleno = cuposDisponibles <= 0;

            return (
              <article
                key={evento.id}
                className="card p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-stone-900 mb-2">
                      {evento.titulo}
                    </h2>
                    {evento.descripcion && (
                      <p className="text-stone-600 mb-4">{evento.descripcion}</p>
                    )}
                    <div className="flex flex-wrap gap-4 text-sm text-stone-600">
                      <span className="flex items-center gap-1.5">
                        📅 {formatearFecha(evento.fecha)}
                      </span>
                      <span className="flex items-center gap-1.5">
                        🕐 {formatearHora(evento.hora)}
                      </span>
                      <span className="flex items-center gap-1.5">
                        📍 {evento.ubicacion}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-start sm:items-end gap-2 shrink-0">
                    <span
                      className={`text-sm font-medium px-3 py-1 rounded-full ${
                        lleno
                          ? "bg-red-100 text-red-700"
                          : cuposDisponibles <= 5
                            ? "bg-amber-100 text-amber-700"
                            : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {lleno
                        ? "Sin cupos"
                        : `${cuposDisponibles} cupo${cuposDisponibles !== 1 ? "s" : ""} disponible${cuposDisponibles !== 1 ? "s" : ""}`}
                    </span>
                    {lleno ? (
                      <button
                        disabled
                        className="btn-primary opacity-50 cursor-not-allowed"
                      >
                        Evento lleno
                      </button>
                    ) : (
                      <Link
                        href={`/reservar/${evento.id}`}
                        className="btn-primary"
                      >
                        Reservar lugar
                      </Link>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
