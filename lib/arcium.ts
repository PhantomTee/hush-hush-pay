import { Arcium } from '@arcium-hq/client';

export const arciumClient = new Arcium({
  network: process.env.NEXT_PUBLIC_ARCIUM_NETWORK || 'devnet',
  clusterUrl: process.env.NEXT_PUBLIC_SOLANA_RPC || 'https://api.devnet.solana.com',
});

export async function encryptSalary(
  salaryLamports: bigint,
  mxePublicKey: string
): Promise<{ ciphertext: Uint8Array; nonce: Uint8Array }> {
  // Use Arcium JS client to encrypt with MXE's Arcis X25519 public key
  const encrypted = await arciumClient.encrypt(salaryLamports, mxePublicKey);
  return encrypted;
}

export async function commissionPayrollRun(params: {
  mxeAddress: string;
  computationDefId: string;
  encryptedSalaries: Uint8Array[];
  taxRateBps: number;
  priorityFee: number;
}): Promise<{ computationId: string; txSignature: string }> {
  const result = await arciumClient.commissionComputation({
    mxeAddress: params.mxeAddress,
    definitionId: params.computationDefId,
    arguments: {
      salaries: params.encryptedSalaries,
      tax_rate_bps: params.taxRateBps,
    },
    priorityFee: params.priorityFee,
    validityWindow: {
      validAfter: Date.now(),
      validBefore: Date.now() + 3600000,
    },
    callbacks: {
      onSuccess: 'STORE_RESULT',
      onFailure: 'EMIT_EVENT',
    },
  });
  return result;
}

export async function decryptPayslip(
  encryptedPayslip: Uint8Array,
  employeePrivateKey: Uint8Array
): Promise<{ gross: bigint; net: bigint; deductions: bigint }> {
  const decrypted = await arciumClient.decrypt(encryptedPayslip, employeePrivateKey);
  return {
    gross: decrypted[0],
    net: decrypted[1],
    deductions: decrypted[2],
  };
}

export async function getComputationStatus(computationId: string): Promise<{
  status: 'pending' | 'processing' | 'complete' | 'failed';
  nodesConfirmed: number;
  totalNodes: number;
}> {
  return await arciumClient.getComputationStatus(computationId);
}
