// Authentication service - handles all auth operations

import { supabase } from './supabase';
import { User, LoginCredentials, RegisterCredentials, OAuthProvider } from '@/types/auth.types';

// "Failed to fetch" is the raw browser error thrown when a request never reaches
// the server (offline, DNS failure, unreachable/paused Supabase project, CORS block).
// Replace it with a message that points at the actual problem instead of the credentials.
function toFriendlyAuthError(error: Error): Error {
  if (error.message === 'Failed to fetch') {
    return new Error(
      'Could not reach the server. Check your internet connection, or the Supabase project may be unavailable.'
    );
  }
  return error;
}

// Helper to fetch user profile from users table
async function fetchUserProfile(authUserId: string, authEmail: string, authCreatedAt: string): Promise<User> {
  const { data: profile, error } = await supabase
    .from('users')
    .select('id, email, username, profile_picture_url, is_guest, created_at')
    .eq('id', authUserId)
    .single();

  if (error || !profile) {
    // Fallback if profile doesn't exist yet
    return {
      id: authUserId,
      email: authEmail,
      username: authEmail.split('@')[0],
      isGuest: false,
      createdAt: authCreatedAt,
    };
  }

  return {
    id: profile.id,
    email: profile.email,
    username: profile.username,
    profilePictureUrl: profile.profile_picture_url,
    isGuest: profile.is_guest,
    createdAt: profile.created_at,
  };
}

// Helper to create user profile in users table
async function createUserProfile(
  authUserId: string,
  email: string,
  username: string,
  createdAt: string
): Promise<void> {
  const { error } = await supabase
    .from('users')
    .insert({
      id: authUserId,
      email: email,
      username: username,
      is_guest: false,
      is_private: false,
      created_at: createdAt,
    });

  if (error) {
    // If insert fails due to duplicate, that's okay (user already exists)
    if (error.code !== '23505') {
      throw error;
    }
  }
}

// Helper to ensure user profile exists (for OAuth users)
async function ensureUserProfile(authUserId: string, email: string, createdAt: string): Promise<void> {
  const { data: existing } = await supabase
    .from('users')
    .select('id')
    .eq('id', authUserId)
    .single();

  if (!existing) {
    // Create profile with email prefix as default username
    await createUserProfile(authUserId, email, email.split('@')[0], createdAt);
  }
}

export const authService = {
  // Sign in with email and password
  async signInWithEmail(credentials: LoginCredentials): Promise<User> {
    const { data, error } = await supabase.auth.signInWithPassword(credentials);

    if (error) throw toFriendlyAuthError(error);

    return fetchUserProfile(data.user!.id, data.user!.email!, data.user!.created_at);
  },

  // Register new user
  async register(credentials: RegisterCredentials): Promise<User> {
    const { data, error } = await supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) throw toFriendlyAuthError(error);

    const authUser = data.user!;

    // Create user profile in users table
    await createUserProfile(
      authUser.id,
      authUser.email!,
      credentials.username,
      authUser.created_at
    );

    return {
      id: authUser.id,
      email: authUser.email!,
      username: credentials.username,
      isGuest: false,
      createdAt: authUser.created_at,
    };
  },

  // OAuth sign in
  async signInWithOAuth(provider: OAuthProvider): Promise<void> {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
    });

    if (error) throw error;
  },

  // Handle OAuth callback - call this after OAuth redirect completes
  async handleOAuthCallback(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    // Ensure user profile exists in users table
    await ensureUserProfile(user.id, user.email!, user.created_at);

    return fetchUserProfile(user.id, user.email!, user.created_at);
  },

  // Continue as guest
  async continueAsGuest(): Promise<User> {
    // Create a temporary guest user session
    return {
      id: 'guest-' + Date.now(),
      email: 'guest@puzzles.app',
      username: 'Guest',
      isGuest: true,
      createdAt: new Date().toISOString(),
    };
  },

  // Sign out
  async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Get current user
  async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    return fetchUserProfile(user.id, user.email!, user.created_at);
  },
};