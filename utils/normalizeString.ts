import capitalizeFirstLetter from './capitalizeFirstLetter';

function normalizeString(input: string): string {
  return capitalizeFirstLetter(input.trim().replace(/\s+/g, ' '));
}

export default normalizeString;
