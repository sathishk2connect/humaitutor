import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          auth_id: string;
          name: string;
          email: string;
          role: 'student' | 'tutor' | 'admin';
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          auth_id: string;
          name: string;
          email: string;
          role: 'student' | 'tutor' | 'admin';
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          auth_id?: string;
          name?: string;
          email?: string;
          role?: 'student' | 'tutor' | 'admin';
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      tutors: {
        Row: {
          id: string;
          user_id: string;
          experience_years: number;
          hourly_rate: number;
          rating: number;
          total_sessions: number;
          total_earnings: number;
          bio: string | null;
          is_available: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          experience_years?: number;
          hourly_rate?: number;
          rating?: number;
          total_sessions?: number;
          total_earnings?: number;
          bio?: string | null;
          is_available?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          experience_years?: number;
          hourly_rate?: number;
          rating?: number;
          total_sessions?: number;
          total_earnings?: number;
          bio?: string | null;
          is_available?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      students: {
        Row: {
          id: string;
          user_id: string;
          total_sessions: number;
          hours_learned: number;
          concepts_mastered: number;
          current_streak: number;
          total_xp: number;
          current_level: number;
          learning_style: 'visual' | 'auditory' | 'kinesthetic' | 'mixed' | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          total_sessions?: number;
          hours_learned?: number;
          concepts_mastered?: number;
          current_streak?: number;
          total_xp?: number;
          current_level?: number;
          learning_style?: 'visual' | 'auditory' | 'kinesthetic' | 'mixed' | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          total_sessions?: number;
          hours_learned?: number;
          concepts_mastered?: number;
          current_streak?: number;
          total_xp?: number;
          current_level?: number;
          learning_style?: 'visual' | 'auditory' | 'kinesthetic' | 'mixed' | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      subjects: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          created_at?: string;
        };
      };
      sessions: {
        Row: {
          id: string;
          student_id: string;
          tutor_id: string | null;
          ai_tutor_id: string | null;
          subject_id: string | null;
          type: 'ai' | 'human' | 'hybrid';
          status: 'scheduled' | 'active' | 'completed' | 'cancelled';
          title: string | null;
          duration_minutes: number | null;
          scheduled_at: string | null;
          started_at: string | null;
          ended_at: string | null;
          transcript: string | null;
          video_url: string | null;
          audio_url: string | null;
          whiteboard_data: any | null;
          student_rating: number | null;
          student_feedback: string | null;
          tutor_notes: string | null;
          ai_confidence_avg: number | null;
          amount: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          tutor_id?: string | null;
          ai_tutor_id?: string | null;
          subject_id?: string | null;
          type: 'ai' | 'human' | 'hybrid';
          status?: 'scheduled' | 'active' | 'completed' | 'cancelled';
          title?: string | null;
          duration_minutes?: number | null;
          scheduled_at?: string | null;
          started_at?: string | null;
          ended_at?: string | null;
          transcript?: string | null;
          video_url?: string | null;
          audio_url?: string | null;
          whiteboard_data?: any | null;
          student_rating?: number | null;
          student_feedback?: string | null;
          tutor_notes?: string | null;
          ai_confidence_avg?: number | null;
          amount?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          tutor_id?: string | null;
          ai_tutor_id?: string | null;
          subject_id?: string | null;
          type?: 'ai' | 'human' | 'hybrid';
          status?: 'scheduled' | 'active' | 'completed' | 'cancelled';
          title?: string | null;
          duration_minutes?: number | null;
          scheduled_at?: string | null;
          started_at?: string | null;
          ended_at?: string | null;
          transcript?: string | null;
          video_url?: string | null;
          audio_url?: string | null;
          whiteboard_data?: any | null;
          student_rating?: number | null;
          student_feedback?: string | null;
          tutor_notes?: string | null;
          ai_confidence_avg?: number | null;
          amount?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}