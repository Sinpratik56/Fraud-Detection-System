import React from 'react';
import { Transaction } from '../types';
import AlertItem from './AlertItem';

interface AlertsQueueProps {
  transactions: Transaction[];
  selectedTransactionId: string | null;
  onSelectTransaction: (id: string) => void;
}

const AlertsQueue: React.FC<AlertsQueueProps> = ({ transactions, selectedTransactionId, onSelectTransaction }) => {
  return (
    <div className="flex-1 overflow-y-auto bg-purple-950/70">
      {transactions.length > 0 ? (
        <ul>
          {transactions.map((tx) => (
            <AlertItem
              key={tx.id}
              transaction={tx}
              isSelected={tx.id === selectedTransactionId}
              onSelect={onSelectTransaction}
            />
          ))}
        </ul>
      ) : (
        <div className="flex items-center justify-center h-full text-purple-400">
            <p>No matching transactions found.</p>
        </div>
      )}
    </div>
  );
};

export default AlertsQueue;