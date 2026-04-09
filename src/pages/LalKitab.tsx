import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { analyzeLalKitab, PLANET_NUMBER, PLANET_ICON, HOUSE_SIGNIFICATION, type LalKitabAnalysis } from "@/lib/lalKitab";
import { Section, Bar, InfoRow, Bullet } from "@/components/ReportSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Download, ArrowLeft, Loader2, BookOpen, CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { Smartphone, Heart, Type } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import ankLogo from "@/assets/ank-darppan-logo.png";
import { exportReportPDF } from "@/lib/pdfExport";
import { Link } from "react-router-dom";

const SECTION_COLORS = [
  "bg-section-amber", "bg-section-violet", "bg-section-blue", "bg-section-emerald",
  "bg-section-rose", "bg-section-cyan", "bg-section-orange", "bg-section-amber",
  "bg-section-violet", "bg-section-emerald", "bg-section-rose", "bg-section-blue",
  "bg-section-cyan", "bg-section-orange",
];

export default function LalKitabPage() {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [report, setReport] = useState<LalKitabAnalysis | null>(null);
  const [err, setErr] = useState("");
  const [exporting, setExporting] = useState(false);
  const [exportPct, setExportPct] = useState(0);
  const reportRef = useRef<HTMLDivElement>(null);

  async function handleExportPDF() {
    if (!report || !reportRef.current) return;
    setExporting(true);
    setExportPct(0);
    try {
      const formattedDob = report.dob.split("-").reverse().join("/");
      await exportReportPDF(reportRef.current, name || "Client", formattedDob, (pct) => setExportPct(pct));
    } catch (e) { console.error("PDF export failed:", e); }
    finally { setExporting(false); }
  }

  function generate() {
    if (!dob) { setErr("Please enter date of birth."); return; }
    try {
      const result = analyzeLalKitab(name.trim() || "Client", dob);
      setErr("");
      setReport(result);
      setTimeout(() => document.getElementById("lk-rpt")?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch { setErr("Failed to analyze. Please check inputs."); }
  }

  const statusIcon = (p: { isInPakkaHouse: boolean; isFriendlyHouse: boolean; isEnemyHouse: boolean }) =>
    p.isInPakkaHouse ? <CheckCircle className="w-4 h-4 text-emerald-400" /> :
    p.isFriendlyHouse ? <CheckCircle className="w-4 h-4 text-blue-400" /> :
    p.isEnemyHouse ? <XCircle className="w-4 h-4 text-red-400" /> :
    <AlertTriangle className="w-4 h-4 text-amber-400" />;

  const statusLabel = (p: { isInPakkaHouse: boolean; isFriendlyHouse: boolean; isEnemyHouse: boolean }) =>
    p.isInPakkaHouse ? "Pakka House ✦" : p.isFriendlyHouse ? "Friendly" : p.isEnemyHouse ? "Enemy" : "Neutral";

  const statusColor = (p: { isInPakkaHouse: boolean; isFriendlyHouse: boolean; isEnemyHouse: boolean }) =>
    p.isInPakkaHouse ? "text-emerald-400" : p.isFriendlyHouse ? "text-blue-400" : p.isEnemyHouse ? "text-red-400" : "text-amber-400";

  let sectionNo = 0;

  return (
    <div className="min-h-screen bg-background relative">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-mystic/5 rounded-full blur-[100px]" />
      </div>

      <header className="print:hidden border-b border-border/30 glass sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors text-xs">
              <ArrowLeft className="w-3.5 h-3.5" /> Home
            </Link>
            <span className="text-border">|</span>
            <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center animate-pulse-glow">
              <BookOpen className="w-4 h-4 text-primary" />
            </div>
            <span className="font-cinzel font-bold text-primary tracking-wider text-sm">Lal Kitab</span>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/mobile-compatibility"><Button size="sm" variant="ghost" className="gap-1 text-muted-foreground hover:text-primary text-xs"><Smartphone className="w-3.5 h-3.5" /> Mobile</Button></Link>
            <Link to="/marriage-compatibility"><Button size="sm" variant="ghost" className="gap-1 text-muted-foreground hover:text-primary text-xs"><Heart className="w-3.5 h-3.5" /> Marriage</Button></Link>
            <Link to="/name-compatibility"><Button size="sm" variant="ghost" className="gap-1 text-muted-foreground hover:text-primary text-xs"><Type className="w-3.5 h-3.5" /> Name</Button></Link>
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
          <img src={heroBg} alt="Lal Kitab" className="w-full h-48 sm:h-64 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.3, duration: 0.6 }}>
              <p className="text-primary/80 font-cinzel text-xs tracking-[0.4em] mb-2">VEDIC ASTROLOGY</p>
              <h1 className="font-cinzel text-2xl sm:text-4xl font-bold text-gradient-gold mb-2">Lal Kitab Predictions & Remedies</h1>
              <p className="text-muted-foreground text-sm max-w-md mx-auto font-cormorant text-lg">
                Unlock powerful remedies from the ancient Red Book of astrology
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* INPUT FORM */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6 }}
          className="glass-gold rounded-2xl p-6 mb-8 print:hidden">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <Label className="text-xs font-medium mb-1.5 block text-muted-foreground uppercase tracking-wider">Full Name</Label>
              <Input value={name} onChange={e => setName(e.target.value)} placeholder="Enter full name"
                className="bg-muted/30 border-border/50 focus:border-primary/50 focus:ring-primary/20" />
            </div>
            <div>
              <Label className="text-xs font-medium mb-1.5 block text-muted-foreground uppercase tracking-wider">Date of Birth</Label>
              <Input type="date" value={dob} onChange={e => setDob(e.target.value)}
                className="bg-muted/30 border-border/50 focus:border-primary/50 focus:ring-primary/20" />
            </div>
          </div>
          {err && <p className="text-destructive text-xs mb-3">{err}</p>}
          <Button onClick={generate} className="w-full gap-2 bg-gradient-to-r from-primary to-amber-600 hover:from-primary/90 hover:to-amber-600/90 font-cinzel tracking-wider">
            <Sparkles className="w-4 h-4" /> Generate Lal Kitab Report
          </Button>
        </motion.div>

        {/* REPORT */}
        {report && (
          <div id="lk-rpt" ref={reportRef}>
            {/* COVER PAGE */}
            <div data-pdf-section="cover" className="report-page relative mb-6 print:mb-0 rounded-2xl overflow-hidden"
              style={{ pageBreakAfter: "always", minHeight: 420 }}>
              <img src={heroBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
              <div className="relative z-10 flex flex-col items-center justify-center text-center p-8 min-h-[420px]">
                <img src={ankLogo} alt="Ank Darppan" className="w-20 h-20 rounded-full border-2 border-primary/50 mb-4 bg-black/50" />
                <h2 className="font-cinzel text-3xl font-bold text-gradient-gold mb-1">Lal Kitab Report</h2>
                <p className="text-primary/70 font-cinzel text-sm tracking-[0.3em] mb-6">PREDICTIONS & REMEDIES</p>
                <div className="glass-gold rounded-xl p-6 max-w-sm w-full">
                  <p className="font-cinzel text-xl font-bold text-primary mb-1">{report.name}</p>
                  <p className="text-muted-foreground text-sm">DOB: {report.dob.split("-").reverse().join("/")}</p>
                  <p className="text-muted-foreground text-sm mt-1">Moolank: {report.moolank} ({report.moolankPlanet})</p>
                  <p className="text-muted-foreground text-sm">Bhagyank: {report.bhagyank} ({report.bhagyankPlanet})</p>
                </div>
                <p className="font-cinzel text-xs text-primary/50 tracking-widest mt-8">Ank Darppan • Aapke Ank</p>
              </div>
            </div>

            {/* Section 1 - Overview */}
            <Section no={++sectionNo} title="LAL KITAB OVERVIEW" colorClass={SECTION_COLORS[0]} clientName={report.name}>
              <p className="text-sm text-muted-foreground mb-3 leading-relaxed print:text-gray-700">
                Lal Kitab is a powerful branch of Vedic astrology known for its practical, accessible remedies.
                Based on the fixed-house system, your planetary positions are analyzed using your birth date numerology.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <InfoRow label="Moolank (Driver)" val={`${report.moolank} — ${report.moolankPlanet}`} />
                <InfoRow label="Bhagyank (Conductor)" val={`${report.bhagyank} — ${report.bhagyankPlanet}`} />
              </div>
              <p className="text-sm text-muted-foreground mt-4 leading-relaxed print:text-gray-700">{report.overallOutlook}</p>
            </Section>

            {/* Section 2 - Planetary Summary */}
            <Section no={++sectionNo} title="PLANETARY PLACEMENT SUMMARY" colorClass={SECTION_COLORS[1]} clientName={report.name}>
              <div className="space-y-2">
                {report.planets.map((p, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-muted/20 border border-border/20 print:bg-gray-50 print:border-gray-200">
                    <span className="text-xl w-8 text-center">{p.icon}</span>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-semibold text-foreground print:text-gray-800">{p.planetName}</span>
                      <span className="text-xs text-muted-foreground ml-2 print:text-gray-600">→ House {p.house}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {statusIcon(p)}
                      <span className={`text-xs font-semibold ${statusColor(p)}`}>{statusLabel(p)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            {/* Individual Planet Sections */}
            {report.planets.map((p, i) => (
              <Section key={i} no={++sectionNo} title={`${p.icon} ${p.planetName.toUpperCase()} — HOUSE ${p.house}`}
                colorClass={SECTION_COLORS[(i + 2) % SECTION_COLORS.length]} clientName={report.name}>
                <div className="mb-3">
                  <div className="flex items-center gap-2 mb-2">
                    {statusIcon(p)}
                    <span className={`text-sm font-semibold ${statusColor(p)} print:text-gray-800`}>{statusLabel(p)}</span>
                  </div>
                  <InfoRow label="House Signification" val={p.houseSignification} />
                </div>
                <p className="text-sm text-muted-foreground mb-3 leading-relaxed print:text-gray-700">{p.prediction}</p>
                {p.remedies.length > 0 && (
                  <>
                    <p className="text-xs font-semibold text-primary mb-2 uppercase tracking-wider print:text-amber-700">
                      Lal Kitab Remedies (Upayas):
                    </p>
                    <Bullet items={p.remedies} color="text-primary" />
                  </>
                )}
              </Section>
            ))}

            {/* General Remedies */}
            <Section no={++sectionNo} title="GENERAL REMEDIES & GUIDANCE" colorClass={SECTION_COLORS[12 % SECTION_COLORS.length]} clientName={report.name}>
              <Bullet items={report.generalRemedies} color="text-emerald-400" />
              <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/10 print:bg-amber-50/50 print:border-amber-100">
                <p className="text-xs text-center text-muted-foreground italic print:text-gray-500">
                  "Lal Kitab ke totke, kare jeevan ko sada sukhda — The remedies of Lal Kitab make life forever blissful."
                </p>
                <p className="text-xs text-center text-primary/60 font-cinzel mt-1 print:text-amber-600">— Ank Darppan</p>
              </div>
            </Section>
          </div>
        )}
      </main>
    </div>
  );
}
