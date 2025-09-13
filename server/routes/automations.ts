import { RequestHandler } from "express";
import { AutomationRule } from "@shared/api";

const automationRules: AutomationRule[] = [
    { id: "auto-1", name: "Renewal Reminder SMS", trigger: "Renewal Due", action: "Send SMS", enabled: true },
    { id: "auto-2", name: "Renewal Reminder Email", trigger: "Renewal Due", action: "Send Email", enabled: true },
    { id: "auto-3", name: "Lapsed Policy Follow-up", trigger: "Policy Lapsed", action: "Create Task", enabled: false },
    { id: "auto-4", name: "Claim Filed Notification", trigger: "Claim Filed", action: "Send Email", enabled: true },
];

export const getAutomations: RequestHandler = (req, res) => {
  res.status(200).json(automationRules);
};