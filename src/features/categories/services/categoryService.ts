
import { supabase } from "@/integrations/supabase/client";
import type { Category } from "../types/category";

export class CategoryService {
  async getCategories(): Promise<Category[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("user_id", user.id)
      .order("name");

    if (error) throw error;
    return data;
  }

  async createCategory(name: string): Promise<Category> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("categories")
      .insert([{ name, user_id: user.id }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateCategory(id: string, name: string): Promise<Category> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("categories")
      .update({ name })
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteCategory(id: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) throw error;
  }

  async getCategoryStats(): Promise<Category[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("categories")
      .select(`
        *,
        transactions:transactions(amount)
      `)
      .eq("user_id", user.id);

    if (error) throw error;
    return data;
  }
}
