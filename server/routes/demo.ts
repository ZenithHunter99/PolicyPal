
import { RequestHandler } from "express";
import { DemoResponse } from "@shared/api";

export const handleDemo: RequestHandler = (_req, res) => {
  const response: DemoResponse = {
    message: "Hello from Express server",
    timestamp: new Date().toISOString(),
    data: { status: "success" }
  };
  res.status(200).json(response);
};