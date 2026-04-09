import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles, Smartphone, Heart, Type, BookOpen, Gem, Grid3X3, Shield, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";
import ankLogo from "@/assets/ank-darppan-logo.png";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

const SERVICES = [
  {
    title: "Lo Shu Grid",
    subtitle: "Vedic Numerology Report",
    description: "Complete personality analysis with Lo Shu Grid, planes of expression, missing numbers, and life path guidance.",
    icon: Grid3X3,
    path: "/loshu-grid",
    gradient: "from-amber-500 to-orange-600",
    glow: "shadow-amber-500/20",
    delay: 0.1,
  },
  {
    title: "Mobile Compatibility",
    subtitle: "Number Vibration Analysis",
    description: "Discover if your mobile number harmonizes with your birth energy. Get lucky number suggestions.",
    icon: Smartphone,
    path: "/mobile-compatibility",
    gradient: "from-blue-500 to-cyan-500",
    glow: "shadow-blue-500/20",
    delay: 0.2,
  },
  {
    title: "Marriage Compatibility",
    subtitle: "Partner Harmony Score",
    description: "Analyze cosmic compatibility between two souls using Moolank, Bhagyank, elements, and Kua groups.",
    icon: Heart,
    path: "/marriage-compatibility",
    gradient: "from-rose-500 to-pink-600",
    glow: "shadow-rose-500/20",
    delay: 0.3,
  },
  {
    title: "Name Compatibility",
    subtitle: "Chaldean Name Analysis",
    description: "Unlock the hidden power of your name. Get correction suggestions aligned with your destiny.",
    icon: Type,
    path: "/name-compatibility",
    gradient: "from-violet-500 to-purple-600",
    glow: "shadow-violet-500/20",
    delay: 0.4,
  },
  {
    title: "Lal Kitab",
    subtitle: "Predictions & Remedies",
    description: "Powerful planetary remedies from the ancient Red Book. Unlock upayas for prosperity and peace.",
    icon: BookOpen,
    path: "/lal-kitab",
    gradient: "from-red-500 to-orange-500",
    glow: "shadow-red-500/20",
    delay: 0.5,
  },
  {
    title: "Crystal & Gem Guide",
    subtitle: "Rudraksha • Crystals • Gems",
    description: "Personalized healing stone recommendations aligned with your cosmic vibrations and chakras.",
    icon: Gem,
    path: "/crystal-gem",
    gradient: "from-emerald-500 to-teal-500",
    glow: "shadow-emerald-500/20",
    delay: 0.6,
  },
];

export default function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null));
    return () => subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    setUser(null);
  }

  return (
    <div className="min-h-screen bg-background relative">
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-mystic/5 rounded-full blur-[100px]" />
      </div>

      {/* NAV */}
      <header className="border-b border-border/30 glass sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={ankLogo} alt="Ank Darppan" className="w-10 h-10 rounded-full border border-primary/30 bg-background" />
            <div>
              <span className="font-cinzel font-bold text-primary tracking-wider text-sm block leading-tight">Ank Darppan</span>
              <span className="text-muted-foreground text-[10px] tracking-[0.3em] font-cinzel">AAPKE ANK</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <Link to="/admin">
                  <Button size="sm" variant="ghost" className="gap-1.5 text-muted-foreground hover:text-primary text-xs">
                    <Shield className="w-3.5 h-3.5" /> Admin
                  </Button>
                </Link>
                <Button size="sm" variant="ghost" onClick={handleLogout} className="gap-1.5 text-muted-foreground hover:text-primary text-xs">
                  <LogOut className="w-3.5 h-3.5" /> Logout
                </Button>
              </>
            ) : (
              <Link to="/login">
                <Button size="sm" variant="outline" className="gap-1.5 border-primary/30 text-primary hover:bg-primary/10 text-xs font-cinzel">
                  <Shield className="w-3.5 h-3.5" /> Admin Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 relative z-10">
        {/* HERO */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative rounded-3xl overflow-hidden mb-12"
        >
          <img src={heroBg} alt="Vedic Numerology" className="w-full h-64 sm:h-80 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.3, duration: 0.6 }}>
              <div className="w-20 h-20 mx-auto mb-4 rounded-full border-2 border-primary/40 bg-background/50 backdrop-blur-sm flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-primary animate-pulse-glow" />
              </div>
              <p className="text-primary/80 font-cinzel text-xs tracking-[0.5em] mb-2">VEDIC NUMEROLOGY</p>
              <h1 className="font-cinzel text-3xl sm:text-5xl font-bold text-gradient-gold mb-3">Ank Darppan</h1>
              <p className="text-muted-foreground max-w-lg mx-auto font-cormorant text-lg sm:text-xl">
                Unlock the ancient wisdom of numbers. Discover your destiny through 
                <span className="text-primary"> Vedic Numerology</span>.
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* SERVICES HEADING */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-center mb-8"
        >
          <p className="text-primary/60 font-cinzel text-xs tracking-[0.4em] mb-2">OUR SERVICES</p>
          <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-foreground">Choose Your Reading</h2>
          <p className="text-muted-foreground font-cormorant text-lg mt-2">Each report is a gateway to self-discovery</p>
        </motion.div>

        {/* SERVICE CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {SERVICES.map((svc) => (
            <motion.div
              key={svc.path}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: svc.delay, duration: 0.6 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
            >
              <Link to={svc.path} className="block h-full">
                <div className={`h-full rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm p-6 
                  hover:border-primary/40 transition-all duration-300 hover:shadow-xl ${svc.glow} group cursor-pointer`}>
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${svc.gradient} flex items-center justify-center mb-4 
                    group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <svc.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-cinzel font-bold text-foreground text-lg mb-1">{svc.title}</h3>
                  <p className="text-primary/70 font-cinzel text-[10px] tracking-[0.2em] uppercase mb-3">{svc.subtitle}</p>
                  <p className="text-muted-foreground text-sm leading-relaxed">{svc.description}</p>
                  <div className="mt-4 flex items-center gap-1.5 text-primary text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    <Sparkles className="w-3.5 h-3.5" /> Generate Report →
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* FOOTER */}
        <div className="border-t border-border/30 pt-8 pb-6 text-center">
          <img src={ankLogo} alt="Ank Darppan" className="w-12 h-12 mx-auto rounded-full border border-primary/20 mb-3" />
          <p className="font-cinzel text-primary text-sm font-bold tracking-wider">Ank Darppan</p>
          <p className="text-muted-foreground text-xs mt-1 font-cormorant text-base">Aapke Ank • Your Numbers, Your Destiny</p>
          <p className="text-muted-foreground/50 text-[10px] mt-4">© {new Date().getFullYear()} Ank Darppan. All rights reserved.</p>
        </div>
      </main>
    </div>
  );
}
