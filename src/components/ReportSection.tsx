import { motion } from "framer-motion";

interface SectionProps {
  no: number;
  title: string;
  colorClass: string;
  children: React.ReactNode;
  clientName?: string;
}

export function Section({ no, title, colorClass, children, clientName }: SectionProps) {
  return (
    <div className="report-page bg-white text-gray-900 relative" style={{ pageBreakBefore: "always" }}>
      {/* Print header */}
      <div className="report-header hidden print:flex items-center justify-between border-b border-gray-300 pb-2 mb-4">
        <span className="font-cinzel text-xs text-gray-500 tracking-wider">{clientName || ""}</span>
        <span className="font-cinzel text-xs text-primary/80 tracking-wider font-bold">Ank Darppan</span>
      </div>

      {/* Section title bar */}
      <div className={`flex items-center gap-3 px-5 py-4 rounded-xl mb-4 ${colorClass}`}>
        <span className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-xs font-bold text-primary font-cinzel shrink-0">
          {no}
        </span>
        <span className="font-cinzel font-semibold text-sm tracking-wider text-foreground print:text-gray-800">
          {title}
        </span>
      </div>

      {/* Content always visible */}
      <div className="px-2 print:px-0">
        {children}
      </div>

      {/* Print footer */}
      <div className="report-footer hidden print:flex items-center justify-between border-t border-gray-300 pt-2 mt-auto absolute bottom-0 left-0 right-0 px-4">
        <span className="font-cinzel text-xs text-gray-500">Ank Darppan</span>
        <span className="font-cinzel text-xs text-gray-500 font-semibold">Aapke Ank</span>
        <span className="text-xs text-gray-500">Page <span className="page-number"></span></span>
      </div>
    </div>
  );
}

export function Bar({ pct, colorClass }: { pct: number; colorClass: string }) {
  return (
    <div className="flex items-center gap-3 text-xs">
      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden print:bg-gray-200">
        <motion.div
          className={`h-full rounded-full ${colorClass}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
      <span className="font-bold w-10 text-right text-primary font-cinzel print:text-gray-800">{pct}%</span>
    </div>
  );
}

export function InfoRow({ label, val }: { label: string; val: string | number }) {
  return (
    <div className="flex items-start border-b border-border/30 py-2 last:border-0 text-sm print:border-gray-200">
      <span className="text-muted-foreground flex-1 print:text-gray-600">{label}</span>
      <span className="font-semibold text-primary font-cinzel print:text-gray-900">{val}</span>
    </div>
  );
}

export function Bullet({ items, color = "text-primary" }: { items: string[]; color?: string }) {
  return (
    <ul className="space-y-1.5">
      {items.map((t, i) => (
        <li key={i} className="text-sm text-muted-foreground flex gap-2 print:text-gray-700">
          <span className={`${color} shrink-0 print:text-gray-500`}>✦</span>{t}
        </li>
      ))}
    </ul>
  );
}
