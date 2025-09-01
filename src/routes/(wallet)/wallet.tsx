import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { useUser } from '@/lib/api-hooks';
import { useTonConnectUI } from '@tonconnect/ui-react';

export const Route = createFileRoute('/(wallet)/wallet')({
  component: WalletPage,
});

function WalletPage() {
  const { data: user, isLoading } = useUser();
  const [tonConnectUI] = useTonConnectUI();
  const [connected, setConnected] = useState(false);
  const [account, setAccount] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = tonConnectUI.onStatusChange((wallet) => {
      setConnected(!!wallet);
      setAccount(wallet);
    });

    // Get initial status
    if (tonConnectUI.wallet) {
      setConnected(true);
      setAccount(tonConnectUI.wallet);
    }

    return unsubscribe;
  }, [tonConnectUI]);

  const connect = () => tonConnectUI.openModal();

  if (isLoading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: '#1A2026', 
        color: '#E7EEF7',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div>Loading wallet...</div>
      </div>
    );
  }

  // Format wallet address for display
  const formatWalletAddress = (address: string) => {
    if (address.length <= 12) return address;
    return `${address.slice(0, 6)}....${address.slice(-6)}`;
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#1A2026', 
      color: '#E7EEF7',
      padding: '20px'
    }}>
      {/* Wallet Card */}
      <div style={{
        backgroundColor: '#3A8ECE',
        borderRadius: '12px',
        padding: '10px',
        position: 'relative',
        overflow: 'hidden',
        height: '158px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}>
        {/* Address and Total Volume */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#ffffff20',
          borderRadius: '30px',
          width: '100%',
          height: '24px',
          padding: '8px',
        }}>
          <div style={{
            fontSize: '12px',
            color: '#ffffff',
            fontFamily: 'monospace'
          }}>
            {connected && account ? 
              formatWalletAddress(account.address) : 
              'Wallet not connected'
            }
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            color: '#ffffff',
            cursor: 'pointer'
          }}>
            <span>{user?.total_volume || 0} TON</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        {/* Main Balance */}
        <div style={{
          fontSize: '37px',
          fontWeight: 'bold',
          color: '#FFFFFF',
          textAlign: 'center',
        }}>
          {connected ? 
            (user?.balance || 0) + ' TON' : 
            'Connect'
          }
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '12px'
        }}>
          {connected ? (
            <>
              <button style={{
                flex: 1,
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                borderRadius: '12px',
                padding: '16px',
                color: '#FFFFFF',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Deposit
              </button>
              <button style={{
                flex: 1,
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                borderRadius: '12px',
                padding: '16px',
                color: '#FFFFFF',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Withdraw
              </button>
            </>
          ) : (
            <button 
              onClick={connect}
              style={{
                width: '100%',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                borderRadius: '12px',
                padding: '16px',
                color: '#FFFFFF',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Connect Wallet
            </button>
          )}
        </div>
      </div>

    </div>
  );
}
