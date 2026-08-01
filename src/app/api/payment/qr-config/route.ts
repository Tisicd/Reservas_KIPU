import { NextResponse } from "next/server";
import { getPaymentConfig } from "@/lib/payment";

export async function GET() {
  const config = getPaymentConfig();
  return NextResponse.json({
    pichincha: {
      qrImage: config.pichincha.qrImage,
      accountName: config.pichincha.accountName,
      accountId: config.pichincha.accountId,
      phone: config.pichincha.phone,
      amount: config.pichincha.amount,
    },
  });
}
