declare module '@arcium-hq/client' {
  export class ArciumClient {
    constructor(config: { network: string; clusterUrl: string });
    encrypt(lamports: bigint, pkey: string): Promise<{ ciphertext: Uint8Array; nonce: Uint8Array }>;
    commissionComputation(params: any): Promise<{ computationId: string; txSignature: string }>;
    decrypt(ct: Uint8Array, key: Uint8Array): Promise<[bigint, bigint, bigint]>;
    getComputationStatus(id: string): Promise<any>;
  }
}
