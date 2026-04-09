import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { analyzeCrystals, type CrystalAnalysis } from "@/lib/crystalGem";
import { Section, InfoRow, Bullet } from "@/components/ReportSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Download, ArrowLeft, Loader2, Gem, Smartphone, Heart, Type, BookOpen } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import ankLogo from "@/assets/ank-darppan-logo.png";
import { exportReportPDF } from "@/lib/pdfExport";
import { Link } from "react-router-dom";

const SC = [
  "bg-section-violet","bg-section-amber","bg-section-emerald","bg-section-rose",
  "bg-section-blue","bg-section-cyan","bg-section-orange","bg-section-violet",
  "bg-section-amber","bg-section-emerald",
];

export default function CrystalGemPage() {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [report, setReport] = useState<CrystalAnalysis | null>(null);
  const [err, setErr] = useState("");
  const [exporting, setExporting] = useState(false);
  const [exportPct, setExportPct] = useState(0);
  const reportRef = useRef<HTMLDivElement>(null);

  async function handleExportPDF() {
    if (!report || !reportRef.current) return;
    setExporting(true); setExportPct(0);
    try {
      const fd = report.dob.split("-").reverse().join("/");
      await exportReportPDF(reportRef.current, name || "Client", fd, p => setExportPct(p));
    } catch (e) { console.error(e); } finally { setExporting(false); }
  }

  function generate() {
    if (!dob) { setErr("Please enter date of birth."); return; }
    const r = analyzeCrystals(name.trim() || "Client", dob);
    setErr(""); setReport(r);
    saveReport(name.trim() || "Client", "crystal_gem", dob, r);
    setTimeout(() => document.getElementById("cg-rpt")?.scrollIntoView({ behavior: "smooth" }), 100);
  }

  let sn = 0;

  return (
    <div className="min-h-screen bg-background relative">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-mystic/5 rounded-full blur-[100px]" />
      </div>

      <header className="print:hidden border-b border-border/30 glass sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors text-xs"><ArrowLeft className="w-3.5 h-3.5" /> Home</Link>
            <span className="text-border">|</span>
            <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center animate-pulse-glow"><Gem className="w-4 h-4 text-primary" /></div>
            <span className="font-cinzel font-bold text-primary tracking-wider text-sm">Crystals & Gems</span>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/mobile-compatibility"><Button size="sm" variant="ghost" className="gap-1 text-muted-foreground hover:text-primary text-xs"><Smartphone className="w-3.5 h-3.5" /> Mobile</Button></Link>
            <Link to="/marriage-compatibility"><Button size="sm" variant="ghost" className="gap-1 text-muted-foreground hover:text-primary text-xs"><Heart className="w-3.5 h-3.5" /> Marriage</Button></Link>
            <Link to="/name-compatibility"><Button size="sm" variant="ghost" className="gap-1 text-muted-foreground hover:text-primary text-xs"><Type className="w-3.5 h-3.5" /> Name</Button></Link>
            <Link to="/lal-kitab"><Button size="sm" variant="ghost" className="gap-1 text-muted-foreground hover:text-primary text-xs"><BookOpen className="w-3.5 h-3.5" /> Lal Kitab</Button></Link>
            {report && (
              <Button size="sm" variant="outline" onClick={handleExportPDF} disabled={exporting} className="gap-1.5 border-primary/30 text-primary hover:bg-primary/10">
                {exporting ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> {exportPct}%</> : <><Download className="w-3.5 h-3.5" /> PDF</>}
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative rounded-3xl overflow-hidden mb-8 print:hidden">
          <img src={heroBg} alt="" className="w-full h-48 sm:h-64 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.3, duration: 0.6 }}>
              <p className="text-primary/80 font-cinzel text-xs tracking-[0.4em] mb-2">VEDIC HEALING</p>
              <h1 className="font-cinzel text-2xl sm:text-4xl font-bold text-gradient-gold mb-2">Crystal, Gem & Rudraksha Guide</h1>
              <p className="text-muted-foreground text-sm max-w-md mx-auto font-cormorant text-lg">Personalized healing stones aligned with your cosmic vibrations</p>
            </motion.div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6 }} className="glass-gold rounded-2xl p-6 mb-8 print:hidden">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <Label className="text-xs font-medium mb-1.5 block text-muted-foreground uppercase tracking-wider">Full Name</Label>
              <Input value={name} onChange={e => setName(e.target.value)} placeholder="Enter full name" className="bg-muted/30 border-border/50" />
            </div>
            <div>
              <Label className="text-xs font-medium mb-1.5 block text-muted-foreground uppercase tracking-wider">Date of Birth</Label>
              <Input type="date" value={dob} onChange={e => setDob(e.target.value)} className="bg-muted/30 border-border/50" />
            </div>
          </div>
          {err && <p className="text-destructive text-xs mb-3">{err}</p>}
          <Button onClick={generate} className="w-full gap-2 bg-gradient-to-r from-primary to-amber-600 hover:from-primary/90 hover:to-amber-600/90 font-cinzel tracking-wider">
            <Sparkles className="w-4 h-4" /> Get Crystal & Gem Suggestions
          </Button>
        </motion.div>

        {report && (
          <div id="cg-rpt" ref={reportRef}>
            {/* COVER */}
            <div data-pdf-section="cover" className="report-page relative mb-6 rounded-2xl overflow-hidden" style={{ pageBreakAfter: "always", minHeight: 420 }}>
              <img src={heroBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
              <div className="relative z-10 flex flex-col items-center justify-center text-center p-8 min-h-[420px]">
                <img src={ankLogo} alt="Ank Darppan" className="w-20 h-20 rounded-full border-2 border-primary/50 mb-4 bg-black/50" />
                <h2 className="font-cinzel text-3xl font-bold text-gradient-gold mb-1">Crystal & Gem Report</h2>
                <p className="text-primary/70 font-cinzel text-sm tracking-[0.3em] mb-6">RUDRAKSHA • CRYSTALS • GEMSTONES</p>
                <div className="glass-gold rounded-xl p-6 max-w-sm w-full">
                  <p className="font-cinzel text-xl font-bold text-primary mb-1">{report.clientName}</p>
                  <p className="text-muted-foreground text-sm">DOB: {report.dob.split("-").reverse().join("/")}</p>
                  <p className="text-muted-foreground text-sm mt-1">Moolank: {report.moolank} ({report.moolankPlanet}) | Bhagyank: {report.bhagyank} ({report.bhagyankPlanet})</p>
                </div>
                <p className="font-cinzel text-xs text-primary/50 tracking-widest mt-8">Ank Darppan • Aapke Ank</p>
              </div>
            </div>

            {/* Moolank Crystals */}
            <Section no={++sn} title={`CRYSTALS FOR MOOLANK ${report.moolank} (${report.moolankPlanet.toUpperCase()})`} colorClass={SC[0]} clientName={report.clientName}>
              <p className="text-sm text-muted-foreground mb-3 print:text-gray-600">
                These crystals resonate with your Moolank planet {report.moolankPlanet} and support your core personality and identity.
              </p>
              {report.moolankCrystals.map((c, i) => (
                <div key={i} className="mb-3 p-3 rounded-xl bg-muted/20 border border-border/20 print:bg-gray-50 print:border-gray-200">
                  <div className="flex items-center gap-2 mb-1">
                    <Gem className="w-4 h-4 text-primary print:text-amber-700" />
                    <span className="font-cinzel font-bold text-sm text-primary print:text-amber-700">{c.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 print:bg-amber-50 print:text-amber-700">{c.color}</span>
                  </div>
                  <InfoRow label="Chakra" val={c.chakra} />
                  <p className="text-xs text-muted-foreground mt-1 print:text-gray-600">{c.properties}</p>
                </div>
              ))}
              <InfoRow label="Recommended Bracelet" val={report.moolankBracelet} />
            </Section>

            {/* Bhagyank Crystals */}
            <Section no={++sn} title={`CRYSTALS FOR BHAGYANK ${report.bhagyank} (${report.bhagyankPlanet.toUpperCase()})`} colorClass={SC[1]} clientName={report.clientName}>
              <p className="text-sm text-muted-foreground mb-3 print:text-gray-600">
                These crystals align with your Bhagyank planet {report.bhagyankPlanet} to enhance your destiny and fortune.
              </p>
              {report.bhagyankCrystals.map((c, i) => (
                <div key={i} className="mb-3 p-3 rounded-xl bg-muted/20 border border-border/20 print:bg-gray-50 print:border-gray-200">
                  <div className="flex items-center gap-2 mb-1">
                    <Gem className="w-4 h-4 text-primary print:text-amber-700" />
                    <span className="font-cinzel font-bold text-sm text-primary print:text-amber-700">{c.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 print:bg-amber-50 print:text-amber-700">{c.color}</span>
                  </div>
                  <InfoRow label="Chakra" val={c.chakra} />
                  <p className="text-xs text-muted-foreground mt-1 print:text-gray-600">{c.properties}</p>
                </div>
              ))}
              <InfoRow label="Recommended Bracelet" val={report.bhagyankBracelet} />
            </Section>

            {/* Gemstones */}
            <Section no={++sn} title="RECOMMENDED GEMSTONES" colorClass={SC[2]} clientName={report.clientName}>
              <p className="text-sm text-muted-foreground mb-3 print:text-gray-600">
                Traditional Vedic gemstones (Ratna) aligned with your planetary rulers:
              </p>
              {report.gems.map((g, i) => (
                <div key={i} className="flex items-start gap-3 p-2 border-b border-border/20 last:border-0 print:border-gray-200">
                  <span className="text-primary shrink-0 print:text-amber-700">💎</span>
                  <div>
                    <span className="font-semibold text-sm text-foreground print:text-gray-800">{g.name}</span>
                    <p className="text-xs text-muted-foreground print:text-gray-600">{g.purpose}</p>
                  </div>
                </div>
              ))}
            </Section>

            {/* Rudraksha */}
            <Section no={++sn} title="RUDRAKSHA RECOMMENDATIONS" colorClass={SC[3]} clientName={report.clientName}>
              <p className="text-sm text-muted-foreground mb-3 print:text-gray-600">
                Sacred Rudraksha beads recommended based on your numerological profile:
              </p>
              {report.rudraksha.map((r, i) => (
                <div key={i} className="mb-3 p-3 rounded-xl bg-muted/20 border border-border/20 print:bg-gray-50 print:border-gray-200">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-7 h-7 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-xs font-bold text-primary font-cinzel print:bg-amber-100 print:text-amber-700">{r.mukhi}</span>
                    <span className="font-cinzel font-bold text-sm text-primary print:text-amber-700">{r.mukhi}-Mukhi Rudraksha</span>
                  </div>
                  <InfoRow label="Associated Deity" val={r.deity} />
                  <InfoRow label="Benefits" val={r.benefits} />
                  <InfoRow label="Mantra" val={r.mantra} />
                </div>
              ))}
            </Section>

            {/* Crystal Combinations */}
            <Section no={++sn} title="POWERFUL CRYSTAL COMBINATIONS" colorClass={SC[4]} clientName={report.clientName}>
              {report.combinations.map((c, i) => (
                <div key={i} className="mb-2 p-2 border-b border-border/20 last:border-0 print:border-gray-200">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-primary font-cinzel print:text-amber-700">{c.purpose}:</span>
                    <span className="text-xs text-foreground print:text-gray-800">{c.crystals}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground print:text-gray-600">{c.effect}</p>
                </div>
              ))}
            </Section>

            {/* Chakra Guide */}
            <Section no={++sn} title="CHAKRA HEALING GUIDE" colorClass={SC[5]} clientName={report.clientName}>
              {report.chakraSuggestions.map((ch, i) => (
                <div key={i} className="mb-2">
                  <p className="text-xs font-semibold text-primary mb-1 print:text-amber-700">{ch.chakra}</p>
                  <Bullet items={ch.crystals} color="text-primary" />
                </div>
              ))}
            </Section>

            {/* Final Note */}
            <Section no={++sn} title="USAGE & CARE GUIDELINES" colorClass={SC[6]} clientName={report.clientName}>
              <Bullet items={[
                "Cleanse crystals under moonlight or with Gangajal before first use",
                "Wear Rudraksha after energizing with the recommended mantra — chant 108 times",
                "Gemstones should be set in the metal of the ruling planet (Gold for Sun/Jupiter, Silver for Moon)",
                "Wear crystals on the dominant hand for active energy, non-dominant for receptive energy",
                "Remove crystals and gems before bathing with chemicals or sleeping if uncomfortable",
                "Recharge crystals every full moon by placing them in moonlight overnight",
              ]} color="text-primary" />
              <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/10 print:bg-amber-50/50">
                <p className="text-xs text-center text-muted-foreground italic print:text-gray-500">
                  "Crystals are the flowers of the mineral kingdom — they carry the healing energy of Mother Earth."
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
