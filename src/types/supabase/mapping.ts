
import type { Json } from "./json";

export interface MappingTable {
  Row: {
    id: string
    user_id: string
    category_id: string
    description_keyword: string
    created_at: string
  }
  Insert: {
    id?: string
    user_id: string
    category_id: string
    description_keyword: string
    created_at?: string
  }
  Update: {
    id?: string
    user_id?: string
    category_id?: string
    description_keyword?: string
    created_at?: string
  }
}
