

import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Lock, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/context/ThemeContext";

interface Product {
  id: number;
  title: string;
  artist: string;
  price: string;
  imageUrl: string;
  exclusive: boolean;
  couveRequired?: number;
}

const TokenConfirmation = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  
  // Mock product data - em uma app real, você buscaria isso de uma API
  const products: Product[] = [
    {
      id: 2,
      title: "Neon Genesis",
      artist: "Rodrigo Almeida",
      price: "44.99",
      imageUrl: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
      exclusive: true,
      couveRequired: 100,
    },
    {
      id: 4,
      title: "Crypto Dreams",
      artist: "Paulo Viera",
      price: "49.99",
      imageUrl: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
      exclusive: true,
      couveRequired: 250,
    },
  ];
  
  const product = products.find(p => p.id.toString() === productId);
  
  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 py-12">
          <div className="container px-4 md:px-6 text-center">
            <h1 className="text-3xl font-bold tracking-tight mb-4">Produto não encontrado</h1>
            <p className="mb-8">O produto que você procura não está disponível.</p>
            <Button onClick={() => navigate("/")}>Voltar à página inicial</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  const handleTokenConfirmation = async () => {
    setIsProcessing(true);
    
    // Simular verificação de token
    setTimeout(() => {
      setIsProcessing(false);
      toast.success("Tokens COUVE verificados com sucesso!", {
        description: "Prosseguindo para o checkout.",
      });
      navigate(`/checkout/${productId}`);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="container px-4 md:px-6 max-w-3xl mx-auto">
          <Card className="border-2 border-paisagem-purple/20 overflow-hidden">
            <div className="p-1 gradient-bg">
              <div className="bg-card p-6 rounded-sm">
                <div className="flex flex-col items-center text-center mb-6">
                  <Lock className="h-12 w-12 text-paisagem-purple mb-4" />
                  <h1 className={cn("text-3xl font-bold tracking-tight mb-2", 
                    isDarkMode ? "text-white" : "text-black")}>
                    Produto Exclusivo COUVE
                  </h1>
                  <p className={cn("", 
                    isDarkMode ? "text-muted-foreground" : "text-gray-600")}>
                    Este é um item exclusivo para detentores do token COUVE
                  </p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="aspect-square relative rounded-lg overflow-hidden">
                    <img 
                      src={product.imageUrl} 
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <h2 className={cn("text-2xl font-bold", 
                      isDarkMode ? "text-white" : "text-black")}>{product.title}</h2>
                    <p className={cn("", 
                      isDarkMode ? "text-muted-foreground" : "text-gray-600")}>Por {product.artist}</p>
                    <p className={cn("text-lg font-semibold", 
                      isDarkMode ? "text-white" : "text-black")}>${product.price}</p>
                    
                    <div className="bg-muted rounded-lg p-4">
                      <p className={cn("font-medium flex items-center gap-2", 
                        isDarkMode ? "text-white" : "text-gray-800")}>
                        <span className="text-paisagem-purple">{product.couveRequired}</span> 
                        tokens COUVE necessários
                      </p>
                    </div>
                    
                    <Button 
                      className="w-full gradient-bg" 
                      size="lg"
                      onClick={handleTokenConfirmation}
                      disabled={isProcessing}
                    >
                      {isProcessing ? "Verificando tokens..." : "Confirmar compra com COUVE"}
                    </Button>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="w-full">
                          Como funciona?
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Sobre produtos exclusivos COUVE</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <p>Os itens exclusivos COUVE são restritos aos detentores do token Paisagem.</p>
                          <ul className="space-y-2">
                            <li className="flex items-start gap-2">
                              <CheckCircle className="h-5 w-5 text-paisagem-teal mt-0.5" />
                              <span>Você precisa ter {product.couveRequired}+ tokens COUVE em sua carteira</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle className="h-5 w-5 text-paisagem-teal mt-0.5" />
                              <span>Nossa plataforma verificará automaticamente seu saldo</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle className="h-5 w-5 text-paisagem-teal mt-0.5" />
                              <span>Os tokens não serão gastos, apenas verificados</span>
                            </li>
                          </ul>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => navigate("/token")}>
                            Saiba mais sobre COUVE
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    
                    <p className={cn("text-sm", 
                      isDarkMode ? "text-muted-foreground" : "text-gray-500")}>
                      Ao comprar este item, você confirma que possui tokens COUVE e permite
                      que nossa plataforma verifique seu saldo.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TokenConfirmation;

