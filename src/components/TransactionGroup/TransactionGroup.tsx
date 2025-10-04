import { TransactionItem } from '@/components/TransactionItem';
import './TransactionGroup.css';

interface Transaction {
  id: number;
  date?: string;
  type: 'withdraw' | 'deposit' | 'referral';
  description: string;
  time: string;
  amount: number;
  icon?: string;
}

interface TransactionGroupProps {
  date: string;
  transactions: Transaction[];
  onTransactionClick?: (transaction: Transaction) => void;
}

export function TransactionGroup({ 
  date, 
  transactions, 
  onTransactionClick 
}: TransactionGroupProps) {
  const formatGroupDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).toUpperCase();
  };

  return (
    <div className="transaction-group">
      <div className="transaction-group__date">
        {formatGroupDate(date)}
      </div>
      <div className="transaction-group__items">
        {transactions.map((transaction) => (
          <TransactionItem
            key={transaction.id}
            transaction={transaction}
            onTransactionClick={onTransactionClick}
          />
        ))}
      </div>
    </div>
  );
}
