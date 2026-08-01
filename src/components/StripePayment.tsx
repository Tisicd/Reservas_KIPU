"use client";

import { useState } from "react";

interface Props {
  eventoTitle: string;
  price: number;
  currency: string;
  publishableKey: string;
  onBack: () => void;
  onSkip: () => void;
  loading: boolean;
}

export default function StripePayment({
  eventoTitle,
  price,
  currency,
  publishableKey,
  onBack,
  onSkip,
  loading,
}: Props) {
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");

  const precioFormateado = price > 0
    ? `$${(price / 100).toFixed(2)} ${currency.toUpperCase()}`
    : null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSkip();
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-stone-900 mb-1">
          Pago con tarjeta
        </h3>
        <p className="text-sm text-stone-500">
          Pago de prueba con Stripe para &quot;{eventoTitle}&quot;
        </p>
        {precioFormateado && (
          <p className="text-lg font-bold text-violet-700 mt-2">
            Total: {precioFormateado}
          </p>
        )}
      </div>

      <div className="card p-6">
        <div className="bg-violet-50 border border-violet-200 rounded-xl p-4 mb-6">
          <p className="text-sm text-violet-800 font-medium mb-1">
            Modo de prueba
          </p>
          <p className="text-xs text-violet-600">
            Este es un formulario de ejemplo. La integración real con Stripe
            requiere configurar las claves de API en stripe.com y usar Stripe
            Elements o Checkout.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label-field">Número de tarjeta</label>
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              className="input-field"
              placeholder="4242 4242 4242 4242"
              maxLength={19}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-field">Vencimiento</label>
              <input
                type="text"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                className="input-field"
                placeholder="MM/AA"
                maxLength={5}
              />
            </div>
            <div>
              <label className="label-field">CVC</label>
              <input
                type="text"
                value={cvc}
                onChange={(e) => setCvc(e.target.value)}
                className="input-field"
                placeholder="123"
                maxLength={4}
              />
            </div>
          </div>

          {precioFormateado && (
            <div className="text-right">
              <p className="text-lg font-bold text-violet-700">
                Total: {precioFormateado}
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
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
              onClick={onSkip}
              className="btn-primary flex-1"
              disabled={loading}
            >
              {loading ? "Procesando..." : "Pagar y reservar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
