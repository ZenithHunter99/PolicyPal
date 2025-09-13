import { useQuery } from "@tanstack/react-query";
import { AutomationRule, Policy } from "../../shared/api";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Switch } from "../components/ui/switch";
import { Badge } from "../components/ui/badge";
import { Skeleton } from "../components/ui/skeleton";

const fetchPolicies = async (): Promise<Policy[]> => {
    const res = await fetch('/api/policies');
    if (!res.ok) throw new Error('Network response was not ok');
    return res.json();
};

const fetchAutomations = async (): Promise<AutomationRule[]> => {
    const res = await fetch('/api/automations');
    if (!res.ok) throw new Error('Network response was not ok');
    return res.json();
};

export default function Workflows() {
    const { data: policies = [], isLoading: isLoadingPolicies } = useQuery({ queryKey: ['policies'], queryFn: fetchPolicies });
    const { data: automations = [], isLoading: isLoadingAutomations } = useQuery({ queryKey: ['automations'], queryFn: fetchAutomations });

    const upcomingRenewals = policies.filter(p => p.status === 'Renewal Due');

    return (
        <div className="flex flex-col h-full gap-6">
            <h1 className="text-2xl font-bold">Automation & Workflows</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader><CardTitle>Upcoming Renewals</CardTitle></CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader><TableRow><TableHead>Policy ID</TableHead><TableHead>Customer</TableHead><TableHead>Due Date</TableHead></TableRow></TableHeader>
                            <TableBody>
                                {isLoadingPolicies ? Array.from({ length: 3 }).map((_, i) => (
                                    <TableRow key={i}><TableCell><Skeleton className="h-4 w-24" /></TableCell><TableCell><Skeleton className="h-4 w-32" /></TableCell><TableCell><Skeleton className="h-4 w-28" /></TableCell></TableRow>
                                )) : upcomingRenewals.map(p => (
                                    <TableRow key={p.id}><TableCell className="font-medium">{p.id}</TableCell><TableCell>{p.customer}</TableCell><TableCell>{p.dueDate}</TableCell></TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle>Automation Rules</CardTitle></CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {isLoadingAutomations ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />) :
                            automations.map(rule => (
                                <div key={rule.id} className="flex items-center justify-between rounded-lg border p-3">
                                    <div>
                                        <p className="font-medium">{rule.name}</p>
                                        <p className="text-sm text-muted-foreground">
                                            Trigger: <Badge variant="secondary">{rule.trigger}</Badge> | Action: <Badge variant="secondary">{rule.action}</Badge>
                                        </p>
                                    </div>
                                    <Switch checked={rule.enabled} />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
 
);
}