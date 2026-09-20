// Sanity tests for utility functions
// These tests verify core utility functions work correctly

import { formatDate, validateEmail, truncateText } from '@/utils/helpers';
import { COLORS, SPACING, FONTS, TYPOGRAPHY, ROUTES } from '@/utils/constants';

describe('Sanity: Utility Functions', () => {
  describe('formatDate', () => {
    it('returns "Just now" for recent dates', () => {
      const now = new Date().toISOString();
      expect(formatDate(now)).toBe('Just now');
    });

    it('returns minutes ago for dates within an hour', () => {
      const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
      expect(formatDate(tenMinutesAgo)).toBe('10m ago');
    });

    it('returns hours ago for dates within a day', () => {
      const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString();
      expect(formatDate(threeHoursAgo)).toBe('3h ago');
    });
  });

  describe('validateEmail', () => {
    it('returns true for valid emails', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.org')).toBe(true);
    });

    it('returns false for invalid emails', () => {
      expect(validateEmail('invalid')).toBe(false);
      expect(validateEmail('no@domain')).toBe(false);
      expect(validateEmail('@nodomain.com')).toBe(false);
    });
  });

  describe('truncateText', () => {
    it('returns original text if shorter than max length', () => {
      expect(truncateText('short', 10)).toBe('short');
    });

    it('truncates and adds ellipsis for long text', () => {
      expect(truncateText('this is a very long text', 10)).toBe('this is...');
    });
  });
});

describe('Sanity: Constants', () => {
  it('has required color definitions', () => {
    expect(COLORS.primary).toBeDefined();
    expect(COLORS.primaryDark).toBeDefined();
    expect(COLORS.text).toBeDefined();
    expect(COLORS.background).toBeDefined();
    expect(COLORS.error).toBeDefined();
    expect(COLORS.success).toBeDefined();
  });

  it('has required spacing values', () => {
    expect(SPACING.xs).toBe(4);
    expect(SPACING.sm).toBe(8);
    expect(SPACING.md).toBe(16);
    expect(SPACING.lg).toBe(24);
    expect(SPACING.xl).toBe(32);
  });

  it('has required font definitions', () => {
    expect(FONTS.regular).toBeDefined();
    expect(FONTS.medium).toBeDefined();
    expect(FONTS.semiBold).toBeDefined();
    expect(FONTS.bold).toBeDefined();
  });

  it('has required typography sizes', () => {
    expect(TYPOGRAPHY.h1).toBeGreaterThan(TYPOGRAPHY.h2);
    expect(TYPOGRAPHY.h2).toBeGreaterThan(TYPOGRAPHY.h3);
    expect(TYPOGRAPHY.body).toBeDefined();
  });

  it('has required route definitions', () => {
    expect(ROUTES.HOME).toBe('/');
    expect(ROUTES.PUZZLES).toBeDefined();
    expect(ROUTES.CLUSTERS).toBeDefined();
    expect(ROUTES.PROFILE).toBeDefined();
    expect(ROUTES.LOGIN).toBeDefined();
  });
});
