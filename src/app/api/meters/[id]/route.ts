import { NextResponse } from "next/server";
import db from "../../../../../db 1.json";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const meter = db.meters.find((m) => m.id === id);

  if (!meter) {
    return NextResponse.json({ error: "Meter not found" }, { status: 404 });
  }

  return NextResponse.json(meter);
}
