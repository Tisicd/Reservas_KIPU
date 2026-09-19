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

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-primary-50 flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" />
          </svg>
        </div>
        <h3 className="font-display text-xl font-bold text-warm-900 mb-1">Pago con tarjeta</h3>
        <p className="text-sm text-warm-500">Pago de prueba con Stripe para &quot;{eventoTitle}&quot;</p>
        {precioFormateado && (
          <p className="text-2xl font-bold text-primary-600 mt-3 font-display">{precioFormateado}</p>
        )}
      </div>

      <div className="bg-primary-50 border border-primary-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" className="mt-0.5 shrink-0"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
          <div>
            <p className="text-sm text-primary-800 font-medium mb-0.5">Modo de prueba</p>
            <p className="text-xs text-primary-600 leading-relaxed">
              Este es un formulario de ejemplo. La integración real requiere configurar tus claves de API en stripe.com.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="label-field">Número de tarjeta</label>
          <input type="text" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} className="input-field" placeholder="4242 4242 4242 4242" maxLength={19} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label-field">Vencimiento</label>
            <input type="text" value={expiry} onChange={(e) => setExpiry(e.target.value)} className="input-field" placeholder="MM/AA" maxLength={5} />
          </div>
          <div>
            <label className="label-field">CVC</label>
            <input type="text" value={cvc} onChange={(e) => setCvc(e.target.value)} className="input-field" placeholder="123" maxLength={4} />
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onBack} className="btn-ghost" disabled={loading}>Volver</button>
        <button type="button" onClick={onSkip} className="btn-primary flex-1" disabled={loading}>
          {loading ? "Procesando..." : "Pagar y reservar"}
        </button>
      </div>
    </div>
  );
}
