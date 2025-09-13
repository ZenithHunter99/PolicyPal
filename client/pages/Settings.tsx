import { useQuery } from "@tanstack/react-query";
import { Insurer } from "@shared/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle, ZapOff } from "lucide-react";

const fetchInsurers = async (): Promise<Insurer[]> => {
    const res = await fetch('/api/insurers');
    if (!res.ok) throw new Error('Network response was not ok');
    return res.json();
};

export default function Settings() {
    const { data: insurers = [], isLoading } = useQuery({ queryKey: ['insurers'], queryFn: fetchInsurers });

    return (
        <div className="flex flex-col h-full gap-6">
            <h1 className="text-2xl font-bold">Settings & Integrations</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Insurer Integrations</CardTitle>
                    <p className="text-sm text-muted-foreground">
                        Connect with insurance providers to enable real-time data sync. (This is a simulation)
                    </p>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {isLoading ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />) :
                        insurers.map(insurer => (
                            <div key={insurer.id} className="flex items-center justify-between rounded-lg border p-4">
                                <span className="font-medium">{insurer.name}</span>
                                {insurer.isConnected ? (
                                    <Button variant="outline" size="sm" className="text-emerald-600 border-emerald-600">
                                        <CheckCircle className="mr-2 h-4 w-4" /> Connected
                                    </Button>
                                ) : (
                                    <Button variant="secondary" size="sm">
                                        <ZapOff className="mr-2 h-4 w-4" /> Connect
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}