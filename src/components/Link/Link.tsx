import { openLink, openTelegramLink } from '@telegram-apps/sdk-react';
import { type FC, type MouseEventHandler, useCallback } from 'react';
import { Link as RouterLink, type LinkProps } from '@tanstack/react-router';

import { classNames } from '@/css/classnames.ts';

import './Link.css';

interface CustomLinkProps extends LinkProps {
  className?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
}

export const Link: FC<CustomLinkProps> = ({
  className,
  onClick: propsOnClick,
  to,
  ...rest
}) => {
  const onClick = useCallback<MouseEventHandler<HTMLAnchorElement>>((e) => {
    propsOnClick?.(e);

    // Compute if target path is external. In this case we would like to open
    // link using TMA method.
    let path: string;
    if (typeof rest.href === 'string') {
      path = rest.href;
    } else if (typeof to === 'string') {
      path = to;
    } else {
      const { search = '', pathname = '', hash = '' } = to || {};
      path = `${pathname}?${search}#${hash}`;
    }

    const targetUrl = new URL(path, window.location.toString());
    const currentUrl = new URL(window.location.toString());
    const isExternal = targetUrl.protocol !== currentUrl.protocol
      || targetUrl.host !== currentUrl.host;

    if (isExternal) {
      e.preventDefault();
      
      const urlString = targetUrl.toString();
      const isTelegramLink = urlString.includes('t.me/') || urlString.includes('telegram.me/');
      
      try {
        if (isTelegramLink) {
          // Use openTelegramLink for Telegram links to keep mini app open
          openTelegramLink(urlString);
        } else {
          // Use openLink for other external links
          openLink(urlString, { tryInstantView: true });
        }
      } catch (error) {
        console.error('Failed to open link:', error);
        // Fallback to window.location.href
        window.location.href = urlString;
      }
    }
  }, [to, propsOnClick, rest.href]);

  return (
    <RouterLink
      {...rest}
      to={to}
      onClick={onClick}
      className={classNames(className, 'link')}
    />
  );
};
