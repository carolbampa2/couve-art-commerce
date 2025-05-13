
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

// Lista de países
const countries = [
  { value: "br", label: "Brasil" },
  { value: "pt", label: "Portugal" },
  { value: "es", label: "Espanha" },
  { value: "fr", label: "França" },
  { value: "us", label: "Estados Unidos" },
  { value: "ca", label: "Canadá" },
  { value: "mx", label: "México" },
  { value: "ar", label: "Argentina" },
  { value: "cl", label: "Chile" },
  { value: "co", label: "Colômbia" },
  { value: "uk", label: "Reino Unido" },
  { value: "de", label: "Alemanha" },
  { value: "it", label: "Itália" },
  { value: "jp", label: "Japão" },
  { value: "cn", label: "China" }
];

// Schema de validação do formulário
const formSchema = z.object({
  firstName: z.string().min(2, "Primeiro nome precisa ter pelo menos 2 caracteres"),
  lastName: z.string().min(2, "Último nome precisa ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  country: z.string().min(1, "Selecione um país"),
  portfolio: z.string().url("URL do portfólio inválida"),
  walletAddress: z.string().min(10, "Endereço de carteira inválido"),
  motivation: z.string().min(20, "Por favor escreva pelo menos 20 caracteres")
});

type FormValues = z.infer<typeof formSchema>;

const ArtistSignup = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      country: "",
      portfolio: "",
      walletAddress: "",
      motivation: ""
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    // Simulação de envio do formulário
    console.log("Formulário enviado:", data);
    
    // Em um caso real, aqui você enviaria os dados para um endpoint
    try {
      // Simular um delay de rede
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mostrar toast de sucesso
      toast.success("Formulário submetido com sucesso!", {
        description: "Sua candidatura será avaliada pela equipe Paisagem. Aguarde que em breve entraremos em contato.",
        duration: 5000,
      });
      
      // Redirecionamento opcional após submissão com sucesso
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      toast.error("Erro ao enviar formulário", {
        description: "Por favor tente novamente mais tarde.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="container px-4 md:px-6 max-w-3xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight mb-2">Cadastro de Artista</h1>
            <p className="text-muted-foreground">
              Junte-se à nossa comunidade de artistas e venda seus designs na plataforma Paisagem
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primeiro Nome</FormLabel>
                      <FormControl>
                        <Input placeholder="João" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Último Nome</FormLabel>
                      <FormControl>
                        <Input placeholder="Silva" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="seu@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>País</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione seu país" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country.value} value={country.value}>
                            {country.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="portfolio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Link do Portfólio</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://seuportfolio.com" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Uma URL para seu trabalho, site ou perfil em redes sociais
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="walletAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Endereço de Carteira (Base Network)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="0x..." 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Sua carteira na rede Base para recebimento de pagamentos
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="motivation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Motivação</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Conte-nos por que você deseja se juntar à plataforma Paisagem..." 
                        className="min-h-[120px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Descreva brevemente seu estilo artístico e motivação para participar
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full gradient-bg" 
                disabled={isSubmitting}
                size="lg"
              >
                {isSubmitting ? "Enviando..." : "Enviar Candidatura"}
              </Button>
              
              <p className="text-center text-xs text-muted-foreground mt-4">
                Suas informações serão enviadas para paisagem.pt@gmail.com e usadas apenas 
                para avaliar sua candidatura como artista na plataforma.
              </p>
            </form>
          </Form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ArtistSignup;
