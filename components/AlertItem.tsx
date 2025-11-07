

import React from 'react';
import { Transaction } from '../types';
import { StatusBadge } from './common/StatusBadge';
import { ClockIcon } from './icons/ClockIcon';
import { BriefcaseIcon } from './icons/BriefcaseIcon';

interface AlertItemProps {
  transaction: Transaction;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const AlertItem: React.FC<AlertItemProps> = ({ transaction, isSelected, onSelect }) => {
  const { id, amount, currency, timestamp, status, riskScore, accountId, merchant, caseId } = transaction;
  const timeAgo = Math.round((Date.now() - timestamp) / 1000 / 60);

  const getRiskColor = (score: number) => {
    if (score > 90) return 'border-red-500';
    if (score > 75) return 'border-orange-500';
    return 'border-yellow-500';
  };
  
  const isNew = (Date.now() - transaction.timestamp) < 6000;

  return (
    <li
      onClick={() => onSelect(id)}
      className={`p-4 border-l-4 cursor-pointer transition-colors duration-200 ${
        isSelected ? 'bg-purple-700/90 backdrop-blur-sm' : 'bg-purple-800/60 hover:bg-purple-700/80 backdrop-blur-sm'
      } ${getRiskColor(riskScore)} border-b border-purple-700/60`}
    >
      <div className="flex justify-between items-start">
        <div>
          <div className="font-bold text-white flex items-center gap-2">
            {/* FIX: The 'title' prop is not valid on the SVG component per its type definition. Moved to a wrapping span to provide the tooltip. */}
            {caseId && <span title="Part of a case"><BriefcaseIcon className="h-4 w-4 text-purple-300" /></span>}
            {merchant.name} - ${amount.toFixed(2)} {currency}
          </div>
          <div className="text-sm text-purple-300">
            {accountId}
          </div>
        </div>
        <div className="flex flex-col items-end">
            <StatusBadge status={status} />
             {isNew && status === 'Pending' && <div className="mt-2 text-xs text-gold-400 animate-pulse-fast">New Alert</div>}
        </div>
      </div>
      <div className="flex justify-between items-center mt-3 text-sm">
        <div className="text-purple-400 flex items-center gap-1">
          <ClockIcon className="h-4 w-4" />
          <span>{timeAgo} min ago</span>
        </div>
        <div className="text-purple-300">
          Risk: <span className="font-bold text-white">{riskScore}</span>
        </div>
      </div>
    </li>
  );
};

export default AlertItem;
