interface ProfileHeaderProps {
  balance: number;
  onSettings?: () => void;
  onDeposit?: () => void;
}

export function ProfileHeader({ balance, onSettings, onDeposit }: ProfileHeaderProps) {
  return (
    <div className="profile-header">
      <button className="profile-header__settings" onClick={onSettings}>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M15.19 9.79L16.31 10.62C16.42 10.71 16.46 10.86 16.4 11L15.31 13C15.25 13.14 15.1 13.21 14.96 13.17L13.65 12.72C13.35 12.96 13.03 13.16 12.68 13.32L12.5 14.7C12.47 14.85 12.35 14.96 12.2 14.96H10C9.85 14.96 9.73 14.85 9.7 14.7L9.52 13.32C9.17 13.16 8.85 12.96 8.55 12.72L7.24 13.17C7.1 13.21 6.95 13.14 6.89 13L5.8 11C5.74 10.86 5.78 10.71 5.89 10.62L7.01 9.79C7 9.6 7 9.4 7 9.2C7 9 7 8.8 7.01 8.61L5.89 7.78C5.78 7.69 5.74 7.54 5.8 7.4L6.89 5.4C6.95 5.26 7.1 5.19 7.24 5.23L8.55 5.68C8.85 5.44 9.17 5.24 9.52 5.08L9.7 3.7C9.73 3.55 9.85 3.44 10 3.44H12.2C12.35 3.44 12.47 3.55 12.5 3.7L12.68 5.08C13.03 5.24 13.35 5.44 13.65 5.68L14.96 5.23C15.1 5.19 15.25 5.26 15.31 5.4L16.4 7.4C16.46 7.54 16.42 7.69 16.31 7.78L15.19 8.61C15.2 8.8 15.2 9 15.2 9.2C15.2 9.4 15.2 9.6 15.19 9.79ZM11.1 7.2C9.94 7.2 9 8.14 9 9.3C9 10.46 9.94 11.4 11.1 11.4C12.26 11.4 13.2 10.46 13.2 9.3C13.2 8.14 12.26 7.2 11.1 7.2Z" fill="white"/>
        </svg>
      </button>

      <div className="profile-header__balance">
        <div className="profile-header__ton-icon">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 0C3.58 0 0 3.58 0 8C0 12.42 3.58 16 8 16C12.42 16 16 12.42 16 8C16 3.58 12.42 0 8 0ZM11.21 5.5L9.36 11.31C9.28 11.56 9.02 11.68 8.79 11.56L6.86 10.5L5.86 11.46C5.72 11.6 5.5 11.52 5.5 11.32V9.59C5.5 9.52 5.53 9.46 5.58 9.41L9.35 5.94C9.43 5.87 9.35 5.75 9.25 5.8L4.68 8.83L2.77 8.09C2.54 8.01 2.53 7.71 2.76 7.62L10.96 4.51C11.18 4.42 11.42 4.59 11.35 4.83L11.21 5.5Z" fill="white"/>
          </svg>
        </div>
        <span className="profile-header__balance-amount">{balance.toFixed(2)}</span>
        <button className="profile-header__deposit-btn" onClick={onDeposit}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 3V13M3 8H13" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
