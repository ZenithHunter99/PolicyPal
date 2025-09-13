import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { Customer } from "@shared/api";
import { Mic, Upload } from "lucide-react";

// Mocking SpeechRecognition for environments where it's not available
const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

export function AIScanModal({ open, onOpenChange, onFilled }: { open: boolean; onOpenChange: (v: boolean) => void; onFilled: (d: Customer) => void; }) {
  const [file, setFile] = useState<File | null>(null);
  const [details, setDetails] = useState<Customer>({ id: "", name: "", dob: "", address: "", phone: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-IN';
    recognition.interimResults = false;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      // Simple logic to fill fields based on voice command
      if (transcript.toLowerCase().includes('name')) {
        const name = transcript.replace(/name is/i, '').trim();
        setDetails(d => ({ ...d, name }));
      } else if (transcript.toLowerCase().includes('phone')) {
        const phone = transcript.replace(/phone is/i, '').replace(/\s/g, '').trim();
        setDetails(d => ({ ...d, phone }));
      }
      toast.info(`Heard: "${transcript}"`);
    };
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
    }
    setIsListening(!isListening);
  };

  async function simulateExtract() {
    if (!file) {
      toast.error("Please upload a document");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    const base = file.name.toLowerCase();
    const guessedName = base.includes("aadhaar") ? "Aadhaar Holder" : base.includes("pan") ? "PAN Holder" : "Customer";
    const nowYear = new Date().getFullYear();
    setDetails({
      id: `CUST-${Date.now()}`,
      name: guessedName,
      dob: `${nowYear - 30}-01-01`,
      address: "221B Baker Street, Mumbai",
      phone: "9876543210",
      email: `${guessedName.split(' ')[0].toLowerCase()}@example.com`
    });
    setLoading(false);
    toast.success("AI extracted fields. Please review and correct.");
  }

  function save() {
    if(!details.name || !details.dob || !details.phone) {
        toast.error("Please fill in at least Name, DOB, and Phone.");
        return;
    }
    onFilled(details);
    onOpenChange(false);
    // Reset state for next time
    setFile(null);
    setDetails({ id: "", name: "", dob: "", address: "", phone: "", email: "" });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>AI Scan & Voice Input</DialogTitle>
           <DialogDescription>
            Upload a document to automatically extract details, or use the microphone to fill fields with your voice.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-4">
            <div className="flex items-center gap-2">
                <Input type="file" accept="image/*,application/pdf" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="flex-1" />
                <Button variant="secondary" onClick={simulateExtract} disabled={loading || !file}><Upload className="mr-2 h-4 w-4" />{loading ? "Processing..." : "Extract"}</Button>
            </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-sm font-medium">Full Name</label>
              <Input value={details.name} onChange={(e) => setDetails({ ...details, name: e.target.value })} placeholder="e.g. John Doe"/>
            </div>
            <div>
              <label className="text-sm font-medium">Date of Birth</label>
              <Input type="date" value={details.dob} onChange={(e) => setDetails({ ...details, dob: e.target.value })} />
            </div>
            <div>
                <label className="text-sm font-medium">Phone Number</label>
                <div className="flex items-center gap-2">
                    <Input value={details.phone} onChange={(e) => setDetails({ ...details, phone: e.target.value })} placeholder="e.g. 9876543210"/>
                     {SpeechRecognition && <Button size="icon" variant={isListening ? "destructive" : "outline"} onClick={toggleListening}><Mic className="h-4 w-4" /></Button>}
                </div>
            </div>
            <div className="col-span-2">
                <label className="text-sm font-medium">Address</label>
                <Input value={details.address} onChange={(e) => setDetails({ ...details, address: e.target.value })} placeholder="e.g. 123 Main St, Anytown"/>
            </div>
             <div className="col-span-2">
                <label className="text-sm font-medium">Email</label>
                <Input type="email" value={details.email} onChange={(e) => setDetails({ ...details, email: e.target.value })} placeholder="e.g. john.doe@example.com"/>
            </div>
          </div>
          <div className="pt-2">
            <Button onClick={save} className="w-full">Add to Workflow</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}