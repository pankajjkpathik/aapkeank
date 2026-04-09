import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import ankLogo from "@/assets/ank-darppan-logo.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr("");
    setSuccess("");

    if (isSignup) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) { setErr(error.message); setLoading(false); return; }
      setSuccess("Account created! Now switch to Login to sign in.");
      setIsSignup(false);
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setErr(error.message);
      setLoading(false);
      return;
    }
    // Check if user has admin role
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setErr("Login failed."); setLoading(false); return; }

    const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", user.id);
    const isAdmin = roles?.some((r: any) => r.role === "admin");
    if (!isAdmin) {
      await supabase.auth.signOut();
      setErr("Access denied. Admin privileges required.");
      setLoading(false);
      return;
    }
    navigate("/admin");
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md mx-4 relative z-10"
      >
        <div className="text-center mb-8">
          <img src={ankLogo} alt="Ank Darppan" className="w-16 h-16 mx-auto rounded-full border-2 border-primary/30 mb-4" />
          <h1 className="font-cinzel text-2xl font-bold text-gradient-gold">{isSignup ? "Create Account" : "Admin Login"}</h1>
          <p className="text-muted-foreground font-cormorant text-lg mt-1">Ank Darppan Dashboard</p>
        </div>

        <div className="glass-gold rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="text-xs font-medium mb-1.5 block text-muted-foreground uppercase tracking-wider">Email</Label>
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@ankdarppan.com"
                className="bg-muted/30 border-border/50" required />
            </div>
            <div>
              <Label className="text-xs font-medium mb-1.5 block text-muted-foreground uppercase tracking-wider">Password</Label>
              <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                className="bg-muted/30 border-border/50" required />
            </div>
            {err && <p className="text-destructive text-xs text-center">{err}</p>}
            {success && <p className="text-green-500 text-xs text-center">{success}</p>}
            <Button type="submit" disabled={loading}
              className="w-full gap-2 bg-gradient-to-r from-primary to-amber-600 hover:from-primary/90 hover:to-amber-600/90 font-cinzel tracking-wider">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
              {loading ? "Processing..." : isSignup ? "Sign Up" : "Login"}
            </Button>
          </form>
        </div>

        <div className="text-center mt-4">
          <button onClick={() => { setIsSignup(!isSignup); setErr(""); setSuccess(""); }}
            className="text-primary hover:text-primary/80 text-sm transition-colors underline">
            {isSignup ? "Already have an account? Login" : "Need an account? Sign Up"}
          </button>
        </div>

        <div className="text-center mt-3">
          <Link to="/" className="text-muted-foreground hover:text-primary text-sm inline-flex items-center gap-1.5 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
