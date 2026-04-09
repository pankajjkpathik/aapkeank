import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { analyzeNameCompatibility, getNumberReading, type NameCompatibility } from "@/lib/nameNumerology";
import { Section, Bar, InfoRow, Bullet } from "@/components/ReportSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Download, ArrowLeft, Loader2, CheckCircle, XCircle, AlertTriangle, Type, Heart, Smartphone, BookOpen, Gem } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import ankLogo from "@/assets/ank-darppan-logo.png";
import { exportReportPDF } from "@/lib/pdfExport";
import { saveReport } from "@/lib/saveReport";
import { Link } from "react-router-dom";

const SECTION_COLORS = [
  "bg-section-amber", "bg-section-violet", "bg-section-blue", "bg-section-emerald",
  "bg-section-rose", "bg-section-cyan", "bg-section-orange", "bg-section-amber",
  "bg-section-violet", "bg-section-emerald",
];

export default function NameCompatibilityPage() {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [report, setReport] = useState<NameCompatibility | null>(null);
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
    if (!name.trim()) { setErr("Please enter a name."); return; }
    if (!dob) { setErr("Please enter date of birth."); return; }
    try {
      const result = analyzeNameCompatibility(name.trim(), dob);
      setErr("");
      setReport(result);
      saveReport(name.trim(), "name", dob, result);
      setTimeout(() => document.getElementById("name-rpt")?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch { setErr("Failed to analyze. Please check inputs."); }
  }

  const scoreColor = (s: number) => s >= 70 ? "text-emerald-400" : s >= 40 ? "text-amber-400" : "text-red-400";
  const scoreLabel = (s: number) => s >= 80 ? "Excellent" : s >= 60 ? "Good" : s >= 40 ? "Average" : "Needs Correction";
  const scoreIcon = (s: number) => s >= 70 ? <CheckCircle className="w-5 h-5 text-emerald-400" /> : s >= 40 ? <AlertTriangle className="w-5 h-5 text-amber-400" /> : <XCircle className="w-5 h-5 text-red-400" />;

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
              <Type className="w-4 h-4 text-primary" />
            </div>
            <span className="font-cinzel font-bold text-primary tracking-wider text-sm">Name Compatibility</span>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/mobile-compatibility"><Button size="sm" variant="ghost" className="gap-1 text-muted-foreground hover:text-primary text-xs"><Smartphone className="w-3.5 h-3.5" /> Mobile</Button></Link>
            <Link to="/marriage-compatibility"><Button size="sm" variant="ghost" className="gap-1 text-muted-foreground hover:text-primary text-xs"><Heart className="w-3.5 h-3.5" /> Marriage</Button></Link>
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
          <img src={heroBg} alt="Name Numerology" className="w-full h-48 sm:h-64 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.3, duration: 0.6 }}>
              <p className="text-primary/80 font-cinzel text-xs tracking-[0.4em] mb-2">CHALDEAN NUMEROLOGY</p>
              <h1 className="font-cinzel text-2xl sm:text-4xl font-bold text-gradient-gold mb-2">Name Compatibility & Correction</h1>
              <p className="text-muted-foreground text-sm max-w-md mx-auto font-cormorant text-lg">
                Discover the hidden power of your name and align it with your destiny
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
            <Sparkles className="w-4 h-4" /> Analyze Name
          </Button>
        </motion.div>

        {/* REPORT */}
        {report && (
          <div id="name-rpt" ref={reportRef}>
            {/* COVER PAGE */}
            <div data-pdf-section="cover" className="report-page relative mb-6 print:mb-0 rounded-2xl overflow-hidden"
              style={{ pageBreakAfter: "always", minHeight: 420 }}>
              <img src={heroBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
              <div className="relative z-10 flex flex-col items-center justify-center text-center p-8 min-h-[420px]">
                <img src={ankLogo} alt="Ank Darppan" className="w-20 h-20 rounded-full border-2 border-primary/50 mb-4 bg-black/50" />
                <h2 className="font-cinzel text-3xl font-bold text-gradient-gold mb-1">Name Compatibility Report</h2>
                <p className="text-primary/70 font-cinzel text-sm tracking-[0.3em] mb-6">CHALDEAN ANALYSIS</p>
                <div className="glass-gold rounded-xl p-6 max-w-sm w-full">
                  <p className="font-cinzel text-xl font-bold text-primary mb-1">{report.name}</p>
                  <p className="text-muted-foreground text-sm">DOB: {report.dob.split("-").reverse().join("/")}</p>
                  <p className="text-muted-foreground text-sm mt-1">Moolank: {report.moolank} | Bhagyank: {report.bhagyank}</p>
                </div>
                <p className="font-cinzel text-xs text-primary/50 tracking-widest mt-8">Ank Darppan • Aapke Ank</p>
              </div>
            </div>

            {/* Section 1 – Chaldean Breakdown */}
            <Section no={1} title="CHALDEAN NAME BREAKDOWN" colorClass={SECTION_COLORS[0]} clientName={report.name}>
              <p className="text-sm text-muted-foreground mb-4 print:text-gray-600">
                Each letter carries a specific vibrational energy in the Chaldean system. Here's how your name breaks down:
              </p>
              <div className="overflow-x-auto mb-4">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-border/30 print:border-gray-300">
                      <th className="text-left py-2 px-2 text-muted-foreground print:text-gray-600">Letter</th>
                      <th className="text-center py-2 px-2 text-muted-foreground print:text-gray-600">Chaldean</th>
                      <th className="text-center py-2 px-2 text-muted-foreground print:text-gray-600">Pythagorean</th>
                      <th className="text-center py-2 px-2 text-muted-foreground print:text-gray-600">Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.nameAnalysis.breakdown.map((b, i) => (
                      <tr key={i} className="border-b border-border/10 print:border-gray-200">
                        <td className="py-1.5 px-2 font-cinzel font-bold text-primary print:text-amber-700">{b.letter}</td>
                        <td className="text-center py-1.5 px-2 font-semibold print:text-gray-800">{b.chaldean}</td>
                        <td className="text-center py-1.5 px-2 text-muted-foreground print:text-gray-600">{b.pythagorean}</td>
                        <td className="text-center py-1.5 px-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${b.isVowel ? "bg-emerald-500/20 text-emerald-400 print:bg-emerald-100 print:text-emerald-700" : "bg-blue-500/20 text-blue-400 print:bg-blue-100 print:text-blue-700"}`}>
                            {b.isVowel ? "Vowel" : "Consonant"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <InfoRow label="Chaldean Total" val={report.nameAnalysis.chaldeanTotal} />
                <InfoRow label="Chaldean Reduced (Name No.)" val={report.nameAnalysis.chaldeanReduced} />
                <InfoRow label="Pythagorean Total" val={report.nameAnalysis.pythagoreanTotal} />
                <InfoRow label="Pythagorean Reduced" val={report.nameAnalysis.pythagoreanReduced} />
              </div>
            </Section>

            {/* Section 2 – Core Numbers */}
            <Section no={2} title="YOUR CORE NAME NUMBERS" colorClass={SECTION_COLORS[1]} clientName={report.name}>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[
                  { label: "Soul Urge", val: report.nameAnalysis.soulUrge, desc: "Inner desires (vowels)" },
                  { label: "Personality", val: report.nameAnalysis.personality, desc: "How others see you (consonants)" },
                  { label: "Expression", val: report.nameAnalysis.expressionNumber, desc: "Life purpose (all letters)" },
                ].map((item, i) => (
                  <div key={i} className="text-center p-3 rounded-xl bg-muted/30 border border-border/20 print:bg-gray-50 print:border-gray-200">
                    <div className="text-2xl font-cinzel font-bold text-primary print:text-amber-700">{item.val}</div>
                    <div className="text-xs font-semibold text-foreground print:text-gray-800">{item.label}</div>
                    <div className="text-[10px] text-muted-foreground print:text-gray-500">{item.desc}</div>
                  </div>
                ))}
              </div>
            </Section>

            {/* Section 3 – Soul Urge */}
            <Section no={3} title="SOUL URGE READING" colorClass={SECTION_COLORS[2]} clientName={report.name}>
              <InfoRow label="Soul Urge Number" val={report.nameAnalysis.soulUrge} />
              <p className="text-sm text-muted-foreground mt-3 leading-relaxed print:text-gray-700">{report.soulUrgeReading}</p>
              <div className="mt-3">
                <p className="text-xs text-muted-foreground mb-2 print:text-gray-600">Keywords:</p>
                <div className="flex flex-wrap gap-1.5">
                  {getNumberReading(report.nameAnalysis.soulUrge).keywords.map((k, i) => (
                    <span key={i} className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 print:bg-amber-50 print:text-amber-800 print:border-amber-200">{k}</span>
                  ))}
                </div>
              </div>
            </Section>

            {/* Section 4 – Personality */}
            <Section no={4} title="PERSONALITY READING" colorClass={SECTION_COLORS[3]} clientName={report.name}>
              <InfoRow label="Personality Number" val={report.nameAnalysis.personality} />
              <p className="text-sm text-muted-foreground mt-3 leading-relaxed print:text-gray-700">{report.personalityReading}</p>
              <div className="mt-3">
                <p className="text-xs text-muted-foreground mb-2 print:text-gray-600">Keywords:</p>
                <div className="flex flex-wrap gap-1.5">
                  {getNumberReading(report.nameAnalysis.personality).keywords.map((k, i) => (
                    <span key={i} className="text-xs px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 print:bg-emerald-50 print:text-emerald-800 print:border-emerald-200">{k}</span>
                  ))}
                </div>
              </div>
            </Section>

            {/* Section 5 – Expression */}
            <Section no={5} title="EXPRESSION / DESTINY READING" colorClass={SECTION_COLORS[4]} clientName={report.name}>
              <InfoRow label="Expression Number" val={report.nameAnalysis.expressionNumber} />
              <p className="text-sm text-muted-foreground mt-3 leading-relaxed print:text-gray-700">{report.expressionReading}</p>
              <div className="mt-3">
                <p className="text-xs text-muted-foreground mb-2 print:text-gray-600">Keywords:</p>
                <div className="flex flex-wrap gap-1.5">
                  {getNumberReading(report.nameAnalysis.expressionNumber).keywords.map((k, i) => (
                    <span key={i} className="text-xs px-2 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 print:bg-rose-50 print:text-rose-800 print:border-rose-200">{k}</span>
                  ))}
                </div>
              </div>
            </Section>

            {/* Section 6 – Compatibility Score */}
            <Section no={6} title="NAME & DOB COMPATIBILITY" colorClass={SECTION_COLORS[5]} clientName={report.name}>
              <div className="text-center mb-4">
                <div className={`text-5xl font-cinzel font-bold ${scoreColor(report.overallScore)} print:text-gray-800`}>
                  {report.overallScore}%
                </div>
                <div className="flex items-center justify-center gap-2 mt-2">
                  {scoreIcon(report.overallScore)}
                  <span className="font-cinzel text-sm font-semibold print:text-gray-700">{scoreLabel(report.overallScore)}</span>
                </div>
              </div>
              <Bar pct={report.overallScore} colorClass={report.overallScore >= 70 ? "bg-emerald-500" : report.overallScore >= 40 ? "bg-amber-500" : "bg-red-500"} />
              <p className="text-sm text-muted-foreground mt-3 leading-relaxed print:text-gray-700">{report.verdict}</p>
              <div className="grid grid-cols-2 gap-3 mt-4">
                <InfoRow label="Name Number (Chaldean)" val={report.nameAnalysis.chaldeanReduced} />
                <InfoRow label="Moolank" val={report.moolank} />
                <InfoRow label="Bhagyank" val={report.bhagyank} />
                <InfoRow label="Moolank Match" val={report.moolankFriendly ? "✓ Friendly" : "✗ Not Friendly"} />
              </div>
            </Section>

            {/* Section 7 – Strengths */}
            <Section no={7} title="STRENGTHS OF YOUR NAME" colorClass={SECTION_COLORS[6]} clientName={report.name}>
              {report.strengths.length > 0 ? (
                <Bullet items={report.strengths} color="text-emerald-400" />
              ) : (
                <p className="text-sm text-muted-foreground print:text-gray-600">No significant strengths detected in current name alignment. Consider name correction.</p>
              )}
            </Section>

            {/* Section 8 – Weaknesses */}
            <Section no={8} title="AREAS OF CONCERN" colorClass={SECTION_COLORS[7]} clientName={report.name}>
              {report.weaknesses.length > 0 ? (
                <Bullet items={report.weaknesses} color="text-amber-400" />
              ) : (
                <p className="text-sm text-muted-foreground print:text-gray-600">No major concerns found. Your name vibration is well-aligned.</p>
              )}
            </Section>

            {/* Section 9 – Name Correction Suggestions */}
            <Section no={9} title="NAME CORRECTION SUGGESTIONS" colorClass={SECTION_COLORS[8]} clientName={report.name}>
              <p className="text-sm text-muted-foreground mb-4 print:text-gray-600">
                Based on your Moolank ({report.moolank}) and Bhagyank ({report.bhagyank}), here are suggested name modifications
                that create more favorable vibrations:
              </p>
              {report.suggestions.length > 0 ? (
                <div className="space-y-3">
                  {report.suggestions.map((s, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-muted/20 border border-border/20 print:bg-gray-50 print:border-gray-200">
                      <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0 print:bg-amber-100 print:border-amber-300">
                        <span className="text-xs font-bold text-primary font-cinzel print:text-amber-700">{s.chaldeanReduced}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-cinzel font-bold text-sm text-primary print:text-amber-700">{s.name}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 print:bg-emerald-50 print:text-emerald-700">
                            Score: {s.score}%
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 print:text-gray-600">{s.reason}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground print:text-gray-600">
                  Your current name is already well-aligned! No corrections needed.
                </p>
              )}
            </Section>

            {/* Section 10 – Final Recommendation */}
            <Section no={10} title="FINAL RECOMMENDATION" colorClass={SECTION_COLORS[9]} clientName={report.name}>
              <div className="p-4 rounded-xl bg-muted/20 border border-border/20 print:bg-amber-50 print:border-amber-200">
                <p className="text-sm leading-relaxed text-muted-foreground print:text-gray-700">
                  {report.overallScore >= 80
                    ? `Your name "${report.name}" carries excellent vibrations that are perfectly aligned with your birth numbers (Moolank ${report.moolank}, Bhagyank ${report.bhagyank}). Continue using this name for maximum success and prosperity.`
                    : report.overallScore >= 60
                    ? `Your name "${report.name}" has good overall compatibility, but there's room for improvement. ${report.suggestions.length > 0 ? `Consider trying "${report.suggestions[0].name}" (Name No. ${report.suggestions[0].chaldeanReduced}) for enhanced results.` : "Minor adjustments could amplify positive vibrations."}`
                    : `Your name "${report.name}" has significant misalignment with your birth numbers. ${report.suggestions.length > 0 ? `We strongly recommend adopting "${report.suggestions[0].name}" (Name No. ${report.suggestions[0].chaldeanReduced}) which aligns better with your Moolank ${report.moolank} and Bhagyank ${report.bhagyank}.` : "A name correction consultation is recommended."}`
                  }
                </p>
              </div>
              <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/10 print:bg-amber-50/50 print:border-amber-100">
                <p className="text-xs text-center text-muted-foreground italic print:text-gray-500">
                  "Your name is your mantra. When it vibrates in harmony with your birth numbers, the universe conspires to support your success."
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
