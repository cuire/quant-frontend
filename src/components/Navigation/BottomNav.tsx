import { Link, useLocation } from '@tanstack/react-router';
import { bem } from '@/css/bem.ts';
import { classNames } from '@/css/classnames.ts';
import { useLastTab } from '@/hooks/useLastTab';

import './BottomNav.css';

const [b, e] = bem('bottom-nav');

interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: 'market' | 'activity' | 'storage' | 'profile';
  dynamicPath?: () => string;
}


function Icon({ name, active }: { name: NavItem['icon']; active: boolean }) {
  const fill = active ? '#248BDA' : '#47515C';
  switch (name) {
    case 'market':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21.2209 8.66667H18.329L17.7127 4.78333C17.5885 4.19578 17.3158 3.65466 16.9234 3.21743C16.5311 2.78019 16.0339 2.46316 15.4845 2.3C14.9323 2.11363 14.3574 2.01258 13.7778 2H10.238C9.65835 2.01258 9.08348 2.11363 8.5313 2.3C7.9819 2.46316 7.48465 2.78019 7.09234 3.21743C6.70003 3.65466 6.4273 4.19578 6.30312 4.78333L5.68682 8.66667H2.79493C2.67046 8.66587 2.54758 8.6961 2.4363 8.75488C2.32501 8.81367 2.22846 8.89935 2.15452 9.00495C2.08059 9.11055 2.03135 9.23307 2.01082 9.36255C1.99029 9.49202 1.99906 9.62478 2.0364 9.75L5.0073 20.25C5.15855 20.7572 5.45921 21.2004 5.8656 21.5151C6.27198 21.8298 6.76292 21.9997 7.26709 22H16.7487C17.2502 21.9961 17.7375 21.8247 18.1408 21.5102C18.544 21.1958 18.8422 20.7545 18.9927 20.25L21.9636 9.75C22.0005 9.62612 22.0095 9.49484 21.9898 9.36664C21.9701 9.23844 21.9223 9.11687 21.8502 9.01163C21.778 8.90639 21.6835 8.82039 21.5743 8.7605C21.465 8.70061 21.344 8.66847 21.2209 8.66667ZM7.29869 8.66667L7.86759 5.05C7.92995 4.75471 8.07463 4.48583 8.28301 4.27793C8.4914 4.07003 8.75397 3.93261 9.03699 3.88333C9.42573 3.75333 9.83028 3.68167 10.238 3.66667H13.7778C14.1918 3.68111 14.5974 3.75333 14.9946 3.88333C15.2776 3.93261 15.5402 4.07003 15.7486 4.27793C15.957 4.48583 16.1016 4.75471 16.164 5.05L16.7171 8.66667H7.23548H7.29869Z" fill={fill}/>
        </svg>
      );
    case 'activity':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6.44444 17.5556H8.66667V12H6.44444V17.5556ZM15.3333 17.5556H17.5556V6.44444H15.3333V17.5556ZM10.8889 17.5556H13.1111V14.2222H10.8889V17.5556ZM10.8889 12H13.1111V9.77778H10.8889V12ZM4.22222 22C3.61111 22 3.08815 21.7826 2.65333 21.3478C2.21852 20.913 2.00074 20.3896 2 19.7778V4.22222C2 3.61111 2.21778 3.08815 2.65333 2.65333C3.08889 2.21852 3.61185 2.00074 4.22222 2H19.7778C20.3889 2 20.9122 2.21778 21.3478 2.65333C21.7833 3.08889 22.0007 3.61185 22 4.22222V19.7778C22 20.3889 21.7826 20.9122 21.3478 21.3478C20.913 21.7833 20.3896 22.0007 19.7778 22H4.22222Z" fill={fill}/>
        </svg>
      );
    case 'storage':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4.22222 22L2 8.66667H22L19.7778 22H4.22222ZM9.77778 15.3333H14.2222C14.537 15.3333 14.8011 15.2267 15.0144 15.0133C15.2278 14.8 15.3341 14.5363 15.3333 14.2222C15.3326 13.9081 15.2259 13.6444 15.0133 13.4311C14.8007 13.2178 14.537 13.1111 14.2222 13.1111H9.77778C9.46296 13.1111 9.19926 13.2178 8.98667 13.4311C8.77407 13.6444 8.66741 13.9081 8.66667 14.2222C8.66593 14.5363 8.77259 14.8004 8.98667 15.0144C9.20074 15.2285 9.46444 15.3348 9.77778 15.3333ZM5.33333 7.55556C5.01852 7.55556 4.75482 7.44889 4.54222 7.23556C4.32963 7.02222 4.22296 6.75852 4.22222 6.44444C4.22148 6.13037 4.32815 5.86667 4.54222 5.65333C4.7563 5.44 5.02 5.33333 5.33333 5.33333H18.6667C18.9815 5.33333 19.2456 5.44 19.4589 5.65333C19.6722 5.86667 19.7785 6.13037 19.7778 6.44444C19.777 6.75852 19.6704 7.02259 19.4578 7.23667C19.2452 7.45074 18.9815 7.55704 18.6667 7.55556H5.33333ZM7.55556 4.22222C7.24074 4.22222 6.97704 4.11556 6.76444 3.90222C6.55185 3.68889 6.44519 3.42519 6.44444 3.11111C6.4437 2.79704 6.55037 2.53333 6.76444 2.32C6.97852 2.10667 7.24222 2 7.55556 2H16.4444C16.7593 2 17.0233 2.10667 17.2367 2.32C17.45 2.53333 17.5563 2.79704 17.5556 3.11111C17.5548 3.42519 17.4481 3.68926 17.2356 3.90333C17.023 4.11741 16.7593 4.2237 16.4444 4.22222H7.55556Z" fill={fill}/>
        </svg>
      );
    case 'profile':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" clipRule="evenodd" d="M7.55556 6.44444C7.55556 5.2657 8.02381 4.13524 8.8573 3.30175C9.6908 2.46825 10.8213 2 12 2C13.1787 2 14.3092 2.46825 15.1427 3.30175C15.9762 4.13524 16.4444 5.2657 16.4444 6.44444C16.4444 7.62318 15.9762 8.75365 15.1427 9.58714C14.3092 10.4206 13.1787 10.8889 12 10.8889C10.8213 10.8889 9.6908 10.4206 8.8573 9.58714C8.02381 8.75365 7.55556 7.62318 7.55556 6.44444ZM7.55556 13.1111C6.08213 13.1111 4.66905 13.6964 3.62718 14.7383C2.58532 15.7802 2 17.1932 2 18.6667C2 19.5507 2.35119 20.3986 2.97631 21.0237C3.60143 21.6488 4.44928 22 5.33333 22H18.6667C19.5507 22 20.3986 21.6488 21.0237 21.0237C21.6488 20.3986 22 19.5507 22 18.6667C22 17.1932 21.4147 15.7802 20.3728 14.7383C19.3309 13.6964 17.9179 13.1111 16.4444 13.1111H7.55556Z" fill={fill}/>
        </svg>
      );
  }
}

export const BottomNav = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Use the custom hook to track localStorage changes
  const [lastTab] = useLastTab('market-last-tab', 'channels');

  // Get the market path dynamically based on last opened tab
  const getMarketPath = () => {
    return `/market/${lastTab}`;
  };

  // Get the activity path dynamically based on last opened tab
  const getActivityPath = () => {
    return `/activity/${lastTab}`;
  };

  const navItems: NavItem[] = [
    { id: 'market', label: 'Market', path: '/market', icon: 'market', dynamicPath: getMarketPath },
    { id: 'activity', label: 'Activity', path: '/activity', icon: 'activity', dynamicPath: getActivityPath },
    { id: 'storage', label: 'Storage', path: '/storage', icon: 'storage' },
    { id: 'profile', label: 'Profile', path: '/profile', icon: 'profile' },
  ];

  return (
    <nav className={b()}>
      {navItems.map((item) => {
        // Use dynamic path for market and activity, static path for others
        const itemPath = item.dynamicPath ? item.dynamicPath() : item.path;
        const isActive = item.path !== '/' ? currentPath.startsWith(item.path) : currentPath === item.path;
        
        return (
          <Link
            key={item.id}
            to={itemPath}
            className={classNames(e('item'), { active: isActive })}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <div className={e('icon')}>
              <Icon name={item.icon} active={isActive} />
            </div>
            <span className={e('label')}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
};
