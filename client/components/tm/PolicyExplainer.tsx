import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const LANGS = [
  { code: "en", label: "English" },
  { code: "hi", label: "Hindi" },
  { code: "mr", label: "Marathi" },
  { code: "ta", label: "Tamil" },
  { code: "bn", label: "Bengali" },
];

interface Policy {
  id: string;
  name: string;
  premium: number;
  coverage: number;
  type: string;
  pros: string[];
  cons: string[];
}

export function PolicyExplainer({ selectedPolicy, candidates }: { selectedPolicy: Policy | null; candidates: Policy[]; }) {
  const [lang, setLang] = useState("en");
  const [expl, setExpl] = useState("");

  const best = useMemo(() => {
    const list = candidates.length ? candidates : selectedPolicy ? [selectedPolicy] : [];
    return list.slice().sort((a, b) => b.coverage / b.premium - a.coverage / a.premium)[0] ?? null;
  }, [candidates, selectedPolicy]);

  useEffect(() => {
    const p = selectedPolicy ?? best;
    if (!p) return;
    const base = `Policy ${p.name} offers coverage of ₹${p.coverage.toLocaleString()} at an annual premium of ₹${p.premium.toLocaleString()}. Suitable for ${p.type}.`;
    const translations: Record<string, string> = {
      en: base,
      hi: `पॉलिसी ${p.name} ₹${p.premium.toLocaleString()} वार्षिक प्रीमियम पर ₹${p.coverage.toLocaleString()} कवर देती है। ${p.type} के लिए उपयुक्त।`,
      mr: `पॉलिसी ${p.name} वार्षि�� प्रीमियम ₹${p.premium.toLocaleString()} मध्ये ₹${p.coverage.toLocaleString()} कव्हर देते. ${p.type} साठी योग्य।`,
      ta: `காப்பீடு ${p.name} ஆண்டுக் காப்புறுதி ₹${p.premium.toLocaleString()}க்கு ₹${p.coverage.toLocaleString()} வரை கவரேஜ். ${p.type}க்கு பொருத்தம்।`,
      bn: `পলিসি ${p.name} বছরে ₹${p.premium.toLocaleString()} প্রিমিয়ামে ₹${p.coverage.toLocaleString()} কভার। ${p.type} এর জন্য উপযুক্ত।`,
    };
    setExpl(translations[lang] ?? base);
  }, [lang, selectedPolicy, best]);

  function speak() {
    if (!expl) return;
    const utter = new SpeechSynthesisUtterance(expl);
    speechSynthesis.cancel();
    // Try to set locale if voices available
    const voice = speechSynthesis.getVoices().find(v => v.lang.toLowerCase().startsWith(lang));
    if (voice) utter.voice = voice;
    speechSynthesis.speak(utter);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="font-medium">Policy Explainer</div>
        <div className="flex items-center gap-2">
          <Select value={lang} onValueChange={setLang}>
            <SelectTrigger className="w-[160px]"><SelectValue placeholder="Language" /></SelectTrigger>
            <SelectContent>
              {LANGS.map(l => <SelectItem key={l.code} value={l.code}>{l.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button variant="secondary" onClick={speak}>Play Audio</Button>
        </div>
      </div>
      <p className="text-sm text-muted-foreground min-h-[40px]">{expl}</p>
      <div className="rounded-lg border p-3">
        <div className="mb-2 font-medium">Recommended for this customer</div>
        <div className="grid grid-cols-3 gap-3">
          {candidates.slice(0,3).map((p) => (
            <div key={p.id} className={`rounded-md border p-3 ${best && best.id === p.id ? 'border-primary ring-1 ring-primary' : ''}`}>
              <div className="text-sm font-medium">{p.name}</div>
              <div className="mt-1 text-xs text-muted-foreground">₹{p.premium.toLocaleString()} • ₹{p.coverage.toLocaleString()} cover</div>
              <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                <ul className="list-disc pl-4 space-y-1">
                  {p.pros.map((x, i) => <li key={i} className="text-emerald-700">{x}</li>)}
                </ul>
                <ul className="list-disc pl-4 space-y-1">
                  {p.cons.map((x, i) => <li key={i} className="text-red-700">{x}</li>)}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
