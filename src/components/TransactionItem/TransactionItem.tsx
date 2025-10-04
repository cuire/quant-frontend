import './TransactionItem.css';

// SVG Icon Components
const WithdrawIcon = () => (
  <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.75 1V14.4167M6.75 1L12.5 6.75M6.75 1L1 6.75" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const PaymentIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.66667 1.33333C6.66667 0.596953 7.26362 0 8 0C8.73638 0 9.33333 0.596954 9.33333 1.33333V14.6667C9.33333 15.403 8.73638 16 8 16C7.26362 16 6.66667 15.403 6.66667 14.6667V1.33333Z" fill="white"/>
    <path d="M1.33333 9.33333C0.596953 9.33333 0 8.73638 0 8C0 7.26362 0.596954 6.66667 1.33333 6.66667H14.6667C15.403 6.66667 16 7.26362 16 8C16 8.73638 15.403 9.33333 14.6667 9.33333H1.33333Z" fill="white"/>
  </svg>
);

const DepositIcon = () => (
  <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.75 14.417V1.00032M6.75 14.417L12.5 8.66699M6.75 14.417L1 8.66699" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

interface Transaction {
  id: number;
  date?: string;
  type: 'withdraw' | 'deposit' | 'referral';
  description: string;
  time: string;
  amount: number;
  icon?: string;
}

interface TransactionItemProps {
  transaction: Transaction;
  onTransactionClick?: (transaction: Transaction) => void;
}

export function TransactionItem({ transaction, onTransactionClick }: TransactionItemProps) {
  const handleClick = () => {
    if (onTransactionClick) {
      onTransactionClick(transaction);
    }
  };

  const isPositive = transaction.amount > 0;
  const iconClass = isPositive ? 'transaction-item__icon--positive' : 'transaction-item__icon--negative';
  const amountClass = isPositive ? 'transaction-item__amount--positive' : 'transaction-item__amount--negative';
  const itemClass = onTransactionClick ? 'transaction-item transaction-item--clickable' : 'transaction-item';

  const renderIcon = () => {
    switch (transaction.type) {
      case 'withdraw':
        return <WithdrawIcon />;
      case 'deposit':
        return <DepositIcon />;
      case 'referral':
        return <PaymentIcon />;
      default:
        return transaction.icon || <PaymentIcon />;
    }
  };

  return (
    <div className={itemClass} onClick={handleClick}>
      {/* Transaction Icon */}
      <div className={`transaction-item__icon ${iconClass}`}>
        {renderIcon()}
      </div>

      {/* Transaction Details */}
      <div className="transaction-item__content">
        <div className="transaction-item__details">
          <div className="transaction-item__description">
            {transaction.description}
          </div>
          <div className="transaction-item__time">
            {transaction.time}
          </div>
        </div>
        <div className={`transaction-item__amount ${amountClass}`}>
          {transaction.amount > 0 ? '+' : ''}{transaction.amount} TON
        </div>
      </div>
    </div>
  );
}
