interface Badge {
  text: string;
  color: 'orange' | 'green' | 'blue';
}

interface ProfileInfoProps {
  photoUrl: string;
  username: string;
  isPremium: boolean;
  telegramLevel?: number;
  badges?: Badge[];
}

export function ProfileInfo({ 
  photoUrl, 
  username, 
  isPremium, 
  telegramLevel = 7,
  badges = [
    { text: 'Excellent User', color: 'orange' },
    { text: 'good buyer', color: 'green' }
  ]
}: ProfileInfoProps) {
  return (
    <div className="profile-info">
      <div className="profile-info__avatar-wrapper">
        <img 
          src={photoUrl} 
          alt={username} 
          className="profile-info__avatar"
        />
        <div className="profile-info__tg-badge">
          <svg width="25" height="25" viewBox="0 0 25 25" fill="none">
            <path d="M12.5 0.5C5.87 0.5 0.5 5.87 0.5 12.5C0.5 19.13 5.87 24.5 12.5 24.5C19.13 24.5 24.5 19.13 24.5 12.5C24.5 5.87 19.13 0.5 12.5 0.5Z" fill="#0088CC"/>
            <path d="M17.52 8.59L15.18 17.91C15.01 18.58 14.63 18.75 14.11 18.45L11.07 16.27L9.6 17.68C9.44 17.84 9.3 17.98 8.98 17.98L9.2 14.88L14.76 9.92C15 9.71 14.72 9.59 14.42 9.8L7.55 14.08L4.55 13.14C3.91 12.94 3.9 12.5 4.68 12.2L16.69 7.59C17.22 7.39 17.69 7.71 17.52 8.59Z" fill="white"/>
          </svg>
          <span>{telegramLevel}</span>
        </div>
      </div>

      <div className="profile-info__details">
        <div className="profile-info__username">
          {username}
        </div>
        <div className="profile-info__badges">
          {badges.map((badge, index) => (
            <span 
              key={index} 
              className={`profile-info__badge profile-info__badge--${badge.color}`}
            >
              {badge.text}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
