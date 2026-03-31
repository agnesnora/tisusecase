import { NextResponse } from "next/server";
import db from "../../../../db 1.json";

export async function GET() {
  return NextResponse.json(db.meters);
}
