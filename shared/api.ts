/**
 * Shared interfaces for the PolicyPal application.
 * These types are used by both the client and server.
 */

export interface Customer {
  id: string;
  name: string;
  dob: string;
  address: string;
  phone: string;
  email: string;
}

export interface Policy {
  id: string;
  customer: string;
  customerId: string;
  type: 'Health' | 'Life' | 'Motor' | 'Travel';
  insurer: string;
  status: 'Active' | 'Renewal Due' | 'Lapsed';
  dueDate: string;
  amount: number;
  policyNumber: string;
  startDate: string;
  endDate: string;
}

export interface Claim {
  id: string;
  policyId: string;
  customer: string;
  claimDate: string;
  amount: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  description: string;
}

export interface Insurer {
  id: string;
  name: string;
  logoUrl?: string; // Optional logo URL for display
  isConnected: boolean;
}

export interface AutomationRule {
  id: string;
  name: string;
  trigger: 'Renewal Due' | 'Policy Lapsed' | 'Claim Filed';
  action: 'Send SMS' | 'Send Email' | 'Create Task';
  enabled: boolean;
}