import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface SectionProps {
  no: number;
  title: string;
  colorClass: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function Section({ no, title, colorClass, children, defaultOpen = false }: SectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="mb-4 rounded-2xl overflow-hidden border border-border/50 glow-gold pdf-section"
      style={{ animationDelay: `${no * 0.05}s` }}>
      <button
        onClick={() => setOpen(!open)}
        className={`print:hidden w-full flex items-center gap-3 px-5 py-4 ${colorClass} transition-all duration-300 hover:brightness-110`}
      >
        <span className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-xs font-bold text-primary font-cinzel shrink-0">
          {no}
        </span>
        <span className="flex-1 text-left font-cinzel font-semibold text-sm tracking-wider text-foreground">
          {title}
        </span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <ChevronDown className="w-4 h-4 text-primary" />
        </motion.div>
      </button>
      <div className={`hidden print:flex pdf-section-header ${colorClass} items-center gap-2`}>
        <span className="w-5 h-5 rounded-full bg-primary/25 flex items-center justify-center text-xs font-bold shrink-0">{no}</span>
        <span className="font-cinzel font-bold">{title}</span>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="p-5 bg-card/50 backdrop-blur-sm pdf-section-body">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className={`hidden print:block p-4 bg-card pdf-section-body`}>
        {children}
      </div>
    </div>
  );
}

export function Bar({ pct, colorClass }: { pct: number; colorClass: string }) {
  return (
    <div className="flex items-center gap-3 text-xs">
      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${colorClass}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
      <span className="font-bold w-10 text-right text-primary font-cinzel">{pct}%</span>
    </div>
  );
}

export function InfoRow({ label, val }: { label: string; val: string | number }) {
  return (
    <div className="flex items-start border-b border-border/30 py-2 last:border-0 text-sm">
      <span className="text-muted-foreground flex-1">{label}</span>
      <span className="font-semibold text-primary font-cinzel">{val}</span>
    </div>
  );
}

export function Bullet({ items, color = "text-primary" }: { items: string[]; color?: string }) {
  return (
    <ul className="space-y-1.5">
      {items.map((t, i) => (
        <li key={i} className="text-sm text-muted-foreground flex gap-2">
          <span className={`${color} shrink-0`}>✦</span>{t}
        </li>
      ))}
    </ul>
  );
}
