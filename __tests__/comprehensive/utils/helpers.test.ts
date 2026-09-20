// Comprehensive tests for utility helper functions

import { formatDate, validateEmail, truncateText } from '@/utils/helpers';

describe('Comprehensive: formatDate', () => {
  describe('Just now', () => {
    it('returns "Just now" for current time', () => {
      const now = new Date().toISOString();
      expect(formatDate(now)).toBe('Just now');
    });

    it('returns "Just now" for 30 seconds ago', () => {
      const date = new Date(Date.now() - 30 * 1000).toISOString();
      expect(formatDate(date)).toBe('Just now');
    });
  });

  describe('Minutes ago', () => {
    it('returns "1m ago" for 1 minute ago', () => {
      const date = new Date(Date.now() - 1 * 60 * 1000).toISOString();
      expect(formatDate(date)).toBe('1m ago');
    });

    it('returns "30m ago" for 30 minutes ago', () => {
      const date = new Date(Date.now() - 30 * 60 * 1000).toISOString();
      expect(formatDate(date)).toBe('30m ago');
    });

    it('returns "59m ago" for 59 minutes ago', () => {
      const date = new Date(Date.now() - 59 * 60 * 1000).toISOString();
      expect(formatDate(date)).toBe('59m ago');
    });
  });

  describe('Hours ago', () => {
    it('returns "1h ago" for 1 hour ago', () => {
      const date = new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString();
      expect(formatDate(date)).toBe('1h ago');
    });

    it('returns "12h ago" for 12 hours ago', () => {
      const date = new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString();
      expect(formatDate(date)).toBe('12h ago');
    });

    it('returns "23h ago" for 23 hours ago', () => {
      const date = new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString();
      expect(formatDate(date)).toBe('23h ago');
    });
  });

  describe('Days ago', () => {
    it('returns "1d ago" for 1 day ago', () => {
      const date = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString();
      expect(formatDate(date)).toBe('1d ago');
    });

    it('returns "6d ago" for 6 days ago', () => {
      const date = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString();
      expect(formatDate(date)).toBe('6d ago');
    });
  });

  describe('Older dates', () => {
    it('returns formatted date for 7+ days ago', () => {
      const date = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString();
      const result = formatDate(date);
      // Should return a locale date string, not "Xd ago"
      expect(result).not.toMatch(/d ago$/);
    });

    it('returns formatted date for old dates', () => {
      const date = new Date('2020-01-15').toISOString();
      const result = formatDate(date);
      expect(result).toBeTruthy();
      expect(result).not.toBe('Just now');
    });
  });
});

describe('Comprehensive: validateEmail', () => {
  describe('Valid emails', () => {
    const validEmails = [
      'test@example.com',
      'user.name@domain.org',
      'user+tag@example.co.uk',
      'firstname.lastname@company.com',
      'email@subdomain.domain.com',
      'email@123.123.123.123',
      '1234567890@example.com',
      '_______@example.com',
    ];

    validEmails.forEach((email) => {
      it(`returns true for "${email}"`, () => {
        expect(validateEmail(email)).toBe(true);
      });
    });
  });

  describe('Invalid emails', () => {
    const invalidEmails = [
      '',
      'invalid',
      'no@domain',
      '@nodomain.com',
      'missing@.com',
      'spaces in@email.com',
      'double@@at.com',
      '.startswithdot@example.com',
    ];

    invalidEmails.forEach((email) => {
      it(`returns false for "${email}"`, () => {
        expect(validateEmail(email)).toBe(false);
      });
    });
  });
});

describe('Comprehensive: truncateText', () => {
  describe('Short text', () => {
    it('returns original text if shorter than max length', () => {
      expect(truncateText('short', 10)).toBe('short');
    });

    it('returns original text if equal to max length', () => {
      expect(truncateText('exact', 5)).toBe('exact');
    });
  });

  describe('Long text', () => {
    it('truncates and adds ellipsis', () => {
      expect(truncateText('this is a very long text', 10)).toBe('this is...');
    });

    it('handles exact boundary correctly', () => {
      // maxLength 10, so we keep 7 chars + "..."
      const result = truncateText('abcdefghij', 10);
      expect(result).toBe('abcdefghij'); // Equal to maxLength, no truncation
    });

    it('truncates text longer than max', () => {
      const result = truncateText('abcdefghijk', 10);
      expect(result).toBe('abcdefg...');
      expect(result.length).toBe(10);
    });
  });

  describe('Edge cases', () => {
    it('handles empty string', () => {
      expect(truncateText('', 10)).toBe('');
    });

    it('handles very short max length', () => {
      expect(truncateText('hello world', 5)).toBe('he...');
    });

    it('handles single character', () => {
      expect(truncateText('a', 10)).toBe('a');
    });

    it('handles max length of 3 (minimum for ellipsis)', () => {
      expect(truncateText('hello', 3)).toBe('...');
    });
  });
});
