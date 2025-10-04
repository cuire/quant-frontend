import { createFileRoute } from '@tanstack/react-router'
import { useUserProfile } from '../../lib/api-hooks'
import '../../components/Profile/Profile.css'

export const Route = createFileRoute('/profile/stats')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data: profile, isLoading, error } = useUserProfile()

  if (isLoading) {
    return (
      <div className="profile-container">
        <div>Loading...</div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="profile-container">
        <div>Error loading stats</div>
      </div>
    )
  }

  const getIconComponent = (icon: string) => {
    switch (icon) {
      case 'TON':
        return (
          <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="0.5" width="20" height="20" rx="10" fill="#248BDA"/>
            <path d="M15.1746 8.13395L10.94 14.8773C10.8883 14.9592 10.8167 15.0267 10.7318 15.0733C10.6469 15.1199 10.5516 15.1442 10.4547 15.1439C10.3579 15.1436 10.2627 15.1186 10.1781 15.0714C10.0936 15.0242 10.0224 14.9562 9.97131 14.8739L5.81997 8.13128C5.70387 7.94215 5.64248 7.72453 5.64264 7.50261C5.6479 7.17491 5.78297 6.86268 6.0182 6.63445C6.25342 6.40622 6.56959 6.28065 6.89731 6.28528H14.1086C14.7973 6.28528 15.3573 6.82861 15.3573 7.49995C15.3569 7.7242 15.2936 7.94383 15.1746 8.13395ZM6.83997 7.90861L9.92864 12.6713V7.42861H7.16264C6.84264 7.42861 6.69997 7.63995 6.83997 7.90861ZM11.0713 12.6713L14.16 7.90861C14.3026 7.63995 14.1573 7.42861 13.8373 7.42861H11.0713V12.6713Z" fill="white"/>
          </svg>
        )
      case 'cart':
        return (
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
        )
      case 'sales':
        return (
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
        )
      case 'gift':
        return (
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
        )
      case 'channel':
        return (
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
        )
      default:
        return (
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
        )
    }
  }

  return (
    <div className="profile-container">
        <div className="profile-stats-page">
          <div className="profile-stats-page__header">
            <h2 className="profile-stats-page__title">All Statistics</h2>
          </div>

          <div className="profile-stats-page__grid">
            {profile.all_stats.map((stat, index) => (
              <div key={index} className="profile-stats-page__card">
                <div className="profile-stats-page__card-content">
                  <div className="profile-stats-page__card-value">{stat.value}</div>
                  <div className="profile-stats-page__card-label">{stat.name}</div>
                </div>
                <div className={`profile-stats-page__${stat.icon}-icon`}>
                  {getIconComponent(stat.icon)}
                </div>
              </div>
            ))}
          </div>
        </div>
    </div>
  )
}