interface ProfileReferralsProps {
  referralsCount: number;
  referralsAmount: number;
  friendsInvited: number;
  referralBalance: number;
  onReferralClick?: () => void;
  onReceiveClick?: () => void;
}

export function ProfileReferrals({ 
  referralsCount = 3, 
  referralsAmount: _referralsAmount = 500,
  friendsInvited = 12,
  referralBalance = 0,
  onReferralClick,
  onReceiveClick
}: ProfileReferralsProps) {
  // referralsAmount is kept for backward compatibility but not used in the UI
  return (
    <div className="profile-referrals">
      <h3 className="profile-referrals__title">Referals</h3>

      <button className="profile-referrals__card" onClick={onReferralClick}>
        <div className="profile-referrals__icon">
          <svg width="32" height="30" viewBox="0 0 32 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M32 8.40909C32 4.04152 28.2684 0.5 23.6658 0.5C20.2258 0.5 17.2711 2.47903 16 5.30345C14.7289 2.47903 11.7742 0.5 8.33244 0.5C3.73333 0.5 0 4.04152 0 8.40909C0 21.0988 16 29.5 16 29.5C16 29.5 32 21.0988 32 8.40909Z" fill="url(#paint0_linear_64_530)"/>
            <defs>
            <linearGradient id="paint0_linear_64_530" x1="0" y1="15" x2="32" y2="15" gradientUnits="userSpaceOnUse">
            <stop stop-color="#FFAE00"/>
            <stop offset="1" stop-color="#8B25CA"/>
            </linearGradient>
            </defs>
          </svg>
          <span className="profile-referrals__count">{referralsCount}</span>
        </div>

        <div className="profile-referrals__content">
          <div className="profile-referrals__text">Заработать на продвижении</div>
          <div className="profile-referrals__description">
            Рекомендуйте рефералку своим друзьям и получайте долю их прибыли.
          </div>
        </div>

        <div className="profile-referrals__arrow">
          <svg width="4" height="8.5" viewBox="0 0 8 17" fill="none">
            <path d="M1 1L7 8.5L1 16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </button>

      <div className="profile-referrals__stats">
        <div className="profile-referrals__stat-card">
          <div className="profile-referrals__stat-content">
            <div className="profile-referrals__stat-value">{friendsInvited}</div>
            <div className="profile-referrals__stat-label">Friends Invited</div>
          </div>
          <div className="profile-referrals__stat-icon">
            <svg width="26" height="17" viewBox="0 0 26 17" fill="none">
              <path d="M9 8.5C11.21 8.5 13 6.71 13 4.5C13 2.29 11.21 0.5 9 0.5C6.79 0.5 5 2.29 5 4.5C5 6.71 6.79 8.5 9 8.5ZM9 10.5C6.33 10.5 1 11.84 1 14.5V16.5H17V14.5C17 11.84 11.67 10.5 9 10.5ZM17.07 8.81C18.21 9.72 19 11.02 19 12.5V16.5H25V14.5C25 12.09 20.69 10.79 17.07 8.81ZM16 8.5C18.21 8.5 20 6.71 20 4.5C20 2.29 18.21 0.5 16 0.5C15.53 0.5 15.09 0.58 14.67 0.72C15.49 1.66 16 2.88 16 4.25C16 5.62 15.49 6.84 14.67 7.78C15.09 7.92 15.53 8 16 8.5Z" fill="#CD62FF"/>
            </svg>
          </div>
        </div>

        <button 
          className={`profile-referrals__stat-card profile-referrals__stat-card-receive${referralBalance > 0 ? ' profile-referrals__stat-card-receive-green' : ''}`} 
          onClick={onReceiveClick}
          disabled={referralBalance <= 0}
        >
          <div className="profile-referrals__stat-label">Receive:</div>
          <div className="profile-referrals__stat-value">{referralBalance} TON</div>
        </button>
      </div>
    </div>
  );
}
