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

  const pasoActual = step === "form" ? 1 : 2;
  const pasos = ["Datos personales", "Pago y confirmación"];

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-warm-900 mb-1">
          {evento.titulo}
        </h1>
        <p className="text-warm-500 text-sm mb-4">Completa tu reserva</p>

        <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-warm-500 mb-6">
          <span className="inline-flex items-center gap-1.5">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            {formatearFecha(evento.fecha)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><polyline points="12,6 12,12 16,14" />
            </svg>
            {formatearHora(evento.hora)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1 1 18 0z" /><circle cx="12" cy="10" r="3" />
            </svg>
            {evento.ubicacion}
          </span>
          <span className="badge badge-success">
            {cuposDisponibles} disponible{cuposDisponibles !== 1 ? "s" : ""}
          </span>
          {precioFormateado && (
            <span className="badge badge-primary">{precioFormateado}</span>
          )}
        </div>

        {/* Stepper */}
        <div className="flex items-center gap-3">
          {pasos.map((label, i) => {
            const num = i + 1;
            const activo = pasoActual === num;
            const completado = pasoActual > num;
            return (
              <div key={num} className="flex items-center gap-3">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-all duration-300 ${
                      completado
                        ? "border-primary-500 bg-primary-500 text-white"
                        : activo
                          ? "border-primary-500 bg-primary-500 text-white shadow-sm shadow-primary-200"
                          : "border-warm-200 text-warm-400"
                    }`}
                  >
                    {completado ? (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20,6 9,17 4,12" />
                      </svg>
                    ) : (
                      num
                    )}
                  </span>
                  <span
                    className={`text-sm font-medium transition-colors duration-300 ${
                      activo || completado ? "text-warm-800" : "text-warm-400"
                    }`}
                  >
                    {label}
                  </span>
                </div>
                {i < pasos.length - 1 && (
                  <div
                    className={`w-10 h-0.5 rounded-full transition-colors duration-300 ${
                      completado ? "bg-primary-400" : "bg-warm-200"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {error && (
        <div className="bg-error-50 border border-red-200 text-error-500 px-4 py-3 rounded-xl text-sm mb-6 animate-fade-in">
          {error}
        </div>
      )}

      {/* Step 1: Form */}
      {step === "form" && (
        <form onSubmit={handleFormSubmit} className="card p-6 space-y-5 animate-slide-in">
          <div>
            <label htmlFor="nombreCompleto" className="label-field">
              Nombre completo <span className="text-primary-500">*</span>
            </label>
            <input
              id="nombreCompleto"
              name="nombreCompleto"
              type="text"
              required
              className="input-field"
              placeholder="María García López"
            />
            <p className="text-xs text-warm-400 mt-1.5">
              Si ya has asistido antes, usa el mismo nombre para reconocerte.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="edad" className="label-field">
                Edad <span className="text-primary-500">*</span>
              </label>
              <input
                id="edad"
                name="edad"
                type="number"
                min={16}
                max={99}
                required
                className="input-field"
                placeholder="28"
              />
            </div>
            <div>
              <label htmlFor="telefono" className="label-field">
                Teléfono
              </label>
              <input
                id="telefono"
                name="telefono"
                type="tel"
                className="input-field"
                placeholder="555 123 4567"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="label-field">
              Correo electrónico
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="input-field"
              placeholder="maria@email.com"
            />
          </div>

          <fieldset>
            <legend className="label-field">
              Idiomas que hablas <span className="text-primary-500">*</span>
            </legend>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
              {IDIOMAS_OPCIONES.map((idioma) => (
                <label
                  key={idioma}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-all duration-200 text-sm ${
                    idiomasSeleccionados.includes(idioma)
                      ? "border-primary-400 bg-primary-50 text-primary-700 shadow-sm"
                      : "border-warm-200 hover:border-primary-300 hover:bg-primary-50/50"
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
              ¿Cómo te enteraste? <span className="text-primary-500">*</span>
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
              Notas adicionales
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
              className="btn-ghost"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {/* Step 2: Payment */}
      {step === "payment" && (
        <div className="card p-6 animate-slide-in">
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
        <div className="card p-6 animate-slide-in">
          <PaymentQR
            eventoTitle={evento.titulo}
            onConfirm={(comprobanteUrl: string) => createReservation("qr", comprobanteUrl)}
            onBack={() => setStep("payment")}
            loading={loading}
          />
        </div>
      )}

      {step === "stripe" && (
        <div className="card p-6 animate-slide-in">
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
