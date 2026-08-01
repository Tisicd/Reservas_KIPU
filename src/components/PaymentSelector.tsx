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
      <div className="text-center py-6">
        <p className="text-stone-600 mb-4">
          Este evento no requiere pago.
        </p>
        <div className="flex gap-3 justify-center">
          <button onClick={onBack} className="btn-secondary" disabled={loading}>
            Volver
          </button>
          <button onClick={onSkip} className="btn-primary" disabled={loading}>
            {loading ? "Registrando..." : "Confirmar reserva gratis"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-stone-900 mb-1">
          Método de pago
        </h3>
        <p className="text-sm text-stone-500">
          Selecciona cómo deseas pagar para &quot;{eventoTitle}&quot;
        </p>
        {precioFormateado && (
          <p className="text-lg font-bold text-violet-700 mt-2">
            {precioFormateado}
          </p>
        )}
      </div>

      <div className="grid gap-3">
        {showQR && (
          <button
            type="button"
            onClick={() => setSelected("qr")}
            className={`p-4 rounded-xl border-2 text-left transition-colors ${
              selected === "qr"
                ? "border-violet-500 bg-violet-50"
                : "border-stone-200 hover:border-violet-300"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">📱</span>
              <div>
                <p className="font-semibold text-stone-900">De Una! — Pichincha</p>
                <p className="text-sm text-stone-500">
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
            className={`p-4 rounded-xl border-2 text-left transition-colors ${
              selected === "stripe"
                ? "border-violet-500 bg-violet-50"
                : "border-stone-200 hover:border-violet-300"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">💳</span>
              <div>
                <p className="font-semibold text-stone-900">
                  Tarjeta de crédito/débito
                </p>
                <p className="text-sm text-stone-500">
                  Pago seguro con Stripe
                </p>
              </div>
            </div>
          </button>
        )}

        {showEfectivo && (
          <button
            type="button"
            onClick={() => setSelected("efectivo")}
            className={`p-4 rounded-xl border-2 text-left transition-colors ${
              selected === "efectivo"
                ? "border-stone-400 bg-stone-50"
                : "border-stone-200 hover:border-stone-300"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">🏷️</span>
              <div>
                <p className="font-semibold text-stone-900">
                  Pagaré en el evento
                </p>
                <p className="text-sm text-stone-500">
                  Realizaré el pago al llegar
                </p>
              </div>
            </div>
          </button>
        )}
      </div>

      {selected && (
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onBack}
            className="btn-secondary"
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
