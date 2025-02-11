
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useMappings = () => {
  return useQuery({
    queryKey: ["mappings"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not authenticated");
      }

      const { data, error } = await supabase
        .from("mappings")
        .select(`
          description_keyword,
          category_id
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      return data;
    },
  });
};
