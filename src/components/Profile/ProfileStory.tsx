interface ProfileStoryProps {
  text: string;
  isRead?: boolean;
  onClick?: () => void;
}

export function ProfileStory({ text, isRead = true, onClick }: ProfileStoryProps) {
  return (
    <button 
      className={`profile-story ${!isRead ? 'profile-story--unread' : ''}`}
      onClick={onClick}
    >
      <div className="profile-story__gradient">
        <span className="profile-story__text">{text}</span>
        <div className="profile-story__icon">
          <svg width="67" height="67" viewBox="0 0 67 67" fill="none">
            <circle cx="33.5" cy="33.5" r="20" fill="rgba(255,255,255,0.2)"/>
            <path d="M33.5 23.5L33.5 43.5M23.5 33.5H43.5" stroke="white" strokeWidth="3" strokeLinecap="round"/>
          </svg>
        </div>
      </div>
    </button>
  );
}
