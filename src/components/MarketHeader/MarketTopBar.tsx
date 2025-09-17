import type { FC } from 'react';
import { bem } from '@/css/bem.ts';
import { useUser } from '@/lib/api-hooks';
import { Link } from '../Link/Link';
import './MarketHeader.css';
import guideIcon from '@/icons/fluent_style-guide-20-filled.svg';

const [b, e] = bem('market-header');

export interface MarketTopBarProps {
  balance?: number;
  showAddChannel?: boolean;
  onAddChannel?: () => void;
}

export const MarketTopBar: FC<MarketTopBarProps> = ({ 
  balance: propBalance, 
  showAddChannel = false,
  onAddChannel
}) => {
  const { data: user } = useUser();
  const balance = propBalance ?? user?.balance ?? 0;

  return (
    <div className={b()}>
      <div className={e('second-row')}>
        {showAddChannel ? (
          <button 
            className={e('telegram-badge')} 
            onClick={onAddChannel}
          >
            <div className={e('telegram-icon')}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4.22222 22L2 8.66667H22L19.7778 22H4.22222ZM9.77778 15.3333H14.2222C14.537 15.3333 14.8011 15.2267 15.0144 15.0133C15.2278 14.8 15.3341 14.5363 15.3333 14.2222C15.3326 13.9081 15.2259 13.6444 15.0133 13.4311C14.8007 13.2178 14.537 13.1111 14.2222 13.1111H9.77778C9.46296 13.1111 9.19926 13.2178 8.98667 13.4311C8.77407 13.6444 8.66741 13.9081 8.66667 14.2222C8.66593 14.5363 8.77259 14.8004 8.98667 15.0144C9.20074 15.2285 9.46444 15.3348 9.77778 15.3333ZM5.33333 7.55556C5.01852 7.55556 4.75482 7.44889 4.54222 7.23556C4.32963 7.02222 4.22296 6.75852 4.22222 6.44444C4.22148 6.13037 4.32815 5.86667 4.54222 5.65333C4.7563 5.44 5.02 5.33333 5.33333 5.33333H18.6667C18.9815 5.33333 19.2456 5.44 19.4589 5.65333C19.6722 5.86667 19.7785 6.13037 19.7778 6.44444C19.777 6.75852 19.6704 7.02259 19.4578 7.23667C19.2452 7.45074 18.9815 7.55704 18.6667 7.55556H5.33333ZM7.55556 4.22222C7.24074 4.22222 6.97704 4.11556 6.76444 3.90222C6.55185 3.68889 6.44519 3.42519 6.44444 3.11111C6.4437 2.79704 6.55037 2.53333 6.76444 2.32C6.97852 2.10667 7.24222 2 7.55556 2H16.4444C16.7593 2 17.0233 2.10667 17.2367 2.32C17.45 2.53333 17.5563 2.79704 17.5556 3.11111C17.5548 3.42519 17.4481 3.68926 17.2356 3.90333C17.023 4.11741 16.7593 4.2237 16.4444 4.22222H7.55556Z" fill="currentColor"/>
            </svg>
            </div>
            <span className={e('telegram-text')}>Add Channel</span>
            <div className={e('arrow')}>
              <svg width="12" height="16" viewBox="0 0 12 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.99998 11.6667L6.33331 8.33333L2.99998 5" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </button>
        ) : (
          <div className={e('telegram-badge')}>
            <div className={e('telegram-icon')}>
              <img src={guideIcon} width={16} height={16} alt="" style={{marginTop: 4}} />
            </div>
            <Link className={e('telegram-text')} href={'/market/cart'}>Guide</Link>
            <div className={e('arrow')}>
              <svg width="12" height="16" viewBox="0 0 12 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.99998 11.6667L6.33331 8.33333L2.99998 5" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        )}

        <div className={e('right-section')}>
          <div className={e('btn-group')}>
            <div className={e('balance-icon')}>
              <svg className={e('diamond-icon')} width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.915 2.31099L6.62167 10.7402C6.5571 10.8426 6.46755 10.9269 6.36145 10.9852C6.25534 11.0435 6.13616 11.0738 6.0151 11.0734C5.89403 11.073 5.77506 11.0418 5.66936 10.9828C5.56366 10.9238 5.4747 10.8388 5.41083 10.736L0.221667 2.30765C0.0765355 2.07125 -0.000196165 1.79922 3.76621e-07 1.52182C0.0065815 1.11219 0.175416 0.721902 0.469449 0.436618C0.763481 0.151334 1.15869 -0.00563721 1.56833 0.000154777H10.5825C11.4433 0.000154777 12.1433 0.679321 12.1433 1.51849C12.1428 1.7988 12.0637 2.07335 11.915 2.31099ZM1.49667 2.02932L5.3575 7.98265V1.42932H1.9C1.5 1.42932 1.32167 1.69349 1.49667 2.02932ZM6.78583 7.98265L10.6467 2.02932C10.825 1.69349 10.6433 1.42932 10.2433 1.42932H6.78583V7.98265Z" fill="white"/>
              </svg>
            </div>
            <span className={e('balance-amount')}>{balance}</span>
            <Link className={e('add-button')} to="/wallet"><span style={{fontSize: '18px', marginBottom: '3px'}}>+</span></Link>
          </div>
        </div>
      </div>
    </div>
  );
};

