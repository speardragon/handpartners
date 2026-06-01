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
          representative_name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          name: string
          representative_name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          name?: string
          representative_name?: string
        }
        Relationships: []
      }
      evaluation: {
        Row: {
          company_id: number
          created_at: string
          evaluation_criterion_id: number
          feedback: string | null
          grade: number
          id: number
          judging_round_id: string
          status: string | null
          user_id: string | null
        }
        Insert: {
          company_id: number
          created_at?: string
          evaluation_criterion_id: number
          feedback?: string | null
          grade: number
          id?: number
          judging_round_id: string
          status?: string | null
          user_id?: string | null
        }
        Update: {
          company_id?: number
          created_at?: string
          evaluation_criterion_id?: number
          feedback?: string | null
          grade?: number
          id?: number
          judging_round_id?: string
          status?: string | null
          user_id?: string | null
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
          judging_round_id: string
          points: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          item_name: string
          judging_round_id: string
          points: number
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          item_name?: string
          judging_round_id?: string
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
          id: string
          program_id: number
          status: Database["public"]["Enums"]["judging_round_status"]
        }
        Insert: {
          created_at?: string
          id: string
          program_id: number
          status?: Database["public"]["Enums"]["judging_round_status"]
        }
        Update: {
          created_at?: string
          id?: string
          program_id?: number
          status?: Database["public"]["Enums"]["judging_round_status"]
        }
        Relationships: [
          {
            foreignKeyName: "judging_round_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: true
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
          feedback: string | null
          group_name: string | null
          id: number
          judge_num: number | null
          judging_round_id: string
          original_filename: string | null
          pdf_path: string | null
          submitted_at: string | null
        }
        Insert: {
          category?: string | null
          company_id: number
          created_at?: string
          feedback?: string | null
          group_name?: string | null
          id?: number
          judge_num?: number | null
          judging_round_id: string
          original_filename?: string | null
          pdf_path?: string | null
          submitted_at?: string | null
        }
        Update: {
          category?: string | null
          company_id?: number
          created_at?: string
          feedback?: string | null
          group_name?: string | null
          id?: number
          judge_num?: number | null
          judging_round_id?: string
          original_filename?: string | null
          pdf_path?: string | null
          submitted_at?: string | null
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
          group_name: string | null
          id: number
          judging_round_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          group_name?: string | null
          id?: number
          judging_round_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          group_name?: string | null
          id?: number
          judging_round_id?: string
          user_id?: string
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
      mentoring: {
        Row: {
          created_at: string
          id: string
          program_id: number
          report_logo_path: string | null
          status: Database["public"]["Enums"]["mentoring_status"]
        }
        Insert: {
          created_at?: string
          id: string
          program_id: number
          report_logo_path?: string | null
          status?: Database["public"]["Enums"]["mentoring_status"]
        }
        Update: {
          created_at?: string
          id?: string
          program_id?: number
          report_logo_path?: string | null
          status?: Database["public"]["Enums"]["mentoring_status"]
        }
        Relationships: [
          {
            foreignKeyName: "mentoring_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: true
            referencedRelation: "program"
            referencedColumns: ["id"]
          },
        ]
      }
      mentoring_company: {
        Row: {
          company_id: number
          created_at: string
          id: number
          mentoring_id: string
        }
        Insert: {
          company_id: number
          created_at?: string
          id?: number
          mentoring_id: string
        }
        Update: {
          company_id?: number
          created_at?: string
          id?: number
          mentoring_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mentoring_company_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mentoring_company_mentoring_id_fkey"
            columns: ["mentoring_id"]
            isOneToOne: false
            referencedRelation: "mentoring"
            referencedColumns: ["id"]
          },
        ]
      }
      mentoring_company_mentor: {
        Row: {
          claimed_at: string | null
          created_at: string
          id: number
          mentor_id: string
          mentoring_company_id: number
        }
        Insert: {
          claimed_at?: string | null
          created_at?: string
          id?: number
          mentor_id: string
          mentoring_company_id: number
        }
        Update: {
          claimed_at?: string | null
          created_at?: string
          id?: number
          mentor_id?: string
          mentoring_company_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "mentoring_company_mentor_mentor_id_fkey"
            columns: ["mentor_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mentoring_company_mentor_mentoring_company_id_fkey"
            columns: ["mentoring_company_id"]
            isOneToOne: false
            referencedRelation: "mentoring_company"
            referencedColumns: ["id"]
          },
        ]
      }
      mentoring_session: {
        Row: {
          company_id: number
          content: string | null
          created_at: string
          id: number
          mentor_id: string | null
          mentored_at: string
          mentoring_id: string
          place: string | null
          session_no: number
          updated_at: string
        }
        Insert: {
          company_id: number
          content?: string | null
          created_at?: string
          id?: number
          mentor_id?: string | null
          mentored_at: string
          mentoring_id: string
          place?: string | null
          session_no: number
          updated_at?: string
        }
        Update: {
          company_id?: number
          content?: string | null
          created_at?: string
          id?: number
          mentor_id?: string | null
          mentored_at?: string
          mentoring_id?: string
          place?: string | null
          session_no?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mentoring_session_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mentoring_session_mentor_id_fkey"
            columns: ["mentor_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mentoring_session_mentoring_id_fkey"
            columns: ["mentoring_id"]
            isOneToOne: false
            referencedRelation: "mentoring"
            referencedColumns: ["id"]
          },
        ]
      }
      mentoring_session_photo: {
        Row: {
          created_at: string
          id: number
          mentoring_session_id: number
          original_filename: string | null
          photo_path: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          id?: number
          mentoring_session_id: number
          original_filename?: string | null
          photo_path: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          id?: number
          mentoring_session_id?: number
          original_filename?: string | null
          photo_path?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "mentoring_session_photo_mentoring_session_id_fkey"
            columns: ["mentoring_session_id"]
            isOneToOne: false
            referencedRelation: "mentoring_session"
            referencedColumns: ["id"]
          },
        ]
      }
      mentoring_user: {
        Row: {
          created_at: string
          id: number
          mentoring_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          mentoring_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: number
          mentoring_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mentoring_user_mentoring_id_fkey"
            columns: ["mentoring_id"]
            isOneToOne: false
            referencedRelation: "mentoring"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mentoring_user_user_id_fkey"
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
          id: string
          phone_number: string | null
          position: string | null
          role: string
          signature_url: string | null
          updated_at: string | null
          username: string
        }
        Insert: {
          affiliation?: string | null
          created_at?: string
          email?: string | null
          id: string
          phone_number?: string | null
          position?: string | null
          role?: string
          signature_url?: string | null
          updated_at?: string | null
          username: string
        }
        Update: {
          affiliation?: string | null
          created_at?: string
          email?: string | null
          id?: string
          phone_number?: string | null
          position?: string | null
          role?: string
          signature_url?: string | null
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
        Args: { judging_round: string }
        Returns: {
          company_id: number
          judging_round_id: string
          status: string
        }[]
      }
    }
    Enums: {
      judging_round_status: "PENDING" | "IN_PROGRESS" | "COMPLETED"
      mentoring_status: "PENDING" | "IN_PROGRESS" | "COMPLETED"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      judging_round_status: ["PENDING", "IN_PROGRESS", "COMPLETED"],
      mentoring_status: ["PENDING", "IN_PROGRESS", "COMPLETED"],
    },
  },
} as const

