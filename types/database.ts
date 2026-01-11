export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          display_name: string
          created_at: string
          current_streak: number
          longest_streak: number
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          display_name: string
          created_at?: string
          current_streak?: number
          longest_streak?: number
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          display_name?: string
          created_at?: string
          current_streak?: number
          longest_streak?: number
          updated_at?: string
        }
        Relationships: []
      }
      food_items: {
        Row: {
          id: string
          name_nl: string
          type: 'fruit' | 'groente'
          category: string | null
          nutrient: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name_nl: string
          type: 'fruit' | 'groente'
          category?: string | null
          nutrient?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name_nl?: string
          type?: 'fruit' | 'groente'
          category?: string | null
          nutrient?: string | null
          created_at?: string
        }
        Relationships: []
      }
      user_intake: {
        Row: {
          id: string
          user_id: string
          food_item_id: string
          intake_date: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          food_item_id: string
          intake_date: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          food_item_id?: string
          intake_date?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_intake_food_item_id_fkey"
            columns: ["food_item_id"]
            referencedRelation: "food_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_intake_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      weekly_stats: {
        Row: {
          id: string
          user_id: string
          week_start_date: string
          unique_items_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          week_start_date: string
          unique_items_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          week_start_date?: string
          unique_items_count?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "weekly_stats_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
