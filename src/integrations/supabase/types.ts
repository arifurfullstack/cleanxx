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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      addresses: {
        Row: {
          city: string
          country: string
          created_at: string
          id: string
          is_default: boolean
          label: string
          postal_code: string
          province: string
          street_address: string
          updated_at: string
          user_id: string
        }
        Insert: {
          city: string
          country?: string
          created_at?: string
          id?: string
          is_default?: boolean
          label?: string
          postal_code: string
          province: string
          street_address: string
          updated_at?: string
          user_id: string
        }
        Update: {
          city?: string
          country?: string
          created_at?: string
          id?: string
          is_default?: boolean
          label?: string
          postal_code?: string
          province?: string
          street_address?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          address_id: string | null
          cleaner_id: string | null
          cleaner_name: string | null
          created_at: string
          customer_id: string
          duration_hours: number
          id: string
          scheduled_date: string
          scheduled_time: string
          service_price: number
          service_type: string
          special_instructions: string | null
          status: Database["public"]["Enums"]["booking_status"]
          updated_at: string
        }
        Insert: {
          address_id?: string | null
          cleaner_id?: string | null
          cleaner_name?: string | null
          created_at?: string
          customer_id: string
          duration_hours?: number
          id?: string
          scheduled_date: string
          scheduled_time: string
          service_price: number
          service_type: string
          special_instructions?: string | null
          status?: Database["public"]["Enums"]["booking_status"]
          updated_at?: string
        }
        Update: {
          address_id?: string | null
          cleaner_id?: string | null
          cleaner_name?: string | null
          created_at?: string
          customer_id?: string
          duration_hours?: number
          id?: string
          scheduled_date?: string
          scheduled_time?: string
          service_price?: number
          service_type?: string
          special_instructions?: string | null
          status?: Database["public"]["Enums"]["booking_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_address_id_fkey"
            columns: ["address_id"]
            isOneToOne: false
            referencedRelation: "addresses"
            referencedColumns: ["id"]
          },
        ]
      }
      cleaner_profiles: {
        Row: {
          bio: string | null
          business_name: string
          created_at: string
          gallery_images: string[] | null
          hourly_rate: number
          id: string
          instant_booking: boolean
          is_active: boolean
          is_verified: boolean
          profile_image: string | null
          response_time: string | null
          service_areas: string[]
          services: string[]
          updated_at: string
          user_id: string
          years_experience: number | null
        }
        Insert: {
          bio?: string | null
          business_name: string
          created_at?: string
          gallery_images?: string[] | null
          hourly_rate?: number
          id?: string
          instant_booking?: boolean
          is_active?: boolean
          is_verified?: boolean
          profile_image?: string | null
          response_time?: string | null
          service_areas?: string[]
          services?: string[]
          updated_at?: string
          user_id: string
          years_experience?: number | null
        }
        Update: {
          bio?: string | null
          business_name?: string
          created_at?: string
          gallery_images?: string[] | null
          hourly_rate?: number
          id?: string
          instant_booking?: boolean
          is_active?: boolean
          is_verified?: boolean
          profile_image?: string | null
          response_time?: string | null
          service_areas?: string[]
          services?: string[]
          updated_at?: string
          user_id?: string
          years_experience?: number | null
        }
        Relationships: []
      }
      platform_settings: {
        Row: {
          advance_booking_days: number
          allow_instant_booking: boolean
          auto_approve_cleaners: boolean
          cancellation_window_hours: number
          default_currency: string
          id: string
          maintenance_mode: boolean
          max_booking_hours: number
          max_hourly_rate: number
          min_booking_hours: number
          min_hourly_rate: number
          notify_cleaner_applications: boolean
          notify_new_bookings: boolean
          notify_new_users: boolean
          platform_commission_rate: number
          platform_name: string
          privacy_url: string | null
          require_2fa_admins: boolean
          require_cleaner_verification: boolean
          require_email_verification: boolean
          site_tagline: string | null
          support_email: string | null
          terms_url: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          advance_booking_days?: number
          allow_instant_booking?: boolean
          auto_approve_cleaners?: boolean
          cancellation_window_hours?: number
          default_currency?: string
          id?: string
          maintenance_mode?: boolean
          max_booking_hours?: number
          max_hourly_rate?: number
          min_booking_hours?: number
          min_hourly_rate?: number
          notify_cleaner_applications?: boolean
          notify_new_bookings?: boolean
          notify_new_users?: boolean
          platform_commission_rate?: number
          platform_name?: string
          privacy_url?: string | null
          require_2fa_admins?: boolean
          require_cleaner_verification?: boolean
          require_email_verification?: boolean
          site_tagline?: string | null
          support_email?: string | null
          terms_url?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          advance_booking_days?: number
          allow_instant_booking?: boolean
          auto_approve_cleaners?: boolean
          cancellation_window_hours?: number
          default_currency?: string
          id?: string
          maintenance_mode?: boolean
          max_booking_hours?: number
          max_hourly_rate?: number
          min_booking_hours?: number
          min_hourly_rate?: number
          notify_cleaner_applications?: boolean
          notify_new_bookings?: boolean
          notify_new_users?: boolean
          platform_commission_rate?: number
          platform_name?: string
          privacy_url?: string | null
          require_2fa_admins?: boolean
          require_cleaner_verification?: boolean
          require_email_verification?: boolean
          site_tagline?: string | null
          support_email?: string | null
          terms_url?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "customer" | "cleaner" | "company" | "admin"
      booking_status:
        | "pending"
        | "confirmed"
        | "in_progress"
        | "completed"
        | "cancelled"
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
      app_role: ["customer", "cleaner", "company", "admin"],
      booking_status: [
        "pending",
        "confirmed",
        "in_progress",
        "completed",
        "cancelled",
      ],
    },
  },
} as const
