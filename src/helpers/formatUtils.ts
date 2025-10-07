/**
 * Format rarity percentage from per-mille value
 * Returns integer if ends with .0, otherwise one decimal place
 * @param rarityPerMille - Rarity value in per-mille (0-1000)
 * @returns Formatted percentage string without the % symbol
 */
export function formatRarity(rarityPerMille: number): string {
  const percentage = rarityPerMille / 10;
  const rounded = Math.round(percentage * 10) / 10; // Round to 1 decimal place
  
  // If the decimal part is 0, return as integer
  if (rounded % 1 === 0) {
    return rounded.toFixed(0);
  }
  // Otherwise return with 1 decimal place
  return rounded.toFixed(1);
}

