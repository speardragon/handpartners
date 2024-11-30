export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      company: {
        Row: {
          created_at: string
          description: string | null
          id: number
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          name?: string
        }
        Relationships: []
      }
      evaluation: {
        Row: {
          company_id: number
          created_at: string
          evaluation_criterion_id: number
          grade: number
          id: number
          judging_round_id: number
          status: string | null
          user_id: number
        }
        Insert: {
          company_id: number
          created_at?: string
          evaluation_criterion_id: number
          grade: number
          id?: number
          judging_round_id: number
          status?: string | null
          user_id: number
        }
        Update: {
          company_id?: number
          created_at?: string
          evaluation_criterion_id?: number
          grade?: number
          id?: number
          judging_round_id?: number
          status?: string | null
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "evaluation_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evaluation_evaluation_criterion_id_fkey"
            columns: ["evaluation_criterion_id"]
            isOneToOne: false
            referencedRelation: "evaluation_criteria"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evaluation_judging_round_id_fkey"
            columns: ["judging_round_id"]
            isOneToOne: false
            referencedRelation: "judging_round"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evaluation_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      evaluation_criteria: {
        Row: {
          created_at: string
          description: string | null
          id: number
          item_name: string
          judging_round_id: number
          points: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          item_name: string
          judging_round_id: number
          points: number
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          item_name?: string
          judging_round_id?: number
          points?: number
        }
        Relationships: [
          {
            foreignKeyName: "evaluation_criteria_judging_round_id_fkey"
            columns: ["judging_round_id"]
            isOneToOne: false
            referencedRelation: "judging_round"
            referencedColumns: ["id"]
          },
        ]
      }
      judging_round: {
        Row: {
          created_at: string
          description: string | null
          end_date: string | null
          id: number
          name: string
          program_id: number
          start_date: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: number
          name: string
          program_id: number
          start_date?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: number
          name?: string
          program_id?: number
          start_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "judging_round_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "program"
            referencedColumns: ["id"]
          },
        ]
      }
      judging_round_company: {
        Row: {
          category: string | null
          company_id: number
          created_at: string
          id: number
          judge_num: number | null
          judging_round_id: number
          pdf_path: string | null
        }
        Insert: {
          category?: string | null
          company_id: number
          created_at?: string
          id?: number
          judge_num?: number | null
          judging_round_id: number
          pdf_path?: string | null
        }
        Update: {
          category?: string | null
          company_id?: number
          created_at?: string
          id?: number
          judge_num?: number | null
          judging_round_id?: number
          pdf_path?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "judging_round_company_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "judging_round_company_judging_round_id_fkey"
            columns: ["judging_round_id"]
            isOneToOne: false
            referencedRelation: "judging_round"
            referencedColumns: ["id"]
          },
        ]
      }
      judging_round_user: {
        Row: {
          created_at: string
          id: number
          judging_round_id: number
          user_id: number
        }
        Insert: {
          created_at?: string
          id?: number
          judging_round_id: number
          user_id: number
        }
        Update: {
          created_at?: string
          id?: number
          judging_round_id?: number
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "judging_round_user_judging_round_id_fkey"
            columns: ["judging_round_id"]
            isOneToOne: false
            referencedRelation: "judging_round"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "judging_round_user_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      program: {
        Row: {
          categories: string[] | null
          created_at: string
          description: string | null
          end_date: string | null
          id: number
          name: string
          start_date: string | null
        }
        Insert: {
          categories?: string[] | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: number
          name: string
          start_date?: string | null
        }
        Update: {
          categories?: string[] | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: number
          name?: string
          start_date?: string | null
        }
        Relationships: []
      }
      program_company: {
        Row: {
          company_id: number
          created_at: string
          id: number
          program_id: number
        }
        Insert: {
          company_id: number
          created_at?: string
          id?: number
          program_id: number
        }
        Update: {
          company_id?: number
          created_at?: string
          id?: number
          program_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "program_company_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "program_company_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "program"
            referencedColumns: ["id"]
          },
        ]
      }
      user: {
        Row: {
          affiliation: string | null
          created_at: string
          email: string | null
          id: number
          password: string
          phone_number: string | null
          position: string | null
          role: string
          updated_at: string | null
          username: string
        }
        Insert: {
          affiliation?: string | null
          created_at?: string
          email?: string | null
          id?: number
          password: string
          phone_number?: string | null
          position?: string | null
          role?: string
          updated_at?: string | null
          username: string
        }
        Update: {
          affiliation?: string | null
          created_at?: string
          email?: string | null
          id?: number
          password?: string
          phone_number?: string | null
          position?: string | null
          role?: string
          updated_at?: string | null
          username?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_unique_evaluations: {
        Args: {
          judging_round: number
        }
        Returns: {
          judging_round_id: number
          company_id: number
          status: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
