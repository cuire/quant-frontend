import { useMemo } from 'react';
import { TransactionGroup } from '@/components/TransactionGroup';
import './TransactionList.css';
import pepefrogGif from '@/assets/pepefrog.gif';
import { Link } from '../Link/Link';

interface Transaction {
  id: number;
  date?: string;
  type: 'withdraw' | 'deposit' | 'referral';
  description: string;
  time: string;
  amount: number;
}

interface TransactionListProps {
  transactions: Transaction[];
  onTransactionClick?: (transaction: Transaction) => void;
  emptyState?: {
    title: string;
    subtitle: string;
    actionText?: string;
  };
}

export function TransactionList({ 
  transactions, 
  onTransactionClick,
  emptyState 
}: TransactionListProps) {
  // Group transactions by date
  const groupedTransactions = useMemo(() => {
    const grouped = transactions.reduce((groups: Record<string, Transaction[]>, transaction: Transaction) => {
      // Use the transaction's date if available, otherwise use today's date
      const date = transaction.date ? new Date(transaction.date).toDateString() : new Date().toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(transaction);
      return groups;
    }, {} as Record<string, Transaction[]>);
    
    return Object.entries(grouped).map(([date, transactions]) => ({
      date,
      transactions: transactions.sort((a: Transaction, b: Transaction) => {
        // Sort by time (newest first)
        const timeA = a.time.split(':').map(Number);
        const timeB = b.time.split(':').map(Number);
        const minutesA = timeA[0] * 60 + timeA[1];
        const minutesB = timeB[0] * 60 + timeB[1];
        return minutesB - minutesA;
      })
    }));
  }, [transactions]);

  if (transactions.length === 0 && emptyState) {
    return (
      <div className="transaction-list__empty-state">
        <div className="transaction-list__empty-icon">
          <img src={pepefrogGif} alt="Pepe Frog" style={{ width: '102px', height: '102px' }} />
        </div>
        <div className="transaction-list__empty-title">
          {emptyState.title}
        </div>
        <div className="transaction-list__empty-subtitle">
          {emptyState.subtitle}
        </div>
        {emptyState.actionText && (
          <Link
            className="transaction-list__empty-action"
            to="/market"
          >
            {emptyState.actionText}
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="transaction-list">
      <div className="transaction-list__header">
        TRANSACTION
      </div>

      {groupedTransactions.map((group) => (
        <TransactionGroup
          key={group.date}
          date={group.date}
          transactions={group.transactions}
          onTransactionClick={onTransactionClick}
        />
      ))}
    </div>
  );
}
