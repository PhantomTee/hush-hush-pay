import { NextResponse } from 'next/server';
import { db } from '../../../lib/db';

export async function GET() {
  // Returns NO salary data, per specification
  return NextResponse.json(db.employees);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // Requires encrypted salary ciphertext
    if (!body.encryptedSalary) {
      return NextResponse.json({ error: "Missing encrypted salary" }, { status: 400 });
    }
    
    const newEmp = {
      id: "emp_" + crypto.randomUUID().split('-')[0],
      orgId: body.orgId || "org_01",
      walletAddress: body.walletAddress,
      displayName: body.displayName,
      arcisPubkey: body.arcisPubkey,
      status: 'active',
      createdAt: new Date().toISOString()
    };
    db.employees.push(newEmp);

    return NextResponse.json({
      success: true,
      id: newEmp.id,
      message: "Employee added successfully"
    }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
