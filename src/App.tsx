import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { ChiSiamo } from "./pages/ChiSiamo";
import { Libri } from "./pages/Libri";
import { Lezioni } from "./pages/Lezioni";
import { Dona } from "./pages/Dona";
import { Contattaci } from "./pages/Contattaci";
import { CookiePolicy } from "./pages/CookiePolicy";
import { PrivacyPolicy } from "./pages/PrivacyPolicy";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="chi-siamo" element={<ChiSiamo />} />
            <Route path="libri" element={<Libri />} />
            <Route path="lezioni" element={<Lezioni />} />
            <Route path="dona" element={<Dona />} />
            <Route path="contattaci" element={<Contattaci />} />
            <Route path="cookie-policy" element={<CookiePolicy />} />
            <Route path="privacy-policy" element={<PrivacyPolicy />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
