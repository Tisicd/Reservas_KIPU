"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function FormularioEvento() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [requierePago, setRequierePago] = useState(false);
  const [metodosPago, setMetodosPago] = useState<string[]>(["qr"]);

  function toggleMetodo(metodo: string) {
    setMetodosPago((prev) =>
      prev.includes(metodo)
        ? prev.filter((m) => m !== metodo)
        : [...prev, metodo]
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(e.currentTarget);

    if (requierePago && metodosPago.length === 0) {
      setError("Selecciona al menos un método de pago");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/admin/eventos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titulo: form.get("titulo"),
          descripcion: form.get("descripcion") || undefined,
          fecha: form.get("fecha"),
          hora: form.get("hora"),
          ubicacion: form.get("ubicacion"),
          capacidadMaxima: parseInt(form.get("capacidadMaxima") as string) || 30,
          requierePago,
          precio: requierePago
            ? Math.round(parseFloat(form.get("precio") as string) * 100) || 0
            : 0,
          metodosPago: requierePago ? metodosPago.join(",") : "",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al crear evento");

      router.push(`/admin/eventos/${data.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card p-6 space-y-5">
      <h2 className="text-lg font-semibold text-stone-900">Nuevo evento</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="titulo" className="label-field">
          Título del evento *
        </label>
        <input
          id="titulo"
          name="titulo"
          type="text"
          required
          className="input-field"
          placeholder="Ej: Intercambio de idiomas — Español/Inglés"
        />
      </div>

      <div>
        <label htmlFor="descripcion" className="label-field">
          Descripción
        </label>
        <textarea
          id="descripcion"
          name="descripcion"
          rows={3}
          className="input-field resize-none"
          placeholder="Detalles del evento..."
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="fecha" className="label-field">
            Fecha *
          </label>
          <input id="fecha" name="fecha" type="date" required className="input-field" />
        </div>
        <div>
          <label htmlFor="hora" className="label-field">
            Hora *
          </label>
          <input id="hora" name="hora" type="time" required className="input-field" />
        </div>
      </div>

      <div>
        <label htmlFor="ubicacion" className="label-field">
          Ubicación del evento *
        </label>
        <input
          id="ubicacion"
          name="ubicacion"
          type="text"
          required
          className="input-field"
          placeholder="Ej: Café Central, Av. Reforma 123, Col. Centro"
        />
      </div>

      <div>
        <label htmlFor="capacidadMaxima" className="label-field">
          Capacidad máxima
        </label>
        <input
          id="capacidadMaxima"
          name="capacidadMaxima"
          type="number"
          min={1}
          max={100}
          defaultValue={30}
          className="input-field w-32"
        />
      </div>

      <hr className="border-stone-200" />

      <div className="space-y-4">
        <h3 className="font-semibold text-stone-900">Configuración de pago</h3>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={requierePago}
            onChange={(e) => setRequierePago(e.target.checked)}
            className="w-4 h-4 rounded border-stone-300 text-violet-600 focus:ring-violet-500"
          />
          <span className="text-sm font-medium text-stone-700">
            Este evento requiere pago
          </span>
        </label>

        {requierePago && (
          <>
            <div>
              <label htmlFor="precio" className="label-field">
                Precio ($)
              </label>
              <input
                id="precio"
                name="precio"
                type="number"
                min={0}
                step={0.01}
                defaultValue={0}
                className="input-field w-40"
                placeholder="0.00"
              />
              <p className="text-xs text-stone-500 mt-1">
                En dólares. Deja en 0 si no hay precio fijo.
              </p>
            </div>

            <div>
              <p className="label-field">Métodos de pago habilitados</p>
              <div className="flex flex-wrap gap-3 mt-2">
                <label
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-colors text-sm ${
                    metodosPago.includes("qr")
                      ? "border-violet-500 bg-violet-50 text-violet-800"
                      : "border-stone-200 hover:border-stone-300"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={metodosPago.includes("qr")}
                    onChange={() => toggleMetodo("qr")}
                    className="sr-only"
                  />
                  <span className="text-lg">📱</span>
                  De Una! (QR Pichincha)
                </label>

                <label
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-colors text-sm ${
                    metodosPago.includes("stripe")
                      ? "border-violet-500 bg-violet-50 text-violet-800"
                      : "border-stone-200 hover:border-stone-300"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={metodosPago.includes("stripe")}
                    onChange={() => toggleMetodo("stripe")}
                    className="sr-only"
                  />
                  <span className="text-lg">💳</span>
                  Tarjeta (Stripe)
                </label>

                <label
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-colors text-sm ${
                    metodosPago.includes("efectivo")
                      ? "border-violet-500 bg-violet-50 text-violet-800"
                      : "border-stone-200 hover:border-stone-300"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={metodosPago.includes("efectivo")}
                    onChange={() => toggleMetodo("efectivo")}
                    className="sr-only"
                  />
                  <span className="text-lg">🏷️</span>
                  Pago en el evento
                </label>
              </div>
            </div>
          </>
        )}
      </div>

      <button type="submit" disabled={loading} className="btn-primary">
        {loading ? "Creando..." : "Crear evento"}
      </button>
    </form>
  );
}
