import { NextRequest, NextResponse } from "next/server";
import { actualizarEvento } from "@/lib/actions";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const evento = await actualizarEvento(parseInt(id), body);
    return NextResponse.json(evento);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error interno";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
