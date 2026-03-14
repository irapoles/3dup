export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: "admin" | "freelancer";
          name: string;
          email: string;
          phone: string | null;
          website: string | null;
          price: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          role?: "admin" | "freelancer";
          name?: string;
          email?: string;
          phone?: string | null;
          website?: string | null;
          price?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          role?: "admin" | "freelancer";
          name?: string;
          email?: string;
          phone?: string | null;
          website?: string | null;
          price?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      projects: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          created_by?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "projects_created_by_fkey";
            columns: ["created_by"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      project_assets: {
        Row: {
          id: string;
          project_id: string;
          file_url: string;
          file_name: string;
          file_size: number | null;
          asset_type: "logo" | "image" | "video";
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          file_url: string;
          file_name: string;
          file_size?: number | null;
          asset_type: "logo" | "image" | "video";
          created_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          file_url?: string;
          file_name?: string;
          file_size?: number | null;
          asset_type?: "logo" | "image" | "video";
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "project_assets_project_id_fkey";
            columns: ["project_id"];
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
        ];
      };
      apartments: {
        Row: {
          id: string;
          project_id: string;
          name: string;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          name: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          name?: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "apartments_project_id_fkey";
            columns: ["project_id"];
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
        ];
      };
      apartment_assets: {
        Row: {
          id: string;
          apartment_id: string;
          file_url: string;
          file_name: string;
          file_size: number | null;
          asset_type: "blueprint" | "moodboard_t1" | "moodboard_t2" | "moodboard_t3";
          created_at: string;
        };
        Insert: {
          id?: string;
          apartment_id: string;
          file_url: string;
          file_name: string;
          file_size?: number | null;
          asset_type: "blueprint" | "moodboard_t1" | "moodboard_t2" | "moodboard_t3";
          created_at?: string;
        };
        Update: {
          id?: string;
          apartment_id?: string;
          file_url?: string;
          file_name?: string;
          file_size?: number | null;
          asset_type?: "blueprint" | "moodboard_t1" | "moodboard_t2" | "moodboard_t3";
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "apartment_assets_apartment_id_fkey";
            columns: ["apartment_id"];
            referencedRelation: "apartments";
            referencedColumns: ["id"];
          },
        ];
      };
      rooms: {
        Row: {
          id: string;
          apartment_id: string;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          apartment_id: string;
          name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          apartment_id?: string;
          name?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "rooms_apartment_id_fkey";
            columns: ["apartment_id"];
            referencedRelation: "apartments";
            referencedColumns: ["id"];
          },
        ];
      };
      room_assets: {
        Row: {
          id: string;
          room_id: string;
          file_url: string;
          file_name: string;
          file_size: number | null;
          asset_type: "render_t1" | "render_t2" | "render_t3";
          uploaded_by: string | null;
          status: "pending" | "approved" | "rejected";
          created_at: string;
        };
        Insert: {
          id?: string;
          room_id: string;
          file_url: string;
          file_name: string;
          file_size?: number | null;
          asset_type: "render_t1" | "render_t2" | "render_t3";
          uploaded_by?: string | null;
          status?: "pending" | "approved" | "rejected";
          created_at?: string;
        };
        Update: {
          id?: string;
          room_id?: string;
          file_url?: string;
          file_name?: string;
          file_size?: number | null;
          asset_type?: "render_t1" | "render_t2" | "render_t3";
          uploaded_by?: string | null;
          status?: "pending" | "approved" | "rejected";
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "room_assets_room_id_fkey";
            columns: ["room_id"];
            referencedRelation: "rooms";
            referencedColumns: ["id"];
          },
        ];
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          title: string;
          body: string | null;
          link: string | null;
          read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: string;
          title: string;
          body?: string | null;
          link?: string | null;
          read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: string;
          title?: string;
          body?: string | null;
          link?: string | null;
          read?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      project_freelancers: {
        Row: {
          id: string;
          project_id: string;
          freelancer_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          freelancer_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          freelancer_id?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "project_freelancers_project_id_fkey";
            columns: ["project_id"];
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];
export type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

export type Project = Database["public"]["Tables"]["projects"]["Row"];
export type ProjectInsert = Database["public"]["Tables"]["projects"]["Insert"];
export type ProjectUpdate = Database["public"]["Tables"]["projects"]["Update"];

export type ProjectAsset = Database["public"]["Tables"]["project_assets"]["Row"];
export type ProjectAssetInsert = Database["public"]["Tables"]["project_assets"]["Insert"];

export type Apartment = Database["public"]["Tables"]["apartments"]["Row"];
export type ApartmentInsert = Database["public"]["Tables"]["apartments"]["Insert"];
export type ApartmentUpdate = Database["public"]["Tables"]["apartments"]["Update"];

export type ApartmentAsset = Database["public"]["Tables"]["apartment_assets"]["Row"];
export type ApartmentAssetInsert = Database["public"]["Tables"]["apartment_assets"]["Insert"];

export type Room = Database["public"]["Tables"]["rooms"]["Row"];
export type RoomInsert = Database["public"]["Tables"]["rooms"]["Insert"];

export type RoomAsset = Database["public"]["Tables"]["room_assets"]["Row"];
export type RoomAssetInsert = Database["public"]["Tables"]["room_assets"]["Insert"];

export type Notification = Database["public"]["Tables"]["notifications"]["Row"];
