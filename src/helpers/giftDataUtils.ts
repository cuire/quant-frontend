/**
 * Utility functions for parsing gift data structures
 */

export interface ParsedGiftItem {
  id: string;
  name: string;
  icon: string;
  quantity: number;
  type: 'item' | 'nft';
}

/**
 * Parses gift data from various formats into a standardized array of items
 * Handles both upgraded (NFT) and simple gift structures, as well as mixed formats
 * 
 * @param giftsData - The gifts data object from API
 * @param giftsMap - Map of gift ID to gift data for lookups
 * @returns Array of parsed gift items
 */
export function parseGiftData(
  giftsData: any,
  giftsMap: Map<string, any>
): ParsedGiftItem[] {
  if (!giftsData || typeof giftsData !== 'object') {
    return [];
  }

  const items: ParsedGiftItem[] = [];

  // Process upgraded gifts if they exist
  if ('upgraded' in giftsData && typeof giftsData.upgraded === 'object') {
    for (const [modelId, backdropIds] of Object.entries(giftsData.upgraded)) {
      // Ensure backdropIds is an array and get its length safely
      const quantity = Array.isArray(backdropIds) ? backdropIds.length : 1;
      const gift = giftsMap.get(modelId);
      
      items.push({
        id: modelId,
        name: gift?.full_name || gift?.short_name || `Gift ${modelId}`,
        icon: gift?.image_url || `https://FlowersRestricted.github.io/gifts/${modelId}/default.png`,
        quantity: quantity,
        type: 'nft'
      });
    }
  }

  // Process regular gifts (simple structure: { giftId: quantity })
  // Skip the 'upgraded' key and any malformed keys
  for (const [giftId, quantity] of Object.entries(giftsData)) {
    // Skip 'upgraded' key (already processed above)
    if (giftId === 'upgraded') {
      continue;
    }
    
    // Skip malformed keys (keys with spaces, quotes, or non-numeric IDs)
    // Valid gift IDs should be clean strings of numbers
    const cleanGiftId = giftId.trim();
    if (cleanGiftId !== giftId || !/^[0-9]+$/.test(cleanGiftId)) {
      console.warn(`Skipping malformed gift ID: "${giftId}"`);
      continue;
    }
    
    // Only process if quantity is a valid number
    if (typeof quantity === 'number' && quantity > 0) {
      const gift = giftsMap.get(cleanGiftId);
      items.push({
        id: cleanGiftId,
        name: gift?.full_name || gift?.short_name || `Gift ${cleanGiftId}`,
        icon: gift?.image_url || `https://FlowersRestricted.github.io/gifts/${cleanGiftId}/default.png`,
        quantity: quantity,
        type: 'item'
      });
    }
  }

  return items;
}

/**
 * Parses gift data using an array of gifts instead of a Map
 * 
 * @param giftsData - The gifts data object from API
 * @param gifts - Array of gift data for lookups
 * @returns Array of parsed gift items
 */
export function parseGiftDataWithArray(
  giftsData: any,
  gifts: any[]
): ParsedGiftItem[] {
  if (!giftsData || typeof giftsData !== 'object') {
    return [];
  }

  const items: ParsedGiftItem[] = [];

  // Process upgraded gifts if they exist
  if ('upgraded' in giftsData && typeof giftsData.upgraded === 'object') {
    for (const [modelId, backdropIds] of Object.entries(giftsData.upgraded)) {
      const foundGift = gifts.find((gift) => gift.id === modelId);
      const quantity = Array.isArray(backdropIds) ? backdropIds.length : 1;
      
      items.push({
        id: modelId,
        name: foundGift?.full_name || foundGift?.short_name || `Gift ${modelId}`,
        icon: foundGift?.image_url || `https://FlowersRestricted.github.io/gifts/${modelId}/default.png`,
        quantity: quantity,
        type: 'nft'
      });
    }
  }

  // Process regular gifts
  for (const [giftId, quantity] of Object.entries(giftsData)) {
    if (giftId === 'upgraded') {
      continue;
    }
    
    // Skip malformed keys
    const cleanGiftId = giftId.trim();
    if (cleanGiftId !== giftId || !/^[0-9]+$/.test(cleanGiftId)) {
      console.warn(`Skipping malformed gift ID: "${giftId}"`);
      continue;
    }
    
    if (typeof quantity === 'number' && quantity > 0) {
      const foundGift = gifts.find((gift) => gift.id === cleanGiftId);
      items.push({
        id: cleanGiftId,
        name: foundGift?.full_name || foundGift?.short_name || `Gift ${cleanGiftId}`,
        icon: foundGift?.image_url || `https://FlowersRestricted.github.io/gifts/${cleanGiftId}/default.png`,
        quantity: quantity,
        type: 'item'
      });
    }
  }

  return items;
}

