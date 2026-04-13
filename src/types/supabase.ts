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
      profiles: {
        Row: {
          id: string
          name: string
          email: string
          role: 'admin' | 'member' | 'client'
          avatar_url: string | null
          timezone: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          email: string
          role?: 'admin' | 'member' | 'client'
          avatar_url?: string | null
          timezone?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          role?: 'admin' | 'member' | 'client'
          avatar_url?: string | null
          timezone?: string
          created_at?: string
          updated_at?: string
        }
      }
      clients: {
        Row: {
          id: string
          name: string
          company: string
          email: string
          phone: string | null
          avatar_url: string | null
          status: 'active' | 'inactive'
          internal_notes: string | null
          portal_slug: string
          portal_welcome_msg: string | null
          portal_sections: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          company: string
          email: string
          phone?: string | null
          avatar_url?: string | null
          status?: 'active' | 'inactive'
          internal_notes?: string | null
          portal_slug: string
          portal_welcome_msg?: string | null
          portal_sections?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          company?: string
          email?: string
          phone?: string | null
          avatar_url?: string | null
          status?: 'active' | 'inactive'
          internal_notes?: string | null
          portal_slug?: string
          portal_welcome_msg?: string | null
          portal_sections?: Json
          created_at?: string
          updated_at?: string
        }
      }
      client_users: {
        Row: {
          id: string
          client_id: string
          profile_id: string
          created_at: string
        }
        Insert: {
          id?: string
          client_id: string
          profile_id: string
          created_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          profile_id?: string
          created_at?: string
        }
      }
      invoices: {
        Row: {
          id: string
          client_id: string
          invoice_number: string
          issue_date: string
          due_date: string
          currency: string
          line_items: Json
          subtotal: number
          tax_total: number
          total: number
          status: 'draft' | 'sent' | 'paid' | 'overdue'
          notes: string | null
          recurring_interval: 'weekly' | 'monthly' | 'quarterly' | 'yearly' | null
          next_due_date: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id: string
          invoice_number: string
          issue_date: string
          due_date: string
          currency?: string
          line_items?: Json
          subtotal?: number
          tax_total?: number
          total?: number
          status?: 'draft' | 'sent' | 'paid' | 'overdue'
          notes?: string | null
          recurring_interval?: 'weekly' | 'monthly' | 'quarterly' | 'yearly' | null
          next_due_date?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          invoice_number?: string
          issue_date?: string
          due_date?: string
          currency?: string
          line_items?: Json
          subtotal?: number
          tax_total?: number
          total?: number
          status?: 'draft' | 'sent' | 'paid' | 'overdue'
          notes?: string | null
          recurring_interval?: 'weekly' | 'monthly' | 'quarterly' | 'yearly' | null
          next_due_date?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      flows: {
        Row: {
          id: string
          title: string
          client_id: string | null
          status: string | null
          column_order: Json
          share_with_client: boolean
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          client_id?: string | null
          status?: string | null
          column_order?: Json
          share_with_client?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          client_id?: string | null
          status?: string | null
          column_order?: Json
          share_with_client?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      flow_columns: {
        Row: {
          id: string
          flow_id: string
          title: string
          position: number
          created_at: string
        }
        Insert: {
          id?: string
          flow_id: string
          title: string
          position?: number
          created_at?: string
        }
        Update: {
          id?: string
          flow_id?: string
          title?: string
          position?: number
          created_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          flow_id: string | null
          column_id: string | null
          workspace_level: boolean
          title: string
          description: Json | null
          priority: 'low' | 'medium' | 'high' | 'urgent'
          status: string
          due_date: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          flow_id?: string | null
          column_id?: string | null
          workspace_level?: boolean
          title: string
          description?: Json | null
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          status?: string
          due_date?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          flow_id?: string | null
          column_id?: string | null
          workspace_level?: boolean
          title?: string
          description?: Json | null
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          status?: string
          due_date?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      task_assignees: {
        Row: {
          task_id: string
          user_id: string
        }
        Insert: {
          task_id: string
          user_id: string
        }
        Update: {
          task_id?: string
          user_id?: string
        }
      }
      task_comments: {
        Row: {
          id: string
          task_id: string
          author_id: string
          body: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          task_id: string
          author_id: string
          body: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          task_id?: string
          author_id?: string
          body?: string
          created_at?: string
          updated_at?: string
        }
      }
      task_attachments: {
        Row: {
          id: string
          task_id: string
          file_url: string
          file_name: string
          uploaded_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          task_id: string
          file_url: string
          file_name: string
          uploaded_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          task_id?: string
          file_url?: string
          file_name?: string
          uploaded_by?: string | null
          created_at?: string
        }
      }
      subtasks: {
        Row: {
          id: string
          parent_task_id: string
          title: string
          is_done: boolean
          created_at: string
        }
        Insert: {
          id?: string
          parent_task_id: string
          title: string
          is_done?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          parent_task_id?: string
          title?: string
          is_done?: boolean
          created_at?: string
        }
      }
      leads: {
        Row: {
          id: string
          name: string
          company: string
          email: string | null
          phone: string | null
          source: string | null
          deal_value: number | null
          currency: string
          stage: string
          assigned_to: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          company: string
          email?: string | null
          phone?: string | null
          source?: string | null
          deal_value?: number | null
          currency?: string
          stage?: string
          assigned_to?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          company?: string
          email?: string | null
          phone?: string | null
          source?: string | null
          deal_value?: number | null
          currency?: string
          stage?: string
          assigned_to?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      lead_notes: {
        Row: {
          id: string
          lead_id: string
          author_id: string
          body: string
          created_at: string
        }
        Insert: {
          id?: string
          lead_id: string
          author_id: string
          body: string
          created_at?: string
        }
        Update: {
          id?: string
          lead_id?: string
          author_id?: string
          body?: string
          created_at?: string
        }
      }
      channels: {
        Row: {
          id: string
          type: 'team' | 'client' | 'dm' | 'group'
          name: string
          client_id: string | null
          created_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          type: 'team' | 'client' | 'dm' | 'group'
          name: string
          client_id?: string | null
          created_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          type?: 'team' | 'client' | 'dm' | 'group'
          name?: string
          client_id?: string | null
          created_by?: string | null
          created_at?: string
        }
      }
      channel_members: {
        Row: {
          channel_id: string
          user_id: string
        }
        Insert: {
          channel_id: string
          user_id: string
        }
        Update: {
          channel_id?: string
          user_id?: string
        }
      }
      messages: {
        Row: {
          id: string
          channel_id: string
          sender_id: string
          body: string
          attachments: Json
          created_at: string
          edited_at: string | null
        }
        Insert: {
          id?: string
          channel_id: string
          sender_id: string
          body: string
          attachments?: Json
          created_at?: string
          edited_at?: string | null
        }
        Update: {
          id?: string
          channel_id?: string
          sender_id?: string
          body?: string
          attachments?: Json
          created_at?: string
          edited_at?: string | null
        }
      }
      message_reactions: {
        Row: {
          id: string
          message_id: string
          user_id: string
          emoji: string
        }
        Insert: {
          id?: string
          message_id: string
          user_id: string
          emoji: string
        }
        Update: {
          id?: string
          message_id?: string
          user_id?: string
          emoji?: string
        }
      }
      brain_pages: {
        Row: {
          id: string
          title: string
          content: Json
          parent_id: string | null
          position: number
          is_shared_all: boolean
          created_by: string | null
          updated_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          content?: Json
          parent_id?: string | null
          position?: number
          is_shared_all?: boolean
          created_by?: string | null
          updated_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: Json
          parent_id?: string | null
          position?: number
          is_shared_all?: boolean
          created_by?: string | null
          updated_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      brain_page_clients: {
        Row: {
          page_id: string
          client_id: string
        }
        Insert: {
          page_id: string
          client_id: string
        }
        Update: {
          page_id?: string
          client_id?: string
        }
      }
      documents: {
        Row: {
          id: string
          title: string
          type: 'proposal' | 'contract'
          client_id: string | null
          content: Json
          status: string | null
          signed_at: string | null
          signer_name: string | null
          signer_ip: string | null
          public_token: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          type: 'proposal' | 'contract'
          client_id?: string | null
          content?: Json
          status?: string | null
          signed_at?: string | null
          signer_name?: string | null
          signer_ip?: string | null
          public_token?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          type?: 'proposal' | 'contract'
          client_id?: string | null
          content?: Json
          status?: string | null
          signed_at?: string | null
          signer_name?: string | null
          signer_ip?: string | null
          public_token?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      meeting_types: {
        Row: {
          id: string
          title: string
          duration_minutes: number
          location: string | null
          description: string | null
          is_active: boolean
          booking_slug: string
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          duration_minutes: number
          location?: string | null
          description?: string | null
          is_active?: boolean
          booking_slug: string
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          duration_minutes?: number
          location?: string | null
          description?: string | null
          is_active?: boolean
          booking_slug?: string
          created_at?: string
        }
      }
      availability_rules: {
        Row: {
          id: string
          day_of_week: number
          start_time: string
          end_time: string
          created_at: string
        }
        Insert: {
          id?: string
          day_of_week: number
          start_time: string
          end_time: string
          created_at?: string
        }
        Update: {
          id?: string
          day_of_week?: number
          start_time?: string
          end_time?: string
          created_at?: string
        }
      }
      availability_blocks: {
        Row: {
          id: string
          blocked_date: string
          reason: string | null
          created_at: string
        }
        Insert: {
          id?: string
          blocked_date: string
          reason?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          blocked_date?: string
          reason?: string | null
          created_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          meeting_type_id: string
          booker_name: string
          booker_email: string
          booker_message: string | null
          start_time: string
          end_time: string
          status: 'confirmed' | 'cancelled'
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          meeting_type_id: string
          booker_name: string
          booker_email: string
          booker_message?: string | null
          start_time: string
          end_time: string
          status?: 'confirmed' | 'cancelled'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          meeting_type_id?: string
          booker_name?: string
          booker_email?: string
          booker_message?: string | null
          start_time?: string
          end_time?: string
          status?: 'confirmed' | 'cancelled'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      files: {
        Row: {
          id: string
          client_id: string | null
          uploaded_by: string | null
          file_name: string
          file_url: string
          file_size: number | null
          mime_type: string | null
          created_at: string
        }
        Insert: {
          id?: string
          client_id?: string | null
          uploaded_by?: string | null
          file_name: string
          file_url: string
          file_size?: number | null
          mime_type?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          client_id?: string | null
          uploaded_by?: string | null
          file_name?: string
          file_url?: string
          file_size?: number | null
          mime_type?: string | null
          created_at?: string
        }
      }
      client_links: {
        Row: {
          id: string
          client_id: string
          title: string
          url: string
          icon: string | null
          position: number
          created_at: string
        }
        Insert: {
          id?: string
          client_id: string
          title: string
          url: string
          icon?: string | null
          position?: number
          created_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          title?: string
          url?: string
          icon?: string | null
          position?: number
          created_at?: string
        }
      }
      agency_settings: {
        Row: {
          id: string
          agency_name: string
          tagline: string | null
          logo_url: string | null
          brand_color: string
          address: string | null
          email_notifications: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          agency_name?: string
          tagline?: string | null
          logo_url?: string | null
          brand_color?: string
          address?: string | null
          email_notifications?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          agency_name?: string
          tagline?: string | null
          logo_url?: string | null
          brand_color?: string
          address?: string | null
          email_notifications?: Json
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'admin' | 'member' | 'client'
      invoice_status: 'draft' | 'sent' | 'paid' | 'overdue'
      channel_type: 'team' | 'client' | 'dm' | 'group'
      task_priority: 'low' | 'medium' | 'high' | 'urgent'
      document_type: 'proposal' | 'contract'
      booking_status: 'confirmed' | 'cancelled'
    }
  }
}
