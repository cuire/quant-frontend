import { createFileRoute } from '@tanstack/react-router';
import { useUser } from '@/lib/api-hooks';
import { useTonWallet } from '@tonconnect/ui-react';
import { TransactionList } from '@/components/TransactionList';
import './wallet.css';
import { MarketTopBar } from '@/components/MarketHeader';


export const Route = createFileRoute('/(wallet)/wallet')({
  component: WalletPage,
});

function WalletPage() {
  const { data: user, isLoading } = useUser();
  const wallet = useTonWallet();

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
            <button className="wallet-action-button" disabled={!wallet}>
              <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.75 9L15.75 3M15.75 3L21.75 9M15.75 3V15C15.75 16.5913 15.1179 18.1174 13.9926 19.2426C12.8674 20.3679 11.3413 21 9.75 21C8.1587 21 6.63258 20.3679 5.50736 19.2426C4.38214 18.1174 3.75 16.5913 3.75 15V12" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Withdraw
            </button>
            <button className="wallet-action-button" disabled={!wallet}>
              <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.25 15L9.25 21M9.25 21L3.25 15M9.25 21V9C9.25 7.4087 9.88214 5.88258 11.0074 4.75736C12.1326 3.63214 13.6587 3 15.25 3C16.8413 3 18.3674 3.63214 19.4926 4.75736C20.6179 5.88258 21.25 7.4087 21.25 9V12" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Deposit
            </button>
          </div>
        </div>

        {/* Transaction Section */}
        <TransactionList 
          transactions={[]}
          onTransactionClick={(transaction) => {
            console.log('Transaction clicked:', transaction);
          }}
          emptyState={{
            title: "Nothing to see here",
            subtitle: "Make your first sales with",
            actionText: "Market",
          }}
        />
      </div>
    </>
  );
}
