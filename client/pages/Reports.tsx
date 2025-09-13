import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { BarChart } from 'lucide-react';

export default function Reports() {
  return (
    <div className="flex flex-col h-full gap-6">
        <h1 className="text-2xl font-bold">Reports & Analytics</h1>
        <Card className="flex-1">
            <CardHeader>
                <CardTitle>Performance Overview</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                    <BarChart className="h-16 w-16 mb-4" />
                    <h3 className="text-xl font-semibold">Reporting Feature Coming Soon</h3>
                    <p className="mt-2 max-w-md">
                        Detailed analytics, commission tracking, and performance reports will be available here to provide deep insights into your business.
                    </p>
                </div>
            </CardContent>
        </Card>
    </div>
  );
}