import { NextResponse } from "next/server";
import db from "../../../../db 1.json";

export async function GET() {
  return NextResponse.json(db.readings);
}

export async function POST(req: Request) {
  const body = await req.json();
  const newReading = {
    id: crypto.randomUUID(),
    ...body,
  };
  return NextResponse.json(newReading, { status: 201 });
}
