import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  query, 
  where, 
  serverTimestamp, 
  onSnapshot 
} from 'firebase/firestore';
import { db, auth } from './firebase';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Data Interfaces
export interface Organization {
  id: string;
  name: string;
  adminWallet: string;
  mxeAddress?: string;
  clusterId?: string;
  createdAt?: any;
}

export interface Employee {
  id: string;
  orgId: string;
  name: string;
  wallet: string;
  arcisPubkey: string;
  status: 'active' | 'invited' | 'terminated';
  baseSalary: number; // Plaintext for employer preview
  salaryCiphertext: string; // Base64 encoded Arcium ciphertext
  salaryNonce: string; // Base64 encoded Arcium nonce
  addedAt?: any;
}

export interface PayRun {
  id: string;
  orgId: string;
  period: string;
  employeeCount: number;
  aggregateUsdc: number;
  txHash?: string;
  status: 'pending' | 'complete' | 'failed';
  computationId?: string;
  createdAt?: any;
}

export interface Payslip {
  id: string;
  employeeId: string;
  employeeWallet: string;
  orgId: string;
  period: string;
  encryptedCid: string;
  date?: string;
}

// Database Operations
export const dbOps = {
  // --- Organizations ---
  async createOrganization(org: Omit<Organization, 'id' | 'createdAt'>, id: string) {
    try {
      await setDoc(doc(db, 'organizations', id), {
        ...org,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `organizations/${id}`);
    }
  },

  async getOrganization(id: string): Promise<Organization | null> {
    try {
      const snap = await getDoc(doc(db, 'organizations', id));
      if (snap.exists()) {
        return { id: snap.id, ...snap.data() } as Organization;
      }
      return null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `organizations/${id}`);
      return null;
    }
  },

  // --- Employees ---
  async addEmployee(employee: Omit<Employee, 'id' | 'addedAt'>) {
    const id = doc(collection(db, 'employees')).id;
    try {
      await setDoc(doc(db, 'employees', id), {
        ...employee,
        addedAt: serverTimestamp()
      });
      return id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `employees/${id}`);
    }
  },

  async getEmployeesByOrg(orgId: string): Promise<Employee[]> {
    try {
      const q = query(collection(db, 'employees'), where('orgId', '==', orgId));
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as Employee));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'employees');
      return [];
    }
  },

  // --- Pay Runs ---
  async createPayRun(run: Omit<PayRun, 'id' | 'createdAt'>) {
    const id = doc(collection(db, 'payRuns')).id;
    try {
      await setDoc(doc(db, 'payRuns', id), {
        ...run,
        createdAt: serverTimestamp()
      });
      return id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `payRuns/${id}`);
    }
  },

  async getPayRunsByOrg(orgId: string): Promise<PayRun[]> {
    try {
      const q = query(collection(db, 'payRuns'), where('orgId', '==', orgId));
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as PayRun));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'payRuns');
      return [];
    }
  },

  // --- Payslips ---
  async getPayslipsByWallet(wallet: string): Promise<Payslip[]> {
    try {
      const q = query(collection(db, 'payslips'), where('employeeWallet', '==', wallet));
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as Payslip));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'payslips');
      return [];
    }
  }
};
