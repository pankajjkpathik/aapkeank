import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { analyzeMobileNumber, NUMBER_ATTRIBUTES, BENEFICIAL_TOTALS, NEUTRAL_TOTALS, MALEFIC_TOTALS, type MobileAnalysis } from "@/lib/mobileNumerology";
import { NUM_DATA } from "@/lib/numerology";
import { Section, Bar, InfoRow, Bullet } from "@/components/ReportSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Download, Smartphone, ArrowLeft, Loader2, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { Heart } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import ankLogo from "@/assets/ank-darppan-logo.png";
import { exportReportPDF } from "@/lib/pdfExport";
import { Link } from "react-router-dom";

const SECTION_COLORS = [
  "bg-section-amber", "bg-section-violet", "bg-section-blue", "bg-section-emerald",
  "bg-section-rose", "bg-section-cyan", "bg-section-orange", "bg-section-amber",
  "bg-section-violet", "bg-section-emerald",
];

export default function MobileCompatibility() {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [mobile, setMobile] = useState("");
  const [report, setReport] = useState<MobileAnalysis | null>(null);
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
    } catch (e) {
      console.error("PDF export failed:", e);
    } finally {
      setExporting(false);
    }
  }

  function generate() {
    if (!dob) { setErr("Please enter date of birth."); return; }
    if (!mobile || mobile.replace(/\D/g, "").length < 10) { setErr("Please enter a valid 10-digit mobile number."); return; }
    try {
      const result = analyzeMobileNumber(mobile, dob);
      setErr("");
      setReport(result);
      setTimeout(() => document.getElementById("mobile-rpt")?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch { setErr("Failed to analyze. Please check inputs."); }
  }

  const scoreColor = (s: number) => s >= 70 ? "text-emerald-400" : s >= 40 ? "text-amber-400" : "text-red-400";
  const scoreLabel = (s: number) => s >= 70 ? "Excellent" : s >= 50 ? "Good" : s >= 30 ? "Average" : "Poor";

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
              <ArrowLeft className="w-3.5 h-3.5" /> Lo Shu Grid
            </Link>
            <span className="text-border">|</span>
            <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center animate-pulse-glow">
              <Smartphone className="w-4 h-4 text-primary" />
            </div>
            <span className="font-cinzel font-bold text-primary tracking-wider text-sm">Mobile Compatibility</span>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/marriage-compatibility">
              <Button size="sm" variant="ghost" className="gap-1.5 text-muted-foreground hover:text-primary text-xs">
                <Heart className="w-3.5 h-3.5" /> Marriage
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
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
          className="relative rounded-3xl overflow-hidden mb-8 print:hidden">
          <img src={heroBg} alt="Mobile Numerology" className="w-full h-48 sm:h-64 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.3, duration: 0.6 }}>
              <p className="text-primary/80 font-cinzel text-xs tracking-[0.4em] mb-2">VEDIC NUMEROLOGY</p>
              <h1 className="font-cinzel text-2xl sm:text-4xl font-bold text-gradient-gold mb-2">Mobile Number Compatibility</h1>
              <p className="text-muted-foreground text-sm max-w-md mx-auto font-cormorant text-lg">
                Discover if your mobile number aligns with your cosmic energy
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* INPUT FORM */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6 }}
          className="glass-gold rounded-2xl p-6 mb-8 print:hidden">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <Label className="text-xs font-medium mb-1.5 block text-muted-foreground uppercase tracking-wider">Full Name</Label>
              <Input value={name} onChange={e => setName(e.target.value)} placeholder="Your name"
                className="bg-muted/30 border-border/50 focus:border-primary/50 focus:ring-primary/20" />
            </div>
            <div>
              <Label className="text-xs font-medium mb-1.5 block text-muted-foreground uppercase tracking-wider">Date of Birth *</Label>
              <Input type="date" value={dob} onChange={e => setDob(e.target.value)} max={new Date().toISOString().split("T")[0]}
                className="bg-muted/30 border-border/50 focus:border-primary/50 focus:ring-primary/20" />
            </div>
            <div>
              <Label className="text-xs font-medium mb-1.5 block text-muted-foreground uppercase tracking-wider">Mobile Number *</Label>
              <Input value={mobile} onChange={e => setMobile(e.target.value)} placeholder="10-digit mobile number" maxLength={15}
                className="bg-muted/30 border-border/50 focus:border-primary/50 focus:ring-primary/20" />
            </div>
          </div>
          {err && <p className="text-sm text-destructive mb-3">{err}</p>}
          <Button className="w-full gap-2 text-base py-5 bg-gradient-to-r from-primary to-gold-dim hover:brightness-110 text-primary-foreground font-cinzel tracking-wider"
            onClick={generate}>
            <Sparkles className="w-4 h-4" /> Analyze Mobile Compatibility
          </Button>
        </motion.div>

        {/* REPORT */}
        {report && (
          <div id="mobile-rpt" ref={reportRef} className="space-y-0">
            {/* COVER PAGE */}
            <div data-pdf-section="cover" className="cover-page relative rounded-3xl overflow-hidden mb-6 border border-primary/20 glow-gold-intense print:rounded-none print:border-0 print:mb-0" style={{ pageBreakAfter: "always" }}>
              <img src={heroBg} alt="Mobile Numerology" className="w-full h-48 sm:h-64 object-cover print:h-[30vh]" />
              <div className="bg-gradient-to-t from-card via-card/90 to-transparent p-8 flex flex-col items-center text-center print:from-white print:via-white print:bg-white">
                <img src={ankLogo} alt="Ank Darppan" className="w-20 h-20 mb-3" loading="lazy" />
                <p className="text-primary/60 font-cinzel text-xs tracking-[0.4em] mb-2 print:text-gray-500">MOBILE NUMBER COMPATIBILITY REPORT</p>
                <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-gradient-gold mb-1 print:text-gray-900">{name || "Client"}</h2>
                <p className="text-muted-foreground text-sm mb-2 print:text-gray-600">DOB: {report.dob.split("-").reverse().join("-")}</p>
                <p className="text-primary font-cinzel font-bold text-lg mb-4 print:text-gray-800">📱 {report.mobileNumber}</p>
                <div className="flex justify-center gap-6 flex-wrap mb-4">
                  {[
                    { l: "Moolank", v: report.moolank },
                    { l: "Bhagyank", v: report.bhagyank },
                    { l: "Mobile Total", v: report.mobileTotalSingle },
                    { l: "Score", v: `${report.overallScore}%` },
                  ].map(x => (
                    <div key={x.l} className="text-center px-3">
                      <div className="text-xl font-cinzel font-bold text-primary w-11 h-11 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto print:border-gray-300 print:text-gray-800">{x.v}</div>
                      <div className="text-xs text-muted-foreground mt-1 font-cinzel tracking-wider print:text-gray-500">{x.l}</div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-border/30 pt-3 print:border-gray-300">
                  <p className="font-cinzel text-lg font-bold text-primary tracking-[0.2em] print:text-gray-800">Ank Darppan</p>
                  <p className="text-xs text-muted-foreground font-cinzel tracking-wider print:text-gray-500">Aapke Ank</p>
                </div>
              </div>
            </div>

            {/* 1. OVERALL SCORE */}
            <Section no={1} title="OVERALL COMPATIBILITY SCORE" colorClass={SECTION_COLORS[0]} clientName={name}>
              <div className="flex flex-col items-center py-4">
                <div className={`text-6xl font-cinzel font-bold ${scoreColor(report.overallScore)} mb-2`}>
                  {report.overallScore}%
                </div>
                <div className={`text-lg font-cinzel font-semibold ${scoreColor(report.overallScore)}`}>
                  {scoreLabel(report.overallScore)} Compatibility
                </div>
                <Bar pct={report.overallScore} colorClass={report.overallScore >= 70 ? "bg-emerald-500" : report.overallScore >= 40 ? "bg-amber-500" : "bg-red-500"} />
                <p className="text-sm text-muted-foreground mt-3 text-center max-w-md">
                  This score evaluates how well your mobile number {report.mobileNumber} aligns with your Moolank ({report.moolank}) and Bhagyank ({report.bhagyank}).
                </p>
              </div>
            </Section>

            {/* 2. BASIC ANALYSIS */}
            <Section no={2} title="BASIC NUMBER ANALYSIS" colorClass={SECTION_COLORS[1]} clientName={name}>
              <div className="space-y-2">
                <InfoRow label="Mobile Number" val={report.mobileNumber} />
                <InfoRow label="Mobile Total" val={`${report.mobileTotal} → ${report.mobileTotalSingle}`} />
                <InfoRow label="Moolank (Birth Number)" val={`${report.moolank} — ${NUM_DATA[report.moolank]?.planet}`} />
                <InfoRow label="Bhagyank (Destiny Number)" val={`${report.bhagyank} — ${NUM_DATA[report.bhagyank]?.planet}`} />
                <InfoRow label="Total Category" val={report.totalCompatibility.toUpperCase()} />
              </div>
              <div className="mt-4 p-4 rounded-xl border bg-muted/20 border-border/30">
                <h3 className="text-xs font-bold text-primary mb-2 uppercase tracking-wider">Number {report.mobileTotalSingle} Attributes</h3>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {report.totalAttributes.keywords.map(k => (
                    <span key={k} className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">{k}</span>
                  ))}
                </div>
                <Bullet items={report.totalAttributes.areas} />
              </div>
            </Section>

            {/* 3. FRIENDSHIP CHART ANALYSIS */}
            <Section no={3} title="NUMBER FRIENDSHIP ANALYSIS" colorClass={SECTION_COLORS[2]} clientName={name}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border bg-muted/20 border-border/30">
                  <h3 className="text-xs font-bold text-primary mb-3 uppercase tracking-wider">Moolank {report.moolank} ({NUM_DATA[report.moolank]?.planet})</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-xs text-emerald-400 font-semibold">Friendly: </span>
                      <span className="text-sm text-muted-foreground">{report.friendshipAnalysis.moolankFriendly.join(", ")}</span>
                    </div>
                    <div>
                      <span className="text-xs text-red-400 font-semibold">Enemy: </span>
                      <span className="text-sm text-muted-foreground">{report.friendshipAnalysis.moolankEnemy.join(", ") || "None"}</span>
                    </div>
                    <div>
                      <span className="text-xs text-amber-400 font-semibold">Neutral: </span>
                      <span className="text-sm text-muted-foreground">{report.friendshipAnalysis.moolankNeutral.join(", ")}</span>
                    </div>
                  </div>
                  <div className="mt-2 pt-2 border-t border-border/30">
                    <span className="text-xs text-muted-foreground">Mobile total {report.mobileTotalSingle} is </span>
                    <span className={`text-xs font-bold ${
                      report.friendshipAnalysis.moolankFriendly.includes(report.mobileTotalSingle) ? "text-emerald-400" :
                      report.friendshipAnalysis.moolankEnemy.includes(report.mobileTotalSingle) ? "text-red-400" : "text-amber-400"
                    }`}>
                      {report.friendshipAnalysis.moolankFriendly.includes(report.mobileTotalSingle) ? "FRIENDLY" :
                       report.friendshipAnalysis.moolankEnemy.includes(report.mobileTotalSingle) ? "ENEMY" : "NEUTRAL"}
                    </span>
                    <span className="text-xs text-muted-foreground"> to Moolank</span>
                  </div>
                </div>
                <div className="p-4 rounded-xl border bg-muted/20 border-border/30">
                  <h3 className="text-xs font-bold text-primary mb-3 uppercase tracking-wider">Bhagyank {report.bhagyank} ({NUM_DATA[report.bhagyank]?.planet})</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-xs text-emerald-400 font-semibold">Friendly: </span>
                      <span className="text-sm text-muted-foreground">{report.friendshipAnalysis.bhagyankFriendly.join(", ")}</span>
                    </div>
                    <div>
                      <span className="text-xs text-red-400 font-semibold">Enemy: </span>
                      <span className="text-sm text-muted-foreground">{report.friendshipAnalysis.bhagyankEnemy.join(", ") || "None"}</span>
                    </div>
                    <div>
                      <span className="text-xs text-amber-400 font-semibold">Neutral: </span>
                      <span className="text-sm text-muted-foreground">{report.friendshipAnalysis.bhagyankNeutral.join(", ")}</span>
                    </div>
                  </div>
                  <div className="mt-2 pt-2 border-t border-border/30">
                    <span className="text-xs text-muted-foreground">Mobile total {report.mobileTotalSingle} is </span>
                    <span className={`text-xs font-bold ${
                      report.friendshipAnalysis.bhagyankFriendly.includes(report.mobileTotalSingle) ? "text-emerald-400" :
                      report.friendshipAnalysis.bhagyankEnemy.includes(report.mobileTotalSingle) ? "text-red-400" : "text-amber-400"
                    }`}>
                      {report.friendshipAnalysis.bhagyankFriendly.includes(report.mobileTotalSingle) ? "FRIENDLY" :
                       report.friendshipAnalysis.bhagyankEnemy.includes(report.mobileTotalSingle) ? "ENEMY" : "NEUTRAL"}
                    </span>
                    <span className="text-xs text-muted-foreground"> to Bhagyank</span>
                  </div>
                </div>
              </div>
            </Section>

            {/* 4. MOBILE TOTAL CATEGORY */}
            <Section no={4} title="MOBILE TOTAL CATEGORY" colorClass={SECTION_COLORS[3]} clientName={name}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                {[
                  { title: "Beneficial", nums: BENEFICIAL_TOTALS, bg: "bg-emerald-950/30 border-emerald-800/40", numBg: "bg-emerald-600", titleCls: "text-emerald-400" },
                  { title: "Neutral", nums: NEUTRAL_TOTALS, bg: "bg-amber-950/30 border-amber-800/40", numBg: "bg-amber-600", titleCls: "text-amber-400" },
                  { title: "Malefic", nums: MALEFIC_TOTALS, bg: "bg-red-950/30 border-red-800/40", numBg: "bg-red-600", titleCls: "text-red-400" },
                ].map(x => (
                  <div key={x.title} className={`p-3 rounded-xl border ${x.bg}`}>
                    <div className={`text-xs font-bold ${x.titleCls} mb-2 uppercase tracking-wide`}>{x.title}</div>
                    <div className="flex gap-2 flex-wrap">
                      {x.nums.map(n => (
                        <span key={n} className={`w-9 h-9 rounded-full ${x.numBg} text-foreground flex items-center justify-center font-cinzel font-bold text-sm ${n === report.mobileTotalSingle ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : ""}`}>{n}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                Your mobile total <span className="font-bold text-primary font-cinzel">{report.mobileTotalSingle}</span> falls under the{" "}
                <span className={`font-bold ${report.totalCompatibility === "beneficial" ? "text-emerald-400" : report.totalCompatibility === "malefic" ? "text-red-400" : "text-amber-400"}`}>
                  {report.totalCompatibility.toUpperCase()}
                </span> category.
              </p>
            </Section>

            {/* 5. DIGIT PAIR READINGS */}
            {report.pairReadings.length > 0 && (
              <Section no={5} title="DIGIT PAIR COMBINATIONS" colorClass={SECTION_COLORS[4]} clientName={name}>
                <p className="text-sm text-muted-foreground mb-4">Analysis of consecutive digit pairs found in your mobile number:</p>
                <div className="space-y-3">
                  {report.pairReadings.map(pr => (
                    <div key={pr.pair} className="rounded-xl border border-border/30 bg-muted/20 p-4 pdf-keep-together">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex gap-1">
                          {pr.pair.split("").map((d, i) => (
                            <div key={i} className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center font-cinzel font-bold text-sm text-primary">{d}</div>
                          ))}
                        </div>
                        <span className="font-cinzel font-semibold text-foreground text-sm">Combination {pr.pair}</span>
                      </div>
                      <Bullet items={pr.readings} />
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* 6. DIGIT REPETITIONS */}
            {report.repetitions.length > 0 && (
              <Section no={6} title="DIGIT REPETITION ANALYSIS" colorClass={SECTION_COLORS[5]} clientName={name}>
                <p className="text-sm text-muted-foreground mb-4">Numbers that appear multiple times in your mobile number carry amplified energy:</p>
                <div className="space-y-3">
                  {report.repetitions.map(r => (
                    <div key={r.digit} className="rounded-xl border border-border/30 bg-muted/20 p-4 pdf-keep-together">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center font-cinzel font-bold text-lg text-primary">{r.digit}</div>
                        <div>
                          <span className="font-semibold text-foreground">Number {r.digit} × {r.count}</span>
                          <span className="text-xs text-muted-foreground ml-2">({NUM_DATA[r.digit]?.planet})</span>
                        </div>
                      </div>
                      <Bullet items={r.effects} />
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* 7. MISSING NUMBER COVERAGE */}
            <Section no={7} title="MISSING NUMBER COVERAGE" colorClass={SECTION_COLORS[6]} clientName={name}>
              <p className="text-sm text-muted-foreground mb-3">Your DOB missing numbers and whether your mobile covers them:</p>
              {report.missingNumbers.length === 0 ? (
                <div className="p-4 bg-emerald-950/30 rounded-xl border border-emerald-800/40 text-center">
                  <CheckCircle className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                  <p className="text-emerald-400 font-semibold">No missing numbers in your DOB grid!</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {report.missingNumbers.map(n => {
                    const covered = report.mobileDigits.includes(n);
                    return (
                      <div key={n} className={`p-3 rounded-xl border text-center pdf-keep-together ${covered ? "bg-emerald-950/30 border-emerald-800/40" : "bg-red-950/30 border-red-800/40"}`}>
                        <div className={`w-10 h-10 rounded-full mx-auto mb-1 flex items-center justify-center font-cinzel font-bold ${covered ? "bg-emerald-600" : "bg-red-600/50 border border-dashed border-red-400"}`}>{n}</div>
                        <div className={`text-xs font-semibold ${covered ? "text-emerald-400" : "text-red-400"}`}>
                          {covered ? "✓ Covered" : "✗ Not covered"}
                        </div>
                        <div className="text-xs text-muted-foreground">{NUM_DATA[n]?.planet}</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Section>

            {/* 8. WARNINGS */}
            {report.warnings.length > 0 && (
              <Section no={8} title="WARNINGS & CAUTIONS" colorClass={SECTION_COLORS[7]} clientName={name}>
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

            {/* 9. RECOMMENDATIONS */}
            <Section no={9} title="RECOMMENDATIONS" colorClass={SECTION_COLORS[8]} clientName={name}>
              <div className="space-y-2 mb-4">
                {report.recommendations.map((r, i) => (
                  <div key={i} className="flex gap-3 p-3 rounded-xl bg-emerald-950/20 border border-emerald-800/30 pdf-keep-together">
                    <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground">{r}</p>
                  </div>
                ))}
              </div>
              <div className="p-4 glass-gold rounded-xl">
                <h3 className="text-xs font-bold text-primary mb-2 uppercase tracking-wider">Ideal Mobile Totals For You</h3>
                <div className="flex gap-3 flex-wrap">
                  {report.idealTotals.map(t => (
                    <div key={t} className="text-center">
                      <div className="w-12 h-12 rounded-full bg-emerald-600 text-foreground flex items-center justify-center font-cinzel font-bold text-lg mx-auto">{t}</div>
                      <div className="text-xs text-muted-foreground mt-1">{NUMBER_ATTRIBUTES[t]?.keywords[0]}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Section>

            {/* 10. NUMBER ATTRIBUTES GUIDE */}
            <Section no={10} title="NUMBER ATTRIBUTES GUIDE" colorClass={SECTION_COLORS[9]} clientName={name}>
              <p className="text-sm text-muted-foreground mb-4">Choose your mobile total based on what you want to attract in life:</p>
              <div className="space-y-3">
                {[1, 3, 5, 6, 9].map(n => {
                  const attr = NUMBER_ATTRIBUTES[n];
                  return (
                    <div key={n} className="rounded-xl border border-border/30 bg-muted/20 p-4 pdf-keep-together">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center font-cinzel font-bold text-primary">{n}</div>
                        <div>
                          <span className="font-semibold text-foreground text-sm">{NUM_DATA[n]?.planet} — {NUM_DATA[n]?.title}</span>
                          <div className="flex gap-1.5 mt-0.5">
                            {attr?.keywords.map(k => (
                              <span key={k} className="text-xs px-1.5 py-0.5 rounded bg-primary/10 text-primary/80">{k}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <Bullet items={attr?.areas || []} />
                    </div>
                  );
                })}
              </div>
            </Section>
          </div>
        )}
      </main>
    </div>
  );
}