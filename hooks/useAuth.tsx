// Authentication hook - manages auth state

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { supabase } from '@/services/supabase';
import { authService } from '@/services/auth.service';
import { composerService } from '@/services/composer.service';
import { User } from '@/types/auth.types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signOut: () => Promise<void>;
  continueAsGuest: () => Promise<void>;
  becomeComposer: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();

    // Listen for auth state changes (handles OAuth callbacks)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          // User signed in (including OAuth), ensure profile exists and load it
          const appUser = await authService.handleOAuthCallback();
          setUser(appUser);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Load user error:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    const user = await authService.signInWithEmail({ email, password });
    setUser(user);
  };

  const signUp = async (email: string, password: string, username: string) => {
    const user = await authService.register({ email, password, username });
    setUser(user);
  };

  const signOut = async () => {
    await authService.signOut();
    setUser(null);
  };

  const continueAsGuest = async () => {
    const guestUser = await authService.continueAsGuest();
    setUser(guestUser);
  };

  const becomeComposer = async () => {
    if (!user || user.isGuest) {
      throw new Error('Must be signed in to become a composer');
    }
    await composerService.becomeComposer(user.id);
    setUser({ ...user, isComposer: true });
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, continueAsGuest, becomeComposer }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};