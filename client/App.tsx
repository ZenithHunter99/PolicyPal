import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { Customer } from "@shared/api";
import { toast } from "sonner";

// Layout and Pages
import { Layout } from "@/components/tm/Layout";
import Dashboard from "./pages/Dashboard";
import Claims from "./pages/Claims";
import Workflows from "./pages/Workflows";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

// Feature Components
import { AIScanModal } from "@/components/tm/AIScanModal";
import { Chatbot } from "@/components/tm/Chatbot";

const queryClient = new QueryClient();

const App = () => {
  const [scanOpen, setScanOpen] = useState(false);
  const [customerFromScan, setCustomerFromScan] = useState<Customer | null>(null);

  const handleScanFilled = (details: Customer) => {
    setCustomerFromScan(details);
    toast.success("Customer details ready", {
        description: `${details.name}'s information can now be used to create a new policy.`,
    });
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout onScanClick={() => setScanOpen(true)} />}>
              <Route index element={<Dashboard customerFromScan={customerFromScan} />} />
              <Route path="claims" element={<Claims />} />
              <Route path="workflows" element={<Workflows />} />
              <Route path="reports" element={<Reports />} />
              <Route path="settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
        <AIScanModal open={scanOpen} onOpenChange={setScanOpen} onFilled={handleScanFilled} />
        <Chatbot />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

createRoot(document.getElementById("root")!).render(<App />);