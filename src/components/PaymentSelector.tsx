"use client";

import { useState } from "react";

interface Props {
  requierePago: boolean;
  precio: number;
  metodosPago: string;
  eventoTitle: string;
  onSelectQR: () => void;
  onSelectStripe: () => void;
  onSkip: () => void;
  onBack: () => void;
  loading: boolean;
}

export default function PaymentSelector({
  requierePago,
  precio,
  metodosPago,
  eventoTitle,
  onSelectQR,
  onSelectStripe,
  onSkip,
  onBack,
  loading,
}: Props) {
  const [selected, setSelected] = useState<string | null>(null);

  const methods = metodosPago
    .split(",")
    .map((m) => m.trim())
    .filter(Boolean);

  const showQR = methods.includes("qr");
  const showStripe = methods.includes("stripe");
  const showEfectivo = methods.includes("efectivo");

  const precioFormateado = precio > 0 ? `$${(precio / 100).toFixed(2)}` : null;

  if (!requierePago) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary-50 flex items-center justify-center">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
            <path d="m9 12 2 2 4-4" />
          </svg>
        </div>
        <p className="text-warm-600 mb-1 font-medium">Este evento no requiere pago.</p>
        <p className="text-sm text-warm-400 mb-6">Confirma tu reserva sin costo.</p>
        <div className="flex gap-3 justify-center">
          <button onClick={onBack} className="btn-ghost" disabled={loading}>
            Volver
          </button>
          <button onClick={onSkip} className="btn-primary" disabled={loading}>
            {loading ? "Registrando..." : "Confirmar reserva"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-gold-50 flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
            <line x1="1" y1="10" x2="23" y2="10" />
          </svg>
        </div>
        <h3 className="font-display text-xl font-bold text-warm-900 mb-1">
          Método de pago
        </h3>
        <p className="text-sm text-warm-500">
          Selecciona cómo deseas pagar para &quot;{eventoTitle}&quot;
        </p>
        {precioFormateado && (
          <p className="text-2xl font-bold text-primary-600 mt-3 font-display">
            {precioFormateado}
          </p>
        )}
      </div>

      <div className="grid gap-3">
        {showQR && (
          <button
            type="button"
            onClick={() => setSelected("qr")}
            className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
              selected === "qr"
                ? "border-primary-400 bg-primary-50 shadow-sm"
                : "border-warm-200 hover:border-primary-300 hover:bg-primary-50/30"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" /><rect x="7" y="7" width="10" height="10" /><line x1="12" y1="3" x2="12" y2="7" /><line x1="12" y1="17" x2="12" y2="21" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-warm-800">De Una! — Banco Pichincha</p>
                <p className="text-sm text-warm-500">
                  Escanea el QR con tu app de Banco Pichincha
                </p>
              </div>
            </div>
          </button>
        )}

        {showStripe && (
          <button
            type="button"
            onClick={() => setSelected("stripe")}
            className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
              selected === "stripe"
                ? "border-primary-400 bg-primary-50 shadow-sm"
                : "border-warm-200 hover:border-primary-300 hover:bg-primary-50/30"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-warm-800">Tarjeta de crédito/débito</p>
                <p className="text-sm text-warm-500">Pago seguro con Stripe</p>
              </div>
            </div>
          </button>
        )}

        {showEfectivo && (
          <button
            type="button"
            onClick={() => setSelected("efectivo")}
            className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
              selected === "efectivo"
                ? "border-warm-300 bg-warm-50"
                : "border-warm-200 hover:border-warm-300 hover:bg-warm-50"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-warm-100 flex items-center justify-center shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#78716c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-warm-800">Pagaré en el evento</p>
                <p className="text-sm text-warm-500">Realizaré el pago al llegar</p>
              </div>
            </div>
          </button>
        )}
      </div>

      {selected && (
        <div className="flex gap-3 pt-2 animate-fade-in-up">
          <button
            type="button"
            onClick={onBack}
            className="btn-ghost"
            disabled={loading}
          >
            Volver
          </button>
          <button
            type="button"
            onClick={() => {
              if (selected === "qr") onSelectQR();
              else if (selected === "stripe") onSelectStripe();
              else onSkip();
            }}
            className="btn-primary flex-1"
            disabled={loading}
          >
            {loading
              ? "Procesando..."
              : selected === "qr"
                ? "Ver código QR"
                : selected === "stripe"
                  ? "Pagar con tarjeta"
                  : "Confirmar reserva"}
          </button>
        </div>
      )}
    </div>
  );
}
