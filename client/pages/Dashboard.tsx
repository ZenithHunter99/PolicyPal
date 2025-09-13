import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Customer, Policy } from "@shared/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DollarSign, Filter, Users, WalletCards, CreditCard } from "lucide-react";
import { StatusPill } from "@/components/tm/StatusPill";
import { PaymentModal } from "@/components/tm/PaymentModal";
import { Skeleton } from "@/components/ui/skeleton";

const fetchPolicies = async (): Promise<Policy[]> => {
    const res = await fetch('/api/policies');
    if (!res.ok) throw new Error('Network response was not ok');
    return res.json();
}

export default function Dashboard({ customerFromScan }: { customerFromScan: Customer | null }) {
    const { data: policies = [], isLoading } = useQuery({ queryKey: ['policies'], queryFn: fetchPolicies });
    
    const [filters, setFilters] = useState({ type: "All", insurer: "All", search: "" });
    const [payment, setPayment] = useState<{ open: boolean; policy?: Policy }>({ open: false });

    const filteredPolicies = useMemo(() => {
        return policies.filter((p) =>
            (filters.type === "All" || p.type === filters.type) &&
            (filters.insurer === "All" || p.insurer === filters.insurer) &&
            (filters.search === "" || p.customer.toLowerCase().includes(filters.search.toLowerCase()) || p.id.toLowerCase().includes(filters.search.toLowerCase()))
        );
    }, [policies, filters]);

    const stats = useMemo(() => ({
        active: policies.filter(p => p.status === "Active").length,
        due: policies.filter(p => p.status === "Renewal Due").length,
        lapsed: policies.filter(p => p.status === "Lapsed").length,
        totalPremium: policies.reduce((acc, p) => acc + p.amount, 0)
    }), [policies]);
    
    const uniqueInsurers = useMemo(() => ['All', ...Array.from(new Set(policies.map(p => p.insurer)))], [policies]);
    const uniqueTypes = useMemo(() => ['All', ...Array.from(new Set(policies.map(p => p.type)))], [policies]);

    return (
        <div className="flex flex-col h-full gap-6">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            
            {customerFromScan && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Autofilled Details Ready</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div><div className="text-muted-foreground">Name</div><div className="font-medium">{customerFromScan.name}</div></div>
                    <div><div className="text-muted-foreground">DOB</div><div className="font-medium">{customerFromScan.dob}</div></div>
                    <div><div className="text-muted-foreground">Phone</div><div className="font-medium">{customerFromScan.phone}</div></div>
                    <div><div className="text-muted-foreground">Address</div><div className="font-medium truncate">{customerFromScan.address}</div></div>
                  </div>
                  <div>
                    <Button>Use in New Purchase</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Active Policies</CardTitle><WalletCards className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold text-emerald-600">{stats.active}</div></CardContent></Card>
                <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Renewal Due</CardTitle><CreditCard className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold text-yellow-600">{stats.due}</div></CardContent></Card>
                <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Lapsed Policies</CardTitle><Users className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold text-red-600">{stats.lapsed}</div></CardContent></Card>
                <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Total Premium</CardTitle><DollarSign className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">₹{stats.totalPremium.toLocaleString()}</div></CardContent></Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center justify-between">
                        <span>All Policies</span>
                        <div className="flex items-center gap-2">
                           <Filter className="h-4 w-4 text-muted-foreground" />
                           <Select value={filters.type} onValueChange={(v) => setFilters(f => ({ ...f, type: v }))}><SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger><SelectContent>{uniqueTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select>
                           <Select value={filters.insurer} onValueChange={(v) => setFilters(f => ({ ...f, insurer: v }))}><SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger><SelectContent>{uniqueInsurers.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select>
                           <Input value={filters.search} onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))} placeholder="Search Customer/Policy..." className="w-[250px]" />
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Policy ID</TableHead><TableHead>Customer</TableHead><TableHead>Type</TableHead><TableHead>Insurer</TableHead><TableHead>Status</TableHead><TableHead>Due Date</TableHead><TableHead className="text-right">Amount</TableHead><TableHead className="text-right">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-[60px]" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-[100px]" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-[90px]" /></TableCell>
                                    <TableCell className="text-right"><Skeleton className="h-4 w-[70px] ml-auto" /></TableCell>
                                    <TableCell className="text-right"><Skeleton className="h-8 w-[120px] ml-auto" /></TableCell>
                                </TableRow>
                            ))
                        ) : (
                            filteredPolicies.map((p) => (
                              <TableRow key={p.id}>
                                <TableCell className="font-medium">{p.id}</TableCell><TableCell>{p.customer}</TableCell><TableCell>{p.type}</TableCell><TableCell>{p.insurer}</TableCell><TableCell><StatusPill status={p.status} /></TableCell><TableCell>{p.dueDate}</TableCell><TableCell className="text-right">₹{p.amount.toLocaleString()}</TableCell>
                                <TableCell className="text-right">
                                  {p.status !== "Active" && (
                                    <Button size="sm" onClick={() => setPayment({ open: true, policy: p })}>Make Payment</Button>
                                  )}
                                </TableCell>
                              </TableRow>
                            ))
                        )}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </CardContent>
            </Card>

            <PaymentModal
                open={payment.open}
                onOpenChange={(v) => setPayment({ open: v, policy: v ? payment.policy : undefined })}
                policy={payment.policy}
            />
        </div>
    );
}