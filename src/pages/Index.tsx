import { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  generateReport, PLANES, planePercent, planePresentStr,
  NUM_DATA, LUCKY_DATA, MISSING_DATA, REPEATED_DATA,
  BHAGYANK_DATA, MOOLANK_DATA, WEST_SIGN_DATA, EAST_SIGN_DATA,
  HEALTH_BHAGYANK, HEALTH_MOOLANK, MONTH_DATA, YEAR_DATA,
  type FullReport, type Gender,
} from "@/lib/numerology";
import { Section, Bar, InfoRow, Bullet } from "@/components/ReportSection";
import { FullGrid, MiniGrid } from "@/components/Grid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Download, Star, Sun, Moon, Loader2, Type, BookOpen, Gem } from "lucide-react";
import { Smartphone } from "lucide-react";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import heroBg from "@/assets/hero-bg.jpg";
import ankLogo from "@/assets/ank-darppan-logo.png";
import { exportReportPDF } from "@/lib/pdfExport";
import { saveReport } from "@/lib/saveReport";

const PLANET_GRAD: Record<number, string> = {
  1: "from-yellow-500 to-orange-500", 2: "from-slate-400 to-blue-400", 3: "from-yellow-400 to-amber-500",
  4: "from-indigo-500 to-violet-700", 5: "from-green-500 to-emerald-600", 6: "from-pink-400 to-rose-500",
  7: "from-slate-500 to-slate-700", 8: "from-blue-800 to-indigo-900", 9: "from-red-500 to-rose-600",
};

const PLANET_BG: Record<number, string> = {
  1: "bg-yellow-950/30 border-yellow-800/40", 2: "bg-slate-900/30 border-slate-700/40",
  3: "bg-amber-950/30 border-amber-800/40", 4: "bg-indigo-950/30 border-indigo-800/40",
  5: "bg-emerald-950/30 border-emerald-800/40", 6: "bg-pink-950/30 border-pink-800/40",
  7: "bg-slate-900/30 border-slate-700/40", 8: "bg-blue-950/30 border-blue-800/40",
  9: "bg-red-950/30 border-red-800/40",
};

const PLANE_COLORS: Record<string, { bar: string; badge: string }> = {
  thought: { bar: "bg-violet-500", badge: "bg-violet-900/50 text-violet-300" },
  success1: { bar: "bg-amber-500", badge: "bg-amber-900/50 text-amber-300" },
  mental: { bar: "bg-indigo-500", badge: "bg-indigo-900/50 text-indigo-300" },
  will: { bar: "bg-blue-500", badge: "bg-blue-900/50 text-blue-300" },
  emotional: { bar: "bg-pink-500", badge: "bg-pink-900/50 text-pink-300" },
  action: { bar: "bg-cyan-500", badge: "bg-cyan-900/50 text-cyan-300" },
  willpwr: { bar: "bg-orange-500", badge: "bg-orange-900/50 text-orange-300" },
  practical: { bar: "bg-green-500", badge: "bg-green-900/50 text-green-300" },
};

const SECTION_COLORS = [
  "bg-section-amber", "bg-section-amber", "bg-section-violet", "bg-section-amber",
  "bg-section-blue", "bg-section-blue", "bg-section-rose", "bg-section-cyan",
  "bg-section-orange", "bg-section-emerald", "bg-section-emerald", "bg-section-emerald",
  "bg-section-amber", "bg-section-rose", "bg-section-emerald", "bg-section-blue",
  "bg-section-violet", "bg-section-blue", "bg-section-amber", "bg-section-orange",
  "bg-section-violet", "bg-section-violet", "bg-section-amber", "bg-section-blue",
  "bg-section-amber", "bg-section-orange", "bg-section-emerald", "bg-section-rose",
  "bg-section-rose", "bg-section-emerald", "bg-section-rose", "bg-section-cyan",
  "bg-section-amber",
];

export default function Home() {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState<Gender>("male");
  const [report, setReport] = useState<FullReport | null>(null);
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
      await exportReportPDF(reportRef.current, report.name, formattedDob, (pct) => setExportPct(pct));
    } catch (e) {
      console.error("PDF export failed:", e);
    } finally {
      setExporting(false);
    }
  }

  function generate() {
    if (!dob) { setErr("Please enter your date of birth."); return; }
    try {
      const r = generateReport(name || "Your Name", dob, gender);
      if (r.digits.length === 0) { setErr("Could not extract valid digits from this date."); return; }
      setErr(""); setReport(r);
      saveReport(name || "Your Name", "loshu_grid", dob, r);
      setTimeout(() => document.getElementById("rpt")?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch { setErr("Failed to generate report. Please check your date."); }
  }

  const planeRows = report ? PLANES.map(p => ({
    ...p, pct: planePercent(report.grid.counts, p.nums),
    presentStr: planePresentStr(report.grid.counts, p.nums)
  })) : [];

  return (
    <div className="min-h-screen bg-background relative">
      {/* Ambient background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-mystic/5 rounded-full blur-[100px]" />
      </div>

      {/* NAV */}
      <header className="print:hidden border-b border-border/30 glass sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors text-xs">
              <Star className="w-3.5 h-3.5" /> Home
            </Link>
            <span className="text-border">|</span>
            <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center animate-pulse-glow">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <span className="font-cinzel font-bold text-primary tracking-wider text-sm">Lo Shu Grid</span>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/mobile-compatibility">
              <Button size="sm" variant="ghost" className="gap-1.5 text-muted-foreground hover:text-primary text-xs">
                <Smartphone className="w-3.5 h-3.5" /> Mobile
              </Button>
            </Link>
            <Link to="/marriage-compatibility">
              <Button size="sm" variant="ghost" className="gap-1.5 text-muted-foreground hover:text-primary text-xs">
                <Heart className="w-3.5 h-3.5" /> Marriage
              </Button>
            </Link>
            <Link to="/name-compatibility">
              <Button size="sm" variant="ghost" className="gap-1.5 text-muted-foreground hover:text-primary text-xs">
                <Type className="w-3.5 h-3.5" /> Name
              </Button>
            </Link>
            <Link to="/lal-kitab">
              <Button size="sm" variant="ghost" className="gap-1.5 text-muted-foreground hover:text-primary text-xs">
                <BookOpen className="w-3.5 h-3.5" /> Lal Kitab
              </Button>
            </Link>
            <Link to="/crystal-gem">
              <Button size="sm" variant="ghost" className="gap-1.5 text-muted-foreground hover:text-primary text-xs">
                <Gem className="w-3.5 h-3.5" /> Crystals
              </Button>
            </Link>
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
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative rounded-3xl overflow-hidden mb-8 print:hidden"
        >
          <img src={heroBg} alt="Vedic Numerology" className="w-full h-64 sm:h-80 object-cover" width={1920} height={1080} />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <p className="text-primary/80 font-cinzel text-xs tracking-[0.4em] mb-2">VEDIC NUMEROLOGY</p>
              <h1 className="font-cinzel text-3xl sm:text-5xl font-bold text-gradient-gold mb-3">
                Lo Shu Grid Report
              </h1>
              <p className="text-muted-foreground text-sm max-w-md mx-auto font-cormorant text-lg">
                Discover your cosmic blueprint through the ancient wisdom of numbers
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* INPUT FORM */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="glass-gold rounded-2xl p-6 mb-8 print:hidden"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <Label className="text-xs font-medium mb-1.5 block text-muted-foreground uppercase tracking-wider">Full Name</Label>
              <Input value={name} onChange={e => setName(e.target.value)} placeholder="Enter your full name"
                className="bg-muted/30 border-border/50 focus:border-primary/50 focus:ring-primary/20" />
            </div>
            <div>
              <Label className="text-xs font-medium mb-1.5 block text-muted-foreground uppercase tracking-wider">Date of Birth *</Label>
              <Input type="date" value={dob} onChange={e => setDob(e.target.value)}
                max={new Date().toISOString().split("T")[0]}
                className="bg-muted/30 border-border/50 focus:border-primary/50 focus:ring-primary/20" />
            </div>
          </div>
          <div className="mb-4">
            <Label className="text-xs font-medium mb-2 block text-muted-foreground uppercase tracking-wider">Gender (for Kua Number)</Label>
            <div className="flex gap-3">
              {(["male", "female"] as Gender[]).map(g => (
                <button key={g} onClick={() => setGender(g)}
                  className={`flex-1 py-2.5 rounded-xl border text-sm font-medium capitalize transition-all flex items-center justify-center gap-2
                    ${gender === g ? "bg-primary/15 text-primary border-primary/40 glow-gold" : "border-border/40 bg-muted/20 hover:bg-muted/40 text-muted-foreground"}`}>
                  {g === "male" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}{g}
                </button>
              ))}
            </div>
          </div>
          {err && <p className="text-sm text-destructive mb-3">{err}</p>}
          <Button className="w-full gap-2 text-base py-5 bg-gradient-to-r from-primary to-gold-dim hover:brightness-110 text-primary-foreground font-cinzel tracking-wider"
            onClick={generate}>
            <Sparkles className="w-4 h-4" /> Generate Complete Report (33 Sections)
          </Button>
        </motion.div>

        {/* REPORT */}
        {report && (
          <div id="rpt" ref={reportRef} className="space-y-0">
            {/* COVER PAGE - Page 1 */}
            <div data-pdf-section="cover" className="cover-page relative rounded-3xl overflow-hidden mb-6 border border-primary/20 glow-gold-intense print:rounded-none print:border-0 print:mb-0" style={{ pageBreakAfter: "always" }}>
              <img src={heroBg} alt="Vedic Numerology" className="w-full h-64 sm:h-80 object-cover print:h-[40vh]" />
              <div className="bg-gradient-to-t from-card via-card/90 to-transparent p-8 flex flex-col items-center text-center print:from-white print:via-white print:bg-white">
                <img src={ankLogo} alt="Ank Darppan Logo" className="w-24 h-24 mb-4" width={512} height={512} loading="lazy" />
                <p className="text-primary/60 font-cinzel text-xs tracking-[0.4em] mb-2 print:text-gray-500">VEDIC NUMEROLOGY REPORT</p>
                <h1 className="font-cinzel text-3xl sm:text-4xl font-bold text-gradient-gold mb-2 print:text-gray-900">{report.name}</h1>
                <p className="text-muted-foreground text-sm mb-6 print:text-gray-600">Date of Birth: {report.dob.split("-").reverse().join("-")}</p>
                <div className="flex justify-center gap-6 flex-wrap mb-6">
                  {[
                    { l: "Moolank", v: report.moolank }, { l: "Bhagyank", v: report.bhagyank },
                    { l: "Kua (M)", v: report.kuaMale }, { l: "Kua (F)", v: report.kuaFemale },
                    { l: "Month", v: report.monthNum }, { l: "Year", v: report.yearNum }
                  ].map(x => (
                    <div key={x.l} className="text-center px-3">
                      <div className="text-2xl font-cinzel font-bold text-primary w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto print:border-gray-300 print:text-gray-800">{x.v}</div>
                      <div className="text-xs text-muted-foreground mt-1.5 font-cinzel tracking-wider print:text-gray-500">{x.l}</div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-border/30 pt-4 print:border-gray-300">
                  <p className="font-cinzel text-lg font-bold text-primary tracking-[0.2em] print:text-gray-800">Ank Darppan</p>
                  <p className="text-xs text-muted-foreground font-cinzel tracking-wider print:text-gray-500">Aapke Ank</p>
                </div>
              </div>
            </div>

            {/* TABLE OF CONTENTS */}
            <div data-pdf-section="toc" className="mb-6 p-5 glass-gold rounded-2xl" style={{ pageBreakAfter: "always" }}>
              <h2 className="font-cinzel font-bold text-sm text-primary mb-3 tracking-[0.15em]">✦ TABLE OF CONTENTS</h2>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-muted-foreground">
                {["Default Lo-Shu Grid", "Lo-Shu Grid", "Thought Plane", "Success Plane 1", "Mental Plane", "Will Plane", "Emotional Plane", "Outlook Action Plane", "Will Power Success 2 Plane", "Practical Plane", "Lucky & Unlucky Number", "Lucky & Unlucky Color", "Maha Dasha", "Missing Number", "Missing Number Remedies", "All Available Numbers", "Repetitive Numbers", "Number Analysis", "Bhagyank Number", "Moolank Number", "Chaldean Name Number", "Name Analysis", "Month Number", "Birth Year Number", "Sun Sign Western", "Sun Sign Eastern", "Vastu Grid", "Vastu Dasha As Per Missing Number", "Marriage & Relationship", "Finance Analysis", "Health Analysis", "Personal Year Number", "All Remedies"].map((t, i) => (
                  <div key={t} className="flex gap-2 py-0.5 hover:text-primary transition-colors">
                    <span className="font-bold text-primary/60 w-5 text-right font-cinzel">{i + 1}</span>
                    <span>{t}</span>
                  </div>
                ))}
              </div>
            </div>


            {/* 1. DEFAULT LO-SHU GRID */}
            <Section no={1} title="DEFAULT LO-SHU GRID" colorClass={SECTION_COLORS[0]} clientName={report.name}>
              <p className="text-xs text-muted-foreground mb-3 text-center">Standard Lo Shu Grid showing positions of numbers 1–9</p>
              <FullGrid report={report} showDefault />
            </Section>

            {/* 2. LO-SHU GRID */}
            <Section no={2} title="LO-SHU GRID" colorClass={SECTION_COLORS[1]} clientName={report.name}>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <FullGrid report={report} />
                  <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1"><div className="w-3 h-3 rounded border-2 border-primary bg-primary/10" /><span>Present</span></div>
                    <div className="flex items-center gap-1"><div className="w-3 h-3 rounded border-2 border-dashed border-destructive/40" /><span>Missing</span></div>
                  </div>
                  <div className="mt-2 p-2 glass rounded text-xs text-muted-foreground">
                    Extracted digits: {report.digits.join(" · ")}
                  </div>
                </div>
                <div className="space-y-2">
                  <InfoRow label="BHAGYANK" val={report.bhagyank} />
                  <InfoRow label="MOOLANK" val={report.moolank} />
                  <InfoRow label="KUA NUMBER (MALE)" val={report.kuaMale} />
                  <InfoRow label="KUA NUMBER (FEMALE)" val={report.kuaFemale} />
                  <div className="mt-3 space-y-1.5">
                    {planeRows.map(p => (
                      <div key={p.key}>
                        <div className="flex justify-between text-xs mb-0.5">
                          <span className="text-muted-foreground">{p.label.replace(" PLANE", "").replace(" OUTLOOK ACTION", "Action")} Plane</span>
                        </div>
                        <Bar pct={p.pct} colorClass={PLANE_COLORS[p.key].bar} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Section>

            {/* 3-10. PLANES */}
            {planeRows.map((p, idx) => {
              const c = PLANE_COLORS[p.key];
              const combo = p.presentStr;
              return (
                <Section key={p.key} no={idx + 3} title={p.label} colorClass={SECTION_COLORS[idx + 2]} clientName={report.name}>
                  <MiniGrid report={report} highlight={p.nums} />
                  <div className={`rounded-xl border p-4 mb-3 pdf-keep-together ${p.pct === 100 ? "bg-emerald-950/30 border-emerald-800/40" : p.pct === 0 ? "bg-red-950/30 border-red-800/40" : "bg-muted/20 border-border/30"}`}>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-2">
                      <span className="font-medium text-foreground">Your {p.label.replace(" OUTLOOK", "")} ({p.nums.join("-")}) numbers: </span>
                      <span className="font-cinzel font-bold text-primary">{combo || "(none present)"}</span>
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
                    <div className="mt-3">
                      <Bar pct={p.pct} colorClass={c.bar} />
                      <p className="text-xs font-semibold text-foreground mt-1">Your {p.label} has {p.pct}% Weightage.</p>
                    </div>
                  </div>
                </Section>
              );
            })}

            {/* 11. LUCKY & UNLUCKY NUMBER */}
            <Section no={11} title="LUCKY & UNLUCKY NUMBER" colorClass={SECTION_COLORS[10]} clientName={report.name}>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">Your Birthday number, life path number, month number, year number & Zodiac sign all play important roles in your life.</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { title: "Lucky Numbers", nums: report.lucky.lucky, bg: "bg-emerald-950/30 border-emerald-800/40", numBg: "bg-emerald-600", titleCls: "text-emerald-400" },
                  { title: "Neutral Numbers", nums: report.lucky.neutral, bg: "bg-amber-950/30 border-amber-800/40", numBg: "bg-amber-600", titleCls: "text-amber-400" },
                  { title: "Unlucky Numbers", nums: report.lucky.unlucky, bg: "bg-red-950/30 border-red-800/40", numBg: "bg-red-600", titleCls: "text-red-400" },
                ].map(x => (
                  <div key={x.title} className={`p-3 rounded-xl border ${x.bg}`}>
                    <div className={`text-xs font-bold ${x.titleCls} mb-2 uppercase tracking-wide`}>{x.title}</div>
                    <div className="flex gap-2 flex-wrap">
                      {x.nums.map(n => <span key={n} className={`w-9 h-9 rounded-full ${x.numBg} text-foreground flex items-center justify-center font-cinzel font-bold text-sm`}>{n}</span>)}
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            {/* 12. LUCKY & UNLUCKY COLOR */}
            <Section no={12} title="LUCKY & UNLUCKY COLOR" colorClass={SECTION_COLORS[11]} clientName={report.name}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-800/40">
                  <div className="text-xs font-bold text-emerald-400 mb-2 uppercase tracking-wide">Lucky Colors</div>
                  <div className="flex gap-2 flex-wrap">{report.lucky.luckyColors.map(c => <span key={c} className="text-sm px-3 py-1 rounded-full bg-emerald-900/50 text-emerald-300 border border-emerald-700/30">{c}</span>)}</div>
                  <div className="mt-3 text-xs text-muted-foreground"><span className="font-semibold text-foreground">Lucky Days: </span>{report.lucky.luckyDays.join(", ")}</div>
                  <div className="mt-1 text-xs text-muted-foreground"><span className="font-semibold text-foreground">Lucky Direction: </span>{report.lucky.luckyDirection}</div>
                </div>
                <div className="p-4 rounded-xl bg-red-950/30 border border-red-800/40">
                  <div className="text-xs font-bold text-red-400 mb-2 uppercase tracking-wide">Unlucky Colors</div>
                  <div className="flex gap-2 flex-wrap">{report.lucky.unluckyColors.map(c => <span key={c} className="text-sm px-3 py-1 rounded-full bg-red-900/50 text-red-300 border border-red-700/30">{c}</span>)}</div>
                </div>
              </div>
            </Section>

            {/* 13. MAHA DASHA */}
            <Section no={13} title="MAHA DASHA" colorClass={SECTION_COLORS[12]} clientName={report.name}>
              <p className="text-sm text-muted-foreground mb-4">Maha Dasha represents the planetary periods based on your birth star. Each planet rules a specific period influencing your life events.</p>
              <div className="space-y-2">
                {report.mahaDasha.map((md, i) => (
                  <div key={i} className={`rounded-xl border p-3 pdf-keep-together ${PLANET_BG[md.num]}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${PLANET_GRAD[md.num]} text-foreground flex items-center justify-center font-cinzel font-bold shrink-0`}>{md.num}</div>
                      <div className="flex-1">
                        <div className="font-semibold text-foreground text-sm">{NUM_DATA[md.num]?.planet} Dasha — Number {md.num}</div>
                        <div className="text-xs text-muted-foreground">{md.start}–{md.end} | {md.dur} years</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            {/* 14. MISSING NUMBER */}
            <Section no={14} title="MISSING NUMBER" colorClass={SECTION_COLORS[13]} clientName={report.name}>
              {report.grid.missing.length === 0 ? (
                <div className="p-4 bg-emerald-950/30 rounded-xl border border-emerald-800/40 text-center">
                  <p className="text-emerald-400 font-semibold">No missing numbers! Your grid is complete.</p>
                </div>
              ) : (
                <>
                  <MiniGrid report={report} highlight={report.grid.missing} />
                  <div className="space-y-3">
                    {report.grid.missing.map(n => (
                      <div key={n} className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 pdf-keep-together">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 rounded-full bg-destructive/20 text-destructive flex items-center justify-center font-cinzel font-bold">{n}</div>
                          <span className="font-semibold text-foreground">Missing Number {n} — {NUM_DATA[n]?.planet}</span>
                        </div>
                        <Bullet items={MISSING_DATA[n]?.effects || []} color="text-destructive/60" />
                      </div>
                    ))}
                  </div>
                </>
              )}
            </Section>

            {/* 15. MISSING NUMBER REMEDIES */}
            <Section no={15} title="MISSING NUMBER REMEDIES" colorClass={SECTION_COLORS[14]} clientName={report.name}>
              {report.grid.missing.length === 0 ? (
                <p className="text-emerald-400 text-center font-semibold">No missing numbers — no remedies needed!</p>
              ) : (
                <div className="space-y-3">
                  {report.grid.missing.map(n => (
                    <div key={n} className="rounded-xl border bg-emerald-950/20 border-emerald-800/30 p-4 pdf-keep-together">
                      <div className="text-xs font-bold text-emerald-400 mb-2">Remedies for Missing Number {n} ({NUM_DATA[n]?.planet})</div>
                      <Bullet items={MISSING_DATA[n]?.remedies || []} color="text-emerald-500/60" />
                    </div>
                  ))}
                </div>
              )}
            </Section>

            {/* 16. ALL AVAILABLE NUMBERS */}
            <Section no={16} title="ALL AVAILABLE NUMBERS" colorClass={SECTION_COLORS[15]} clientName={report.name}>
              <MiniGrid report={report} highlight={report.grid.present} />
              <p className="text-sm text-muted-foreground mb-3 text-center">All numbers present in your Lo Shu chart:</p>
              <div className="space-y-3">
                {report.grid.present.map(n => {
                  const d = NUM_DATA[n];
                  return (
                    <div key={n} className={`rounded-xl border p-4 pdf-keep-together ${PLANET_BG[n]}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${PLANET_GRAD[n]} text-foreground flex items-center justify-center font-cinzel font-bold`}>{n}</div>
                        <div>
                          <div className="font-semibold text-foreground">Number {n} — {d?.title}</div>
                          <div className="text-xs text-muted-foreground">{d?.planet} • appears {report.grid.counts[n]} time{report.grid.counts[n] > 1 ? "s" : ""}</div>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{report.grid.counts[n] === 1 ? d?.times1 : d?.times2plus}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {d?.positives.map((pos, i) => <span key={i} className="text-xs px-2 py-0.5 bg-emerald-900/40 text-emerald-300 rounded-full border border-emerald-800/30">{pos}</span>)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Section>

            {/* 17. REPETITIVE NUMBERS */}
            {report.grid.repeated.length > 0 && (
              <Section no={17} title="REPETITIVE NUMBERS" colorClass={SECTION_COLORS[16]} clientName={report.name}>
                <MiniGrid report={report} highlight={report.grid.repeated} />
                <div className="space-y-3">
                  {report.grid.repeated.map(n => {
                    const rd = REPEATED_DATA[n];
                    return (
                      <div key={n} className={`rounded-xl border p-4 ${PLANET_BG[n]}`}>
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${PLANET_GRAD[n]} text-foreground flex items-center justify-center font-cinzel font-bold`}>{n}</div>
                          <div>
                            <div className="font-semibold text-foreground">Number {n} × {report.grid.counts[n]} — {rd?.title}</div>
                            <div className="text-xs text-muted-foreground">{NUM_DATA[n]?.planet}</div>
                          </div>
                        </div>
                        <Bullet items={rd?.traits || []} color="text-mystic" />
                        <div className="mt-2 pt-2 border-t border-border/30 space-y-1 text-xs text-muted-foreground">
                          <p><span className="font-semibold text-foreground">Donation: </span>{rd?.donation}</p>
                          <p><span className="font-semibold text-foreground">Medical Issues: </span>{rd?.health}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Section>
            )}

            {/* 18. NUMBER ANALYSIS */}
            <Section no={18} title="NUMBER ANALYSIS" colorClass={SECTION_COLORS[17]} clientName={report.name}>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead><tr className="bg-muted/30"><th className="text-left p-2.5 font-semibold text-primary/80 font-cinzel text-xs tracking-wider">Analysis</th><th className="text-right p-2.5 font-semibold text-primary/80 font-cinzel text-xs tracking-wider">Value</th></tr></thead>
                  <tbody className="divide-y divide-border/30">
                    {[
                      ["MOOLANK", report.moolank], ["BHAGYANK", report.bhagyank],
                      ["TOTAL ALPHABET COUNT", report.nameData.totalLetters],
                      ["FIRST NAME ALPHABET COUNT", report.nameData.firstLetters],
                      [`FIRST NAME NUMBER (${report.nameData.firstName})`, report.nameData.firstSingle],
                      [`FIRST NAME COMPOUND (${report.nameData.firstName})`, report.nameData.firstCompound],
                      [`FULL NAME NUMBER (${report.name})`, report.nameData.fullSingle],
                      [`FULL NAME COMPOUND (${report.name})`, report.nameData.fullCompound],
                      ["SUN SIGN (WESTERN)", report.westernSign],
                      ["SUN SIGN (EASTERN)", report.easternSign],
                      ["MONTH NUMBER", report.monthNum],
                      ["YEAR NUMBER", report.yearNum],
                    ].map(([l, v]) => (
                      <tr key={String(l)} className="hover:bg-muted/20 transition-colors">
                        <td className="p-2.5 text-muted-foreground">{l}</td>
                        <td className="p-2.5 text-right font-semibold font-cinzel text-primary">{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>

            {/* 19. BHAGYANK */}
            <Section no={19} title={`BHAGYANK — ${report.bhagyank} (${NUM_DATA[report.bhagyank]?.planet})`} colorClass={SECTION_COLORS[18]} clientName={report.name}>
              <div className={`rounded-xl border p-4 ${PLANET_BG[report.bhagyank]}`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${PLANET_GRAD[report.bhagyank]} text-foreground flex items-center justify-center font-cinzel font-bold text-2xl shrink-0 animate-pulse-glow`}>{report.bhagyank}</div>
                  <div>
                    <p className="font-cinzel font-bold text-lg text-foreground">{NUM_DATA[report.bhagyank]?.title}</p>
                    <p className="text-sm text-muted-foreground">{NUM_DATA[report.bhagyank]?.planet} — Life Path Number</p>
                  </div>
                </div>
                <Bullet items={BHAGYANK_DATA[report.bhagyank]?.overview || []} />
                <div className="mt-3 grid gap-3">
                  <div className="p-3 glass rounded-lg text-xs"><span className="font-bold text-primary">Love & Relationship: </span><span className="text-muted-foreground">{BHAGYANK_DATA[report.bhagyank]?.love}</span></div>
                  <div className="p-3 glass rounded-lg text-xs"><span className="font-bold text-primary">Finance: </span><span className="text-muted-foreground">{BHAGYANK_DATA[report.bhagyank]?.finance}</span></div>
                  <div className="p-3 glass rounded-lg text-xs"><span className="font-bold text-primary">Marriage — Very Good: </span><span className="text-foreground">{BHAGYANK_DATA[report.bhagyank]?.marriageCompat.veryGood}</span><span className="text-muted-foreground"> · Good: {BHAGYANK_DATA[report.bhagyank]?.marriageCompat.good} · Average: {BHAGYANK_DATA[report.bhagyank]?.marriageCompat.average}</span></div>
                </div>
              </div>
            </Section>

            {/* 20. MOOLANK */}
            <Section no={20} title={`MOOLANK — ${report.moolank} (${NUM_DATA[report.moolank]?.planet})`} colorClass={SECTION_COLORS[19]} clientName={report.name}>
              <div className={`rounded-xl border p-4 ${PLANET_BG[report.moolank]}`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${PLANET_GRAD[report.moolank]} text-foreground flex items-center justify-center font-cinzel font-bold text-2xl shrink-0`}>{report.moolank}</div>
                  <div>
                    <p className="font-cinzel font-bold text-lg text-foreground">{NUM_DATA[report.moolank]?.title}</p>
                    <p className="text-sm text-muted-foreground">{NUM_DATA[report.moolank]?.planet} — Birthday Number</p>
                  </div>
                </div>
                <Bullet items={MOOLANK_DATA[report.moolank]?.overview || []} />
                <div className="mt-3 grid gap-2">
                  <div className="p-3 glass rounded-lg text-xs"><span className="font-bold text-primary">Love: </span><span className="text-muted-foreground">{MOOLANK_DATA[report.moolank]?.love}</span></div>
                  <div className="p-3 glass rounded-lg text-xs"><span className="font-bold text-primary">Career: </span><span className="text-muted-foreground">{MOOLANK_DATA[report.moolank]?.career}</span></div>
                  <div className="p-3 glass rounded-lg text-xs"><span className="font-bold text-primary">Finance: </span><span className="text-muted-foreground">{MOOLANK_DATA[report.moolank]?.finance}</span></div>
                </div>
              </div>
            </Section>

            {/* 21. CHALDEAN NAME NUMBER */}
            <Section no={21} title="CHALDEAN NAME NUMBER" colorClass={SECTION_COLORS[20]} clientName={report.name}>
              <div className="glass-gold rounded-xl p-4">
                <div className="grid grid-cols-3 gap-4 text-center mb-4">
                  <div><div className="text-2xl font-cinzel font-bold text-primary">{report.nameData.fullCompound}</div><div className="text-xs text-muted-foreground">Compound</div></div>
                  <div><div className="text-2xl font-cinzel font-bold text-primary">{report.nameData.fullSingle}</div><div className="text-xs text-muted-foreground">Single</div></div>
                  <div><div className="text-2xl font-cinzel font-bold text-primary">{report.nameData.totalLetters}</div><div className="text-xs text-muted-foreground">Letters</div></div>
                </div>
                <p className="text-sm text-muted-foreground">Your full name "{report.name}" reduces to number {report.nameData.fullSingle} ({NUM_DATA[report.nameData.fullSingle]?.planet} — {NUM_DATA[report.nameData.fullSingle]?.title}). This number influences how you present yourself to the world.</p>
              </div>
            </Section>

            {/* 22. NAME ANALYSIS */}
            <Section no={22} title="NAME ANALYSIS" colorClass={SECTION_COLORS[21]} clientName={report.name}>
              <div className="space-y-3">
                <div className="glass-gold rounded-xl p-4">
                  <h3 className="text-xs font-bold text-primary mb-2 uppercase tracking-wider">First Name: {report.nameData.firstName}</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <InfoRow label="Compound Number" val={report.nameData.firstCompound} />
                    <InfoRow label="Single Number" val={report.nameData.firstSingle} />
                    <InfoRow label="Letters" val={report.nameData.firstLetters} />
                  </div>
                </div>
                <div className="glass-gold rounded-xl p-4">
                  <h3 className="text-xs font-bold text-primary mb-2 uppercase tracking-wider">Full Name: {report.name}</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <InfoRow label="Compound Number" val={report.nameData.fullCompound} />
                    <InfoRow label="Single Number" val={report.nameData.fullSingle} />
                    <InfoRow label="Letters" val={report.nameData.totalLetters} />
                  </div>
                </div>
              </div>
            </Section>

            {/* 23. MONTH NUMBER */}
            <Section no={23} title={`MONTH NUMBER — ${report.monthNum}`} colorClass={SECTION_COLORS[22]} clientName={report.name}>
              <div className={`rounded-xl border p-4 ${PLANET_BG[report.monthNum]}`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${PLANET_GRAD[report.monthNum]} text-foreground flex items-center justify-center font-cinzel font-bold text-xl shrink-0`}>{report.monthNum}</div>
                  <div>
                    <p className="font-cinzel font-bold text-foreground">{NUM_DATA[report.monthNum]?.planet} — Month Energy</p>
                    <p className="text-xs text-muted-foreground">{NUM_DATA[report.monthNum]?.title}</p>
                  </div>
                </div>
                <Bullet items={MONTH_DATA[report.monthNum]?.points || []} />
              </div>
            </Section>

            {/* 24. BIRTH YEAR NUMBER */}
            <Section no={24} title={`BIRTH YEAR NUMBER — ${report.yearNum}`} colorClass={SECTION_COLORS[23]} clientName={report.name}>
              <div className={`rounded-xl border p-4 ${PLANET_BG[report.yearNum]}`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${PLANET_GRAD[report.yearNum]} text-foreground flex items-center justify-center font-cinzel font-bold text-xl shrink-0`}>{report.yearNum}</div>
                  <div>
                    <p className="font-cinzel font-bold text-foreground">{NUM_DATA[report.yearNum]?.planet} — Year Energy</p>
                    <p className="text-xs text-muted-foreground">{NUM_DATA[report.yearNum]?.title}</p>
                  </div>
                </div>
                <Bullet items={YEAR_DATA[report.yearNum]?.points || []} />
              </div>
            </Section>

            {/* 25. WESTERN SIGN */}
            <Section no={25} title={`SUN SIGN WESTERN — ${report.westernSign}`} colorClass={SECTION_COLORS[24]} clientName={report.name}>
              <div className="glass-gold rounded-xl p-4">
                <div className="font-cinzel text-xl font-bold text-primary mb-3">{report.westernSign}</div>
                <Bullet items={WEST_SIGN_DATA[report.westernSign]?.desc || []} />
                <div className="mt-3 p-3 glass rounded-lg text-xs">
                  <p className="font-semibold text-primary mb-1">Health Areas:</p>
                  <Bullet items={WEST_SIGN_DATA[report.westernSign]?.health || []} color="text-destructive/60" />
                </div>
              </div>
            </Section>

            {/* 26. EASTERN SIGN */}
            <Section no={26} title={`SUN SIGN EASTERN — ${report.easternSign}`} colorClass={SECTION_COLORS[25]} clientName={report.name}>
              <div className="glass-gold rounded-xl p-4">
                <div className="font-cinzel text-xl font-bold text-primary mb-3">{report.easternSign}</div>
                <Bullet items={EAST_SIGN_DATA[report.easternSign]?.desc || []} />
                <div className="mt-3 p-3 glass rounded-lg text-xs">
                  <p className="font-semibold text-primary mb-1">Health Areas:</p>
                  <Bullet items={EAST_SIGN_DATA[report.easternSign]?.health || []} color="text-destructive/60" />
                </div>
              </div>
            </Section>

            {/* 27. VASTU GRID */}
            <Section no={27} title="VASTU GRID" colorClass={SECTION_COLORS[26]} clientName={report.name}>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-2 text-center font-cinzel tracking-wider">Your Vastu Lo-Shu Grid</p>
                  <FullGrid report={report} />
                </div>
                <div className="space-y-2">
                  <InfoRow label="BHAGYANK" val={report.bhagyank} />
                  <InfoRow label="MOOLANK" val={report.moolank} />
                  <InfoRow label="KUA (MALE)" val={report.kuaMale} />
                  <InfoRow label="KUA (FEMALE)" val={report.kuaFemale} />
                  <div className="mt-3 p-3 glass rounded-lg text-xs">
                    <p className="font-semibold text-primary mb-1">Your Kua Number:</p>
                    <p className="text-muted-foreground">Determines lucky directions for sleeping, working, eating and sitting.</p>
                  </div>
                </div>
              </div>
            </Section>

            {/* 28. VASTU DASHA */}
            <Section no={28} title="VASTU DASHA AS PER MISSING NUMBER" colorClass={SECTION_COLORS[27]} clientName={report.name}>
              {report.grid.missing.length === 0 ? (
                <div className="p-4 bg-emerald-950/30 rounded-xl border border-emerald-800/40 text-center">
                  <p className="text-emerald-400 font-semibold">No missing numbers! Your Vastu is complete and balanced.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {report.grid.missing.map(n => (
                    <div key={n} className="rounded-xl border border-destructive/20 bg-destructive/5 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-destructive/20 text-destructive flex items-center justify-center font-cinzel font-bold">{n}</div>
                        <span className="font-semibold text-foreground">Missing {n} — Vastu Dosha ({NUM_DATA[n]?.planet})</span>
                      </div>
                      <Bullet items={MISSING_DATA[n]?.effects || []} color="text-destructive/60" />
                    </div>
                  ))}
                </div>
              )}
            </Section>

            {/* 29. MARRIAGE */}
            <Section no={29} title="MARRIAGE & RELATIONSHIP" colorClass={SECTION_COLORS[28]} clientName={report.name}>
              <div className="space-y-4">
                <div className="glass-gold rounded-xl p-4 pdf-keep-together">
                  <h3 className="font-semibold text-primary mb-2 text-sm font-cinzel">Life Path {report.bhagyank} Analysis</h3>
                  <Bullet items={BHAGYANK_DATA[report.bhagyank]?.overview.slice(0, 4) || []} />
                  <div className="mt-2 p-2 glass rounded-lg text-xs">
                    <span className="font-bold text-emerald-400">Very Good: </span>{BHAGYANK_DATA[report.bhagyank]?.marriageCompat.veryGood}
                    <span className="ml-2 font-bold text-amber-400">Good: </span>{BHAGYANK_DATA[report.bhagyank]?.marriageCompat.good}
                    <span className="ml-2 font-bold text-muted-foreground">Average: </span>{BHAGYANK_DATA[report.bhagyank]?.marriageCompat.average}
                  </div>
                </div>
                <div className="glass-gold rounded-xl p-4 pdf-keep-together">
                  <h3 className="font-semibold text-primary mb-2 text-sm font-cinzel">Birthday {report.moolank} Analysis</h3>
                  <p className="text-sm text-muted-foreground mb-2">{MOOLANK_DATA[report.moolank]?.love}</p>
                </div>
              </div>
            </Section>

            {/* 30. FINANCE */}
            <Section no={30} title="FINANCE ANALYSIS" colorClass={SECTION_COLORS[29]} clientName={report.name}>
              <div className="space-y-4">
                <div className="glass-gold rounded-xl p-4 pdf-keep-together">
                  <h3 className="font-semibold text-primary mb-2 text-sm font-cinzel">As Per Life Path {report.bhagyank}</h3>
                  <p className="text-sm text-muted-foreground">{BHAGYANK_DATA[report.bhagyank]?.finance}</p>
                </div>
                <div className="glass-gold rounded-xl p-4 pdf-keep-together">
                  <h3 className="font-semibold text-primary mb-2 text-sm font-cinzel">Career Insights</h3>
                  <Bullet items={BHAGYANK_DATA[report.bhagyank]?.career || []} />
                </div>
              </div>
            </Section>

            {/* 31. HEALTH */}
            <Section no={31} title="HEALTH ANALYSIS" colorClass={SECTION_COLORS[30]} clientName={report.name}>
              <div className="space-y-4">
                <div className="glass-gold rounded-xl p-4 pdf-keep-together">
                  <h3 className="font-semibold text-primary mb-2 text-sm font-cinzel">Bhagyank {report.bhagyank} — {NUM_DATA[report.bhagyank]?.planet}</h3>
                  <Bullet items={BHAGYANK_DATA[report.bhagyank]?.health || []} color="text-destructive/60" />
                </div>
                <div className="glass-gold rounded-xl p-4 pdf-keep-together">
                  <h3 className="font-semibold text-primary mb-2 text-sm font-cinzel">Moolank {report.moolank} — {NUM_DATA[report.moolank]?.planet}</h3>
                  <p className="text-sm text-muted-foreground">{HEALTH_MOOLANK[report.moolank]?.areas}</p>
                </div>
              </div>
            </Section>

            {/* 32. PERSONAL YEAR */}
            <Section no={32} title="PERSONAL YEAR NUMBER" colorClass={SECTION_COLORS[31]} clientName={report.name}>
              <p className="text-sm text-muted-foreground mb-4">Each nine-year period marks the beginning and end of a particular stage of development.</p>
              <div className="space-y-3">
                {report.personalYears.map(py => (
                  <div key={py.year} className={`rounded-xl border p-4 pdf-keep-together ${PLANET_BG[py.num]}`}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${PLANET_GRAD[py.num]} text-foreground flex items-center justify-center font-cinzel font-bold shrink-0`}>{py.num}</div>
                      <div>
                        <div className="font-semibold text-foreground">Year {py.year} — Personal Number {py.num}</div>
                        <div className="text-xs text-muted-foreground">{NUM_DATA[py.num]?.planet} energy</div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      {py.predictions.map((p, i) => (
                        <div key={i} className="flex gap-2 text-xs text-muted-foreground"><span className="font-bold text-primary shrink-0">{i + 1}.</span>{p}</div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            {/* 33. ALL REMEDIES */}
            <Section no={33} title="ALL REMEDIES" colorClass={SECTION_COLORS[32]} clientName={report.name}>
              <div className="space-y-4">
                <div className="glass-gold rounded-xl p-4">
                  <h3 className="font-semibold text-primary mb-2 text-sm font-cinzel">General Remedies — Moolank {report.moolank}</h3>
                  <p className="text-xs text-muted-foreground"><span className="font-semibold text-foreground">Donation: </span>{REPEATED_DATA[report.moolank]?.donation}</p>
                  <p className="text-xs text-muted-foreground mt-1"><span className="font-semibold text-foreground">Health Focus: </span>{HEALTH_MOOLANK[report.moolank]?.areas}</p>
                </div>
                {report.grid.missing.length > 0 && (
                  <div className="glass-gold rounded-xl p-4">
                    <h3 className="font-semibold text-primary mb-2 text-sm font-cinzel">Missing Number Remedies</h3>
                    {report.grid.missing.map(n => (
                      <div key={n} className="mb-3">
                        <div className="text-xs font-bold text-emerald-400 mb-1">Number {n} ({NUM_DATA[n]?.planet}):</div>
                        <Bullet items={MISSING_DATA[n]?.remedies || []} color="text-emerald-500/60" />
                      </div>
                    ))}
                  </div>
                )}
                <div className="glass-gold rounded-xl p-4">
                  <h3 className="font-semibold text-primary mb-2 text-sm font-cinzel">Lucky Color & Number Remedies</h3>
                  <p className="text-xs text-muted-foreground">Wear: <span className="font-bold text-primary">{report.lucky.luckyColors.join(", ")}</span></p>
                  <p className="text-xs text-muted-foreground mt-1">Use: <span className="font-bold text-primary">{report.lucky.lucky.join(", ")}</span></p>
                  <p className="text-xs text-muted-foreground mt-1">Avoid Colors: <span className="font-bold text-destructive/70">{report.lucky.unluckyColors.join(", ")}</span></p>
                  <p className="text-xs text-muted-foreground mt-1">Avoid Numbers: <span className="font-bold text-destructive/70">{report.lucky.unlucky.join(", ")}</span></p>
                </div>
              </div>
            </Section>

            <div className="print:hidden text-center py-8">
              <Button onClick={handleExportPDF} disabled={exporting}
                className="gap-2 bg-gradient-to-r from-primary to-gold-dim hover:brightness-110 text-primary-foreground font-cinzel tracking-wider" size="lg">
                {exporting ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating PDF... {exportPct}%</> : <><Download className="w-4 h-4" /> Download Full PDF Report</>}
              </Button>
              {exporting && <div className="w-64 mx-auto mt-3 h-1.5 bg-muted rounded-full overflow-hidden"><div className="h-full bg-primary rounded-full transition-all duration-300" style={{ width: `${exportPct}%` }} /></div>}
            </div>
          </div>
        )}
      </main>

      <footer className="print:hidden border-t border-border/20 mt-8 py-6 text-center text-xs text-muted-foreground">
        <p className="font-cinzel mb-1 text-primary/60">Lo Shu Grid — Vedic Numerology Report</p>
        <p>33 comprehensive sections based on traditional Vedic numerology</p>
      </footer>
    </div>
  );
}
