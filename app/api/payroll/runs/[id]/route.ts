import { NextResponse } from 'next/server';
import { db } from '../../../../../lib/db';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const run = db.payRuns.find(r => r.id === id);
  if (!run) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({
    ...run,
    aggregateTotalLamports: run.aggregateTotalLamports.toString()
  });
}
