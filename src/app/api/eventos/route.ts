import { NextRequest, NextResponse } from "next/server";
import { crearEvento } from "@/lib/actions";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.titulo || !body.fecha || !body.hora || !body.ubicacion) {
      return NextResponse.json(
        { error: "Título, fecha, hora y ubicación son obligatorios" },
        { status: 400 }
      );
    }

    const evento = await crearEvento(body);
    return NextResponse.json(evento, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error interno";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
