"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  reservaId: number;
}

export default function BotonEliminarReserva({ reservaId }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm("¿Eliminar esta reserva?")) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/admin/reservas/${reservaId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error al eliminar");
      router.refresh();
    } catch {
      alert("No se pudo eliminar la reserva");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-error-500 hover:text-red-700 text-xs font-medium disabled:opacity-50 hover:underline transition-all"
    >
      {loading ? "..." : "Eliminar"}
    </button>
  );
}
