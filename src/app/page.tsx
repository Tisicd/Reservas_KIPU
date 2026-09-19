export const dynamic = "force-dynamic";

import { getEventosActivos, getReservasCount } from "@/lib/actions";
import { formatearFecha, formatearHora } from "@/lib/constants";
import Link from "next/link";
import Globe from "@/components/Globe";
import FloatingImages from "@/components/FloatingImages";

export default async function HomePage() {
  const eventos = await getEventosActivos();
  const eventosConCupos = await Promise.all(
    eventos.map(async (e) => ({ ...e, reservas: await getReservasCount(e.id) }))
  );

  return (
    <>
      {/* ============================================================
          HERO — cream bg, circles, kipu4.jpg
          ============================================================ */}
      <section className="relative min-h-[80vh] bg-[#F5F0E8] overflow-hidden">
        {/* Big blurred circles */}
        <div className="absolute top-20 right-10 w-32 h-32 rounded-full bg-[#D4A017]/10 blur-2xl" />
        <div className="absolute bottom-20 left-10 w-40 h-40 rounded-full bg-[#2E7D32]/10 blur-2xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-[#4CAF50]/5 blur-3xl" />
        {/* Smaller decorative circles */}
        <div className="absolute top-32 left-20 w-12 h-12 rounded-full border-2 border-[#D4A017]/20" />
        <div className="absolute bottom-40 right-20 w-8 h-8 rounded-full border-2 border-[#2E7D32]/20" />
        <div className="absolute top-1/4 right-1/3 w-6 h-6 rounded-full bg-[#D4A017]/30" />
        <div className="absolute top-1/3 right-20 w-16 h-16 rounded-full border border-[#2E7D32]/15" />
        <div className="absolute bottom-1/3 left-1/4 w-10 h-10 rounded-full bg-[#D4A017]/15" />
        <div className="absolute top-3/4 right-1/4 w-14 h-14 rounded-full border-2 border-[#D4A017]/10" />
        <div className="absolute top-10 left-1/3 w-5 h-5 rounded-full bg-[#2E7D32]/25" />
        <div className="absolute bottom-10 right-1/3 w-20 h-20 rounded-full border border-[#2E7D32]/10" />
        <div className="absolute top-1/2 right-10 w-7 h-7 rounded-full bg-[#D4A017]/20" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 py-20 md:py-28">
          <div className="grid md:grid-cols-2 gap-12 items-center">

            <div>
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-[#1A3A2A] leading-none" style={{ fontFamily: "'Inter', sans-serif" }}>KIPU</h1>
              <p className="text-lg md:text-xl text-[#3D2E1E] mt-2 font-light tracking-wide" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                Languages · Cultures · Connections
              </p>
              <div className="flex items-center gap-4 mt-4">
                <span className="h-px w-12 bg-[#D4A017]/40" />
                <span className="text-xs text-[#5C4530] font-light tracking-[0.2em] uppercase" style={{ fontFamily: "'Montserrat', sans-serif" }}>Conectando culturas</span>
                <span className="h-px w-12 bg-[#D4A017]/40" />
              </div>
              <p className="text-[#5C4530] mt-4 max-w-lg leading-relaxed" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                Idiomas que nos conectan, culturas que nos transforman.
              </p>
              <div className="flex flex-wrap gap-4 mt-8">
                <a href="#eventos" className="px-6 py-3 bg-[#2E7D32] hover:bg-[#1B5E20] text-[#FDFBF7] font-semibold rounded-full transition-all hover:scale-105" style={{ fontFamily: "'Montserrat', sans-serif" }}>Conoce nuestros eventos</a>
                <a href="#community" className="px-6 py-3 border-2 border-[#2E7D32] text-[#2E7D32] hover:bg-[#2E7D32] hover:text-[#FDFBF7] font-semibold rounded-full transition-all" style={{ fontFamily: "'Montserrat', sans-serif" }}>Únete a la comunidad</a>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute -inset-4 bg-[#D4A017]/10 rounded-2xl blur-xl" />
                <img src="/assets/kipu4.jpg" alt="KIPU Community" className="relative rounded-2xl shadow-2xl w-full max-w-md object-cover" />
                <div className="absolute -bottom-4 -right-4 bg-[#D4A017] text-[#FDFBF7] px-4 py-2 rounded-full text-sm font-semibold shadow-lg" style={{ fontFamily: "'Montserrat', sans-serif" }}>🌍 Comunidad global</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          ORIGIN — dark green with transition
          ============================================================ */}
      <section id="origin" className="py-20 bg-[#1A3A2A] relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-[#F5F0E8] to-transparent" />
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle, #D4A017 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

        <div className="relative z-10 max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">

            <div className="flex justify-center order-2 md:order-1">
              <div className="relative">
                <div className="absolute -inset-8 bg-[#D4A017]/10 rounded-full blur-2xl" />
                <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96">
                  <Globe />
                </div>
              </div>
            </div>

            <div className="order-1 md:order-2">
              <div className="inline-block px-4 py-1 border border-[#D4A017]/30 rounded-full text-[#D4A017] text-xs tracking-widest uppercase font-medium mb-6" style={{ fontFamily: "'Montserrat', sans-serif" }}>Origin</div>
              <h2 className="text-4xl md:text-5xl font-bold text-[#FDFBF7] mb-6" style={{ fontFamily: "'Inter', sans-serif" }}>
                The Meaning Behind <span className="text-[#D4A017]">KIPU</span>
              </h2>
              <p className="text-[#E8E0D4] leading-relaxed mb-4 font-light" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                KIPU is inspired by the ancient Andean system of knotted cords — the quipu — used to record and preserve knowledge across generations.
              </p>
              <p className="text-[#D4C8B8] leading-relaxed font-light" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                To us, every language is a code. Once you understand it, you unlock new cultures, new perspectives, and meaningful human connections.
              </p>
              <div className="flex items-center gap-4 mt-6">
                <span className="h-px w-12 bg-[#D4A017]/40" />
                <span className="font-hand text-sm text-[#D4A017]/60">The knots that unite us</span>
                <span className="h-px w-12 bg-[#D4A017]/40" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          EVENTS — cream bg, green header cards, gold button
          ============================================================ */}
      <section id="eventos" className="py-20 bg-[#F5F0E8] relative overflow-hidden">
        <div className="absolute top-20 right-10 w-24 h-24 rounded-full bg-[#D4A017]/5 blur-xl" />
        <div className="absolute bottom-20 left-10 w-32 h-32 rounded-full bg-[#2E7D32]/5 blur-xl" />

        <div className="relative z-10 max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-5xl md:text-6xl font-bold text-[#1A3A2A]" style={{ fontFamily: "'Inter', sans-serif" }}>Events</h2>
            <div className="flex items-center justify-center gap-4 mt-2">
              <span className="h-px w-12 bg-[#D4A017]/40" />
              <span className="text-sm text-[#5C4530] font-light tracking-[0.2em] uppercase" style={{ fontFamily: "'Montserrat', sans-serif" }}>Upcoming Gatherings</span>
              <span className="h-px w-12 bg-[#D4A017]/40" />
            </div>
          </div>

          {eventosConCupos.length === 0 ? (
            <p className="text-center text-[#5C4530]" style={{ fontFamily: "'Montserrat', sans-serif" }}>New events coming soon.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {eventosConCupos.map((evento) => {
                const cupos = (evento.capacidadMaxima ?? 30) - evento.reservas;
                const lleno = cupos <= 0;
                return (
                  <div key={evento.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1">
                    <div className="bg-[#2E7D32] px-6 py-4">
                      <h3 className="text-xl font-bold text-[#FDFBF7]" style={{ fontFamily: "'Inter', sans-serif" }}>{evento.titulo}</h3>
                      <p className="text-sm text-[#E8E0D4] font-light" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        {lleno ? "Sin cupos" : `${cupos} spots disponibles`}
                      </p>
                    </div>
                    <div className="p-6">
                      {evento.descripcion && (
                        <p className="text-sm text-[#5C4530] leading-relaxed" style={{ fontFamily: "'Montserrat', sans-serif" }}>{evento.descripcion}</p>
                      )}
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center gap-2 text-sm text-[#5C4530]">
                          <span>📅</span>
                          <span className="font-light" style={{ fontFamily: "'Montserrat', sans-serif" }}>{formatearFecha(evento.fecha)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-[#5C4530]">
                          <span>⏰</span>
                          <span className="font-light" style={{ fontFamily: "'Montserrat', sans-serif" }}>{formatearHora(evento.hora)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-[#5C4530]">
                          <span>📍</span>
                          <span className="font-light" style={{ fontFamily: "'Montserrat', sans-serif" }}>{evento.ubicacion}</span>
                        </div>
                      </div>
                      {evento.precio != null && evento.precio > 0 && (
                        <div className="mt-3 flex items-center gap-2">
                          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[#D4A017] text-[#3D2E1E]" style={{ fontFamily: "'Montserrat', sans-serif" }}>${(evento.precio / 100).toFixed(2)}</span>
                        </div>
                      )}
                      {lleno ? (
                        <button disabled className="mt-4 w-full py-2.5 bg-gray-300 text-gray-500 font-semibold rounded-lg text-sm cursor-not-allowed" style={{ fontFamily: "'Montserrat', sans-serif" }}>Full</button>
                      ) : (
                        <Link href={`/reservar/${evento.id}`} className="mt-4 block text-center w-full py-2.5 bg-[#D4A017] hover:bg-[#B8860B] text-[#FDFBF7] font-semibold rounded-lg transition-all text-sm shadow-md hover:shadow-lg" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                          Reserve
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ============================================================
          COMMUNITY — cream bg, dark text
          ============================================================ */}
      <section id="community" className="py-20 bg-[#F5F0E8] relative overflow-hidden border-t border-[#EDE6D6]">
        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-[#1A3A2A] mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
            The Knots That <span className="text-[#D4A017]">Bring Us Together</span>
          </h2>
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="h-px w-16 bg-[#D4A017]/30" />
            <span className="text-[#D4A017] text-xs tracking-widest uppercase font-light" style={{ fontFamily: "'Montserrat', sans-serif" }}>KIPU</span>
            <span className="h-px w-16 bg-[#D4A017]/30" />
          </div>
          <p className="text-lg text-[#5C4530] max-w-3xl mx-auto leading-relaxed font-light" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            Every gathering is a new knot in the KIPU network — a connection that goes beyond borders, languages, and cultures.
          </p>
          <div className="mt-12">
            <FloatingImages />
          </div>
          <p className="font-hand text-xl italic mt-10 max-w-md mx-auto leading-relaxed text-[#2E7D32]">
            &ldquo;Each shared experience becomes part of a story that continues to grow.&rdquo;
          </p>
        </div>
      </section>
    </>
  );
}
