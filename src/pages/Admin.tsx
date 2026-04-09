import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, LogOut, BarChart3, FileText, Users, ArrowLeft, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import ankLogo from "@/assets/ank-darppan-logo.png";

interface ReportRecord {
  id: string;
  client_name: string;
  report_type: string;
  dob: string;
  created_at: string;
  data: any;
}

const REPORT_TYPE_LABELS: Record<string, string> = {
  loshu_grid: "Lo Shu Grid",
  mobile: "Mobile Compatibility",
  marriage: "Marriage Compatibility",
  name: "Name Compatibility",
  lal_kitab: "Lal Kitab",
  crystal_gem: "Crystal & Gem",
};

export default function Admin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [reports, setReports] = useState<ReportRecord[]>([]);
  const [stats, setStats] = useState({ total: 0, byType: {} as Record<string, number> });

  useEffect(() => {
    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) { navigate("/login"); return; }

      const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", session.user.id);
      const isAdmin = roles?.some((r: any) => r.role === "admin");
      if (!isAdmin) { navigate("/login"); return; }

      setUser(session.user);
      await loadReports();
      setLoading(false);
    }
    checkAuth();
  }, [navigate]);

  async function loadReports() {
    const { data } = await supabase.from("generated_reports").select("*").order("created_at", { ascending: false }).limit(100);
    const reps = (data || []) as ReportRecord[];
    setReports(reps);
    const byType: Record<string, number> = {};
    reps.forEach(r => { byType[r.report_type] = (byType[r.report_type] || 0) + 1; });
    setStats({ total: reps.length, byType });
  }

  async function deleteReport(id: string) {
    await supabase.from("generated_reports").delete().eq("id", id);
    setReports(prev => prev.filter(r => r.id !== id));
    setStats(prev => ({ ...prev, total: prev.total - 1 }));
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/");
  }

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-primary animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-background relative">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
      </div>

      <header className="border-b border-border/30 glass sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-1.5 text-muted-foreground hover:text-primary text-xs"><ArrowLeft className="w-3.5 h-3.5" /> Home</Link>
            <span className="text-border">|</span>
            <Shield className="w-5 h-5 text-primary" />
            <span className="font-cinzel font-bold text-primary tracking-wider text-sm">Admin Dashboard</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground text-xs">{user?.email}</span>
            <Button size="sm" variant="ghost" onClick={handleLogout} className="gap-1.5 text-muted-foreground hover:text-primary text-xs">
              <LogOut className="w-3.5 h-3.5" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 relative z-10">
        {/* STATS CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="glass-gold rounded-xl p-5 text-center">
            <BarChart3 className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{stats.total}</p>
            <p className="text-muted-foreground text-xs">Total Reports</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="glass-gold rounded-xl p-5 text-center">
            <FileText className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{Object.keys(stats.byType).length}</p>
            <p className="text-muted-foreground text-xs">Report Types</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="glass-gold rounded-xl p-5 text-center">
            <Users className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{new Set(reports.map(r => r.client_name)).size}</p>
            <p className="text-muted-foreground text-xs">Unique Clients</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="glass-gold rounded-xl p-5 text-center">
            <FileText className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">
              {reports.filter(r => {
                const d = new Date(r.created_at);
                const now = new Date();
                return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
              }).length}
            </p>
            <p className="text-muted-foreground text-xs">This Month</p>
          </motion.div>
        </div>

        {/* REPORT TYPE BREAKDOWN */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="glass-gold rounded-xl p-6 mb-8">
          <h3 className="font-cinzel font-bold text-foreground mb-4">Reports by Type</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {Object.entries(REPORT_TYPE_LABELS).map(([key, label]) => (
              <div key={key} className="rounded-lg bg-muted/30 border border-border/30 p-3 text-center">
                <p className="text-lg font-bold text-primary">{stats.byType[key] || 0}</p>
                <p className="text-muted-foreground text-[10px] tracking-wider uppercase">{label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* RECENT REPORTS TABLE */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="glass-gold rounded-xl p-6">
          <h3 className="font-cinzel font-bold text-foreground mb-4">Recent Reports</h3>
          {reports.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-8">No reports generated yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/30">
                    <th className="text-left py-2 px-3 text-muted-foreground text-xs uppercase tracking-wider">Client</th>
                    <th className="text-left py-2 px-3 text-muted-foreground text-xs uppercase tracking-wider">Type</th>
                    <th className="text-left py-2 px-3 text-muted-foreground text-xs uppercase tracking-wider">DOB</th>
                    <th className="text-left py-2 px-3 text-muted-foreground text-xs uppercase tracking-wider">Date</th>
                    <th className="text-right py-2 px-3 text-muted-foreground text-xs uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map(r => (
                    <tr key={r.id} className="border-b border-border/20 hover:bg-muted/20 transition-colors">
                      <td className="py-2.5 px-3 text-foreground">{r.client_name}</td>
                      <td className="py-2.5 px-3"><span className="text-primary text-xs font-medium">{REPORT_TYPE_LABELS[r.report_type] || r.report_type}</span></td>
                      <td className="py-2.5 px-3 text-muted-foreground">{r.dob}</td>
                      <td className="py-2.5 px-3 text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</td>
                      <td className="py-2.5 px-3 text-right">
                        <Button size="sm" variant="ghost" onClick={() => deleteReport(r.id)} className="text-destructive hover:text-destructive/80 h-7 w-7 p-0">
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
