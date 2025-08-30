import type { FC } from 'react';

import { bem } from '@/css/bem.ts';
import { classNames } from '@/css/classnames.ts';

import './Gift.css';

const [b, e] = bem('gift');

export interface GiftItem {
  id: string;
  name: string;
  icon: string;
  quantity: number;
  type?: 'nft' | 'item';
}

export interface GiftProps extends React.HTMLAttributes<HTMLDivElement> {
  items: GiftItem[];
  title: string;
  giftNumber: string;
  price: number;
  isFastSale?: boolean;
}

export const Gift: FC<GiftProps> = ({ 
  items, 
  title, 
  giftNumber, 
  price, 
  isFastSale = false, 
  ...rest 
}) => (
  <div {...rest} className={classNames(b(), rest.className)}>
    {isFastSale && (
      <div className={e('fast-sale-banner')}>
        Fast sale
      </div>
    )}
    
    <div className={e('header')}>
      <h3 className={e('title')}>{title}</h3>
      <span className={e('gift-number')}>#{giftNumber}</span>
    </div>
    
    <div className={e('items-grid')}>
      {items.map((item) => (
        <div key={item.id} className={e('item')}>
          <div className={e('item-icon')}>
            <img 
              src={item.icon} 
              alt={item.name} 
              onError={(e) => {
                e.currentTarget.src = '/placeholder-gift.svg';
              }}
            />
            {item.type === 'nft' && (
              <span className={e('nft-label')}>NFTs</span>
            )}
            <span className={e('quantity')}>x{item.quantity}</span>
          </div>
        </div>
      ))}
    </div>
    
    <button className={e('price-button')}>
      <span className={e('diamond-icon')}>💎</span>
      <span className={e('price')}>{price}</span>
    </button>
  </div>
);
