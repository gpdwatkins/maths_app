// Comprehensive tests for auth service

import { authService } from '@/services/auth.service';
import { supabase } from '@/services/supabase';

// Mock Supabase
jest.mock('@/services/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
      getUser: jest.fn(),
      signInWithOAuth: jest.fn(),
      onAuthStateChange: jest.fn(() => ({
        data: { subscription: { unsubscribe: jest.fn() } },
      })),
    },
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(),
        })),
      })),
      insert: jest.fn(),
    })),
  },
}));

describe('Comprehensive: authService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('signInWithEmail', () => {
    it('calls supabase signInWithPassword with credentials', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        created_at: '2024-01-01T00:00:00Z',
      };

      (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: {
                id: 'user-123',
                email: 'test@example.com',
                username: 'testuser',
                profile_picture_url: null,
                is_guest: false,
                created_at: '2024-01-01T00:00:00Z',
              },
              error: null,
            }),
          }),
        }),
      });

      await authService.signInWithEmail({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    it('throws error when sign in fails', async () => {
      (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
        data: { user: null },
        error: new Error('Invalid credentials'),
      });

      await expect(
        authService.signInWithEmail({
          email: 'test@example.com',
          password: 'wrongpassword',
        })
      ).rejects.toThrow('Invalid credentials');
    });
  });

  describe('register', () => {
    it('calls supabase signUp with credentials', async () => {
      const mockUser = {
        id: 'new-user-123',
        email: 'new@example.com',
        created_at: '2024-01-01T00:00:00Z',
      };

      (supabase.auth.signUp as jest.Mock).mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      (supabase.from as jest.Mock).mockReturnValue({
        insert: jest.fn().mockResolvedValue({ error: null }),
      });

      const result = await authService.register({
        email: 'new@example.com',
        password: 'password123',
        username: 'newuser',
      });

      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: 'new@example.com',
        password: 'password123',
      });

      expect(result.email).toBe('new@example.com');
      expect(result.username).toBe('newuser');
    });

    it('throws error when registration fails', async () => {
      (supabase.auth.signUp as jest.Mock).mockResolvedValue({
        data: { user: null },
        error: new Error('Email already exists'),
      });

      await expect(
        authService.register({
          email: 'existing@example.com',
          password: 'password123',
          username: 'user',
        })
      ).rejects.toThrow('Email already exists');
    });
  });

  describe('signOut', () => {
    it('calls supabase signOut', async () => {
      (supabase.auth.signOut as jest.Mock).mockResolvedValue({ error: null });

      await authService.signOut();

      expect(supabase.auth.signOut).toHaveBeenCalled();
    });

    it('throws error when sign out fails', async () => {
      (supabase.auth.signOut as jest.Mock).mockResolvedValue({
        error: new Error('Sign out failed'),
      });

      await expect(authService.signOut()).rejects.toThrow('Sign out failed');
    });
  });

  describe('getCurrentUser', () => {
    it('returns user when logged in', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        created_at: '2024-01-01T00:00:00Z',
      };

      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: mockUser },
      });

      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: {
                id: 'user-123',
                email: 'test@example.com',
                username: 'testuser',
                profile_picture_url: 'https://example.com/pic.jpg',
                is_guest: false,
                created_at: '2024-01-01T00:00:00Z',
              },
              error: null,
            }),
          }),
        }),
      });

      const result = await authService.getCurrentUser();

      expect(result).toBeTruthy();
      expect(result?.email).toBe('test@example.com');
    });

    it('returns null when not logged in', async () => {
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: null },
      });

      const result = await authService.getCurrentUser();

      expect(result).toBeNull();
    });
  });

  describe('continueAsGuest', () => {
    it('returns guest user object', async () => {
      const result = await authService.continueAsGuest();

      expect(result.isGuest).toBe(true);
      expect(result.username).toBe('Guest');
      expect(result.email).toBe('guest@puzzles.app');
      expect(result.id).toMatch(/^guest-/);
    });
  });

  describe('signInWithOAuth', () => {
    it('calls supabase signInWithOAuth with provider', async () => {
      (supabase.auth.signInWithOAuth as jest.Mock).mockResolvedValue({
        error: null,
      });

      await authService.signInWithOAuth('google');

      expect(supabase.auth.signInWithOAuth).toHaveBeenCalledWith({
        provider: 'google',
      });
    });

    it('throws error when OAuth fails', async () => {
      (supabase.auth.signInWithOAuth as jest.Mock).mockResolvedValue({
        error: new Error('OAuth failed'),
      });

      await expect(authService.signInWithOAuth('google')).rejects.toThrow(
        'OAuth failed'
      );
    });
  });
});
