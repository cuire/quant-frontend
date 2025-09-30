interface ProfileReferralsProps {
  referralsCount: number;
  referralsAmount: number;
  friendsInvited: number;
  onReferralClick?: () => void;
}

export function ProfileReferrals({ 
  referralsCount = 3, 
  referralsAmount = 500,
  friendsInvited = 12,
  onReferralClick 
}: ProfileReferralsProps) {
  return (
    <div className="profile-referrals">
      <h3 className="profile-referrals__title">Referals</h3>

      <button className="profile-referrals__card" onClick={onReferralClick}>
        <div className="profile-referrals__icon">
          <svg width="32" height="33" viewBox="0 0 32 33" fill="none">
            <path d="M16 2.5C8.28 2.5 2 8.78 2 16.5C2 24.22 8.28 30.5 16 30.5C23.72 30.5 30 24.22 30 16.5C30 8.78 23.72 2.5 16 2.5ZM22.07 10.93L19.71 21.81C19.55 22.56 19.02 22.78 18.32 22.39L14.58 19.69L12.76 21.45C12.56 21.65 12.39 21.82 12 21.82V18.09C12 17.92 12.07 17.76 12.18 17.65L19.35 11.12C19.64 10.86 19.29 10.72 18.9 10.98L10.05 16.67L6.37 15.47C5.59 15.22 5.58 14.66 6.55 14.27L21.14 8.77C21.79 8.52 22.35 8.91 22.07 10.93Z" fill="white"/>
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
          <svg width="8" height="17" viewBox="0 0 8 17" fill="none">
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
              <path d="M9 8.5C11.21 8.5 13 6.71 13 4.5C13 2.29 11.21 0.5 9 0.5C6.79 0.5 5 2.29 5 4.5C5 6.71 6.79 8.5 9 8.5ZM9 10.5C6.33 10.5 1 11.84 1 14.5V16.5H17V14.5C17 11.84 11.67 10.5 9 10.5ZM17.07 8.81C18.21 9.72 19 11.02 19 12.5V16.5H25V14.5C25 12.09 20.69 10.79 17.07 8.81ZM16 8.5C18.21 8.5 20 6.71 20 4.5C20 2.29 18.21 0.5 16 0.5C15.53 0.5 15.09 0.58 14.67 0.72C15.49 1.66 16 2.88 16 4.25C16 5.62 15.49 6.84 14.67 7.78C15.09 7.92 15.53 8 16 8.5Z" fill="white"/>
            </svg>
          </div>
        </div>

        <div className="profile-referrals__stat-card profile-referrals__stat-card--green">
          <div className="profile-referrals__stat-label">Receive:</div>
          <div className="profile-referrals__stat-value">{referralsAmount} TON</div>
        </div>
      </div>
    </div>
  );
}
