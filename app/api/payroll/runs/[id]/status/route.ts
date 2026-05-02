import { NextResponse } from 'next/server';
import { db } from '../../../../../../lib/db';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const run = db.payRuns.find(r => r.computationId === id);
  if (!run) {
     return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Calculate generic progress based on status
  let progressIndex = 1;
  let nodesConfirmed = 0;
  if (run.status === 'complete') {
      progressIndex = 4;
      nodesConfirmed = 5;
  } else if (run.status === 'pending') {
      progressIndex = 2;
      nodesConfirmed = 3;
  }

  return NextResponse.json({
    id,
    status: run.status,
    nodesConfirmed,
    totalNodes: 5,
    progressIndex
  });
}
