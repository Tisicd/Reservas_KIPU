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
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      <div className="card p-10">
        {esPendiente ? (
          <>
            <span className="text-6xl mb-6 block">⏳</span>
            <h1 className="text-2xl font-bold text-stone-900 mb-3">
              ¡Reserva pendiente de confirmación!
            </h1>
            {nombre && (
              <p className="text-lg text-stone-700 mb-2">
                Gracias, <strong>{decodeURIComponent(nombre)}</strong>
              </p>
            )}
            <p className="text-stone-600 mb-4">
              {esNuevo
                ? "¡Bienvenido/a! Es tu primera vez con nosotros."
                : "¡Qué gusto verte de nuevo!"}
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-left">
              <p className="text-sm text-amber-800 font-medium mb-2">
                ¿Qué sigue?
              </p>
              <ol className="text-sm text-amber-700 space-y-1 list-decimal list-inside">
                <li>Tu comprobante de pago fue enviado</li>
                <li>El administrador revisará tu comprobante</li>
                <li>Recibirás una confirmación cuando sea aprobado</li>
              </ol>
            </div>
            <p className="text-sm text-stone-500 mb-8">
              Tu reserva será confirmada una vez que verifiquemos tu pago.
            </p>
          </>
        ) : (
          <>
            <span className="text-6xl mb-6 block">✅</span>
            <h1 className="text-2xl font-bold text-stone-900 mb-3">
              ¡Reserva confirmada!
            </h1>
            {nombre && (
              <p className="text-lg text-stone-700 mb-2">
                Gracias, <strong>{decodeURIComponent(nombre)}</strong>
              </p>
            )}
            <p className="text-stone-600 mb-4">
              {esNuevo
                ? "¡Bienvenido/a! Es tu primera vez con nosotros. Nos alegra tenerte."
                : "¡Qué gusto verte de nuevo! Gracias por seguir siendo parte de nuestra comunidad."}
            </p>
            <p className="text-sm text-stone-500 mb-8">
              Te esperamos en el evento. Recuerda llegar unos minutos antes.
            </p>
          </>
        )}
        <Link href="/" className="btn-primary">
          Ver más eventos
        </Link>
      </div>
    </div>
  );
}
