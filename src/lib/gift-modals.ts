import { MarketGift, Channel } from './api';
import { ModalType } from '@/contexts/ModalContext';
import { useRemoveGiftFromSale, useRemoveChannelFromSale } from './api-hooks';
import { useToast } from '@/hooks/useToast';

export interface UserGift {
  id: string | number;
  gift_data: {
    id: string | number;
    full_name?: string;
  };
  slug?: string;
  price?: number;
  gift_frozen_until?: string | null;
  model_data?: {
    name?: string;
    rarity_per_mille?: number;
    floor?: number;
  };
  backdrop_data?: {
    name?: string;
    rarity_per_mille?: number;
    floor?: number;
    center_color?: string;
    edge_color?: string;
  };
  symbol_data?: {
    name?: string;
    rarity_per_mille?: number;
    floor?: number;
  };
  status?: string;
}

export interface UpgradedGiftModalData {
  id: string | number;
  giftId: string;
  giftSlug?: string;
  name: string;
  num: any;
  gift_frozen_until: string | null;
  price: number;
  model: {
    value: string;
    rarity_per_mille: number;
    floor: number;
  };
  backdrop: {
    value: string;
    rarity_per_mille: number;
    floor: number;
    centerColor: string;
    edgeColor: string;
  };
  symbol: {
    value: string;
    rarity_per_mille: number;
    floor: number;
  };
  status?: string;
  onDecline?: (id: string | number) => void;
}

/**
 * Opens the upgraded-gift modal for a user gift (from storage page)
 */
export function openUserGiftModal(
  userGift: UserGift,
  openModal: (type: ModalType, data?: any) => void,
  onDecline?: (id: string | number) => void
): void {
  const model = userGift.model_data ? {
    value: userGift.model_data.name || '',
    rarity_per_mille: userGift.model_data.rarity_per_mille || 0,
    floor: userGift.model_data.floor || 0
  } : { value: '', rarity_per_mille: 0, floor: 0 };

  const backdrop = userGift.backdrop_data ? {
    value: userGift.backdrop_data.name || '',
    rarity_per_mille: userGift.backdrop_data.rarity_per_mille || 0,
    floor: userGift.backdrop_data.floor || 0,
    centerColor: userGift.backdrop_data.center_color || '000000',
    edgeColor: userGift.backdrop_data.edge_color || '000000'
  } : { value: '', rarity_per_mille: 0, floor: 0, centerColor: '000000', edgeColor: '000000' };

  const symbol = userGift.symbol_data ? {
    value: userGift.symbol_data.name || '',
    rarity_per_mille: userGift.symbol_data.rarity_per_mille || 0,
    floor: userGift.symbol_data.floor || 0
  } : { value: '', rarity_per_mille: 0, floor: 0 };

  const modalData: UpgradedGiftModalData = {
    id: userGift.id,
    giftId: String(userGift.gift_data.id),
    giftSlug: userGift.slug,
    name: userGift.gift_data?.full_name || `Gift ${userGift.gift_data.id}`,
    num: userGift.id,
    gift_frozen_until: userGift.gift_frozen_until || null,
    price: userGift.price || 0,
    model,
    backdrop,
    symbol,
    status: userGift.status,
    onDecline,
  };

  openModal('upgraded-gift', modalData);
}

/**
 * Opens the upgraded-gift modal for a market gift
 */
export function openMarketGiftModal(
  gift: MarketGift,
  openModal: (type: ModalType, data?: any) => void,
  isMyGift: boolean = false,
  onDecline?: (id: string | number) => void
): void {
  const model = gift.attributes.find((a: any) => a.type === 'model');
  const backdrop = gift.attributes.find((a: any) => a.type === 'backdrop');
  const symbol = gift.attributes.find((a: any) => a.type === 'symbol');

  const modalData: UpgradedGiftModalData = {
    id: gift.id,
    giftId: gift.gift_id,
    giftSlug: gift.slug,
    price: gift.price,
    name: gift.full_name,
    num: gift.num,
    gift_frozen_until: gift.gift_frozen_until,
    model: model ? {
      value: model.value,
      rarity_per_mille: model.rarity_per_mille,
      floor: Number(model.floor) || 0
    } : { value: '', rarity_per_mille: 0, floor: 0 },
    backdrop: backdrop ? {
      value: backdrop.value,
      rarity_per_mille: backdrop.rarity_per_mille,
      floor: Number(backdrop.floor) || 0,
      centerColor: (backdrop as any).centerColor || '000000',
      edgeColor: (backdrop as any).edgeColor || '000000'
    } : { value: '', rarity_per_mille: 0, floor: 0, centerColor: '000000', edgeColor: '000000' },
    symbol: symbol ? {
      value: symbol.value,
      rarity_per_mille: symbol.rarity_per_mille,
      floor: Number(symbol.floor) || 0
    } : { value: '', rarity_per_mille: 0, floor: 0 },
  };

  // If it's my gift, add status and onDecline
  if (isMyGift && onDecline) {
    modalData.status = 'active';
    modalData.onDecline = onDecline;
  }

  openModal('upgraded-gift', modalData);
}

/**
 * Custom hook to handle removing a gift from sale
 * Returns a function that can be used as the onDecline callback
 */
export function useDeclineGift() {
  const removeGiftFromSaleMutation = useRemoveGiftFromSale();
  const { success: showSuccessToast, block: showErrorToast } = useToast();

  return async (id: string | number) => {
    try {
      await removeGiftFromSaleMutation.mutateAsync(String(id));
      showSuccessToast({ message: 'Gift removed from sale successfully!' });
    } catch (error) {
      console.error('Failed to remove gift from sale:', error);
      showErrorToast({ message: 'Failed to remove gift from sale. Please try again.' });
    }
  };
}

/**
 * Custom hook to handle removing a channel from sale
 * Returns a function that can be used as the onDecline callback
 */
export function useDeclineChannel() {
  const removeChannelFromSaleMutation = useRemoveChannelFromSale();
  const { success: showSuccessToast, block: showErrorToast } = useToast();

  return async (id: string | number) => {
    try {
      await removeChannelFromSaleMutation.mutateAsync(String(id));
      showSuccessToast({ message: 'Channel removed from sale successfully!' });
    } catch (error) {
      console.error('Failed to remove channel from sale:', error);
      showErrorToast({ message: 'Failed to remove channel from sale. Please try again.' });
    }
  };
}

/**
 * Opens the gift-details modal for a market channel
 */
export function openMarketChannelModal(
  channel: Channel,
  gifts: any[],
  openModal: (type: ModalType, data?: any) => void,
  isMyChannel: boolean = false,
  onDecline?: (id: string | number) => void
): void {
  // Create a copy of the channel to modify its status if needed
  const channelData = { ...channel };
  
  const modalData: any = {
    channel: channelData,
    gifts,
  };

  // If it's my channel, set status to 'active' and add decline callback
  if (isMyChannel && onDecline) {
    channelData.status = 'active'; // This ensures "Remove Sale" and "Change Price" buttons show
    modalData.onDecline = onDecline;
    modalData.showPurchaseActions = true;
  }

  openModal('gift-details', modalData);
}
