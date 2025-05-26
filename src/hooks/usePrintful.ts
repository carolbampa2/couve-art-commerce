
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '../integrations/supabase/types';
import { useToast } from '@/hooks/use-toast';

// Define the PrintfulProduct interface
interface PrintfulProduct extends Tables<'products'> {
  artists: Tables<'artists'> | null;
}

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
  return useQuery<PrintfulProduct[], Error>({
    queryKey: ['products', 'printful'],
    queryFn: async (): Promise<PrintfulProduct[]> => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          artists (
            id,
            name,
            bio,
            avatar_url
          )
        `)
        .eq('is_printful_product', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      // Supabase typings might not perfectly match our extended interface,
      // so we cast to PrintfulProduct[] ensuring the structure is compatible.
      // If data is null (e.g. no products found), return an empty array
      // to match the expected PrintfulProduct[] return type.
      return (data as PrintfulProduct[] | null) ?? [];
    },
  });
};
