
import { Json } from './database.types';

export interface Tables {
  budgets: {
    Row: {
      amount: number;
      category_id: string;
      created_at: string | null;
      id: string;
      period: string;
      user_id: string;
    };
    Insert: {
      amount: number;
      category_id: string;
      created_at?: string | null;
      id?: string;
      period: string;
      user_id: string;
    };
    Update: {
      amount?: number;
      category_id?: string;
      created_at?: string | null;
      id?: string;
      period?: string;
      user_id?: string;
    };
    Relationships: [
      {
        foreignKeyName: "budgets_category_id_fkey";
        columns: ["category_id"];
        isOneToOne: false;
        referencedRelation: "categories";
        referencedColumns: ["id"];
      }
    ];
  };
  categories: {
    Row: {
      created_at: string | null;
      id: string;
      name: string;
      user_id: string;
    };
    Insert: {
      created_at?: string | null;
      id?: string;
      name: string;
      user_id: string;
    };
    Update: {
      created_at?: string | null;
      id?: string;
      name?: string;
      user_id?: string;
    };
    Relationships: [];
  };
  transactions: {
    Row: {
      amount: number;
      category_id: string | null;
      created_at: string | null;
      date: string;
      description: string | null;
      id: string;
      tags: string[] | null;
      user_id: string;
    };
    Insert: {
      amount: number;
      category_id?: string | null;
      created_at?: string | null;
      date: string;
      description?: string | null;
      id?: string;
      tags?: string[] | null;
      user_id: string;
    };
    Update: {
      amount?: number;
      category_id?: string | null;
      created_at?: string | null;
      date?: string;
      description?: string | null;
      id?: string;
      tags?: string[] | null;
      user_id?: string;
    };
    Relationships: [
      {
        foreignKeyName: "transactions_category_id_fkey";
        columns: ["category_id"];
        isOneToOne: false;
        referencedRelation: "categories";
        referencedColumns: ["id"];
      }
    ];
  };
}
