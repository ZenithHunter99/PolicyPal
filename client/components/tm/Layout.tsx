import { Outlet, useLocation, Link } from "react-router-dom";
import { Sidebar, SidebarProvider, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { TurtlemintLogo } from "@/components/tm/TurtlemintLogo";
import { LayoutDashboard, ShieldCheck, Workflow, BarChart, Settings, ScanLine } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { path: "/", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/claims", icon: ShieldCheck, label: "Claims" },
  { path: "/workflows", icon: Workflow, label: "Workflows" },
  { path: "/reports", icon: BarChart, label: "Reports" },
  { path: "/settings", icon: Settings, label: "Settings" },
];

export function Layout({ onScanClick }: { onScanClick: () => void; }) {
  const location = useLocation();

  return (
    <SidebarProvider>
      <Sidebar>
        <div className="flex flex-col h-full">
          <div className="p-4 flex items-center gap-3 border-b">
            <TurtlemintLogo className="h-9 w-9 text-primary" />
            <span className="text-xl font-semibold">PolicyPal</span>
          </div>
          <div className="flex-1 p-2">
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.path}
                  >
                    <Link to={item.path}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </div>
          <div className="p-4 border-t">
             <Button className="w-full" onClick={onScanClick}>
                <ScanLine className="mr-2 h-4 w-4" />
                AI Scan
            </Button>
          </div>
        </div>
      </Sidebar>
      <main className="flex-1 p-6 bg-muted/40 h-screen overflow-y-auto">
        <Outlet />
      </main>
    </SidebarProvider>
  );
}