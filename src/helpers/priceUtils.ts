/**
 * Utility function to safely convert any price value to a number
 * Handles cases where price might be an object, string, or number
 */
export const getChannelPrice = (price: any): number => {
  if (typeof price === 'number') {
    return Math.round(price);
  }
  if (typeof price === 'object' && price !== null) {
    // If price is an object, try to get the first numeric value
    const values = Object.values(price);
    const numericValue = values.find(v => typeof v === 'number') as number | undefined;
    return numericValue ? Math.round(numericValue) : 0;
  }
  if (typeof price === 'string') {
    const parsed = parseFloat(price);
    return isNaN(parsed) ? 0 : Math.round(parsed);
  }
  return 0;
};
