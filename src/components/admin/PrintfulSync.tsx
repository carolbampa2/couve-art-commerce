
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Package, CheckCircle, AlertCircle } from 'lucide-react';
import { useSyncPrintfulProducts, usePrintfulProducts } from '@/hooks/usePrintful';

const PrintfulSync = () => {
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const syncMutation = useSyncPrintfulProducts();
  const { data: printfulProducts, isLoading } = usePrintfulProducts();

  const handleSync = async () => {
    try {
      await syncMutation.mutateAsync();
      setLastSyncTime(new Date());
    } catch (error) {
      console.error('Sync error:', error);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Sincronização Printful
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Sincronize produtos da sua conta Printful automaticamente
              </p>
              {lastSyncTime && (
                <p className="text-xs text-muted-foreground mt-1">
                  Última sincronização: {lastSyncTime.toLocaleString('pt-BR')}
                </p>
              )}
            </div>
            <Button 
              onClick={handleSync} 
              disabled={syncMutation.isPending}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${syncMutation.isPending ? 'animate-spin' : ''}`} />
              {syncMutation.isPending ? 'Sincronizando...' : 'Sincronizar'}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">
                {printfulProducts?.length || 0} produtos sincronizados
              </span>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-blue-500" />
              <span className="text-sm">Auto-sync habilitado</span>
            </div>
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-purple-500" />
              <span className="text-sm">Fulfillment automático</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Produtos Printful</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin" />
              <span className="ml-2">Carregando produtos...</span>
            </div>
          ) : (
            <div className="space-y-4">
              {printfulProducts?.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    {product.image_url && (
                      <img 
                        src={product.image_url} 
                        alt={product.title}
                        className="w-12 h-12 object-cover rounded"
                      />
                    )}
                    <div>
                      <h4 className="font-medium">{product.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        Produto Printful
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Printful</Badge>
                    <span className="font-medium">${product.price}</span>
                  </div>
                </div>
              ))}
              
              {printfulProducts?.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhum produto Printful encontrado</p>
                  <p className="text-sm">Clique em "Sincronizar" para importar produtos</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PrintfulSync;
