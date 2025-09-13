import { Outlet, useLocation, Link } from "react-router-dom";
import { TurtlemintLogo } from "./TurtlemintLogo";
import { LayoutDashboard, ShieldCheck, Workflow, BarChart, Settings, ScanLine, Search } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const navItems = [
  { path: "/", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/claims", icon: ShieldCheck, label: "Policy Explainer" },
  { path: "/workflows", icon: Workflow, label: "Cash Deposit" },
];

export function Layout({ onScanClick }: { onScanClick: () => void; }) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-white">
      {/* Top Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <TurtlemintLogo className="h-8 w-8 text-green-600" />
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Search policies, customers, receipts" 
                  className="pl-10 w-80 border-gray-300 focus:border-green-500 focus:ring-green-500"
                />
              </div>
              <Button onClick={onScanClick} className="bg-green-600 hover:bg-green-700 text-white">
                <ScanLine className="mr-2 h-4 w-4" />
                AI Scan
              </Button>
            </div>
          </div>
        </div>
        
        {/* Navigation Tabs */}
        <div className="px-6">
          <div className="flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-1 py-4 text-sm font-medium border-b-2 transition-colors ${
                  location.pathname === item.path
                    ? "border-green-600 text-green-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}