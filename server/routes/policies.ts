import { RequestHandler } from "express";
import { Policy } from "@shared/api";

const policies: Policy[] = [
    { id: "PL-1001", customerId: "CUST-001", customer: "Ravi Kumar", type: "Health", insurer: "HDFC ERGO", status: "Active", dueDate: "—", amount: 14500, policyNumber: "HDF123456", startDate: "2024-08-01", endDate: "2025-07-31" },
    { id: "PL-1002", customerId: "CUST-002", customer: "Anita Sharma", type: "Life", insurer: "LIC", status: "Renewal Due", dueDate: "2025-10-01", amount: 22000, policyNumber: "LIC987654", startDate: "2023-10-01", endDate: "2025-09-30" },
    { id: "PL-1003", customerId: "CUST-003", customer: "Sanjay Patel", type: "Motor", insurer: "ICICI Lombard", status: "Lapsed", dueDate: "2025-07-21", amount: 7800, policyNumber: "ICI456789", startDate: "2024-07-21", endDate: "2025-07-20" },
    { id: "PL-1004", customerId: "CUST-004", customer: "Pooja Verma", type: "Health", insurer: "Star Health", status: "Renewal Due", dueDate: "2025-09-15", amount: 16800, policyNumber: "STAR112233", startDate: "2024-09-15", endDate: "2025-09-14" },
    { id: "PL-1005", customerId: "CUST-005", customer: "Arjun Mehta", type: "Travel", insurer: "Tata AIG", status: "Active", dueDate: "—", amount: 5200, policyNumber: "TATA445566", startDate: "2025-01-10", endDate: "2025-01-25" },
];

export const getPolicies: RequestHandler = (req, res) => {
  res.status(200).json(policies);
};