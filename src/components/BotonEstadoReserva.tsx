"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  reservaId: number;
  accion: "aprobar" | "rechazar";
}

export default function BotonEstadoReserva({ reservaId, accion }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    const mensaje =
      accion === "aprobar"
        ? "¿Confirmar esta reserva?"
        : "¿Rechazar esta reserva?";

    if (!confirm(mensaje)) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/reservas/${reservaId}/${accion}`, {
        method: "PATCH",
      });
      if (!res.ok) throw new Error("Error");
      router.refresh();
    } catch {
      alert("No se pudo procesar la solicitud");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`text-xs font-medium disabled:opacity-50 hover:underline transition-all ${
        accion === "aprobar"
          ? "text-success-500 hover:text-success-600"
          : "text-error-500 hover:text-red-700"
      }`}
    >
      {loading ? "..." : accion === "aprobar" ? "Aprobar" : "Rechazar"}
    </button>
  );
}
