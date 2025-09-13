import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { getPolicies, getPolicyById } from "./routes/policies";
import { getClaims } from "./routes/claims";
import { getInsurers } from "./routes/insurers";
import { getAutomations } from "./routes/automations";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);
  
  // New PolicyPal API Routes
  app.get("/api/policies", getPolicies);
  app.get("/api/policies/:id", getPolicyById);
  app.get("/api/claims", getClaims);
  app.get("/api/insurers", getInsurers);
  app.get("/api/automations", getAutomations);

  return app;
}