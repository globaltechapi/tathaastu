import { createContext, useContext, useEffect, useState } from "react";
import { query } from "./mysql";
import bcrypt from 'bcryptjs';
import React from 'react';

type User = {
  id: string;
  email: string;
  name: string;
  is_super_admin: boolean;
  is_ambassador: boolean;
  created_at: string;
  user_metadata?: {
    name?: string;
  };
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for session in localStorage
    const checkSession = async () => {
      try {
        const session = localStorage.getItem('user_session');
        if (session) {
          const userData = JSON.parse(session);
          setUser(userData);
        }
      } catch (error) {
        console.error('Session check error:', error);
        localStorage.removeItem('user_session');
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      // Query the database for the user
      const { data, error } = await query(
        'SELECT id, email, name, password_hash, is_super_admin, is_ambassador, created_at FROM users WHERE email = ?',
        [email]
      );

      if (error || !data || (data as any[]).length === 0) {
        return { error: { message: 'Invalid login credentials' } };
      }

      const user = (data as any[])[0];
      
      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password_hash);
      if (!isValidPassword) {
        return { error: { message: 'Invalid login credentials' } };
      }

      // Create user object without password
      const { password_hash, ...userWithoutPassword } = user;
      const userObject = {
        ...userWithoutPassword,
        user_metadata: { name: user.name }
      };

      // Save to state and localStorage
      setUser(userObject);
      localStorage.setItem('user_session', JSON.stringify(userObject));

      return { error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      return { error: { message: 'An error occurred during sign in' } };
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      // Check if user already exists
      const { data: existingUser } = await query(
        'SELECT id FROM users WHERE email = ?',
        [email]
      );

      if ((existingUser as any[]).length > 0) {
        return { error: { message: 'User with this email already exists' } };
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Generate UUID for user ID
      const userId = crypto.randomUUID();

      // Insert new user
      const { error } = await query(
        'INSERT INTO users (id, email, name, password_hash, is_super_admin, is_ambassador, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [userId, email, name, hashedPassword, false, false, new Date().toISOString()]
      );

      if (error) {
        return { error: { message: 'Failed to create user account' } };
      }

      // Create user object
      const newUser = {
        id: userId,
        email,
        name,
        is_super_admin: false,
        is_ambassador: false,
        created_at: new Date().toISOString(),
        user_metadata: { name }
      };

      // Save to state and localStorage
      setUser(newUser);
      localStorage.setItem('user_session', JSON.stringify(newUser));

      return { error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      return { error: { message: 'An error occurred during sign up' } };
    }
  };

  const signOut = async () => {
    localStorage.removeItem('user_session');
    setUser(null);
  };

  const contextValue = { user, loading, signIn, signUp, signOut };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
