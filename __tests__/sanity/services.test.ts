// Sanity tests for services
// These tests verify that services export correctly and have expected methods

import { authService } from '@/services/auth.service';
import { puzzleService } from '@/services/puzzle.service';

describe('Sanity: Services', () => {
  describe('authService', () => {
    it('exports signInWithEmail method', () => {
      expect(typeof authService.signInWithEmail).toBe('function');
    });

    it('exports register method', () => {
      expect(typeof authService.register).toBe('function');
    });

    it('exports signOut method', () => {
      expect(typeof authService.signOut).toBe('function');
    });

    it('exports getCurrentUser method', () => {
      expect(typeof authService.getCurrentUser).toBe('function');
    });

    it('exports continueAsGuest method', () => {
      expect(typeof authService.continueAsGuest).toBe('function');
    });

    it('exports signInWithOAuth method', () => {
      expect(typeof authService.signInWithOAuth).toBe('function');
    });
  });

  describe('puzzleService', () => {
    it('exports getSubscribedChannels method', () => {
      expect(typeof puzzleService.getSubscribedChannels).toBe('function');
    });

    it('exports getChannel method', () => {
      expect(typeof puzzleService.getChannel).toBe('function');
    });

    it('exports getChannelPuzzles method', () => {
      expect(typeof puzzleService.getChannelPuzzles).toBe('function');
    });

    it('exports submitAnswer method', () => {
      expect(typeof puzzleService.submitAnswer).toBe('function');
    });

    it('exports subscribeToChannel method', () => {
      expect(typeof puzzleService.subscribeToChannel).toBe('function');
    });

    it('exports unsubscribeFromChannel method', () => {
      expect(typeof puzzleService.unsubscribeFromChannel).toBe('function');
    });

    it('exports createPuzzle method', () => {
      expect(typeof puzzleService.createPuzzle).toBe('function');
    });
  });
});
