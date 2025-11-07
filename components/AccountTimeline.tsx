import React from 'react';
import { Transaction } from '../types';
import { StatusBadge } from './common/StatusBadge';
import { ClockIcon } from './icons/ClockIcon';

interface AccountTimelineProps {
  history: Transaction[];
  currentTransactionId: string;
}

const AccountTimeline: React.FC<AccountTimelineProps> = ({ history, currentTransactionId }) => {
  return (
    <div className="bg-purple-950/60 backdrop-blur-sm rounded-lg p-4 max-h-96 overflow-y-auto border border-purple-700/50">
      <div className="relative pl-4">
        {/* Vertical line */}
        <div className="absolute left-6 top-0 h-full w-0.5 bg-purple-700"></div>

        {history.map((tx, index) => {
          const isCurrent = tx.id === currentTransactionId;
          const timeAgo = Math.round((Date.now() - tx.timestamp) / 1000 / 60);

          return (
            <div key={tx.id} className="relative flex items-start mb-6">
              {/* Dot */}
              <div
                className={`absolute left-6 top-1.5 -ml-2 h-4 w-4 rounded-full z-10 ${
                  isCurrent ? 'bg-gold-500 ring-4 ring-gold-500/30' : 'bg-purple-500'
                }`}
              ></div>
              <div className="pl-8 w-full">
                <div className={`p-3 rounded-lg ${isCurrent ? 'bg-purple-700/70' : 'bg-purple-800/60'}`}>
                  <div className="flex justify-between items-center">
                    <p className="font-semibold text-white">
                      {tx.merchant.name} - ${tx.amount.toFixed(2)}
                    </p>
                    <StatusBadge status={tx.status} />
                  </div>
                  <div className="flex items-center text-xs text-purple-400 mt-1 gap-4">
                    <span className="flex items-center gap-1">
                      <ClockIcon className="h-3 w-3" />
                      {timeAgo} min ago
                    </span>
                    {/* FIX: The transaction location is on `tx.location`, not `tx.merchant`. */}
                    <span>{tx.location.city}, {tx.location.country}</span>
                  </div>
                   {isCurrent && <p className="text-xs text-gold-400 mt-2 font-bold">CURRENT TRANSACTION</p>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AccountTimeline;