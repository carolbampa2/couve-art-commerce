import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useSyncPrintfulProducts = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('sync-printful-products');
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: "Sincronização concluída!",
        description: data.message || "Produtos da Printful sincronizados com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro na sincronização",
        description: error.message || "Erro ao sincronizar produtos da Printful.",
        variant: "destructive",
      });
    },
  });
};

export const useCreatePrintfulOrder = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ orderId, customerInfo, shippingInfo }: {
      orderId: string;
      customerInfo: any;
      shippingInfo: any;
    }) => {
      const { data, error } = await supabase.functions.invoke('create-printful-order', {
        body: { orderId, customerInfo, shippingInfo }
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      toast({
        title: "Pedido enviado!",
        description: data.message || "Pedido enviado para a Printful com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro no pedido",
        description: error.message || "Erro ao enviar pedido para a Printful.",
        variant: "destructive",
      });
    },
  });
};

export const usePrintfulProducts = () => {
  return useQuery({
    queryKey: ['products', 'printful'],
    queryFn: async () => {
      try {
        // @ts-ignore - Avoiding TypeScript deep instantiation error
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_printful_product', true)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error('Error fetching printful products:', error);
        return [];
      }
    },
  });
};