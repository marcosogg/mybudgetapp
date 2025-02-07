
import type { Json } from "./json";

export interface CategoryTable {
  Row: {
    id: string
    user_id: string
    name: string
    created_at: string
  }
  Insert: {
    id?: string
    user_id: string
    name: string
    created_at?: string
  }
  Update: {
    id?: string
    user_id?: string
    name?: string
    created_at?: string
  }
}
