// Authentication-related type definitions

export interface User {
  id: string;
  email: string;
  username: string;
  profilePictureUrl?: string;
  isGuest: boolean;
  createdAt: string;
}

export interface AuthSession {
  user: User | null;
  accessToken: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  username: string;
}

export type OAuthProvider = 'google' | 'apple' | 'github';