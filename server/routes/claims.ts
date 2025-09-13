import { RequestHandler } from "express";
import { Claim } from "@shared/api";

const claims: Claim[] = [
    { id: "CLM-001", policyId: "PL-1003", customer: "Sanjay Patel", claimDate: "2025-06-15", amount: 2500, status: "Approved", description: "Minor dent repair" },
    { id: "CLM-002", policyId: "PL-1001", customer: "Ravi Kumar", claimDate: "2025-08-20", amount: 12000, status: "Pending", description: "Hospitalization bill" },
    { id: "CLM-003", policyId: "PL-1004", customer: "Pooja Verma", claimDate: "2025-05-10", amount: 5000, status: "Rejected", description: "Pre-existing condition" },
];

export const getClaims: RequestHandler = (req, res) => {
  res.status(200).json(claims);
};