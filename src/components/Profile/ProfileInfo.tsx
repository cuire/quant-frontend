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


const ProfileLevel = ({ level }: { level: number }) => {
  return (
    <div className="profile-info__tg-badge">
      <svg width="26" height="25" viewBox="0 0 26 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11.148 0.767116C12.1711 -0.255633 13.8297 -0.255778 14.8527 0.767116L16.1496 2.06404C16.6811 2.5955 17.4019 2.89407 18.1535 2.89407H19.9867C21.4335 2.89418 22.6066 4.0671 22.6066 5.51396V7.34753C22.6066 8.09893 22.905 8.81957 23.4362 9.351L24.7327 10.648C25.7557 11.6711 25.7558 13.3296 24.7327 14.3527L23.4366 15.6488C22.9052 16.1802 22.6066 16.901 22.6066 17.6526V19.4867C22.6065 20.9335 21.4335 22.1065 19.9867 22.1066H18.1526C17.401 22.1066 16.6802 22.4052 16.1488 22.9366L14.8527 24.2327C13.8296 25.2558 12.1711 25.2557 11.148 24.2327L9.85193 22.9366C9.32047 22.4052 8.59966 22.1066 7.84806 22.1066H6.01397C4.56712 22.1066 3.39419 20.9335 3.39409 19.4867V17.653C3.39409 16.9012 3.09536 16.1802 2.56366 15.6487L1.26713 14.3527C0.244228 13.3296 0.244351 11.6711 1.26713 10.648L2.56406 9.35106C3.09552 8.81961 3.39409 8.09879 3.39409 7.3472V5.51396C3.39409 4.06704 4.56705 2.89407 6.01397 2.89407H7.84721C8.5988 2.89407 9.31962 2.5955 9.85107 2.06404L11.148 0.767116Z" fill="white"/>
      </svg>
      <span>{level}</span>
    </div>
  )
}


export function ProfileInfo({ 
  photoUrl, 
  username, 
  isPremium: _isPremium, 
  telegramLevel = 7,
  badges = []
}: ProfileInfoProps) {
  return (
    <div className="profile-info">
      <div className="profile-info__avatar-wrapper">
        <img 
          src={photoUrl} 
          alt={username} 
          className="profile-info__avatar"
        />
        <ProfileLevel level={telegramLevel} />
      </div>

      <div className="profile-info__details">
        <div 
          className="profile-info__username"
          style={{ cursor: 'pointer' }}
        >
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
