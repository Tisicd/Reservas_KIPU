export const dynamic = "force-dynamic";

import { getEventoById, getReservasCount } from "@/lib/actions";
import { notFound, redirect } from "next/navigation";
import FormularioReserva from "@/components/FormularioReserva";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ReservarPage({ params }: Props) {
  const { id } = await params;
  const eventoId = parseInt(id);

  if (isNaN(eventoId)) notFound();

  const evento = await getEventoById(eventoId);
  if (!evento || !evento.activo) notFound();

  const reservas = await getReservasCount(eventoId);
  const cuposDisponibles = (evento.capacidadMaxima ?? 30) - reservas;

  if (cuposDisponibles <= 0) {
    redirect("/");
  }

  return <FormularioReserva evento={evento} cuposDisponibles={cuposDisponibles} />;
}
