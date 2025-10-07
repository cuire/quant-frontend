import { forwardRef } from 'react';

import { bem } from '@/css/bem.ts';
import { classNames } from '@/css/classnames.ts';
import { CountdownTimer } from '@/components/CountdownTimer';
import { DaysHoursCountdown } from '@/components/DaysHoursCountdown';
import { NftBadge } from '@/components/NftBadge/NftBadge';
import { GiftSlugIcon } from '@/components/GiftIcon';

import './Gift.css';

const [b, e] = bem('gift');

export interface GiftItem {
  id: string;
  name: string;
  icon: string;
  quantity?: number;
  type?: 'nft' | 'item';
  giftSlug?: string;
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
  /** Timestamp для countdown timer (ISO string или Date) */
  timeEndTimestamp?: string | Date;
  /** Показать информацию о предложении (цена и время) */
  showOfferInfo?: boolean;
  /** Обработчик кнопки Sell для варианта storage */
  onSell?: () => void;
  /** Обработчик отклонения (крестик) для варианта storage */
  onDecline?: () => void;
  /** Обработчик клика по карточке */
  onClick?: () => void;
  /** Тип действия в storage: продажа (Received) или удаление (Placed) */
  storageAction?: 'sell' | 'remove';

  action?: 'sell' | 'buy-or-cart' | 'cancel-offer';
  /** Статус канала для отображения цены */
  channelStatus?: string;
  /** Статус подарка для отображения кнопки Sell */
  giftStatus?: string;

  transferringEndAt?: string;
  /** Timestamp when gift is frozen until (ISO string или Date) */
  gift_frozen_until?: string | Date | null;
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
  timeEndTimestamp,
  showOfferInfo = false,
  onSell,
  onDecline,
  onClick,
  storageAction = 'sell',
  action = 'sell',
  channelStatus,
  giftStatus,
  transferringEndAt,
  gift_frozen_until = null,
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
    <div 
      {...rest} 
      ref={ref} 
      className={classNames(b(isStorage ? 'storage' : undefined), b(channelStatus === 'transferring' ? 'transferring' : undefined), rest.className)}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default', ...rest.style }}
    >
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
            {(items.length > 4 ? items.slice(0, 3) : items).map((item) => (
              <div key={item.id} className={e('item')}>
                  <div 
                    className={e('item-background')}
                    style={{ 
                      backgroundColor: getItemBackgroundColor()
                    }}
                  >
                  <div className={e('item-content')}>
                    {item.giftSlug && item.giftSlug !== 'None-None' ? (  
                      <GiftSlugIcon giftSlug={item.giftSlug} size="100%" className={e('full-size-image')} />
                    ) : (
                      <img 
                      src={item.icon} 
                      alt={item.name} 
                      className={e('item-image')}
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder-gift.svg';
                      }}
                    />
                    )}
                    {item.type === 'nft' && (
                      <NftBadge overlay />
                    )}
                    {item.quantity && <span className={e('quantity-badge')}>x{item.quantity}</span>}
                  </div>
                 
                </div>
              </div>
            ))}

            {items.length > 4 && (
              <div className={e('item')}>
                  <div className={e('more-badge')}><span>+{items.length - 3} more</span></div>
              </div>
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

          {gift_frozen_until && (
            <div className={e('frozen-countdown')}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.00002 14.6667C3.63335 14.6667 3.31958 14.5362 3.05869 14.2754C2.7978 14.0145 2.66713 13.7005 2.66669 13.3334V6.66669C2.66669 6.30002 2.79735 5.98624 3.05869 5.72535C3.32002 5.46447 3.6338 5.3338 4.00002 5.33335H4.66669V4.00002C4.66669 3.0778 4.9918 2.2918 5.64202 1.64202C6.29224 0.992243 7.07824 0.667132 8.00002 0.666687C8.9218 0.666243 9.70802 0.991354 10.3587 1.64202C11.0094 2.29269 11.3342 3.07869 11.3334 4.00002V5.33335H12C12.3667 5.33335 12.6807 5.46402 12.942 5.72535C13.2034 5.98669 13.3338 6.30047 13.3334 6.66669V13.3334C13.3334 13.7 13.2029 14.014 12.942 14.2754C12.6811 14.5367 12.3671 14.6671 12 14.6667H4.00002ZM8.00002 11.3334C8.36669 11.3334 8.68069 11.2029 8.94202 10.942C9.20335 10.6811 9.3338 10.3671 9.33335 10C9.33291 9.63291 9.20247 9.31913 8.94202 9.05869C8.68158 8.79824 8.36758 8.66758 8.00002 8.66669C7.63246 8.6658 7.31869 8.79647 7.05869 9.05869C6.79869 9.32091 6.66802 9.63469 6.66669 10C6.66535 10.3654 6.79602 10.6794 7.05869 10.942C7.32135 11.2047 7.63513 11.3351 8.00002 11.3334ZM6.00002 5.33335H10V4.00002C10 3.44447 9.80558 2.97224 9.41669 2.58335C9.0278 2.19447 8.55558 2.00002 8.00002 2.00002C7.44447 2.00002 6.97224 2.19447 6.58335 2.58335C6.19446 2.97224 6.00002 3.44447 6.00002 4.00002V5.33335Z" fill="white"/>
              </svg>
              <DaysHoursCountdown 
                endTime={gift_frozen_until} 
                onExpire={() => {
                  // Optionally refresh the data when timer expires
                  console.log('Frozen timer expired');
                }}
              />
            </div>
          )}
        </div>
        
        <div className={e('footer')}>
          <div className={e('info', isStorage && 'storage', showOfferInfo && 'offer')}>
            <h3 className={e('title')}>{title}</h3>
            <span className={e('number')}>{giftNumber.slice(0, 6)}</span>
          </div>

          {showOfferInfo && (
            <div className={e('offer-info')}>
              <div className={e('offer-price')}>Offer Price: <span>{offerPriceTon} TON</span></div>
              <div className={e('offer-time')}>Time End: <span>{timeEndTimestamp ? <CountdownTimer endTime={timeEndTimestamp} /> : (timeEnd || '--:--:--')}</span></div>
            </div>
          )}

          {isStorage ? (
            <div className={e('storage')}> 
              {giftStatus === 'reserved' ? (
                <div className={e('actions', 'single')}>
                  <button 
                    type="button" 
                    className={e('sell-button')} 
                    onClick={(ev) => { ev.stopPropagation(); onSell && onSell(); }}
                  >
                    Sell
                  </button>
                </div>
              ) : variant === 'my-channel' && channelStatus === 'reserved' ? (
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
                  >
                    Frozen by admin
                  </button>
                </div>
              ) : variant === 'my-channel' && channelStatus === 'active' || giftStatus === 'active' ? (
                <div className={e('actions', 'single')}>
                  <button 
                    type="button" 
                    className={e('sell-button')} 
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
                    onClick={(ev) => { ev.stopPropagation(); onDecline && onDecline(); }}
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

              {action === 'cancel-offer' && (
                <button 
                  className={e('price-button')}
                  onClick={(ev) => { ev.stopPropagation(); onSell && onSell(); }}
                  style={{ backgroundColor: 'rgba(80, 52, 52, 1)', color: 'rgba(255, 125, 127, 1)' }}
                >
                  <svg className={e('diamond-icon')} width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.915 2.31099L6.62167 10.7402C6.5571 10.8426 6.46755 10.9269 6.36145 10.9852C6.25534 11.0435 6.13616 11.0738 6.0151 11.0734C5.89403 11.073 5.77506 11.0418 5.66936 10.9828C5.56366 10.9238 5.4747 10.8388 5.41083 10.736L0.221667 2.30765C0.0765355 2.07125 -0.000196165 1.79922 3.76621e-07 1.52182C0.0065815 1.11219 0.175416 0.721902 0.469449 0.436618C0.763481 0.151334 1.15869 -0.00563721 1.56833 0.000154777H10.5825C11.4433 0.000154777 12.1433 0.679321 12.1433 1.51849C12.1428 1.7988 12.0637 2.07335 11.915 2.31099ZM1.49667 2.02932L5.3575 7.98265V1.42932H1.9C1.5 1.42932 1.32167 1.69349 1.49667 2.02932ZM6.78583 7.98265L10.6467 2.02932C10.825 1.69349 10.6433 1.42932 10.2433 1.42932H6.78583V7.98265Z" fill="currentColor"/>
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
