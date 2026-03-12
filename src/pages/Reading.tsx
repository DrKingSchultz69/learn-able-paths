import { useState, useRef } from "react";
import { READING_PASSAGE } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Volume2, VolumeX } from "lucide-react";

const FONTS = [
  { value: "font-dyslexic", label: "OpenDyslexic" },
  { value: "font-comic", label: "Comic Sans" },
  { value: "font-sans", label: "Arial / Lexend" },
  { value: "font-serif", label: "Verdana" },
];

const BG_COLORS = [
  { value: "bg-[#FDF6E3]", label: "Cream", preview: "#FDF6E3" },
  { value: "bg-[#E8F4FD]", label: "Light Blue", preview: "#E8F4FD" },
  { value: "bg-card", label: "White", preview: "#FFFFFF" },
  { value: "bg-[#1a1a2e] text-[#e0e0e0]", label: "Dark Mode", preview: "#1a1a2e" },
];

export default function Reading() {
  const [font, setFont] = useState("font-sans");
  const [fontSize, setFontSize] = useState(18);
  const [lineHeight, setLineHeight] = useState(1.8);
  const [bgColor, setBgColor] = useState("bg-[#FDF6E3]");
  const [speaking, setSpeaking] = useState(false);
  const [rulerLine, setRulerLine] = useState<number | null>(null);
  const textRef = useRef<HTMLDivElement>(null);

  const speak = () => {
    if (speaking) {
      speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(READING_PASSAGE);
    utterance.rate = 0.85;
    utterance.onend = () => setSpeaking(false);
    speechSynthesis.speak(utterance);
    setSpeaking(true);
  };

  const handleTextClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const lineHeightPx = fontSize * lineHeight;
    const clickY = e.clientY - rect.top;
    const line = Math.floor(clickY / lineHeightPx);
    setRulerLine(rulerLine === line ? null : line);
  };

  const lineHeightPx = fontSize * lineHeight;

  return (
    <div className="container py-10 animate-fade-in">
      <h1 className="text-3xl font-bold mb-2">Adaptive Reading Tools</h1>
      <p className="text-muted-foreground mb-8">Customize the reading experience to your needs</p>

      <div className="grid lg:grid-cols-[300px_1fr] gap-8">
        {/* Controls */}
        <div className="space-y-6 rounded-xl border bg-card p-6">
          <div>
            <Label className="mb-2 block">Font Family</Label>
            <Select value={font} onValueChange={setFont}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {FONTS.map((f) => (
                  <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="mb-2 block">Font Size: {fontSize}pt</Label>
            <Slider value={[fontSize]} onValueChange={([v]) => setFontSize(v)} min={12} max={32} step={1} />
          </div>

          <div>
            <Label className="mb-2 block">Line Spacing: {lineHeight.toFixed(1)}x</Label>
            <Slider value={[lineHeight * 10]} onValueChange={([v]) => setLineHeight(v / 10)} min={10} max={25} step={1} />
          </div>

          <div>
            <Label className="mb-2 block">Background Color</Label>
            <div className="grid grid-cols-2 gap-2">
              {BG_COLORS.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setBgColor(c.value)}
                  className={`rounded-lg border-2 p-3 text-xs font-medium transition-all ${bgColor === c.value ? "border-primary shadow-sm" : "border-transparent"}`}
                  style={{ backgroundColor: c.preview, color: c.preview === "#1a1a2e" ? "#e0e0e0" : "#333" }}
                  aria-label={`${c.label} background`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Button onClick={speak} variant="outline" className="w-full">
              {speaking ? <><VolumeX className="mr-2 h-4 w-4" />Stop</> : <><Volume2 className="mr-2 h-4 w-4" />Read Aloud</>}
            </Button>
            <p className="text-xs text-muted-foreground">Click on text to enable reading ruler</p>
          </div>
        </div>

        {/* Reading area */}
        <div
          ref={textRef}
          className={`rounded-xl border p-8 relative overflow-hidden cursor-pointer ${font} ${bgColor}`}
          style={{ fontSize: `${fontSize}px`, lineHeight: `${lineHeight}` }}
          onClick={handleTextClick}
          role="article"
          aria-label="Reading passage with adaptive formatting"
        >
          {rulerLine !== null && (
            <div
              className="absolute left-0 right-0 pointer-events-none"
              style={{
                top: `${rulerLine * lineHeightPx + 32}px`,
                height: `${lineHeightPx}px`,
                backgroundColor: "hsl(var(--primary) / 0.1)",
                borderTop: "2px solid hsl(var(--primary) / 0.3)",
                borderBottom: "2px solid hsl(var(--primary) / 0.3)",
              }}
            />
          )}
          {READING_PASSAGE}
        </div>
      </div>
    </div>
  );
}
