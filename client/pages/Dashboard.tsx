import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Customer, Policy } from "../../shared/api";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { ScrollArea } from "../components/ui/scroll-area";
import { DollarSign, Filter, Users, WalletCards, CreditCard } from "lucide-react";
import { StatusPill } from "../components/tm/StatusPill";
import { PaymentModal } from "../components/tm/PaymentModal";
import { Skeleton } from "../components/ui/skeleton";

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
        <div className="space-y-6">
            {/* Filters Section */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-4">
                    <h3 className="text-sm font-medium text-gray-900">Filters</h3>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <label className="text-sm text-gray-600">Policy Type</label>
                            <Select value={filters.type} onValueChange={(v: string) => setFilters(f => ({ ...f, type: v }))}>
                                <SelectTrigger className="w-32">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {uniqueTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center gap-2">
                            <label className="text-sm text-gray-600">Insurer</label>
                            <Select value={filters.insurer} onValueChange={(v: string) => setFilters(f => ({ ...f, insurer: v }))}>
                                <SelectTrigger className="w-32">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {uniqueInsurers.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center gap-2">
                            <label className="text-sm text-gray-600">Customer / Policy</label>
                            <Input 
                                value={filters.search} 
                                onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))} 
                                placeholder="e.g., Ravi, PL-1001" 
                                className="w-48"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-4 gap-6">
                <Card className="bg-white border border-gray-200">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Active Policies</p>
                                <p className="text-3xl font-bold text-green-600">{stats.active}</p>
                            </div>
                            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <WalletCards className="h-6 w-6 text-green-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                
                <Card className="bg-white border border-gray-200">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Renewal Due</p>
                                <p className="text-3xl font-bold text-orange-600">{stats.due}</p>
                            </div>
                            <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                                <CreditCard className="h-6 w-6 text-orange-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                
                <Card className="bg-white border border-gray-200">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">$ Lapsed</p>
                                <p className="text-3xl font-bold text-red-600">{stats.lapsed}</p>
                            </div>
                            <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                                <DollarSign className="h-6 w-6 text-red-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                
                <Card className="bg-white border border-gray-200">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Commission</p>
                                <p className="text-3xl font-bold text-gray-900">₹ {stats.totalPremium.toLocaleString()}</p>
                            </div>
                            <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                <Users className="h-6 w-6 text-gray-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-3 gap-6">
                {/* Policies Table */}
                <div className="col-span-2">
                    <Card className="bg-white border border-gray-200">
                        <CardHeader className="border-b border-gray-200">
                            <CardTitle className="text-lg font-semibold">Policies</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-b border-gray-200">
                                            <TableHead className="font-medium text-gray-900">Policy ID</TableHead>
                                            <TableHead className="font-medium text-gray-900">Customer</TableHead>
                                            <TableHead className="font-medium text-gray-900">Type</TableHead>
                                            <TableHead className="font-medium text-gray-900">Insurer</TableHead>
                                            <TableHead className="font-medium text-gray-900">Status</TableHead>
                                            <TableHead className="font-medium text-gray-900">Due Date</TableHead>
                                            <TableHead className="font-medium text-gray-900 text-right">Amount</TableHead>
                                            <TableHead className="font-medium text-gray-900 text-right">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {isLoading ? (
                                            Array.from({ length: 5 }).map((_, i) => (
                                                <TableRow key={i} className="border-b border-gray-100">
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
                                                <TableRow key={p.id} className="border-b border-gray-100 hover:bg-gray-50">
                                                    <TableCell className="font-medium text-gray-900">{p.id}</TableCell>
                                                    <TableCell className="text-gray-700">{p.customer}</TableCell>
                                                    <TableCell className="text-gray-700">{p.type}</TableCell>
                                                    <TableCell className="text-gray-700">{p.insurer}</TableCell>
                                                    <TableCell>
                                                        <StatusPill status={p.status} />
                                                    </TableCell>
                                                    <TableCell className="text-gray-700">{p.dueDate}</TableCell>
                                                    <TableCell className="text-right font-medium text-gray-900">₹{p.amount.toLocaleString()}</TableCell>
                                                    <TableCell className="text-right">
                                                        {p.status !== "Active" && (
                                                            <Button 
                                                                size="sm" 
                                                                onClick={() => setPayment({ open: true, policy: p })}
                                                                className="bg-green-600 hover:bg-green-700 text-white"
                                                            >
                                                                Make Payment
                                                            </Button>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Sidebar */}
                <div className="space-y-6">
                    {/* Customers */}
                    <Card className="bg-white border border-gray-200">
                        <CardHeader className="border-b border-gray-200">
                            <CardTitle className="text-lg font-semibold">Customers</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 space-y-3">
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <div key={i} className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <Skeleton className="h-4 w-24" />
                                            <Skeleton className="h-3 w-32" />
                                        </div>
                                        <Skeleton className="h-6 w-16" />
                                    </div>
                                ))
                            ) : (
                                filteredPolicies.slice(0, 5).map((p) => (
                                    <div key={p.id} className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-gray-900">{p.customer}</p>
                                            <p className="text-sm text-gray-600">{p.type} • {p.insurer}</p>
                                        </div>
                                        <div>
                                            {p.status === "Active" ? (
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    Active
                                                </span>
                                            ) : (
                                                <Button 
                                                    size="sm" 
                                                    className="bg-green-100 text-green-700 hover:bg-green-200"
                                                    onClick={() => setPayment({ open: true, policy: p })}
                                                >
                                                    Pay
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>

                    {/* Payment History */}
                    <Card className="bg-white border border-gray-200">
                        <CardHeader className="border-b border-gray-200">
                            <CardTitle className="text-lg font-semibold">Payment History</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">2025-08-10</span>
                                <span className="font-medium text-gray-900">₹ 3,200</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">2025-08-22</span>
                                <span className="font-medium text-gray-900">₹ 5,400</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">2025-09-03</span>
                                <span className="font-medium text-gray-900">₹ 2,100</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <PaymentModal
                open={payment.open}
                onOpenChange={(v) => setPayment({ open: v, policy: v ? payment.policy : undefined })}
                policy={payment.policy}
            />
        </div>
    );
}