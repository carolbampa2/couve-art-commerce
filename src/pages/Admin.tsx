
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Package, Users, BarChart3, Printer } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import PrintfulSync from '@/components/admin/PrintfulSync';

const Admin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Simple admin check - in production, you'd want proper role-based auth
  const isAdmin = user?.email === 'admin@paisagem.art'; // Configure your admin email

  if (!user) {
    navigate('/auth');
    return null;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6 text-center">
              <h2 className="text-xl font-semibold mb-2">Acesso Negado</h2>
              <p className="text-muted-foreground mb-4">
                Você não tem permissão para acessar esta área.
              </p>
              <Button onClick={() => navigate('/')}>
                Voltar ao Início
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="container px-4 md:px-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2">Painel Administrativo</h1>
            <p className="text-muted-foreground">
              Gerencie produtos, artistas e integrações da plataforma Paisagem
            </p>
          </div>

          <Tabs defaultValue="printful" className="space-y-6">
            <TabsList className="grid w-full grid-cols-1 md:grid-cols-5">
              <TabsTrigger value="printful" className="flex items-center gap-2">
                <Printer className="h-4 w-4" />
                Printful
              </TabsTrigger>
              <TabsTrigger value="products" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Produtos
              </TabsTrigger>
              <TabsTrigger value="artists" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Artistas
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Configurações
              </TabsTrigger>
            </TabsList>

            <TabsContent value="printful">
              <PrintfulSync />
            </TabsContent>

            <TabsContent value="products">
              <Card>
                <CardHeader>
                  <CardTitle>Gerenciamento de Produtos</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Funcionalidade em desenvolvimento...
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="artists">
              <Card>
                <CardHeader>
                  <CardTitle>Gerenciamento de Artistas</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Funcionalidade em desenvolvimento...
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics">
              <Card>
                <CardHeader>
                  <CardTitle>Analytics e Relatórios</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Funcionalidade em desenvolvimento...
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Configurações do Sistema</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Funcionalidade em desenvolvimento...
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Admin;
