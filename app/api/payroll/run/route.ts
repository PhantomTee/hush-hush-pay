import { NextResponse } from 'next/server';
import { db } from '../../../../lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Create new pay run record
    const compId = "comp_" + crypto.randomUUID().split('-')[0];
    const newRun = {
      id: "run_" + crypto.randomUUID().split('-')[0],
      orgId: body.orgId || "org_01",
      periodStart: body.periodStart || new Date().toISOString().split('T')[0],
      periodEnd: body.periodEnd || new Date().toISOString().split('T')[0],
      employeeCount: body.employeeCount || db.employees.length,
      status: 'pending',
      computationId: compId,
      txSignature: "tx_" + crypto.randomUUID(),
      aggregateTotalLamports: BigInt(0),
      createdAt: new Date().toISOString()
    };
    
    // Simulate async execution success later
    setTimeout(() => {
        const run = db.payRuns.find(r => r.computationId === compId);
        if (run) {
            run.status = 'complete';
            run.aggregateTotalLamports = BigInt(Math.floor(Math.random() * 50000000000));
        }
    }, 5000);

    db.payRuns.push(newRun);

    return NextResponse.json({
      computationId: compId,
      message: "Arcium computation commissioned",
      status: "pending"
    });
  } catch (e) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
