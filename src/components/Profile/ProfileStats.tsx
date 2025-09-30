interface ProfileStatsProps {
  totalVolume: number;
  buyChannels: number;
  onMoreClick?: () => void;
}

export function ProfileStats({ totalVolume, buyChannels, onMoreClick }: ProfileStatsProps) {
  return (
    <div className="profile-stats">
      <div className="profile-stats__header">
        <h3 className="profile-stats__title">Statistics</h3>
        <button className="profile-stats__more" onClick={onMoreClick}>
          <span>more</span>
          <svg width="8" height="17" viewBox="0 0 8 17" fill="none">
            <path d="M1 1L7 8.5L1 16" stroke="#888B8E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      <div className="profile-stats__cards">
        <div className="profile-stats__card">
          <div className="profile-stats__card-content">
            <div className="profile-stats__card-value">{totalVolume} TON</div>
            <div className="profile-stats__card-label">Total Volume</div>
          </div>
          <div className="profile-stats__ton-icon">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 0C3.58 0 0 3.58 0 8C0 12.42 3.58 16 8 16C12.42 16 16 12.42 16 8C16 3.58 12.42 0 8 0ZM11.21 5.5L9.36 11.31C9.28 11.56 9.02 11.68 8.79 11.56L6.86 10.5L5.86 11.46C5.72 11.6 5.5 11.52 5.5 11.32V9.59C5.5 9.52 5.53 9.46 5.58 9.41L9.35 5.94C9.43 5.87 9.35 5.75 9.25 5.8L4.68 8.83L2.77 8.09C2.54 8.01 2.53 7.71 2.76 7.62L10.96 4.51C11.18 4.42 11.42 4.59 11.35 4.83L11.21 5.5Z" fill="white"/>
            </svg>
          </div>
        </div>

        <div className="profile-stats__card">
          <div className="profile-stats__card-content">
            <div className="profile-stats__card-value">{buyChannels}</div>
            <div className="profile-stats__card-label">Buy Channels</div>
          </div>
          <div className="profile-stats__channel-icon">
            <svg width="23" height="23" viewBox="0 0 23 23" fill="none">
              <circle cx="11.5" cy="11.5" r="11.5" fill="url(#paint0_linear)" />
              <path d="M11.5 6C8.46 6 6 8.46 6 11.5C6 14.54 8.46 17 11.5 17C14.54 17 17 14.54 17 11.5C17 8.46 14.54 6 11.5 6ZM11.5 15C9.57 15 8 13.43 8 11.5C8 9.57 9.57 8 11.5 8C13.43 8 15 9.57 15 11.5C15 13.43 13.43 15 11.5 15Z" fill="white"/>
              <defs>
                <linearGradient id="paint0_linear" x1="0" y1="0" x2="23" y2="23" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#667E96"/>
                  <stop offset="1" stopColor="#47515C"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
