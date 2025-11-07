
import React, { useState } from 'react';
import { Transaction, TransactionStatus, AnalystAction, Case } from '../types';
import { createAnalystAction } from '../services/mockApi';
import RiskScoreGauge from './RiskScoreGauge';
import AccountTimeline from './AccountTimeline';
import { ActionButton } from './common/ActionButton';
import { StatusBadge } from './common/StatusBadge';
import { UserCircleIcon } from './icons/UserCircleIcon';
import { ClockIcon } from './icons/ClockIcon';
import CollaborationIndicator from './CollaborationIndicator';
import { BriefcaseIcon } from './icons/BriefcaseIcon';

interface AlertDetailsProps {
  transaction: Transaction;
  accountHistory: Transaction[];
  onAnalystAction: (transactionId: string, action: AnalystAction) => void;
  cases: Case[];
  onCreateCase: (transactionId: string) => void;
  onAddToCase: (transactionId: string, caseId: string) => void;
  comment: string;
  setComment: (comment: string) => void;
}

const DetailCard: React.FC<{ title: string, children: React.ReactNode, icon?: React.ReactNode }> = ({ title, children, icon }) => (
    <div className="bg-purple-950/60 backdrop-blur-sm rounded-lg p-4 border border-purple-700/50">
        <h3 className="text-md font-semibold text-purple-300 border-b border-purple-700/80 pb-2 mb-3 flex items-center gap-2">
            {icon}
            {title}
        </h3>
        {children}
    </div>
);

const DetailItem: React.FC<{ label: string, value: string | number }> = ({ label, value }) => (
    <div className="flex justify-between text-sm mb-2">
        <span className="text-purple-400">{label}</span>
        <span className="text-white font-medium text-right">{value}</span>
    </div>
);

const AlertDetails: React.FC<AlertDetailsProps> = ({ 
    transaction, 
    accountHistory, 
    onAnalystAction,
    cases,
    onCreateCase,
    onAddToCase,
    comment,
    setComment
}) => {

  const handleAction = (action: TransactionStatus) => {
    if (comment.trim() === '') {
        alert('Please provide a comment before taking action.');
        return;
    }
    const newAction = createAnalystAction(action, comment);
    onAnalystAction(transaction.id, newAction);
  };

  const currentCase = cases.find(c => c.id === transaction.caseId);

  return (
    <div className="p-6 space-y-6 w-full">
        {/* Header */}
        <div className="flex justify-between items-start">
            <div>
                <h2 className="text-2xl font-bold text-white">Transaction Details</h2>
                <p className="text-sm text-purple-400 break-all">{transaction.id}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
                <StatusBadge status={transaction.status} large />
                <CollaborationIndicator transactionId={transaction.id} />
            </div>
        </div>

        {/* Main Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
                 <DetailCard title="Risk Analysis">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <RiskScoreGauge score={transaction.riskScore} />
                        <div className="flex-1">
                            <h4 className="font-bold text-lg text-white mb-2">{transaction.reason.summary}</h4>
                            <ul className="space-y-2">
                                {transaction.reason.contributingFeatures.map(feature => (
                                    <li key={feature.name} className="text-sm">
                                        <strong className="text-purple-300">{feature.name}:</strong>
                                        <span className="text-white ml-2">{feature.value}</span>
                                        <p className="text-xs text-purple-400 italic">{feature.description}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </DetailCard>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <DetailCard title="Transaction Info">
                        <DetailItem label="Amount" value={`${transaction.amount.toFixed(2)} ${transaction.currency}`} />
                        <DetailItem label="Card Number" value={transaction.cardNumber} />
                        <DetailItem label="Timestamp" value={new Date(transaction.timestamp).toLocaleString()} />
                    </DetailCard>
                    <DetailCard title="Merchant Details">
                        <DetailItem label="Name" value={transaction.merchant.name} />
                        <DetailItem label="Category" value={transaction.merchant.category} />
                        <DetailItem label="Country" value={transaction.merchant.country} />
                    </DetailCard>
                     <DetailCard title="Location & Device">
                        <DetailItem label="IP Address" value={transaction.location.ipAddress} />
                        <DetailItem label="Location" value={`${transaction.location.city}, ${transaction.location.country}`} />
                        <DetailItem label="Device" value={`${transaction.device.os} - ${transaction.device.browser}`} />
                    </DetailCard>
                </div>
            </div>
            <div className="md:col-span-1 space-y-6">
                <DetailCard title="Analyst Actions">
                    <div className="space-y-4">
                        <textarea
                          id="analyst-comment"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          placeholder="Add audit notes... (Required)"
                          rows={4}
                          className="w-full bg-purple-700 border border-purple-600 rounded-md p-2 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-gold-500"
                        />
                        <div className="grid grid-cols-2 gap-2">
                            <ActionButton status="Approved" onClick={() => handleAction('Approved')} />
                            <ActionButton status="Blocked" onClick={() => handleAction('Blocked')} />
                            <ActionButton status="Escalated" colSpan={2} onClick={() => handleAction('Escalated')} />
                        </div>
                    </div>
                </DetailCard>
                
                <DetailCard title="Case Management" icon={<BriefcaseIcon className="h-5 w-5" />}>
                    {currentCase ? (
                        <div>
                            <p className="text-sm text-white">This alert is part of:</p>
                            <p className="font-bold text-gold-400">{currentCase.name}</p>
                            <p className="text-xs text-purple-400">{currentCase.transactionIds.length} related alerts</p>
                        </div>
                    ) : (
                         <div className="space-y-2">
                            <button onClick={() => onCreateCase(transaction.id)} className="w-full text-center bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-3 rounded-md text-sm transition-colors">
                                Create New Case
                            </button>
                             <select 
                                onChange={(e) => onAddToCase(transaction.id, e.target.value)}
                                defaultValue=""
                                className="w-full bg-purple-700 border border-purple-600 rounded-md p-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
                             >
                                 <option value="" disabled>Add to existing case...</option>
                                 {cases.filter(c => c.status === 'Open').map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                             </select>
                        </div>
                    )}
                </DetailCard>

                <DetailCard title="Action History">
                    <ul className="space-y-4 max-h-48 overflow-y-auto">
                        {transaction.analystActions.length > 0 ? transaction.analystActions.slice().reverse().map(action => (
                            <li key={action.timestamp} className="text-sm">
                                <div className="flex justify-between items-center">
                                    <span className="flex items-center gap-2 font-semibold text-white">
                                        <UserCircleIcon className="h-5 w-5"/> {action.analystName}
                                    </span>
                                    <StatusBadge status={action.action} />
                                </div>
                                <p className="text-purple-300 mt-1 pl-1 border-l-2 border-purple-700 ml-2">{action.comment}</p>
                                <div className="text-xs text-purple-400 mt-1 flex items-center gap-1 ml-2">
                                  <ClockIcon className="h-3 w-3" /> {new Date(action.timestamp).toLocaleString()}
                                </div>
                            </li>
                        )) : <p className="text-sm text-purple-400">No actions taken yet.</p>}
                    </ul>
                </DetailCard>
            </div>
        </div>
        
        {/* Account Timeline */}
        <div>
            <h3 className="text-xl font-bold text-white mb-4">Account Activity Timeline</h3>
            <AccountTimeline history={accountHistory} currentTransactionId={transaction.id} />
        </div>
    </div>
  );
};

export default AlertDetails;
