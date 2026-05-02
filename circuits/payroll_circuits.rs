use arcis::*;

#[encrypted]
mod payroll_circuits {
    use arcis::*;

    const MAX_EMPLOYEES: usize = 100;
    const MAX_DEDUCTIONS: usize = 8;

    #[derive(Copy, Clone)]
    pub struct SalaryRecord {
        gross_amount: u64,
        employee_id: u128,
    }

    #[derive(Copy, Clone)]
    pub struct DeductionSet {
        items: [u64; MAX_DEDUCTIONS],
        count: u8,
    }

    // Core: compute net salary privately
    #[instruction]
    pub fn process_net_salary(
        salary: Enc<Shared, SalaryRecord>,
        deductions: Enc<Shared, DeductionSet>,
        tax_rate_bps: u64,
    ) -> Enc<Shared, u64> {
        let record = salary.to_arcis();
        let ded = deductions.to_arcis();
        let gross = record.gross_amount;
        let tax = (gross * tax_rate_bps) / 10000u64;
        let mut voluntary_total = 0u64;
        for i in 0..MAX_DEDUCTIONS {
            let active = (i as u8) < ded.count;
            voluntary_total += if active { ded.items[i] } else { 0u64 };
        }
        let net = gross - tax - voluntary_total;
        salary.owner.from_arcis(net)
    }

    // Aggregate: reveal only the total, not individuals
    #[instruction]
    pub fn aggregate_payroll_total(
        salaries: Enc<Shared, [u64; MAX_EMPLOYEES]>,
        active_count: u64,
    ) -> u64 {
        let s = salaries.to_arcis();
        let mut total = 0u64;
        for i in 0..MAX_EMPLOYEES {
            let include = (i as u64) < active_count;
            total += if include { s[i] } else { 0u64 };
        }
        total.reveal()
    }

    // Verify employer authorization before executing payroll
    #[instruction]
    pub fn verify_payment_authorization(
        employer_key: Pack<VerifyingKey>,
        payment_hash: [u8; 32],
        signature: [u8; 64],
    ) -> bool {
        let vk = employer_key.unpack();
        let sig = ArcisEd25519Signature::from_bytes(signature);
        vk.verify(&payment_hash, &sig).reveal()
    }

    // Generate payslip encrypted to specific employee
    #[instruction]
    pub fn generate_employee_payslip(
        gross: Enc<Shared, u64>,
        deductions: Enc<Shared, u64>,
        employee_pubkey_x: BaseField25519,
    ) -> Enc<Shared, (u64, u64, u64)> {
        let g = gross.to_arcis();
        let d = deductions.to_arcis();
        let net = g - d;
        let employee_pub = ArcisX25519Pubkey::new_from_x(employee_pubkey_x);
        let target = Shared::new(employee_pub);
        target.from_arcis((g, net, d))
    }
}
