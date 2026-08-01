import { NextRequest, NextResponse } from "next/server";
import { crearReserva } from "@/lib/actions";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.eventoId || !body.nombreCompleto || !body.edad || !body.idiomas || !body.comoSeEntero) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    const result = await crearReserva({
      eventoId: body.eventoId,
      nombreCompleto: body.nombreCompleto,
      edad: body.edad,
      idiomas: body.idiomas,
      comoSeEntero: body.comoSeEntero,
      telefono: body.telefono,
      email: body.email,
      notas: body.notas,
      metodoPago: body.metodoPago,
      comprobanteUrl: body.comprobanteUrl,
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error interno";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
