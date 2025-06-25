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
      downloads: {
        Row: {
          created_at: string
          download_type: string | null
          file_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          download_type?: string | null
          file_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          download_type?: string | null
          file_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "downloads_file_id_fkey"
            columns: ["file_id"]
            isOneToOne: false
            referencedRelation: "files"
            referencedColumns: ["id"]
          },
        ]
      }
      event_users: {
        Row: {
          created_at: string
          display_name: string | null
          download_permissions: string[] | null
          email: string | null
          event_id: string
          id: string
          last_luma_sync: string | null
          luma_guest_id: string | null
          role: Database["public"]["Enums"]["user_role"]
          role_source: Database["public"]["Enums"]["role_source"] | null
          upload_permissions: string[] | null
          user_id: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          download_permissions?: string[] | null
          email?: string | null
          event_id: string
          id?: string
          last_luma_sync?: string | null
          luma_guest_id?: string | null
          role: Database["public"]["Enums"]["user_role"]
          role_source?: Database["public"]["Enums"]["role_source"] | null
          upload_permissions?: string[] | null
          user_id: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          download_permissions?: string[] | null
          email?: string | null
          event_id?: string
          id?: string
          last_luma_sync?: string | null
          luma_guest_id?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          role_source?: Database["public"]["Enums"]["role_source"] | null
          upload_permissions?: string[] | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_users_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          cover_image_url: string | null
          created_at: string
          description: string | null
          event_date: string | null
          id: string
          last_sync: string | null
          location: string | null
          luma_event_id: string | null
          luma_event_url: string | null
          luma_imported: boolean | null
          name: string
          organizer_id: string
          sync_enabled: boolean | null
          updated_at: string
        }
        Insert: {
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          event_date?: string | null
          id?: string
          last_sync?: string | null
          location?: string | null
          luma_event_id?: string | null
          luma_event_url?: string | null
          luma_imported?: boolean | null
          name: string
          organizer_id: string
          sync_enabled?: boolean | null
          updated_at?: string
        }
        Update: {
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          event_date?: string | null
          id?: string
          last_sync?: string | null
          location?: string | null
          luma_event_id?: string | null
          luma_event_url?: string | null
          luma_imported?: boolean | null
          name?: string
          organizer_id?: string
          sync_enabled?: boolean | null
          updated_at?: string
        }
        Relationships: []
      }
      files: {
        Row: {
          created_at: string
          event_id: string
          file_name: string
          file_size: number
          file_type: Database["public"]["Enums"]["file_type"]
          folder_name: string
          id: string
          metadata: Json | null
          mime_type: string
          storage_path: string
          tags: string[] | null
          thumbnail_path: string | null
          updated_at: string
          upload_completed: boolean | null
          uploader_id: string
        }
        Insert: {
          created_at?: string
          event_id: string
          file_name: string
          file_size: number
          file_type: Database["public"]["Enums"]["file_type"]
          folder_name: string
          id?: string
          metadata?: Json | null
          mime_type: string
          storage_path: string
          tags?: string[] | null
          thumbnail_path?: string | null
          updated_at?: string
          upload_completed?: boolean | null
          uploader_id: string
        }
        Update: {
          created_at?: string
          event_id?: string
          file_name?: string
          file_size?: number
          file_type?: Database["public"]["Enums"]["file_type"]
          folder_name?: string
          id?: string
          metadata?: Json | null
          mime_type?: string
          storage_path?: string
          tags?: string[] | null
          thumbnail_path?: string | null
          updated_at?: string
          upload_completed?: boolean | null
          uploader_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "files_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      luma_api_keys: {
        Row: {
          calendar_name: string | null
          created_at: string
          encrypted_api_key: string
          id: string
          is_active: boolean | null
          last_validated: string | null
          updated_at: string
          user_id: string
          validation_error: string | null
        }
        Insert: {
          calendar_name?: string | null
          created_at?: string
          encrypted_api_key: string
          id?: string
          is_active?: boolean | null
          last_validated?: string | null
          updated_at?: string
          user_id: string
          validation_error?: string | null
        }
        Update: {
          calendar_name?: string | null
          created_at?: string
          encrypted_api_key?: string
          id?: string
          is_active?: boolean | null
          last_validated?: string | null
          updated_at?: string
          user_id?: string
          validation_error?: string | null
        }
        Relationships: []
      }
      luma_api_usage: {
        Row: {
          id: string
          last_request: string
          request_count: number | null
          user_id: string
          window_start: string
        }
        Insert: {
          id?: string
          last_request?: string
          request_count?: number | null
          user_id: string
          window_start?: string
        }
        Update: {
          id?: string
          last_request?: string
          request_count?: number | null
          user_id?: string
          window_start?: string
        }
        Relationships: []
      }
      luma_webhooks: {
        Row: {
          created_at: string
          error_message: string | null
          event_id: string | null
          id: string
          luma_event_id: string
          payload: Json
          processed: boolean | null
          processed_at: string | null
          webhook_type: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          event_id?: string | null
          id?: string
          luma_event_id: string
          payload: Json
          processed?: boolean | null
          processed_at?: string | null
          webhook_type: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          event_id?: string | null
          id?: string
          luma_event_id?: string
          payload?: Json
          processed?: boolean | null
          processed_at?: string | null
          webhook_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "luma_webhooks_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      sync_logs: {
        Row: {
          created_at: string
          error_message: string | null
          event_id: string
          id: string
          records_processed: number | null
          status: Database["public"]["Enums"]["sync_status"]
          sync_type: Database["public"]["Enums"]["sync_type"]
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          event_id: string
          id?: string
          records_processed?: number | null
          status: Database["public"]["Enums"]["sync_status"]
          sync_type: Database["public"]["Enums"]["sync_type"]
        }
        Update: {
          created_at?: string
          error_message?: string | null
          event_id?: string
          id?: string
          records_processed?: number | null
          status?: Database["public"]["Enums"]["sync_status"]
          sync_type?: Database["public"]["Enums"]["sync_type"]
        }
        Relationships: [
          {
            foreignKeyName: "sync_logs_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_access_folder: {
        Args: { event_uuid: string; user_uuid: string; folder: string }
        Returns: boolean
      }
      can_user_modify_role: {
        Args: {
          event_uuid: string
          user_uuid: string
          target_user_uuid: string
        }
        Returns: boolean
      }
      check_luma_rate_limit: {
        Args: { user_uuid: string }
        Returns: boolean
      }
      decrypt_api_key: {
        Args: { encrypted_key: string }
        Returns: string
      }
      encrypt_api_key: {
        Args: { api_key: string }
        Returns: string
      }
      get_user_role_in_event: {
        Args: { event_uuid: string; user_uuid: string }
        Returns: Database["public"]["Enums"]["user_role"]
      }
    }
    Enums: {
      file_type: "image" | "video" | "document"
      role_source: "manual" | "luma_auto" | "luma_manual"
      sync_status: "success" | "error" | "partial"
      sync_type: "guests" | "event_details" | "full"
      user_role: "organizer" | "speaker" | "sponsor" | "volunteer" | "attendee"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      file_type: ["image", "video", "document"],
      role_source: ["manual", "luma_auto", "luma_manual"],
      sync_status: ["success", "error", "partial"],
      sync_type: ["guests", "event_details", "full"],
      user_role: ["organizer", "speaker", "sponsor", "volunteer", "attendee"],
    },
  },
} as const
