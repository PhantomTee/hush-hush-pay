export const mockOrg = {
  id: 'org_01',
  name: 'Acme Corp',
  mxeAddress: 'MXE7f3k...9pQr',
  clusterId: 'CLS-042',
  clusterNodes: 5,
  clusterHealth: 'healthy',
  nextPayDate: new Date(Date.now() + 5 * 24 * 3600000),
};

export const mockEmployees = [
  { id: 'emp_01', name: 'Alice Chen', wallet: '7xKw...3pR1', status: 'active', addedAt: '2024-01-15' },
  { id: 'emp_02', name: 'Bob Martinez', wallet: '9mNv...7kL2', status: 'active', addedAt: '2024-02-01' },
  { id: 'emp_03', name: 'Carol White', wallet: '3jPq...1mK8', status: 'active', addedAt: '2024-02-20' },
];

export const mockPayRuns = [
  { id: 'run_01', period: 'March 2025', employees: 12, aggregateUsdc: 45200, txHash: '5xKq...9pW2', status: 'complete' },
  { id: 'run_02', period: 'February 2025', employees: 11, aggregateUsdc: 43100, txHash: '3mPr...7kN1', status: 'complete' },
];

export const mockArxNodes = [
  { id: 'node_01', jurisdiction: 'DE', uptime: 99.8, reputation: 95, status: 'active' },
  { id: 'node_02', jurisdiction: 'US', uptime: 99.5, reputation: 93, status: 'active' },
  { id: 'node_03', jurisdiction: 'SG', uptime: 98.9, reputation: 91, status: 'active' },
];
