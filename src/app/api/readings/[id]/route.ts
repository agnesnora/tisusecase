import { NextResponse } from "next/server";
import db from "../../../../../db 1.json";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await req.json();
  const existing = db.readings.find((r) => r.id === id);

  if (!existing) {
    return NextResponse.json({ error: "Reading not found" }, { status: 404 });
  }

  return NextResponse.json({ ...existing, ...body });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const existing = db.readings.find((r) => r.id === id);

  if (!existing) {
    return NextResponse.json({ error: "Reading not found" }, { status: 404 });
  }

  return new NextResponse(null, { status: 200 });
}
