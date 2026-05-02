import { NextResponse } from 'next/server';
import { db } from '../../../lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newOrg = {
      id: "org_" + crypto.randomUUID().split('-')[0],
      name: body.name || 'Untitled Org',
      walletAddress: body.walletAddress || '',
      mxeAddress: "MXE_" + crypto.randomUUID().split('-')[0],
      clusterId: "CLS-" + Math.floor(Math.random() * 1000),
      createdAt: new Date().toISOString()
    };
    db.organizations.push(newOrg);
    return NextResponse.json(newOrg, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
