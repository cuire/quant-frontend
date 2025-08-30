import { Link, useLocation } from '@tanstack/react-router';
import { bem } from '@/css/bem.ts';
import { classNames } from '@/css/classnames.ts';

import './BottomNav.css';

const [b, e] = bem('bottom-nav');

interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: string; // Placeholder for now, will be replaced with actual SVG
}

const navItems: NavItem[] = [
  { id: 'market', label: 'Market', path: '/', icon: '🛒' },
  { id: 'activity', label: 'Activity', path: '/activity', icon: '📊' },
  { id: 'storage', label: 'Storage', path: '/storage', icon: '📦' },
  { id: 'profile', label: 'Profile', path: '/profile', icon: '👤' },
];

export const BottomNav = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <nav className={b()}>
      {navItems.map((item) => {
        const isActive = currentPath === item.path;
        
        return (
          <Link
            key={item.id}
            to={item.path}
            className={classNames(e('item'), { active: isActive })}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <div className={e('icon')}>
              {item.icon}
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
