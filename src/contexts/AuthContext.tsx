import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabaseService } from '../services/supabaseService';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'tutor' | 'admin';
  avatar?: string;
  createdAt: Date;
}

interface AuthContextType {
  user: User | null;
  supabaseUser: SupabaseUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string, role: User['role']) => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const result = await supabaseService.getCurrentUser();
      if (result) {
        setSupabaseUser(result.user);
        setUser({
          id: result.profile.id,
          name: result.profile.name,
          email: result.profile.email,
          role: result.profile.role,
          avatar: result.profile.avatar_url || undefined,
          createdAt: new Date(result.profile.created_at)
        });
      }
    } catch (error) {
      console.error('Error checking user:', error);
      // Clear auth state when session validation fails
      setUser(null);
      setSupabaseUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const result = await supabaseService.signIn(email, password);
      setSupabaseUser(result.user);
      setUser({
        id: result.profile.id,
        name: result.profile.name,
        email: result.profile.email,
        role: result.profile.role,
        avatar: result.profile.avatar_url || undefined,
        createdAt: new Date(result.profile.created_at)
      });
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabaseService.signOut();
      setUser(null);
      setSupabaseUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const register = async (name: string, email: string, password: string, role: User['role']) => {
    setIsLoading(true);
    try {
      const result = await supabaseService.signUp(email, password, { name, role });
      setSupabaseUser(result.user);
      setUser({
        id: result.profile.id,
        name: result.profile.name,
        email: result.profile.email,
        role: result.profile.role,
        avatar: result.profile.avatar_url || undefined,
        createdAt: new Date(result.profile.created_at)
      });
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, supabaseUser, login, logout, register, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}