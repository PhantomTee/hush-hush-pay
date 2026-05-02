import { NextResponse } from 'next/server';
import { db } from '../../../../lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Simulate aggregating all pay runs locally via an MPC approximation callback
    const totalLamports = db.payRuns.reduce((acc, run) => acc + run.aggregateTotalLamports, BigInt(0));
    // Provide a mocked response that uses the real data from DB
    return NextResponse.json({
      aggregateValue: totalLamports.toString(),
      computationId: "comp_" + crypto.randomUUID().split('-')[0],
      message: "MPC Aggregate computation triggered"
    });
  } catch (e) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
