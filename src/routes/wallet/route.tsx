import { createFileRoute } from '@tanstack/react-router';
import { useUser, useUserActivityInfinite, useWallets, useConnectWallet, useDisconnectWallet, useInitiateDeposit, useInitiateWithdrawal } from '@/lib/api-hooks';
import { useTonWallet } from '@tonconnect/ui-react';
import { useEffect, useMemo, useState } from 'react';
import { TransactionList } from '@/components/TransactionList';
import './wallet.css';
import { MarketTopBar } from '@/components/MarketHeader';
import { initData } from '@telegram-apps/sdk-react';


export const Route = createFileRoute('/wallet')({
  component: WalletPage,
});

function WalletPage() {
  const { data: user, isLoading } = useUser();
  const wallet = useTonWallet();
  const { data: activityPages } = useUserActivityInfinite(20, ['deposit','withdrawal','referral_reward']);
  const { data: wallets } = useWallets();
  const connectWalletMutation = useConnectWallet();
  const disconnectWalletMutation = useDisconnectWallet();
  const initiateDepositMutation = useInitiateDeposit();
  const initiateWithdrawalMutation = useInitiateWithdrawal();

  const activeWallet = useMemo(() => (wallets || []).find(w => w.is_active) || null, [wallets]);

  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState<string>('');
  const [withdrawAmount, setWithdrawAmount] = useState<string>('');
  const [modalError, setModalError] = useState<string | null>(null);

  useEffect(() => {
    // Sync wallet connection state with backend
    const address = wallet?.account?.address;
    const provider = (wallet as any)?.device?.appName || 'TON Wallet';
    if (address) {
      connectWalletMutation.mutate({ address, provider });
    } else if (!address && activeWallet?.id) {
      disconnectWalletMutation.mutate(activeWallet.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet?.account?.address]);

  const handleDeposit = async () => {
    setModalError(null);
    const amountNum = Number(depositAmount);
    if (!activeWallet?.id) {
      setModalError('No active wallet');
      return;
    }
    if (!amountNum || amountNum <= 0) {
      setModalError('Enter a valid amount');
      return;
    }
    try {
      const res = await initiateDepositMutation.mutateAsync({ walletId: activeWallet.id, amount: amountNum });
      // Optionally redirect to res.payment_url or open wallet via ton:// link
      if (res?.payment_url) {
        window.location.href = res.payment_url;
      }
      setShowDepositModal(false);
      setDepositAmount('');
    } catch (e: any) {
      setModalError(e?.message || 'Failed to initiate deposit');
    }
  };

  const handleWithdraw = async () => {
    setModalError(null);
    const amountNum = Number(withdrawAmount);
    const addressFriendly = wallet?.account?.address;
    if (!addressFriendly) {
      setModalError('Wallet not connected');
      return;
    }
    if (!amountNum || amountNum <= 0) {
      setModalError('Enter a valid amount');
      return;
    }
    try {
      await initiateWithdrawalMutation.mutateAsync({ walletAddress: addressFriendly, amount: amountNum });
      setShowWithdrawModal(false);
      setWithdrawAmount('');
    } catch (e: any) {
      setModalError(e?.message || 'Failed to initiate withdrawal');
    }
  };

  

  // const connect = () => tonConnectUI.openModal();
  if (isLoading) {
    return (
      <div className="wallet-page" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div>Loading wallet...</div>
      </div>
    );
  }

  return (
    <>
      <MarketTopBar showConnectButton={true} />
      <div className="wallet-page">
        {/* Wallet Balance Section */}
        <div className="wallet-balance-section">
          <div className="wallet-balance-section-header">
            <div className="wallet-balance-label">
              Wallet balance
            </div>
            <div className="wallet-balance-amount">
              {`${(user?.balance || 100799).toLocaleString()} TON`}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="wallet-action-buttons">
            <button className="wallet-action-button" disabled={!wallet} onClick={() => setShowWithdrawModal(true)}>
              <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.25 15L9.25 21M9.25 21L3.25 15M9.25 21V9C9.25 7.4087 9.88214 5.88258 11.0074 4.75736C12.1326 3.63214 13.6587 3 15.25 3C16.8413 3 18.3674 3.63214 19.4926 4.75736C20.6179 5.88258 21.25 7.4087 21.25 9V12" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Withdraw
            </button>
            <button className="wallet-action-button" disabled={!wallet} onClick={() => setShowDepositModal(true)}>
              <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.75 9L15.75 3M15.75 3L21.75 9M15.75 3V15C15.75 16.5913 15.1179 18.1174 13.9926 19.2426C12.8674 20.3679 11.3413 21 9.75 21C8.1587 21 6.63258 20.3679 5.50736 19.2426C4.38214 18.1174 3.75 16.5913 3.75 15V12" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Deposit
            </button>
          </div>
        </div>

        {/* Transaction Section */}
        <TransactionList 
          transactions={(activityPages?.pages || [])
            .flatMap((page) => page.activities || [])
            .map((a: any) => {
              const created = new Date(a.created_at);
              const hh = String(created.getHours()).padStart(2, '0');
              const mm = String(created.getMinutes()).padStart(2, '0');
              return {
                id: a.id,
                date: created.toISOString(),
                type: a.type === 'withdrawal' ? 'withdraw' : a.type === 'deposit' ? 'deposit' : 'referral',
                description: a.type === 'withdrawal' ? 'Withdraw' : a.type === 'deposit' ? 'Deposit' : 'Referral reward',
                time: `${hh}:${mm}`,
                amount: a.amount ?? 0,
              };
            })}
          onTransactionClick={(transaction) => {
            console.log('Transaction clicked:', transaction);
          }}
          emptyState={{
            title: "Nothing to see here",
            subtitle: "Make your first sales with",
            actionText: "Market",
          }}
        />
        {/* Modals */}
        {showDepositModal && (
          <div className="wallet-modal-overlay" onClick={() => setShowDepositModal(false)}>
            <div className="wallet-modal" onClick={(e) => e.stopPropagation()}>
              <div className="wallet-modal__title">Deposit</div>
              <div className="wallet-modal__field">
                <input
                  type="number"
                  placeholder="Amount (TON)"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  style={{ width: '100%', height: '36px', borderRadius: '10px', border: '1px solid #3F4B58', background: 'transparent', color: '#E7EEF7', padding: '0 12px' }}
                />
              </div>
              {modalError && <div style={{ color: '#FF6B6B', fontSize: '12px' }}>{modalError}</div>}
              <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                <button className="market-header__btn-secondary" onClick={() => setShowDepositModal(false)}>Cancel</button>
                <button className="market-header__btn-primary" onClick={handleDeposit} disabled={initiateDepositMutation.isPending}>
                  {initiateDepositMutation.isPending ? 'Processing…' : 'Deposit'}
                </button>
              </div>
            </div>
          </div>
        )}
        {showWithdrawModal && (
          <div className="wallet-modal-overlay" onClick={() => setShowWithdrawModal(false)}>
            <div className="wallet-modal" onClick={(e) => e.stopPropagation()}>
              <div className="wallet-modal__title">Withdraw</div>
              <div className="wallet-modal__field">
                <input
                  type="number"
                  placeholder="Amount (TON)"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  style={{ width: '100%', height: '36px', borderRadius: '10px', border: '1px solid #3F4B58', background: 'transparent', color: '#E7EEF7', padding: '0 12px' }}
                />
              </div>
              {modalError && <div style={{ color: '#FF6B6B', fontSize: '12px' }}>{modalError}</div>}
              <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                <button className="market-header__btn-secondary" onClick={() => setShowWithdrawModal(false)}>Cancel</button>
                <button className="market-header__btn-primary" onClick={handleWithdraw} disabled={initiateWithdrawalMutation.isPending}>
                  {initiateWithdrawalMutation.isPending ? 'Processing…' : 'Withdraw'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
