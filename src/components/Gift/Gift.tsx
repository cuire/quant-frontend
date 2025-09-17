import { forwardRef } from 'react';

import { bem } from '@/css/bem.ts';
import { classNames } from '@/css/classnames.ts';
import { CountdownTimer } from '@/components/CountdownTimer';

import './Gift.css';

const [b, e] = bem('gift');

export interface GiftItem {
  id: string;
  name: string;
  icon: string;
  quantity?: number;
  type?: 'nft' | 'item';
}

export interface GiftProps extends React.HTMLAttributes<HTMLDivElement> {
  items: GiftItem[];
  title: string;
  giftNumber: string;
  price: number;
  isFastSale?: boolean;
  timeBadge?: string | null;
  cornerBadge?: 'blue' | 'orange' | null;
  backgroundColor?: string;
  /**
   * Вариант отображения карточки. По умолчанию рыночный вариант.
   * Для страницы Storage используется вариант 'storage-offer'.
   */
  variant?: 'market' | 'storage-offer' | 'my-channel';
  /** Цена предложения (TON) для варианта storage */
  offerPriceTon?: number;
  /** Остаток времени в формате HH:MM:SS для варианта storage */
  timeEnd?: string;
  /** Обработчик кнопки Sell для варианта storage */
  onSell?: () => void;
  /** Обработчик отклонения (крестик) для варианта storage */
  onDecline?: () => void;
  /** Тип действия в storage: продажа (Received) или удаление (Placed) */
  storageAction?: 'sell' | 'remove';

  action?: 'sell' | 'buy-or-cart';
  /** Статус канала для отображения цены */
  channelStatus?: string;

  transferringEndAt?: string;
}

export const Gift = forwardRef<HTMLDivElement, GiftProps>(({ 
  items, 
  title, 
  giftNumber, 
  price, 
  isFastSale = false,
  timeBadge = null,
  cornerBadge = null,
  backgroundColor,
  variant = 'market',
  offerPriceTon,
  timeEnd,
  onSell,
  onDecline,
  storageAction = 'sell',
  action = 'sell',
  channelStatus,
  transferringEndAt,
  ...rest 
}, ref) => {
  // Определяем класс сетки в зависимости от количества элементов
  const getGridClass = () => {
    if (items.length === 1) return 'single';
    if (items.length === 2) return 'double';
    if (items.length === 3) return 'triple';
    return 'multiple';
  };

  // Получаем цвет фона для отдельного подарка
  const getItemBackgroundColor = () => {
    return '#344150'; // Единый цвет для всех подарков
  };

  const isStorage = variant === 'storage-offer' || variant === 'my-channel';

  return (
    <div {...rest} ref={ref} className={classNames(b(isStorage ? 'storage' : undefined), b(channelStatus === 'transferring' ? 'transferring' : undefined), rest.className)}>
      {isFastSale && (
        <div className={e('fast-sale-banner')}>
          Fast sale
        </div>
      )}
      
      {timeBadge && (
        <div className={e('time-badge')}>
          {timeBadge}
        </div>
      )}
      
      {cornerBadge && (
        <div className={e('corner-badge', cornerBadge)} />
      )}
      
      <div className={e('content')}>
        <div 
          className={e('items-area')}
          style={{ backgroundColor: '#2A3541' }}
        >
          <div className={e('items-grid', getGridClass())}>
            {items.slice(0, 4).map((item) => (
              <div key={item.id} className={e('item')}>
                  <div 
                    className={e('item-background')}
                    style={{ 
                      backgroundColor: getItemBackgroundColor()
                    }}
                  >
                  <div className={e('item-content')}>
                    <img 
                      src={item.icon} 
                      alt={item.name} 
                      className={e('item-image')}
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder-gift.svg';
                      }}
                    />
                    {item.type === 'nft' && (
                      <span className={e('nft-badge')}>NFTs</span>
                    )}
                    {item.quantity && <span className={e('quantity-badge')}>x{item.quantity}</span>}
                  </div>
                </div>
              </div>
            ))}
            {items.length > 4 && (
              <div className={e('more-badge')}>+{items.length - 4} more</div>
            )}
          </div>

          {channelStatus === 'transferring' && transferringEndAt && (
            <div className={e('transferring-badge')}>
              <span>
                <CountdownTimer 
                  endTime={transferringEndAt} 
                  onExpire={() => {
                    // Optionally refresh the data when timer expires
                    console.log('Transfer timer expired');
                  }}
                />
              </span>
            </div>
          )}
        </div>
        
        <div className={e('footer')}>
          <div className={e('info', isStorage && 'storage')}>
            <h3 className={e('title')}>{title}</h3>
            <span className={e('number')}>#{giftNumber}</span>
          </div>

          {isStorage ? (
            <div className={e('storage')}> 
              {variant === 'my-channel' && channelStatus === 'reserved' ? (
                <div className={e('actions', 'single')}>
                  <button 
                    type="button" 
                    className={e('sell-button')} 
                    onClick={(ev) => { ev.stopPropagation(); onSell && onSell(); }}
                  >
                    Sell
                  </button>
                </div>
              ) : variant === 'my-channel' && channelStatus === 'transferring' ? (
                <div className={e('actions', 'single')}>
                  <button 
                    type="button" 
                    className={e('sell-button')} 
                    onClick={(ev) => { ev.stopPropagation(); onSell && onSell(); }}
                    style={{ 
                      backgroundColor: '#DA7024',
                    }}
                  >
                    Receiving
                  </button>
                </div>
              ) : variant === 'my-channel' && channelStatus === 'frozen' ? (
                <div className={e('actions', 'single')}>
                  <button 
                    type="button" 
                    className={e('sell-button')} 
                    onClick={(ev) => { ev.stopPropagation(); onSell && onSell(); }}
                  >
                    Frozen by admin
                  </button>
                </div>
              ) : variant === 'my-channel' && channelStatus === 'active' ? (
                <div className={e('actions', 'single')}>
                  <button 
                    type="button" 
                    className={e('sell-button')} 
                    onClick={(ev) => { ev.stopPropagation(); onSell && onSell(); }}
                    style={{ 
                      backgroundColor: '#32404D',
                      display: 'flex', alignItems: 'center', gap: '4px', paddingLeft: '12px', paddingRight: '12px', textAlign: 'left' }}
                  >
                    <div className="" style={{ flex: 1 }}>
                      Your Price:
                    </div>
                    <div className="">
                      {price} TON
                    </div>
                  </button>
                </div>
              ) : storageAction === 'remove' ? (
                <div className={e('actions', 'single')}>
                  <button 
                    type="button" 
                    className={e('remove-button')} 
                    onClick={(ev) => { ev.stopPropagation(); onSell && onSell(); }}
                  >
                    Remove Offers
                  </button>
                </div>
              ) : (
                <div className={e('actions')}>
                  <button 
                    type="button" 
                    className={e('sell-button')} 
                    onClick={(ev) => { ev.stopPropagation(); onSell && onSell(); }}
                  >
                    Sell
                  </button>
                  <button 
                    type="button" 
                    className={e('decline-button')} 
                    aria-label="Decline" 
                    onClick={(ev) => { ev.stopPropagation(); onDecline && onDecline(); }}
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              {action === 'sell' && (
                <button className={e('price-button')}>
                  <svg className={e('diamond-icon')} width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.915 2.31099L6.62167 10.7402C6.5571 10.8426 6.46755 10.9269 6.36145 10.9852C6.25534 11.0435 6.13616 11.0738 6.0151 11.0734C5.89403 11.073 5.77506 11.0418 5.66936 10.9828C5.56366 10.9238 5.4747 10.8388 5.41083 10.736L0.221667 2.30765C0.0765355 2.07125 -0.000196165 1.79922 3.76621e-07 1.52182C0.0065815 1.11219 0.175416 0.721902 0.469449 0.436618C0.763481 0.151334 1.15869 -0.00563721 1.56833 0.000154777H10.5825C11.4433 0.000154777 12.1433 0.679321 12.1433 1.51849C12.1428 1.7988 12.0637 2.07335 11.915 2.31099ZM1.49667 2.02932L5.3575 7.98265V1.42932H1.9C1.5 1.42932 1.32167 1.69349 1.49667 2.02932ZM6.78583 7.98265L10.6467 2.02932C10.825 1.69349 10.6433 1.42932 10.2433 1.42932H6.78583V7.98265Z" fill="white"/>
                  </svg>
                  <span className={e('price')}>{price}</span>
                </button>
              )}

              {action === 'buy-or-cart' && (
                <button className={e('price-button')}>
                  <svg className={e('diamond-icon')} width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.915 2.31099L6.62167 10.7402C6.5571 10.8426 6.46755 10.9269 6.36145 10.9852C6.25534 11.0435 6.13616 11.0738 6.0151 11.0734C5.89403 11.073 5.77506 11.0418 5.66936 10.9828C5.56366 10.9238 5.4747 10.8388 5.41083 10.736L0.221667 2.30765C0.0765355 2.07125 -0.000196165 1.79922 3.76621e-07 1.52182C0.0065815 1.11219 0.175416 0.721902 0.469449 0.436618C0.763481 0.151334 1.15869 -0.00563721 1.56833 0.000154777H10.5825C11.4433 0.000154777 12.1433 0.679321 12.1433 1.51849C12.1428 1.7988 12.0637 2.07335 11.915 2.31099ZM1.49667 2.02932L5.3575 7.98265V1.42932H1.9C1.5 1.42932 1.32167 1.69349 1.49667 2.02932ZM6.78583 7.98265L10.6467 2.02932C10.825 1.69349 10.6433 1.42932 10.2433 1.42932H6.78583V7.98265Z" fill="white"/>
                  </svg>
                  <span className={e('price')}>{price}</span>
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
});
