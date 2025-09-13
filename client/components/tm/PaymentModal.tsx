import { useEffect, useRef, useState } from "react";
import * as QRCode from "qrcode";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { downloadReceipt } from "./receipt";
import { toast } from "sonner";
import { Policy } from "../../../shared/api";

export interface PaymentModalProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  policy?: Policy | null;
}

export function PaymentModal({ open, onOpenChange, policy }: PaymentModalProps) {
  const [method, setMethod] = useState("upi");
  const [processing, setProcessing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [vpa, setVpa] = useState("customer@upi");
  
  const amount = policy?.amount ?? 0;
  const customer = policy?.customer ?? "";
  const policyId = policy?.id ?? "";

  const upiString = `upi://pay?pa=${encodeURIComponent(vpa)}&pn=${encodeURIComponent(customer)}&am=${amount}&tn=${encodeURIComponent("Policy "+policyId)}`;

  useEffect(() => {
    if (open && method === "upi" && canvasRef.current && upiString) {
      QRCode.toCanvas(canvasRef.current, upiString, { width: 220 }, (err: any) => {
        if (err) console.error(err);
      });
    }
  }, [open, method, upiString]);

  function success(selectedMethod: string) {
    if(!policy) return;
    const txnId = `${selectedMethod.toUpperCase()}-${Date.now()}`;
    downloadReceipt(policyId, customer);
    console.log({
      policyId,
      customer,
      amount,
      method: selectedMethod.toUpperCase(),
      txnId,
      timestamp: new Date().toLocaleString(),
    });
    toast.success("Payment successful", { description: `Txn ${txnId} for Policy ${policyId}` });
    onOpenChange(false);
  }

  async function handlePay(selectedMethod: string) {
    try {
      setProcessing(true);
      await new Promise((r) => setTimeout(r, 900));
      success(selectedMethod);
    } catch (e) {
      toast.error("Payment failed");
    } finally {
      setProcessing(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Make Payment</DialogTitle>
          <DialogDescription>
            For {customer} • Policy {policyId} • Amount: ₹{amount.toLocaleString()}
          </DialogDescription>
        </DialogHeader>
        <Tabs value={method} onValueChange={setMethod}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upi">UPI</TabsTrigger>
            <TabsTrigger value="card">Card</TabsTrigger>
            <TabsTrigger value="netbanking">Net Banking</TabsTrigger>
          </TabsList>
          <TabsContent value="upi" className="mt-4">
            <div className="flex gap-6 items-start">
              <div className="rounded-lg border p-4 bg-white">
                <canvas ref={canvasRef} />
              </div>
              <div className="flex-1 space-y-3 pt-2">
                <label className="text-sm font-medium">Pay to VPA (UPI ID)</label>
                <Input value={vpa} onChange={(e) => setVpa(e.target.value)} placeholder="name@bank" />
                <p className="text-sm text-muted-foreground">Scan the QR or enter VPA to pay. We'll auto-confirm upon successful payment.</p>
                <div className="pt-2">
                  <Button onClick={() => handlePay("upi")} disabled={processing}>
                    {processing ? "Processing..." : "Simulate Payment"}
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="card" className="mt-4 space-y-3">
             <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="text-sm font-medium">Card Number</label>
                <Input placeholder="1234 5678 9012 3456" maxLength={19} />
              </div>
              <div>
                <label className="text-sm font-medium">Expiry</label>
                <Input placeholder="MM/YY" />
              </div>
              <div>
                <label className="text-sm font-medium">CVV</label>
                <Input placeholder="***" type="password" />
              </div>
              <div className="col-span-2 pt-2">
                <Button onClick={() => handlePay("card")} disabled={processing}>
                  {processing ? "Processing..." : `Pay ₹${amount.toLocaleString()}`}
                </Button>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="netbanking" className="mt-4 space-y-3">
            <label className="text-sm font-medium">Select Your Bank</label>
            <Input placeholder="e.g., HDFC, ICICI, SBI" />
            <div className="pt-2">
              <Button onClick={() => handlePay("netbanking")} disabled={processing}>
                {processing ? "Processing..." : "Proceed to Bank"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}