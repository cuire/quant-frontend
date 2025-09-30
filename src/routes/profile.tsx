import { createFileRoute } from '@tanstack/react-router'
import { useUser } from '../lib/api-hooks'
import { 
  ProfileHeader, 
  ProfileInfo, 
  ProfileStories, 
  ProfileStats, 
  ProfileReferrals 
} from '../components/Profile'
import '../components/Profile/Profile.css'

export const Route = createFileRoute('/profile')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data: user } = useUser()

  if (!user) {
    return (
      <div className="profile-container">
        <div>Loading...</div>
      </div>
    )
  }

  return (
    <div className="profile-container">
      <ProfileHeader 
        balance={user.balance}
        onSettings={() => console.log('Settings clicked')}
        onDeposit={() => console.log('Deposit clicked')}
      />

      <ProfileInfo 
        photoUrl={user.photo_url}
        username={user.username || `${user.first_name} ${user.last_name}`}
        isPremium={user.is_premium}
      />

      <ProfileStories />

      <ProfileStats 
        totalVolume={user.total_volume}
        buyChannels={user.total_purchases}
        onMoreClick={() => console.log('More stats clicked')}
      />

      <ProfileReferrals 
        referralsCount={user.referrals_count}
        referralsAmount={user.referrals_amount}
        friendsInvited={user.referrals_count}
      />
    </div>
  )
}
