import { RequestHandler } from "express";
import { Insurer } from "@shared/api";

const insurers: Insurer[] = [
    { id: "insurer-1", name: "HDFC ERGO", isConnected: true },
    { id: "insurer-2", name: "LIC", isConnected: false },
    { id: "insurer-3", name: "ICICI Lombard", isConnected: true },
    { id: "insurer-4", name: "Star Health", isConnected: false },
    { id: "insurer-5", name: "Tata AIG", isConnected: true },
    { id: "insurer-6", name: "Bajaj Allianz", isConnected: false },
];

export const getInsurers: RequestHandler = (req, res) => {
  res.status(200).json(insurers);
};