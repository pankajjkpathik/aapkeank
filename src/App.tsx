import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import MobileCompatibility from "./pages/MobileCompatibility.tsx";
import MarriageCompatibility from "./pages/MarriageCompatibility.tsx";
import NameCompatibility from "./pages/NameCompatibility.tsx";
import LalKitab from "./pages/LalKitab.tsx";
import CrystalGem from "./pages/CrystalGem.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/mobile-compatibility" element={<MobileCompatibility />} />
          <Route path="/marriage-compatibility" element={<MarriageCompatibility />} />
          <Route path="/name-compatibility" element={<NameCompatibility />} />
          <Route path="/lal-kitab" element={<LalKitab />} />
          <Route path="/crystal-gem" element={<CrystalGem />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
