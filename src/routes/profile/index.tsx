import { createFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useUser, useUserProfile, useWithdrawReferralBalance } from '../../lib/api-hooks'
import { useModal } from '../../contexts/ModalContext'
import { 
  ProfileInfo, 
  ProfileStats, 
  ProfileReferrals 
} from '../../components/Profile'
import '../../components/Profile/Profile.css'
import { ProfileLinks } from '../../components/Profile/ProfileLinks'
import { useToast } from '../../hooks/useToast'

export const Route = createFileRoute('/profile/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { t } = useTranslation()
  const { data: user } = useUser()
  const { data: profile } = useUserProfile()
  const withdrawReferralBalance = useWithdrawReferralBalance()
  const { openModal } = useModal()
  const { success: showSuccessToast, warning: showErrorToast } = useToast()

  console.log('- User data:', user)
  console.log('- Profile data:', profile)

  const handleWithdrawReferralBalance = async () => {
    try {
      await withdrawReferralBalance.mutateAsync()
      showSuccessToast({ message: t('profile.referralBalanceWithdrawn') })
    } catch (error) {
      console.error('Failed to withdraw referral balance:', error)
      const errorMessage = (error as any)?.message || t('profile.referralBalanceWithdrawFailed')
      showErrorToast({ message: errorMessage })
    }
  }

  const handleReferralClick = () => {
    openModal('referral')
  }

  if (!user || !profile) {
    return (
      <div className="profile-container">
        <div>{t('profile.loading')}</div>
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
