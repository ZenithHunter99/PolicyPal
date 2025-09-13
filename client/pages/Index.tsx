import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, Filter, Users, WalletCards, CreditCard, ScanLine, Languages } from "lucide-react";
import { StatusPill, PolicyStatus } from "@/components/tm/StatusPill";
import { PaymentModal } from "@/components/tm/PaymentModal";
import { Chatbot } from "@/components/tm/Chatbot";
import { AIScanModal, CustomerDetails } from "@/components/tm/AIScanModal";
import { PolicyExplainer } from "@/components/tm/PolicyExplainer";
import { CashDeposit } from "@/components/tm/CashDeposit";

interface PolicyRow {
  id: string;
  customer: string;
  type: string;
  insurer: string;
  status: PolicyStatus;
  dueDate: string;
  amount: number;
}

const seedPolicies: PolicyRow[] = [
  { id: "PL-1001", customer: "Ravi Kumar", type: "Health", insurer: "HDFC ERGO", status: "Active", dueDate: "—", amount: 14500 },
  { id: "PL-1002", customer: "Anita Sharma", type: "Life", insurer: "LIC", status: "Renewal Due", dueDate: "2025-10-01", amount: 22000 },
  { id: "PL-1003", customer: "Sanjay Patel", type: "Motor", insurer: "ICICI Lombard", status: "Lapsed", dueDate: "2025-07-21", amount: 7800 },
  { id: "PL-1004", customer: "Pooja Verma", type: "Health", insurer: "Star Health", status: "Renewal Due", dueDate: "2025-09-15", amount: 16800 },
  { id: "PL-1005", customer: "Arjun Mehta", type: "Travel", insurer: "Tata AIG", status: "Active", dueDate: "—", amount: 5200 },
];

export default function Index() {
  const [policies, setPolicies] = useState<PolicyRow[]>(seedPolicies);
  const [filters, setFilters] = useState({ type: "All", insurer: "All", search: "" });
  const [payment, setPayment] = useState<{ open: boolean; policy?: PolicyRow }>(() => ({ open: false }));
  const [scanOpen, setScanOpen] = useState(false);
  const [customerFromScan, setCustomerFromScan] = useState<CustomerDetails | null>(null);
  const [tab, setTab] = useState("dashboard");

  const filtered = useMemo(() => {
    return policies.filter((p) =>
      (filters.type === "All" || p.type === filters.type) &&
      (filters.insurer === "All" || p.insurer === filters.insurer) &&
      (filters.search === "" || p.customer.toLowerCase().includes(filters.search.toLowerCase()) || p.id.toLowerCase().includes(filters.search.toLowerCase()))
    );
  }, [policies, filters]);

  const counts = useMemo(() => ({
    active: policies.filter(p => p.status === "Active").length,
    due: policies.filter(p => p.status === "Renewal Due").length,
    lapsed: policies.filter(p => p.status === "Lapsed").length,
  }), [policies]);

  const commissions = useMemo(() => ({ total: 184250, history: [
    { id: "CM-001", date: "2025-08-10", amount: 3200 },
    { id: "CM-002", date: "2025-08-22", amount: 5400 },
    { id: "CM-003", date: "2025-09-03", amount: 2100 },
  ] }), []);

  const candidates = useMemo(() => [
    { id: "RX1", name: "Health Plus", premium: 18000, coverage: 500000, type: "family floater", pros: ["Cashless network", "Wellness benefits"], cons: ["Room rent cap"] },
    { id: "RX2", name: "Secure Life", premium: 22000, coverage: 2500000, type: "term life", pros: ["High cover"], cons: ["Medical tests required"] },
    { id: "RX3", name: "Auto Shield", premium: 7000, coverage: 500000, type: "motor", pros: ["Zero dep add-on"], cons: ["Garage network limited"] },
  ], []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto w-full max-w-[2852px] px-6 py-6" style={{ aspectRatio: "2852/1476" }}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-md bg-primary flex items-center justify-center">
              <svg viewBox="0 0 64 64" className="h-6 w-6 text-primary-foreground" aria-hidden>
                <g fill="currentColor">
                  <path d="M32 14c-9.389 0-17 6.716-17 15 0 8.284 7.611 15 17 15s17-6.716 17-15c0-8.284-7.611-15-17-15zm0 6c6.627 0 12 4.477 12 9s-5.373 9-12 9-12-4.477-12-9 5.373-9 12-9z"/>
                  <path d="M19 30c-2.8-1.2-6.5-1.2-9.5 1.5-.8.7-1.9.7-2.7-.1-.8-.8-.8-2.1.1-2.9C10.2 24 15.2 24 19 25.7V30z"/>
                  <path d="M45 30c2.8-1.2 6.5-1.2 9.5 1.5.8.7 1.9.7 2.7-.1.8-.8.8-2.1-.1-2.9-3.3-3.6-8.3-3.6-12.1-1.9V30z"/>
                  <path d="M26 42.5c-1.1 2.7-3.4 5.3-6.7 6.7-1 .4-2.1-.1-2.5-1.1-.4-1 .1-2.1 1.1-2.5 2.2-.9 3.8-2.6 4.6-4.4h3.5z"/>
                  <path d="M38 42.5c1.1 2.7 3.4 5.3 6.7 6.7 1 .4 2.1-.1 2.5-1.1.4-1-.1-2.1-1.1-2.5-2.2-.9-3.8-2.6-4.6-4.4H38z"/>
                </g>
              </svg>
            </div>
            <div className="text-xl font-semibold">Turtlemint B2B</div>
          </div>
          <div className="flex items-center gap-3">
            <Input className="w-[360px]" placeholder="Search policies, customers, receipts" />
            <Button variant="secondary" className="gap-2" onClick={() => setScanOpen(true)}><ScanLine className="h-4 w-4" /> AI Scan</Button>
          </div>
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="mt-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="explainer">Policy Explainer</TabsTrigger>
            <TabsTrigger value="deposit">Cash Deposit</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2"><Filter className="h-4 w-4" /> Filters</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium">Policy Type</label>
                  <Select value={filters.type} onValueChange={(v) => setFilters({ ...filters, type: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {['All','Health','Life','Motor','Travel'].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Insurer</label>
                  <Select value={filters.insurer} onValueChange={(v) => setFilters({ ...filters, insurer: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {['All','HDFC ERGO','LIC','ICICI Lombard','Star Health','Tata AIG'].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Customer / Policy</label>
                  <Input value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} placeholder="e.g., Ravi, PL-1001" />
                </div>
              </CardContent>
            </Card>

            {customerFromScan && (
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="text-lg">Autofilled details ready</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-3 text-sm">
                    <div><div className="text-muted-foreground">Name</div><div className="font-medium">{customerFromScan.name}</div></div>
                    <div><div className="text-muted-foreground">DOB</div><div className="font-medium">{customerFromScan.dob}</div></div>
                    <div><div className="text-muted-foreground">ID</div><div className="font-medium">{customerFromScan.idNumber}</div></div>
                    <div><div className="text-muted-foreground">Address</div><div className="font-medium truncate">{customerFromScan.address}</div></div>
                  </div>
                  <div className="mt-3">
                    <Button>Use in New Purchase</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="mt-6 grid grid-cols-12 gap-4">
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2"><WalletCards className="h-4 w-4" /> Active Policies</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-emerald-600">{counts.active}</div>
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2"><CreditCard className="h-4 w-4" /> Renewal Due</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-yellow-600">{counts.due}</div>
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2"><DollarSign className="h-4 w-4" /> Lapsed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-600">{counts.lapsed}</div>
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2"><Users className="h-4 w-4" /> Commission</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">₹ {commissions.total.toLocaleString()}</div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-6 grid grid-cols-12 gap-6">
              <Card className="col-span-12">
                <CardHeader>
                  <CardTitle className="text-lg">Policies</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[520px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Policy ID</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Insurer</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Due Date</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                          <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filtered.map((p) => (
                          <TableRow key={p.id}>
                            <TableCell>{p.id}</TableCell>
                            <TableCell>{p.customer}</TableCell>
                            <TableCell>{p.type}</TableCell>
                            <TableCell>{p.insurer}</TableCell>
                            <TableCell><StatusPill status={p.status} /></TableCell>
                            <TableCell>{p.dueDate}</TableCell>
                            <TableCell className="text-right">₹ {p.amount.toLocaleString()}</TableCell>
                            <TableCell className="text-right">
                              {p.status !== "Active" && (
                                <Button size="sm" onClick={() => setPayment({ open: true, policy: p })}>Make Payment</Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            <div className="mt-6 grid grid-cols-12 gap-6">
              <Card className="col-span-6">
                <CardHeader>
                  <CardTitle className="text-lg">Customers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {policies.map(p => (
                      <div key={p.id} className="flex items-center justify-between rounded-md border p-3">
                        <div>
                          <div className="font-medium">{p.customer}</div>
                          <div className="text-xs text-muted-foreground">{p.type} • {p.insurer}</div>
                        </div>
                        {p.status !== "Active" ? (
                          <Button size="sm" variant="secondary" onClick={() => setPayment({ open: true, policy: p })}>Pay</Button>
                        ) : (
                          <Badge variant="secondary">Active</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="col-span-6">
                <CardHeader>
                  <CardTitle className="text-lg">Payment History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    {commissions.history.map(h => (
                      <div key={h.id} className="flex items-center justify-between rounded-md border p-2">
                        <span className="text-muted-foreground">{h.date}</span>
                        <span>₹ {h.amount.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-6 flex items-center justify-end">
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => setScanOpen(true)}><ScanLine className="mr-2 h-4 w-4" /> AI Scan to Autofill</Button>
                <Button onClick={() => setPayment({ open: true, policy: policies.find(p => p.status === 'Renewal Due') })}><CreditCard className="mr-2 h-4 w-4" /> Quick Payment</Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="deposit" className="mt-4">
            <CashDeposit
              policies={policies.map(p => ({ id: p.id, customer: p.customer, amount: p.amount }))}
              onApproved={(policyId, txnId) => {
                setPolicies(prev => prev.map(p => p.id === policyId ? { ...p, status: "Active", dueDate: "—" } : p));
              }}
            />
          </TabsContent>

          <TabsContent value="explainer" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2"><Languages className="h-4 w-4" /> Policy Explainer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-12 gap-6">
                  <div className="col-span-8 space-y-4">
                    <PolicyExplainer selectedPolicy={null} candidates={candidates as any} />
                  </div>
                  <div className="col-span-4">
                    <div className="rounded-lg border p-4">
                      <div className="mb-2 text-sm font-medium">Select a sample customer or policy to compare</div>
                      <div className="space-y-2 text-sm">
                        {policies.map(p => (
                          <div key={p.id} className="flex items-center justify-between rounded-md border p-2">
                            <div>
                              <div className="font-medium">{p.customer}</div>
                              <div className="text-xs text-muted-foreground">{p.type} • {p.insurer}</div>
                            </div>
                            <StatusPill status={p.status} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <PaymentModal
        open={payment.open}
        onOpenChange={(v) => setPayment({ open: v, policy: v ? payment.policy : undefined })}
        policyId={payment.policy?.id ?? ""}
        customer={payment.policy?.customer ?? ""}
        amount={payment.policy?.amount ?? 0}
      />
      <AIScanModal open={scanOpen} onOpenChange={setScanOpen} onFilled={(d) => setCustomerFromScan(d)} />
      <Chatbot />
    </div>
  );
}
