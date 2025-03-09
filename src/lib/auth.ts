import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "./supabase";
import { Session, User } from "@supabase/supabase-js";
import React from "react";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  signIn: (
    email: string,
    password: string,
  ) => Promise<{
    error: Error | null;
    user: User | null;
  }>;
  signUp: (
    email: string,
    password: string,
    name: string,
  ) => Promise<{
    error: Error | null;
    needsEmailConfirmation?: boolean;
  }>;
  signOut: () => Promise<void>;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, name: string) => {
    try {
      // First sign up the user with auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
          // Skip email confirmation for development
          emailRedirectTo: `${window.location.origin}/login`,
        },
      });

      if (error) throw error;

      if (data?.user) {
        // Create user profile in the users table
        const { error: profileError } = await supabase
          .from("users")
          .insert([{ id: data.user.id, email, name }]);

        if (profileError) {
          return { error: new Error(profileError.message) };
        }

        // Auto sign in after signup for development
        if (!data.session) {
          const { error: signInError } = await supabase.auth.signInWithPassword(
            {
              email,
              password,
            },
          );

          if (signInError) {
            console.error("Auto sign-in failed:", signInError);
          }
        }
      }

      // For development, we'll pretend email confirmation is not needed
      return { error: null, needsEmailConfirmation: false };
    } catch (error) {
      return {
        error:
          error instanceof Error
            ? error
            : new Error("An error occurred during sign up"),
      };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      return { error, user: data?.user };
    } catch (error) {
      return {
        error:
          error instanceof Error
            ? error
            : new Error("An error occurred during sign in"),
        user: null,
      };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    session,
    user,
    signIn,
    signUp,
    signOut,
    loading,
  };

  return React.createElement(AuthContext.Provider, { value }, children);
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
