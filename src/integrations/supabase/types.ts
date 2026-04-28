export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      analytics_events: {
        Row: {
          category_slug: string | null
          cta_destination: string | null
          cta_location: string | null
          form_id: string | null
          id: string
          name: string
          occurred_at: string
          props: Json
        }
        Insert: {
          category_slug?: string | null
          cta_destination?: string | null
          cta_location?: string | null
          form_id?: string | null
          id?: string
          name: string
          occurred_at?: string
          props?: Json
        }
        Update: {
          category_slug?: string | null
          cta_destination?: string | null
          cta_location?: string | null
          form_id?: string | null
          id?: string
          name?: string
          occurred_at?: string
          props?: Json
        }
        Relationships: []
      }
      email_leads: {
        Row: {
          consent: boolean
          created_at: string
          email: string
          id: string
          source_path: string | null
          source_section: string | null
          surface: string
          track: string
          user_agent: string | null
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          consent?: boolean
          created_at?: string
          email: string
          id?: string
          source_path?: string | null
          source_section?: string | null
          surface: string
          track: string
          user_agent?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          consent?: boolean
          created_at?: string
          email?: string
          id?: string
          source_path?: string | null
          source_section?: string | null
          surface?: string
          track?: string
          user_agent?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Relationships: []
      }
      meditations: {
        Row: {
          audio_url: string
          created_at: string
          duration_seconds: number | null
          elfsight_app_id: string | null
          id: string
          original_audio_url: string | null
          portrait_url: string | null
          rehosted: boolean
          slug: string
          speaker: string | null
          title: string
          updated_at: string
        }
        Insert: {
          audio_url: string
          created_at?: string
          duration_seconds?: number | null
          elfsight_app_id?: string | null
          id?: string
          original_audio_url?: string | null
          portrait_url?: string | null
          rehosted?: boolean
          slug: string
          speaker?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          audio_url?: string
          created_at?: string
          duration_seconds?: number | null
          elfsight_app_id?: string | null
          id?: string
          original_audio_url?: string | null
          portrait_url?: string | null
          rehosted?: boolean
          slug?: string
          speaker?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      rehosted_images: {
        Row: {
          byte_size: number | null
          content_type: string | null
          created_at: string
          id: string
          original_url: string
          public_url: string
          storage_path: string
        }
        Insert: {
          byte_size?: number | null
          content_type?: string | null
          created_at?: string
          id?: string
          original_url: string
          public_url: string
          storage_path: string
        }
        Update: {
          byte_size?: number | null
          content_type?: string | null
          created_at?: string
          id?: string
          original_url?: string
          public_url?: string
          storage_path?: string
        }
        Relationships: []
      }
      seo_snapshot_runs: {
        Row: {
          base_url: string
          error_count: number
          finished_at: string | null
          id: string
          notes: string | null
          ok_count: number
          regression_count: number
          started_at: string
          url_count: number
        }
        Insert: {
          base_url: string
          error_count?: number
          finished_at?: string | null
          id?: string
          notes?: string | null
          ok_count?: number
          regression_count?: number
          started_at?: string
          url_count?: number
        }
        Update: {
          base_url?: string
          error_count?: number
          finished_at?: string | null
          id?: string
          notes?: string | null
          ok_count?: number
          regression_count?: number
          started_at?: string
          url_count?: number
        }
        Relationships: []
      }
      seo_snapshots: {
        Row: {
          canonical: string | null
          content_length: number | null
          error: string | null
          fetch_ms: number | null
          fetched_at: string
          http_status: number | null
          id: string
          meta_description: string | null
          path: string
          run_id: string
          title: string | null
          url: string
        }
        Insert: {
          canonical?: string | null
          content_length?: number | null
          error?: string | null
          fetch_ms?: number | null
          fetched_at?: string
          http_status?: number | null
          id?: string
          meta_description?: string | null
          path: string
          run_id: string
          title?: string | null
          url: string
        }
        Update: {
          canonical?: string | null
          content_length?: number | null
          error?: string | null
          fetch_ms?: number | null
          fetched_at?: string
          http_status?: number | null
          id?: string
          meta_description?: string | null
          path?: string
          run_id?: string
          title?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "seo_snapshots_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "seo_snapshot_runs"
            referencedColumns: ["id"]
          },
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
    Enums: {},
  },
} as const
