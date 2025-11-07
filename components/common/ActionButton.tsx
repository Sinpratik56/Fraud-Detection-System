import React from 'react';
import { TransactionStatus } from '../../types';
import { CheckCircleIcon } from '../icons/CheckCircleIcon';
import { XCircleIcon } from '../icons/XCircleIcon';
import { ArrowUpCircleIcon } from '../icons/ArrowUpCircleIcon';

interface ActionButtonProps {
  status: 'Approved' | 'Blocked' | 'Escalated';
  onClick: () => void;
  colSpan?: number;
}

const statusConfig = {
    Approved: {
        bg: 'bg-green-600 hover:bg-green-700',
        icon: <CheckCircleIcon className="h-5 w-5" />
    },
    Blocked: {
        bg: 'bg-red-600 hover:bg-red-700',
        icon: <XCircleIcon className="h-5 w-5" />
    },
    Escalated: {
        bg: 'bg-purple-600 hover:bg-purple-700',
        icon: <ArrowUpCircleIcon className="h-5 w-5" />
    }
}

export const ActionButton: React.FC<ActionButtonProps> = ({ status, onClick, colSpan = 1 }) => {
    const config = statusConfig[status];
    const colSpanClass = colSpan === 2 ? 'col-span-2' : '';
  
    return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-2 w-full text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-purple-950 ${config.bg} ${colSpanClass}`}
    >
      {config.icon}
      {status}
    </button>
  );
};