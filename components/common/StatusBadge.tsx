import React from 'react';
import { TransactionStatus } from '../../types';

interface StatusBadgeProps {
  status: TransactionStatus;
  large?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, large = false }) => {
  const baseClasses = `font-bold rounded-full inline-block ${large ? 'px-3 py-1 text-sm' : 'px-2 py-0.5 text-xs'}`;

  const statusStyles: Record<TransactionStatus, string> = {
    Pending: 'bg-gold-500/20 text-gold-400',
    Approved: 'bg-green-500/20 text-green-400',
    Blocked: 'bg-red-500/20 text-red-400',
    Escalated: 'bg-purple-500/20 text-purple-400',
  };

  return <span className={`${baseClasses} ${statusStyles[status]}`}>{status}</span>;
};