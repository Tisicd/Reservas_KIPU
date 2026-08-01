"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  COMO_SE_ENTERO_OPCIONES,
  IDIOMAS_OPCIONES,
  formatearFecha,
  formatearHora,
} from "@/lib/constants";
import type { Evento } from "@/db/schema";
import PaymentSelector from "@/components/PaymentSelector";
import PaymentQR from "@/components/PaymentQR";
import StripePayment from "@/components/StripePayment";

interface Props {
  evento: Evento;
  cuposDisponibles: number;
}

type Step = "form" | "payment" | "qr" | "stripe";

export default function FormularioReserva({ evento, cuposDisponibles }: Props) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("form");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [idiomasSeleccionados, setIdiomasSeleccionados] = useState<string[]>([]);
  const [otroIdioma, setOtroIdioma] = useState("");
  const [formData, setFormData] = useState<Record<string, string>>({});

  function toggleIdioma(idioma: string) {
    setIdiomasSeleccionados((prev) =>
      prev.includes(idioma) ? prev.filter((i) => i !== idioma) : [...prev, idioma]
    );
  }

  function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const form = new FormData(e.currentTarget);
    const idiomas = idiomasSeleccionados.includes("Otro") && otroIdioma
      ? [...idiomasSeleccionados.filter((i) => i !== "Otro"), otroIdioma]
      : idiomasSeleccionados;

    if (idiomas.length === 0) {
      setError("Selecciona al menos un idioma");
      return;
    }

    setFormData({
      nombreCompleto: (form.get("nombreCompleto") as string) || "",
      edad: form.get("edad") as string || "",
      idiomas: idiomas.join(", "),
      comoSeEntero: (form.get("comoSeEntero") as string) || "",
      telefono: (form.get("telefono") as string) || "",
      email: (form.get("email") as string) || "",
      notas: (form.get("notas") as string) || "",
    });

    setStep("payment");
  }

  async function createReservation(metodo: string, comprobanteUrl?: string) {
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/reservas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventoId: evento.id,
          nombreCompleto: formData.nombreCompleto,
          edad: parseInt(formData.edad),
          idiomas: formData.idiomas,
          comoSeEntero: formData.comoSeEntero,
          telefono: formData.telefono || undefined,
          email: formData.email || undefined,
          notas: formData.notas || undefined,
          metodoPago: metodo,
          comprobanteUrl: comprobanteUrl || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al crear la reserva");
      }

      router.push(
        `/reservar/${evento.id}/confirmacion?nombre=${encodeURIComponent(data.cliente.nombreCompleto)}&nuevo=${data.esUsuarioNuevo}&pendiente=true`
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
      setStep("form");
    } finally {
      setLoading(false);
    }
  }

  const precioFormateado = (evento.precio ?? 0) > 0
    ? `$${((evento.precio ?? 0) / 100).toFixed(2)}`
    : null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-stone-900 mb-2">
          Reservar: {evento.titulo}
        </h1>
        <div className="flex flex-wrap gap-3 text-sm text-stone-600">
          <span>📅 {formatearFecha(evento.fecha)}</span>
          <span>🕐 {formatearHora(evento.hora)}</span>
          <span>📍 {evento.ubicacion}</span>
          <span className="text-emerald-600 font-medium">
            {cuposDisponibles} cupo{cuposDisponibles !== 1 ? "s" : ""} disponible
            {cuposDisponibles !== 1 ? "s" : ""}
          </span>
          {precioFormateado && (
            <span className="text-violet-600 font-medium">{precioFormateado}</span>
          )}
        </div>

        <div className="flex items-center gap-2 mt-6">
          <div
            className={`flex items-center gap-2 text-sm font-medium ${
              step === "form" ? "text-violet-700" : "text-stone-400"
            }`}
          >
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs border-2 ${
              step === "form"
                ? "border-violet-500 bg-violet-500 text-white"
                : "border-stone-300 text-stone-500"
            }`}>
              1
            </span>
            Datos personales
          </div>
          <div className="w-8 h-0.5 bg-stone-200" />
          <div
            className={`flex items-center gap-2 text-sm font-medium ${
              step !== "form" ? "text-violet-700" : "text-stone-400"
            }`}
          >
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs border-2 ${
              step !== "form"
                ? "border-violet-500 bg-violet-500 text-white"
                : "border-stone-300 text-stone-500"
            }`}>
              2
            </span>
            Pago y confirmación
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-6">
          {error}
        </div>
      )}

      {step === "form" && (
        <form onSubmit={handleFormSubmit} className="card p-6 space-y-6">
          <div>
            <label htmlFor="nombreCompleto" className="label-field">
              Nombre completo *
            </label>
            <input
              id="nombreCompleto"
              name="nombreCompleto"
              type="text"
              required
              className="input-field"
              placeholder="Ej: María García López"
            />
            <p className="text-xs text-stone-500 mt-1">
              Si ya has asistido antes, usa el mismo nombre para reconocerte como
              cliente frecuente.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="edad" className="label-field">
                Edad *
              </label>
              <input
                id="edad"
                name="edad"
                type="number"
                min={16}
                max={99}
                required
                className="input-field"
                placeholder="Ej: 28"
              />
            </div>
            <div>
              <label htmlFor="telefono" className="label-field">
                Teléfono (opcional)
              </label>
              <input
                id="telefono"
                name="telefono"
                type="tel"
                className="input-field"
                placeholder="Ej: 555 123 4567"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="label-field">
              Correo electrónico (opcional)
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="input-field"
              placeholder="Ej: maria@email.com"
            />
          </div>

          <fieldset>
            <legend className="label-field">Idiomas que hablas *</legend>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
              {IDIOMAS_OPCIONES.map((idioma) => (
                <label
                  key={idioma}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-colors text-sm ${
                    idiomasSeleccionados.includes(idioma)
                      ? "border-violet-500 bg-violet-50 text-violet-800"
                      : "border-stone-200 hover:border-stone-300"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={idiomasSeleccionados.includes(idioma)}
                    onChange={() => toggleIdioma(idioma)}
                    className="sr-only"
                  />
                  {idioma}
                </label>
              ))}
            </div>
            {idiomasSeleccionados.includes("Otro") && (
              <input
                type="text"
                value={otroIdioma}
                onChange={(e) => setOtroIdioma(e.target.value)}
                className="input-field mt-2"
                placeholder="Especifica el idioma"
              />
            )}
          </fieldset>

          <div>
            <label htmlFor="comoSeEntero" className="label-field">
              ¿Cómo te enteraste del evento? *
            </label>
            <select
              id="comoSeEntero"
              name="comoSeEntero"
              required
              className="input-field"
              defaultValue=""
            >
              <option value="" disabled>
                Selecciona una opción
              </option>
              {COMO_SE_ENTERO_OPCIONES.map((opcion) => (
                <option key={opcion} value={opcion}>
                  {opcion}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="notas" className="label-field">
              Notas adicionales (opcional)
            </label>
            <textarea
              id="notas"
              name="notas"
              rows={3}
              className="input-field resize-none"
              placeholder="¿Algo que debamos saber?"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn-primary flex-1">
              Continuar al pago
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="btn-secondary"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {step === "payment" && (
        <div className="card p-6">
          <PaymentSelector
            requierePago={evento.requierePago ?? false}
            precio={evento.precio ?? 0}
            metodosPago={evento.metodosPago ?? ""}
            eventoTitle={evento.titulo}
            onSelectQR={() => setStep("qr")}
            onSelectStripe={() => setStep("stripe")}
            onSkip={() => createReservation("efectivo")}
            onBack={() => setStep("form")}
            loading={loading}
          />
        </div>
      )}

      {step === "qr" && (
        <div className="card p-6">
          <PaymentQR
            eventoTitle={evento.titulo}
            onConfirm={(comprobanteUrl: string) => createReservation("qr", comprobanteUrl)}
            onBack={() => setStep("payment")}
            loading={loading}
          />
        </div>
      )}

      {step === "stripe" && (
        <div className="card p-6">
          <StripePayment
            eventoTitle={evento.titulo}
            price={evento.precio ?? 0}
            currency="usd"
            publishableKey={process.env.NEXT_PUBLIC_STRIPE_KEY || ""}
            onBack={() => setStep("payment")}
            onSkip={() => createReservation("stripe")}
            loading={loading}
          />
        </div>
      )}
    </div>
  );
}
