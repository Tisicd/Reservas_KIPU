import { NextResponse } from "next/server";
import { getPublicPaymentConfig } from "@/lib/payment";

export async function GET() {
  return NextResponse.json(getPublicPaymentConfig());
}
