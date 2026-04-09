import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { analyzeMarriage, NUMBER_ELEMENT, ELEMENT_COMPAT, kuaGroup, type MarriageAnalysis } from "@/lib/marriageNumerology";
import { NUM_DATA } from "@/lib/numerology";
import { Section, Bar, InfoRow, Bullet } from "@/components/ReportSection";
import { MiniGrid } from "@/components/Grid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Download, Heart, ArrowLeft, Loader2, AlertTriangle, CheckCircle, Sun, Moon, Smartphone, Type, BookOpen, Gem } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import ankLogo from "@/assets/ank-darppan-logo.png";
import { exportReportPDF } from "@/lib/pdfExport";
import { saveReport } from "@/lib/saveReport";
import { Link } from "react-router-dom";

type Gender = "male" | "female";

const SECTION_COLORS = [
  "bg-section-rose", "bg-section-amber", "bg-section-violet", "bg-section-blue",
  "bg-section-emerald", "bg-section-cyan", "bg-section-orange", "bg-section-rose",
  "bg-section-amber", "bg-section-violet", "bg-section-emerald",
];

const RATING_STYLE: Record<string, { color: string; bg: string }> = {
  excellent: { color: "text-emerald-400", bg: "bg-emerald-950/30 border-emerald-800/40" },
  good: { color: "text-blue-400", bg: "bg-blue-950/30 border-blue-800/40" },
  average: { color: "text-amber-400", bg: "bg-amber-950/30 border-amber-800/40" },
  challenging: { color: "text-red-400", bg: "bg-red-950/30 border-red-800/40" },
};

export default function MarriageCompatibility() {
  const [nameA, setNameA] = useState("");
  const [dobA, setDobA] = useState("");
  const [genderA, setGenderA] = useState<Gender>("male");
  const [nameB, setNameB] = useState("");
  const [dobB, setDobB] = useState("");
  const [genderB, setGenderB] = useState<Gender>("female");
  const [report, setReport] = useState<MarriageAnalysis | null>(null);
  const [err, setErr] = useState("");
  const [exporting, setExporting] = useState(false);
  const [exportPct, setExportPct] = useState(0);
  const reportRef = useRef<HTMLDivElement>(null);

  async function handleExportPDF() {
    if (!report || !reportRef.current) return;
    setExporting(true);
    setExportPct(0);
    try {
      const label = `${report.personA.name} & ${report.personB.name}`;
      await exportReportPDF(reportRef.current, label, "", (pct) => setExportPct(pct));
    } catch (e) {
      console.error("PDF export failed:", e);
    } finally {
      setExporting(false);
    }
  }

  function generate() {
    if (!dobA || !dobB) { setErr("Please enter both dates of birth."); return; }
    try {
      const r = analyzeMarriage(nameA || "Person A", dobA, genderA, nameB || "Person B", dobB, genderB);
      setErr("");
      setReport(r);
      saveReport(`${nameA || "Person A"} & ${nameB || "Person B"}`, "marriage", `${dobA} / ${dobB}`, r);
      setTimeout(() => document.getElementById("marriage-rpt")?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch { setErr("Failed to analyze. Please check inputs."); }
  }

  const scoreColor = (s: number) => s >= 75 ? "text-emerald-400" : s >= 60 ? "text-blue-400" : s >= 50 ? "text-amber-400" : "text-red-400";
  const relColor = (r: string) => r === "friendly" || r === "supportive" ? "text-emerald-400" : r === "enemy" || r === "destructive" ? "text-red-400" : "text-amber-400";

  return (
    <div className="min-h-screen bg-background relative">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-mystic/5 rounded-full blur-[100px]" />
      </div>

      {/* NAV */}
      <header className="print:hidden border-b border-border/30 glass sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors text-xs">
              <ArrowLeft className="w-3.5 h-3.5" /> Home
            </Link>
            <span className="text-border">|</span>
            <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center animate-pulse-glow">
              <Heart className="w-4 h-4 text-primary" />
            </div>
            <span className="font-cinzel font-bold text-primary tracking-wider text-sm">Marriage Compatibility</span>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/mobile-compatibility"><Button size="sm" variant="ghost" className="gap-1 text-muted-foreground hover:text-primary text-xs"><Smartphone className="w-3.5 h-3.5" /> Mobile</Button></Link>
            <Link to="/name-compatibility"><Button size="sm" variant="ghost" className="gap-1 text-muted-foreground hover:text-primary text-xs"><Type className="w-3.5 h-3.5" /> Name</Button></Link>
            <Link to="/lal-kitab"><Button size="sm" variant="ghost" className="gap-1 text-muted-foreground hover:text-primary text-xs"><BookOpen className="w-3.5 h-3.5" /> Lal Kitab</Button></Link>
            <Link to="/crystal-gem"><Button size="sm" variant="ghost" className="gap-1 text-muted-foreground hover:text-primary text-xs"><Gem className="w-3.5 h-3.5" /> Crystals</Button></Link>
            {report && (
              <Button size="sm" variant="outline" onClick={handleExportPDF} disabled={exporting}
                className="gap-1.5 border-primary/30 text-primary hover:bg-primary/10">
                {exporting ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> {exportPct}%</> : <><Download className="w-3.5 h-3.5" /> PDF</>}
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 relative z-10">
        {/* HERO */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
          className="relative rounded-3xl overflow-hidden mb-8 print:hidden">
          <img src={heroBg} alt="Marriage Compatibility" className="w-full h-48 sm:h-64 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.3, duration: 0.6 }}>
              <p className="text-primary/80 font-cinzel text-xs tracking-[0.4em] mb-2">VEDIC NUMEROLOGY</p>
              <h1 className="font-cinzel text-2xl sm:text-4xl font-bold text-gradient-gold mb-2">Marriage Compatibility</h1>
              <p className="text-muted-foreground text-sm max-w-md mx-auto font-cormorant text-lg">
                Discover the cosmic harmony between two souls
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* INPUT FORM */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6 }}
          className="glass-gold rounded-2xl p-6 mb-8 print:hidden">
          {/* Person A */}
          <div className="mb-4">
            <h3 className="font-cinzel text-xs font-bold text-primary mb-3 tracking-[0.15em]">♂ PARTNER A</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <Label className="text-xs font-medium mb-1 block text-muted-foreground uppercase tracking-wider">Name</Label>
                <Input value={nameA} onChange={e => setNameA(e.target.value)} placeholder="Partner A name"
                  className="bg-muted/30 border-border/50 focus:border-primary/50 focus:ring-primary/20" />
              </div>
              <div>
                <Label className="text-xs font-medium mb-1 block text-muted-foreground uppercase tracking-wider">Date of Birth *</Label>
                <Input type="date" value={dobA} onChange={e => setDobA(e.target.value)} max={new Date().toISOString().split("T")[0]}
                  className="bg-muted/30 border-border/50 focus:border-primary/50 focus:ring-primary/20" />
              </div>
              <div>
                <Label className="text-xs font-medium mb-1 block text-muted-foreground uppercase tracking-wider">Gender</Label>
                <div className="flex gap-2">
                  {(["male", "female"] as Gender[]).map(g => (
                    <button key={g} onClick={() => setGenderA(g)}
                      className={`flex-1 py-2 rounded-lg border text-xs font-medium capitalize transition-all flex items-center justify-center gap-1
                        ${genderA === g ? "bg-primary/15 text-primary border-primary/40" : "border-border/40 bg-muted/20 hover:bg-muted/40 text-muted-foreground"}`}>
                      {g === "male" ? <Sun className="w-3 h-3" /> : <Moon className="w-3 h-3" />}{g}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-border/30" />
            <Heart className="w-5 h-5 text-primary/50" />
            <div className="flex-1 h-px bg-border/30" />
          </div>

          {/* Person B */}
          <div className="mb-4">
            <h3 className="font-cinzel text-xs font-bold text-primary mb-3 tracking-[0.15em]">♀ PARTNER B</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <Label className="text-xs font-medium mb-1 block text-muted-foreground uppercase tracking-wider">Name</Label>
                <Input value={nameB} onChange={e => setNameB(e.target.value)} placeholder="Partner B name"
                  className="bg-muted/30 border-border/50 focus:border-primary/50 focus:ring-primary/20" />
              </div>
              <div>
                <Label className="text-xs font-medium mb-1 block text-muted-foreground uppercase tracking-wider">Date of Birth *</Label>
                <Input type="date" value={dobB} onChange={e => setDobB(e.target.value)} max={new Date().toISOString().split("T")[0]}
                  className="bg-muted/30 border-border/50 focus:border-primary/50 focus:ring-primary/20" />
              </div>
              <div>
                <Label className="text-xs font-medium mb-1 block text-muted-foreground uppercase tracking-wider">Gender</Label>
                <div className="flex gap-2">
                  {(["male", "female"] as Gender[]).map(g => (
                    <button key={g} onClick={() => setGenderB(g)}
                      className={`flex-1 py-2 rounded-lg border text-xs font-medium capitalize transition-all flex items-center justify-center gap-1
                        ${genderB === g ? "bg-primary/15 text-primary border-primary/40" : "border-border/40 bg-muted/20 hover:bg-muted/40 text-muted-foreground"}`}>
                      {g === "male" ? <Sun className="w-3 h-3" /> : <Moon className="w-3 h-3" />}{g}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {err && <p className="text-sm text-destructive mb-3">{err}</p>}
          <Button className="w-full gap-2 text-base py-5 bg-gradient-to-r from-primary to-gold-dim hover:brightness-110 text-primary-foreground font-cinzel tracking-wider"
            onClick={generate}>
            <Heart className="w-4 h-4" /> Check Marriage Compatibility
          </Button>
        </motion.div>

        {/* REPORT */}
        {report && (
          <div id="marriage-rpt" ref={reportRef} className="space-y-0">
            {/* COVER PAGE */}
            <div data-pdf-section="cover" className="cover-page relative rounded-3xl overflow-hidden mb-6 border border-primary/20 glow-gold-intense print:rounded-none print:border-0 print:mb-0" style={{ pageBreakAfter: "always" }}>
              <img src={heroBg} alt="Marriage Compatibility" className="w-full h-48 sm:h-56 object-cover print:h-[30vh]" />
              <div className="bg-gradient-to-t from-card via-card/90 to-transparent p-8 flex flex-col items-center text-center print:from-white print:via-white print:bg-white">
                <img src={ankLogo} alt="Ank Darppan" className="w-20 h-20 mb-3" loading="lazy" />
                <p className="text-primary/60 font-cinzel text-xs tracking-[0.4em] mb-2 print:text-gray-500">MARRIAGE COMPATIBILITY REPORT</p>
                <div className="flex items-center gap-4 mb-2">
                  <div className="text-center">
                    <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-gradient-gold print:text-gray-900">{report.personA.name}</h2>
                    <p className="text-xs text-muted-foreground print:text-gray-500">DOB: {report.personA.dob.split("-").reverse().join("-")}</p>
                  </div>
                  <Heart className="w-8 h-8 text-primary shrink-0" />
                  <div className="text-center">
                    <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-gradient-gold print:text-gray-900">{report.personB.name}</h2>
                    <p className="text-xs text-muted-foreground print:text-gray-500">DOB: {report.personB.dob.split("-").reverse().join("-")}</p>
                  </div>
                </div>
                <div className={`text-4xl font-cinzel font-bold mt-3 ${scoreColor(report.overallScore)}`}>{report.overallScore}%</div>
                <div className={`text-sm font-cinzel font-semibold ${scoreColor(report.overallScore)}`}>{report.scoreLabel} Match</div>
                <div className="border-t border-border/30 pt-3 mt-4 print:border-gray-300">
                  <p className="font-cinzel text-lg font-bold text-primary tracking-[0.2em] print:text-gray-800">Ank Darppan</p>
                  <p className="text-xs text-muted-foreground font-cinzel tracking-wider print:text-gray-500">Aapke Ank</p>
                </div>
              </div>
            </div>

            {/* 1. OVERALL SCORE */}
            <Section no={1} title="OVERALL COMPATIBILITY SCORE" colorClass={SECTION_COLORS[0]} clientName={`${report.personA.name} & ${report.personB.name}`}>
              <div className="flex flex-col items-center py-4">
                <div className={`text-6xl font-cinzel font-bold ${scoreColor(report.overallScore)} mb-2`}>{report.overallScore}%</div>
                <div className={`text-lg font-cinzel font-semibold ${scoreColor(report.overallScore)}`}>{report.scoreLabel} Match</div>
                <Bar pct={report.overallScore} colorClass={report.overallScore >= 75 ? "bg-emerald-500" : report.overallScore >= 60 ? "bg-blue-500" : report.overallScore >= 50 ? "bg-amber-500" : "bg-red-500"} />
                <p className="text-sm text-muted-foreground mt-3 text-center max-w-md">
                  Scoring: 75+ Excellent | 60-74 Good | 50-59 Average | Below 50 Challenging
                </p>
              </div>
              {/* Score breakdown */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-4">
                {[
                  { label: "Moolank", score: report.moolankScore, weight: "25%" },
                  { label: "Bhagyank", score: report.bhagyankScore, weight: "25%" },
                  { label: "Element", score: report.elementScore, weight: "15%" },
                  { label: "Kua", score: report.kuaScore, weight: "15%" },
                  { label: "Grid", score: report.gridScore, weight: "20%" },
                ].map(s => (
                  <div key={s.label} className="text-center p-3 rounded-xl bg-muted/20 border border-border/30">
                    <div className={`text-xl font-cinzel font-bold ${scoreColor(s.score)}`}>{s.score}</div>
                    <div className="text-xs text-muted-foreground">{s.label}</div>
                    <div className="text-xs text-muted-foreground/60">{s.weight}</div>
                  </div>
                ))}
              </div>
            </Section>

            {/* 2. PARTNER PROFILES */}
            <Section no={2} title="PARTNER PROFILES" colorClass={SECTION_COLORS[1]} clientName={`${report.personA.name} & ${report.personB.name}`}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[report.personA, report.personB].map((p, idx) => (
                  <div key={idx} className="p-4 rounded-xl border bg-muted/20 border-border/30">
                    <h3 className="text-xs font-bold text-primary mb-3 uppercase tracking-wider font-cinzel">{p.name}</h3>
                    <div className="space-y-1.5">
                      <InfoRow label="Date of Birth" val={p.dob.split("-").reverse().join("-")} />
                      <InfoRow label="Moolank" val={`${p.moolank} — ${NUM_DATA[p.moolank]?.planet}`} />
                      <InfoRow label="Bhagyank" val={`${p.bhagyank} — ${NUM_DATA[p.bhagyank]?.planet}`} />
                      <InfoRow label="Kua Number" val={`${p.kua} (${p.kuaGroup} Group)`} />
                      <InfoRow label="Element" val={p.element} />
                      <InfoRow label="Present Numbers" val={p.grid.present.join(", ")} />
                      <InfoRow label="Missing Numbers" val={p.grid.missing.length > 0 ? p.grid.missing.join(", ") : "None"} />
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            {/* 3. MOOLANK COMPATIBILITY */}
            <Section no={3} title="MOOLANK (BIRTH NUMBER) COMPATIBILITY" colorClass={SECTION_COLORS[2]} clientName={`${report.personA.name} & ${report.personB.name}`}>
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="text-center">
                  <div className="w-14 h-14 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center font-cinzel font-bold text-2xl text-primary mx-auto">{report.personA.moolank}</div>
                  <div className="text-xs text-muted-foreground mt-1">{report.personA.name}</div>
                  <div className="text-xs text-primary/60">{NUM_DATA[report.personA.moolank]?.planet}</div>
                </div>
                <div className={`text-lg font-cinzel font-bold ${relColor(report.moolankRelation)}`}>
                  {report.moolankRelation.toUpperCase()}
                </div>
                <div className="text-center">
                  <div className="w-14 h-14 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center font-cinzel font-bold text-2xl text-primary mx-auto">{report.personB.moolank}</div>
                  <div className="text-xs text-muted-foreground mt-1">{report.personB.name}</div>
                  <div className="text-xs text-primary/60">{NUM_DATA[report.personB.moolank]?.planet}</div>
                </div>
              </div>
              <div className={`rounded-xl border p-4 ${RATING_STYLE[report.pairReading.rating]?.bg || "bg-muted/20 border-border/30"}`}>
                <div className={`text-xs font-bold uppercase tracking-wider mb-1 ${RATING_STYLE[report.pairReading.rating]?.color || "text-muted-foreground"}`}>
                  {report.pairReading.rating} Pairing
                </div>
                <p className="text-sm text-muted-foreground">{report.pairReading.desc}</p>
              </div>
              <div className="mt-3"><Bar pct={report.moolankScore} colorClass={report.moolankScore >= 70 ? "bg-emerald-500" : report.moolankScore >= 50 ? "bg-amber-500" : "bg-red-500"} /></div>
            </Section>

            {/* 4. BHAGYANK COMPATIBILITY */}
            <Section no={4} title="BHAGYANK (DESTINY NUMBER) COMPATIBILITY" colorClass={SECTION_COLORS[3]} clientName={`${report.personA.name} & ${report.personB.name}`}>
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="text-center">
                  <div className="w-14 h-14 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center font-cinzel font-bold text-2xl text-primary mx-auto">{report.personA.bhagyank}</div>
                  <div className="text-xs text-muted-foreground mt-1">{report.personA.name}</div>
                  <div className="text-xs text-primary/60">{NUM_DATA[report.personA.bhagyank]?.planet}</div>
                </div>
                <div className={`text-lg font-cinzel font-bold ${relColor(report.bhagyankRelation)}`}>
                  {report.bhagyankRelation.toUpperCase()}
                </div>
                <div className="text-center">
                  <div className="w-14 h-14 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center font-cinzel font-bold text-2xl text-primary mx-auto">{report.personB.bhagyank}</div>
                  <div className="text-xs text-muted-foreground mt-1">{report.personB.name}</div>
                  <div className="text-xs text-primary/60">{NUM_DATA[report.personB.bhagyank]?.planet}</div>
                </div>
              </div>
              <div className={`rounded-xl border p-4 ${RATING_STYLE[report.bhagyankPairReading.rating]?.bg || "bg-muted/20 border-border/30"}`}>
                <div className={`text-xs font-bold uppercase tracking-wider mb-1 ${RATING_STYLE[report.bhagyankPairReading.rating]?.color || "text-muted-foreground"}`}>
                  {report.bhagyankPairReading.rating} Pairing
                </div>
                <p className="text-sm text-muted-foreground">{report.bhagyankPairReading.desc}</p>
              </div>
              <div className="mt-3"><Bar pct={report.bhagyankScore} colorClass={report.bhagyankScore >= 70 ? "bg-emerald-500" : report.bhagyankScore >= 50 ? "bg-amber-500" : "bg-red-500"} /></div>
            </Section>

            {/* 5. ELEMENT COMPATIBILITY */}
            <Section no={5} title="ELEMENT COMPATIBILITY" colorClass={SECTION_COLORS[4]} clientName={`${report.personA.name} & ${report.personB.name}`}>
              <div className="flex items-center justify-center gap-6 mb-4">
                <div className="text-center p-4 rounded-xl bg-muted/20 border border-border/30">
                  <div className="text-2xl mb-1">{report.personA.element === "Fire" ? "🔥" : report.personA.element === "Water" ? "💧" : report.personA.element === "Earth" ? "🌍" : "💨"}</div>
                  <div className="text-sm font-cinzel font-bold text-primary">{report.personA.element}</div>
                  <div className="text-xs text-muted-foreground">{report.personA.name}</div>
                  <div className="text-xs text-muted-foreground">Moolank {report.personA.moolank}</div>
                </div>
                <div className={`text-lg font-cinzel font-bold ${relColor(report.elementRelation)}`}>
                  {report.elementRelation.toUpperCase()}
                </div>
                <div className="text-center p-4 rounded-xl bg-muted/20 border border-border/30">
                  <div className="text-2xl mb-1">{report.personB.element === "Fire" ? "🔥" : report.personB.element === "Water" ? "💧" : report.personB.element === "Earth" ? "🌍" : "💨"}</div>
                  <div className="text-sm font-cinzel font-bold text-primary">{report.personB.element}</div>
                  <div className="text-xs text-muted-foreground">{report.personB.name}</div>
                  <div className="text-xs text-muted-foreground">Moolank {report.personB.moolank}</div>
                </div>
              </div>
              <div className="mt-3"><Bar pct={report.elementScore} colorClass={report.elementScore >= 70 ? "bg-emerald-500" : report.elementScore >= 50 ? "bg-amber-500" : "bg-red-500"} /></div>
              <p className="text-sm text-muted-foreground mt-2 text-center">
                {report.elementRelation === "supportive" ? "Your elements naturally support and strengthen each other." :
                 report.elementRelation === "destructive" ? "Your elements conflict — conscious effort needed for harmony." :
                 "Your elements are neutral — a balanced but unremarkable connection."}
              </p>
            </Section>

            {/* 6. KUA NUMBER COMPATIBILITY */}
            <Section no={6} title="KUA NUMBER COMPATIBILITY" colorClass={SECTION_COLORS[5]} clientName={`${report.personA.name} & ${report.personB.name}`}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                {[report.personA, report.personB].map((p, idx) => (
                  <div key={idx} className="p-4 rounded-xl border bg-muted/20 border-border/30 text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center font-cinzel font-bold text-xl text-primary mx-auto mb-2">{p.kua}</div>
                    <div className="text-sm font-cinzel font-semibold text-foreground">{p.name}</div>
                    <div className={`text-xs font-bold mt-1 ${p.kuaGroup === "East" ? "text-amber-400" : "text-blue-400"}`}>
                      {p.kuaGroup} Group
                    </div>
                  </div>
                ))}
              </div>
              <div className={`p-4 rounded-xl border text-center ${report.kuaMatch ? "bg-emerald-950/30 border-emerald-800/40" : "bg-amber-950/30 border-amber-800/40"}`}>
                {report.kuaMatch ? (
                  <>
                    <CheckCircle className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                    <p className="text-emerald-400 font-semibold">Same Kua Group — Excellent directional compatibility!</p>
                    <p className="text-xs text-muted-foreground mt-1">Both partners thrive in the same directions, making home Vastu naturally harmonious.</p>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                    <p className="text-amber-400 font-semibold">Different Kua Groups — Directional compromise needed</p>
                    <p className="text-xs text-muted-foreground mt-1">{report.personA.name} ({report.personA.kuaGroup}) and {report.personB.name} ({report.personB.kuaGroup}) prefer different directions. Adjust sleeping position and home layout for balance.</p>
                  </>
                )}
              </div>
              <div className="mt-3"><Bar pct={report.kuaScore} colorClass={report.kuaScore >= 70 ? "bg-emerald-500" : "bg-amber-500"} /></div>
            </Section>

            {/* 7. LO SHU GRID COMPARISON */}
            <Section no={7} title="LO SHU GRID COMPARISON" colorClass={SECTION_COLORS[6]} clientName={`${report.personA.name} & ${report.personB.name}`}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <h3 className="text-xs font-bold text-primary mb-2 uppercase tracking-wider font-cinzel text-center">{report.personA.name}'s Grid</h3>
                  <MiniGrid report={{ grid: report.personA.grid, digits: report.personA.digits } as any} highlight={report.personA.grid.present} />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-primary mb-2 uppercase tracking-wider font-cinzel text-center">{report.personB.name}'s Grid</h3>
                  <MiniGrid report={{ grid: report.personB.grid, digits: report.personB.digits } as any} highlight={report.personB.grid.present} />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-center">
                  <div className="text-xs font-bold text-emerald-400 mb-1 uppercase">Shared Numbers</div>
                  <div className="text-lg font-cinzel font-bold text-emerald-400">{report.gridOverlap.shared.join(", ") || "None"}</div>
                </div>
                <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-800/40 text-center">
                  <div className="text-xs font-bold text-amber-400 mb-1 uppercase">Only {report.personA.name}</div>
                  <div className="text-lg font-cinzel font-bold text-amber-400">{report.gridOverlap.onlyA.join(", ") || "None"}</div>
                </div>
                <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-800/40 text-center">
                  <div className="text-xs font-bold text-blue-400 mb-1 uppercase">Only {report.personB.name}</div>
                  <div className="text-lg font-cinzel font-bold text-blue-400">{report.gridOverlap.onlyB.join(", ") || "None"}</div>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Grid Complement Score</span>
                </div>
                <Bar pct={report.gridOverlap.complement} colorClass={report.gridOverlap.complement >= 70 ? "bg-emerald-500" : report.gridOverlap.complement >= 50 ? "bg-amber-500" : "bg-red-500"} />
                <p className="text-xs text-muted-foreground mt-1 text-center">How well you fill each other's missing number energies</p>
              </div>
            </Section>

            {/* 8. FRIENDSHIP CHART */}
            <Section no={8} title="NUMBER FRIENDSHIP CHART" colorClass={SECTION_COLORS[7]} clientName={`${report.personA.name} & ${report.personB.name}`}>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-muted/30">
                      <th className="text-left p-2.5 font-semibold text-primary/80 font-cinzel text-xs tracking-wider">Aspect</th>
                      <th className="text-center p-2.5 font-semibold text-primary/80 font-cinzel text-xs tracking-wider">{report.personA.name}</th>
                      <th className="text-center p-2.5 font-semibold text-primary/80 font-cinzel text-xs tracking-wider">{report.personB.name}</th>
                      <th className="text-center p-2.5 font-semibold text-primary/80 font-cinzel text-xs tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {[
                      { aspect: "Moolank", a: report.personA.moolank, b: report.personB.moolank, status: report.moolankRelation },
                      { aspect: "Bhagyank", a: report.personA.bhagyank, b: report.personB.bhagyank, status: report.bhagyankRelation },
                      { aspect: "Element", a: report.personA.element, b: report.personB.element, status: report.elementRelation },
                      { aspect: "Kua Group", a: report.personA.kuaGroup, b: report.personB.kuaGroup, status: report.kuaMatch ? "match" : "mismatch" },
                    ].map(row => (
                      <tr key={row.aspect} className="hover:bg-muted/20 transition-colors">
                        <td className="p-2.5 text-muted-foreground">{row.aspect}</td>
                        <td className="p-2.5 text-center font-cinzel font-bold text-primary">{row.a}</td>
                        <td className="p-2.5 text-center font-cinzel font-bold text-primary">{row.b}</td>
                        <td className={`p-2.5 text-center font-bold text-xs uppercase ${
                          row.status === "friendly" || row.status === "supportive" || row.status === "match" ? "text-emerald-400" :
                          row.status === "enemy" || row.status === "destructive" || row.status === "mismatch" ? "text-red-400" : "text-amber-400"
                        }`}>{row.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>

            {/* 9. WARNINGS */}
            {report.warnings.length > 0 && (
              <Section no={9} title="WARNINGS & CAUTIONS" colorClass={SECTION_COLORS[8]} clientName={`${report.personA.name} & ${report.personB.name}`}>
                <div className="space-y-2">
                  {report.warnings.map((w, i) => (
                    <div key={i} className="flex gap-3 p-3 rounded-xl bg-red-950/20 border border-red-800/30 pdf-keep-together">
                      <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                      <p className="text-sm text-muted-foreground">{w}</p>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* 10. RECOMMENDATIONS & REMEDIES */}
            <Section no={10} title="RECOMMENDATIONS & REMEDIES" colorClass={SECTION_COLORS[9]} clientName={`${report.personA.name} & ${report.personB.name}`}>
              <div className="space-y-2">
                {report.recommendations.map((r, i) => (
                  <div key={i} className="flex gap-3 p-3 rounded-xl bg-emerald-950/20 border border-emerald-800/30 pdf-keep-together">
                    <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground">{r}</p>
                  </div>
                ))}
              </div>
            </Section>

            {/* 11. ELEMENT CHART REFERENCE */}
            <Section no={11} title="ELEMENT COMPATIBILITY REFERENCE" colorClass={SECTION_COLORS[10]} clientName={`${report.personA.name} & ${report.personB.name}`}>
              <p className="text-sm text-muted-foreground mb-3">Reference chart showing how elements interact with each other:</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-muted/30">
                      <th className="p-2 text-left font-cinzel text-xs text-primary/80"></th>
                      {["Fire 🔥", "Water 💧", "Earth 🌍", "Air 💨"].map(e => (
                        <th key={e} className="p-2 text-center font-cinzel text-xs text-primary/80">{e}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {(["Fire", "Water", "Earth", "Air"] as const).map(row => (
                      <tr key={row}>
                        <td className="p-2 font-cinzel text-xs text-primary/80 font-semibold">{row} {row === "Fire" ? "🔥" : row === "Water" ? "💧" : row === "Earth" ? "🌍" : "💨"}</td>
                        {(["Fire", "Water", "Earth", "Air"] as const).map(col => {
                          const rel = ELEMENT_COMPAT[row]?.[col] || "neutral";
                          return (
                            <td key={col} className={`p-2 text-center text-xs font-semibold ${
                              rel === "supportive" ? "text-emerald-400" : rel === "destructive" ? "text-red-400" : "text-amber-400"
                            }`}>{rel === "supportive" ? "✓ Support" : rel === "destructive" ? "✗ Destruct" : "~ Neutral"}</td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-3 text-xs text-muted-foreground">
                <p><span className="font-bold">Numbers by Element:</span> Fire (1,3,9) · Water (2,7) · Earth (5,6,8) · Air (4)</p>
              </div>
            </Section>
          </div>
        )}
      </main>
    </div>
  );
}