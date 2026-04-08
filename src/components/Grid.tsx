import { motion } from "framer-motion";
import { LO_SHU_LAYOUT, type FullReport } from "@/lib/numerology";

export function FullGrid({ report, showDefault = false }: { report: FullReport; showDefault?: boolean }) {
  const cols = ["THOUGHT", "WILL", "ACTION"];
  const rows = ["MENTAL", "EMOTIONAL", "PRACTICAL"];
  return (
    <div className="pdf-grid-block pdf-keep-together">
      <div className="flex">
        <div className="w-24 shrink-0" />
        <div className="flex-1 grid grid-cols-3 gap-2 mb-1">
          {cols.map(c => (
            <div key={c} className="text-center text-[10px] font-bold text-primary/70 tracking-[0.2em] py-1 font-cinzel">{c}</div>
          ))}
        </div>
      </div>
      <div className="flex gap-2">
        <div className="flex flex-col justify-around w-22 shrink-0">
          {rows.map(r => (
            <div key={r} className="text-right pr-2 text-[10px] font-bold text-primary/70 tracking-wider py-3 font-cinzel">{r}</div>
          ))}
        </div>
        <div className="flex-1 grid grid-cols-3 gap-2">
          {LO_SHU_LAYOUT.flat().map((n, idx) => {
            const cnt = showDefault ? 0 : report.grid.counts[n];
            const miss = !showDefault && report.grid.missing.includes(n);
            const rep = !showDefault && cnt > 1;
            return (
              <motion.div
                key={n}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: idx * 0.06, duration: 0.4 }}
                className={`aspect-square rounded-xl border-2 flex flex-col items-center justify-center transition-all
                  ${showDefault
                    ? "border-border/30 bg-muted/20"
                    : miss
                      ? "border-dashed border-destructive/40 bg-destructive/5"
                      : rep
                        ? "border-primary/60 bg-primary/10 glow-gold"
                        : "border-border/50 bg-card/50"
                  }`}
              >
                {showDefault ? (
                  <span className="font-cinzel text-2xl font-bold text-muted-foreground/30">{n}</span>
                ) : cnt > 0 ? (
                  <span className="font-cinzel text-xl font-bold text-primary">{Array(cnt).fill(n).join("")}</span>
                ) : (
                  <span className="font-cinzel text-sm text-muted-foreground/20">{n}</span>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function MiniGrid({ report, highlight }: { report: FullReport; highlight: number[] }) {
  return (
    <div className="grid grid-cols-3 gap-1.5 w-48 mx-auto my-3 pdf-mini-grid pdf-keep-together">
      {LO_SHU_LAYOUT.flat().map(n => {
        const cnt = report.grid.counts[n];
        const isH = highlight.includes(n);
        const isMissing = report.grid.missing.includes(n);
        return (
          <div key={n} className={`aspect-square rounded-lg border-2 flex items-center justify-center font-cinzel font-bold text-base
            ${isH && cnt > 0 ? "border-primary bg-primary/15 text-primary" : isH && isMissing ? "border-dashed border-destructive/40 bg-destructive/5 text-destructive/60" : "border-border/20 bg-muted/10 text-muted-foreground/20"}`}>
            {isH ? (cnt > 0 ? Array(cnt).fill(n).join("") : n) : ""}
          </div>
        );
      })}
    </div>
  );
}
