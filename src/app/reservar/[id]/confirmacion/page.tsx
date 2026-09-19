import Link from "next/link";

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ nombre?: string; nuevo?: string; pendiente?: string }>;
}

export default async function ConfirmacionPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { nombre, nuevo, pendiente } = await searchParams;
  const esNuevo = nuevo === "true";
  const esPendiente = pendiente === "true";

  return (
    <div className="max-w-lg mx-auto px-4 py-20">
      <div className="card p-10 text-center animate-fade-in-up">
        {esPendiente ? (
          <>
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gold-50 flex items-center justify-center">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12,6 12,12 16,14" />
              </svg>
            </div>
            <h1 className="font-display text-2xl font-bold text-warm-900 mb-3">
              Reserva pendiente
            </h1>
            {nombre && (
              <p className="text-lg text-warm-700 mb-2">
                Gracias, <strong>{decodeURIComponent(nombre)}</strong>
              </p>
            )}
            <p className="text-warm-500 mb-6 leading-relaxed">
              {esNuevo
                ? "¡Bienvenido/a! Es tu primera vez con nosotros."
                : "¡Qué gusto verte de nuevo!"}
            </p>

            <div className="bg-gold-50 border border-gold-200 rounded-xl p-5 mb-6 text-left">
              <p className="text-sm text-gold-700 font-semibold mb-3">¿Qué sigue?</p>
              <ol className="text-sm text-gold-700 space-y-2 list-decimal list-inside leading-relaxed">
                <li>Tu comprobante de pago fue enviado</li>
                <li>El administrador revisará tu comprobante</li>
                <li>Tu reserva será confirmada al verificar el pago</li>
              </ol>
            </div>

            <p className="text-sm text-warm-400 mb-8">
              Te notificaremos cuando tu reserva sea aprobada.
            </p>
          </>
        ) : (
          <>
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary-50 flex items-center justify-center">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22,4 12,14.01 9,11.01" />
              </svg>
            </div>
            <h1 className="font-display text-2xl font-bold text-warm-900 mb-3">
              ¡Reserva confirmada!
            </h1>
            {nombre && (
              <p className="text-lg text-warm-700 mb-2">
                Gracias, <strong>{decodeURIComponent(nombre)}</strong>
              </p>
            )}
            <p className="text-warm-500 mb-6 leading-relaxed">
              {esNuevo
                ? "¡Bienvenido/a! Es tu primera vez con nosotros. Nos alegra tenerte."
                : "¡Qué gusto verte de nuevo! Gracias por seguir siendo parte de nuestra comunidad."}
            </p>

            <p className="text-sm text-warm-400 mb-8">
              Te esperamos en el evento. Recuerda llegar unos minutos antes.
            </p>
          </>
        )}

        <div className="flex gap-3 justify-center">
          <Link href="/" className="btn-primary">
            Explorar más eventos
          </Link>
        </div>
      </div>
    </div>
  );
}
