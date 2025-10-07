import type { FC } from 'react';
import { config } from '@/lib/config';

export interface ProfileLinksProps {
  giftChannelUrl?: string;
  giftChatUrl?: string;
  channelChannelUrl?: string;
  channelChatUrl?: string;
}

export const ProfileLinks: FC<ProfileLinksProps> = ({
  giftChannelUrl,
  giftChatUrl,
  channelChannelUrl,
  channelChatUrl,
}) => {
  // Allow env-config override in future if needed
  const links = [
    { label: 'Канал про подарки', url: giftChannelUrl || config.telegramChannelUrl },
    { label: 'Чат про подарки', url: giftChatUrl || config.settings.supportUrl },
    { label: 'Канал про каналы', url: channelChannelUrl || config.telegramChannelUrl },
    { label: 'Чат про каналы', url: channelChatUrl || config.settings.supportUrl },
  ];

  return (
    <div className="profile-links">
      <div className="profile-links__header">
        <h3 className="profile-links__title">Links</h3>
      </div>
      <div className="profile-links__grid">
        {links.map((item, i) => (
          <a key={i} href={item.url} target="_blank" rel="noopener noreferrer" className="profile-links__item">
            <span className="profile-links__icon">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.05066 11.5142L5.644 9.65624C5.31699 9.98083 4.90121 10.2014 4.44906 10.29C3.99691 10.3786 3.52864 10.3314 3.10328 10.1543C2.67792 9.97719 2.31452 9.67811 2.0589 9.29477C1.80327 8.91143 1.66685 8.46099 1.66685 8.00024C1.66685 7.53948 1.80327 7.08904 2.0589 6.7057C2.31452 6.32236 2.67792 6.02328 3.10328 5.84617C3.52864 5.66906 3.99691 5.62185 4.44906 5.71048C4.90121 5.79912 5.31699 6.01964 5.644 6.34424L9.05066 4.48624C8.93383 3.93806 9.01821 3.36614 9.28839 2.87507C9.55857 2.384 9.99649 2.00659 10.5221 1.81186C11.0476 1.61713 11.6257 1.61809 12.1507 1.81456C12.6756 2.01104 13.1123 2.3899 13.3808 2.88186C13.6494 3.37383 13.7318 3.94602 13.6132 4.49381C13.4945 5.04159 13.1827 5.52836 12.7346 5.8651C12.2865 6.20185 11.7323 6.36605 11.1731 6.3277C10.6139 6.28935 10.0872 6.051 9.68933 5.65624L6.28266 7.51424C6.3508 7.83443 6.3508 8.16538 6.28266 8.48557L9.68933 10.3442C10.0872 9.94947 10.6139 9.71112 11.1731 9.67277C11.7323 9.63442 12.2865 9.79863 12.7346 10.1354C13.1827 10.4721 13.4945 10.9589 13.6132 11.5067C13.7318 12.0545 13.6494 12.6266 13.3808 13.1186C13.1123 13.6106 12.6756 13.9894 12.1507 14.1859C11.6257 14.3824 11.0476 14.3833 10.5221 14.1886C9.99649 13.9939 9.55857 13.6165 9.28839 13.1254C9.01821 12.6343 8.93383 12.0624 9.05066 11.5142Z" fill="white"/>
              </svg>
            </span>
            <span className="profile-links__label">{item.label}</span>
            <span className="profile-links__arrow">
              <svg width="4" height="8.5" viewBox="0 0 8 17" fill="none">
                <path d="M1 1L7 8.5L1 16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}


