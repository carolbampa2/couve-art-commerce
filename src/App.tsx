
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Artists from "./pages/Artists";
import ArtistProducts from "./pages/ArtistProducts";
import ArtistSignup from "./pages/ArtistSignup";
import Shop from "./pages/Shop";
import Token from "./pages/Token";
import TokenConfirmation from "./pages/TokenConfirmation";
import Checkout from "./pages/Checkout";
import PaymentSuccess from "./pages/PaymentSuccess";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import { ThemeProvider } from "./context/ThemeContext";
import { LanguageProvider } from "./context/LanguageContext";
import { AuthProvider } from "./context/AuthContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/artists" element={<Artists />} />
                <Route path="/artist-products/:artistId" element={<ArtistProducts />} />
                <Route path="/artist-signup" element={<ArtistSignup />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/token" element={<Token />} />
                <Route path="/token-confirmation/:productId" element={<TokenConfirmation />} />
                <Route path="/checkout/:productId" element={<Checkout />} />
                <Route path="/payment-success" element={<PaymentSuccess />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
