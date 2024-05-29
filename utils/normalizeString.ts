function normalizeString(input: string): string {
  return input.trim().replace(/\s+/g, ' ');
}

export default normalizeString;
