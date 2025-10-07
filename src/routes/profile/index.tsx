import { createFileRoute } from '@tanstack/react-router'
import { useUser, useUserProfile, useWithdrawReferralBalance } from '../../lib/api-hooks'
import { useModal } from '../../contexts/ModalContext'
import { 
  ProfileInfo, 
  ProfileStats, 
  ProfileReferrals 
} from '../../components/Profile'
import '../../components/Profile/Profile.css'
import { ProfileLinks } from '../../components/Profile/ProfileLinks'

export const Route = createFileRoute('/profile/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data: user } = useUser()
  const { data: profile } = useUserProfile()
  const withdrawReferralBalance = useWithdrawReferralBalance()
  const { openModal } = useModal()

  console.log('- User data:', user)
  console.log('- Profile data:', profile)

  const handleWithdrawReferralBalance = async () => {
    try {
      await withdrawReferralBalance.mutateAsync()
      // Success is handled by the hook's onSuccess callback
    } catch (error) {
      console.error('Failed to withdraw referral balance:', error)
    }
  }

  const handleReferralClick = () => {
    openModal('referral')
  }

  if (!user || !profile) {
    return (
      <div className="profile-container">
        <div>Loading...</div>
      </div>
    )
  }

  return (
    <div className="profile-container">
        <ProfileInfo 
          photoUrl={user.photo_url}
          username={user.username || `${user.first_name} ${user.last_name}`}
          isPremium={user.is_premium}
        />

        {/* <ProfileStories /> */}

        <ProfileStats 
          mainStats={profile.main_stats}
        />

        <ProfileReferrals 
          referralsCount={profile.referral_level}
          referralsAmount={profile.referrals_volume}
          friendsInvited={profile.referrals_count}
          referralBalance={profile.referrals_balance}
          onReferralClick={handleReferralClick}
          onReceiveClick={handleWithdrawReferralBalance}
        />

        <ProfileLinks />
    </div>
  )
}
