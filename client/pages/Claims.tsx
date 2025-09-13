import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Claim } from "@shared/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const fetchClaims = async (): Promise<Claim[]> => {
    const res = await fetch('/api/claims');
    if (!res.ok) throw new Error('Network response was not ok');
    return res.json();
};

const statusColors: Record<Claim['status'], string> = {
    Pending: "bg-yellow-500",
    Approved: "bg-emerald-500",
    Rejected: "bg-red-500",
};

export default function Claims() {
    const { data: claims = [], isLoading } = useQuery({ queryKey: ['claims'], queryFn: fetchClaims });
    const [statusFilter, setStatusFilter] = useState<"All" | Claim['status']>("All");

    const filteredClaims = useMemo(() => {
        if (statusFilter === "All") return claims;
        return claims.filter(c => c.status === statusFilter);
    }, [claims, statusFilter]);
    
    return (
        <div className="flex flex-col h-full gap-6">
            <h1 className="text-2xl font-bold">Claims Management</h1>
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center justify-between">
                        <span>All Claims</span>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">Status:</span>
                            <Select value={statusFilter} onValueChange={(v: any) => setStatusFilter(v)}>
                                <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="All">All</SelectItem>
                                    <SelectItem value="Pending">Pending</SelectItem>
                                    <SelectItem value="Approved">Approved</SelectItem>
                                    <SelectItem value="Rejected">Rejected</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Claim ID</TableHead>
                                <TableHead>Policy ID</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                Array.from({ length: 3 }).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                                        <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                                        <TableCell className="text-right"><Skeleton className="h-4 w-20 ml-auto" /></TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                filteredClaims.map(claim => (
                                    <TableRow key={claim.id}>
                                        <TableCell className="font-medium">{claim.id}</TableCell>
                                        <TableCell>{claim.policyId}</TableCell>
                                        <TableCell>{claim.customer}</TableCell>
                                        <TableCell>{claim.claimDate}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="flex w-fit items-center gap-2 pr-2">
                                                <span className={`h-2.5 w-2.5 rounded-full ${statusColors[claim.status]}`} />
                                                {claim.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">₹{claim.amount.toLocaleString()}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}