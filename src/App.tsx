
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Artists from "./pages/Artists";
import ArtistSignup from "./pages/ArtistSignup";
import Shop from "./pages/Shop";
import Token from "./pages/Token";
import TokenConfirmation from "./pages/TokenConfirmation";
import Checkout from "./pages/Checkout";
import PaymentSuccess from "./pages/PaymentSuccess";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/artists" element={<Artists />} />
          <Route path="/artist-signup" element={<ArtistSignup />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/token" element={<Token />} />
          <Route path="/token-confirmation/:productId" element={<TokenConfirmation />} />
          <Route path="/checkout/:productId" element={<Checkout />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/privacy" element={<Index />} /> {/* Placeholder for future Privacy page */}
          <Route path="/terms" element={<Index />} /> {/* Placeholder for future Terms page */}
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
