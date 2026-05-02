# Firestore Security Specification - HushHush Pay

## 1. Data Invariants
- An **Organization** is the root of authority. The `adminWallet` field defines who can manage the org.
- An **Employee** must belong to an `orgId`. Only the org admin can add/modify employees.
- A **PayRun** is a batch event. Only the org admin can create one.
- A **Payslip** is private. Only the employee (identified by `wallet`) and the org admin can read it.

## 2. The Dirty Dozen (Attack Payloads)
1. **Admin Impersonation**: Attempting to update `organizations/org1` while authenticated as a user whose UID does not match `adminWallet`.
2. **Ghost Field Injection**: Attempting to add `isAdmin: true` to an employee record during update.
3. **Identity Poisoning**: Using a 1MB string as a `runId`.
4. **Chronos Attack**: Changing the `createdAt` timestamp of a completed `payRun`.
5. **PII Leak**: A signed-in user attempting to `get` an employee record from a different organization.
6. **Self-Promotion**: An employee attempting to change their `status` to 'active' if they were 'terminated'.
7. **Cross-Tenant Write**: Creating an employee in `orgA` with an `orgId` pointing to `orgB`.
8. **Denial of Wallet**: Sending a `list` query to `employees` without an `orgId` filter (blanket read check).
9. **Orphaned Record**: Creating a `payRun` for a non-existent `orgId`.
10. **Salary Tamper**: Attempting to update `encryptedCid` on a payslip after it has been issued.
11. **MXE Hijack**: Updating `mxeAddress` of an organization.
12. **Status Shortcut**: Moving a `payRun` from 'pending' directly to 'complete' without the necessary intermediate state (if logic required it).

## 3. Test Runner - firestore.rules.test.ts
(Sketch of tests to be implemented)
- `expect(db.doc('orgs/1').update({ name: 'Hacked' })).toDeny()` for non-owners.
- `expect(db.collection('employees').add({ orgId: 'org1', wallet: '...' })).toDeny()` for non-admins.
- `expect(db.doc('payslips/ps1').get()).toAllow()` ONLY for the matching employee.
