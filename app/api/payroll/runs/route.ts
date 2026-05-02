import { NextResponse } from 'next/server';
import { db } from '../../../../lib/db';

export async function GET() {
  const jsonRuns = db.payRuns.map(r => ({
    ...r,
    aggregateTotalLamports: r.aggregateTotalLamports.toString() // BigInt serialization
  }));
  return NextResponse.json(jsonRuns);
}
