import { capitalizeFirstLetter, normalizeString } from '@/utils/textUtils';
import { describe, it, expect } from 'vitest';

describe('capitalizeFirstLetter', () => {
  it('should capitalize the first letter of a lowercase string', () => {
    expect(capitalizeFirstLetter('hello')).toBe('Hello');
  });

  it('should capitalize the first letter of an uppercase string', () => {
    expect(capitalizeFirstLetter('HELLO')).toBe('Hello');
  });

  it('should handle an empty string', () => {
    expect(capitalizeFirstLetter('')).toBe('');
  });

  it('should handle a single character string', () => {
    expect(capitalizeFirstLetter('a')).toBe('A');
  });

  it('should handle a string with mixed case', () => {
    expect(capitalizeFirstLetter('hELLO')).toBe('Hello');
  });
});

describe('normalizeString', () => {
  it('should trim spaces and capitalize the first letter', () => {
    expect(normalizeString('   hello   ')).toBe('Hello');
  });

  it('should replace multiple spaces with a single space and capitalize the first letter', () => {
    expect(normalizeString('hello   world')).toBe('Hello world');
  });

  it('should handle an empty string', () => {
    expect(normalizeString('')).toBe('');
  });

  it('should handle a string with mixed case and multiple spaces', () => {
    expect(normalizeString('   hELLO   wORLD  ')).toBe('Hello world');
  });

  it('should handle a string with a single character', () => {
    expect(normalizeString(' a ')).toBe('A');
  });
});
