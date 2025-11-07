
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Transaction, TransactionStatus, AnalystAction, Case } from './types';
import { generateInitialTransactions, generateNewTransaction, getTransactionsForAccount, getCases, createCase, addTransactionToCase } from './services/mockApi';
import AlertsQueue from './components/AlertsQueue';
import AlertDetails from './components/AlertDetails';
import { Header } from './components/Header';
import { SearchIcon } from './components/icons/SearchIcon';
import DashboardWidgets from './components/DashboardWidgets';

const App: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<TransactionStatus | 'All'>('All');
  const [cases, setCases] = useState<Case[]>([]);
  const [comment, setComment] = useState('');

  useEffect(() => {
    setTransactions(generateInitialTransactions());
    setCases(getCases());
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTransactions(prev => [generateNewTransaction(), ...prev].sort((a, b) => b.timestamp - a.timestamp));
    }, 5000); // Add a new transaction every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const handleSelectTransaction = (id: string) => {
    setSelectedTransactionId(id);
  };

  const handleAnalystAction = useCallback((transactionId: string, action: AnalystAction) => {
    setTransactions(prev =>
      prev.map(tx => {
        if (tx.id === transactionId) {
          return {
            ...tx,
            status: action.action,
            analystActions: [...tx.analystActions, action],
          };
        }
        return tx;
      })
    );
    setComment('');
  }, []);
  
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter(tx => statusFilter === 'All' || tx.status === statusFilter)
      .filter(tx =>
        tx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.accountId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.merchant.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [transactions, statusFilter, searchTerm]);

  const selectedTransaction = useMemo(() => {
    if (!selectedTransactionId) return null;
    return transactions.find(tx => tx.id === selectedTransactionId) || null;
  }, [selectedTransactionId, transactions]);

  const accountHistory = useMemo(() => {
    if (!selectedTransaction) return [];
    return getTransactionsForAccount(transactions, selectedTransaction.accountId);
  }, [selectedTransaction, transactions]);

  const handleCreateCase = useCallback((transactionId: string) => {
    const newCase = createCase(transactionId);
    setCases(prev => [...prev, newCase]);
    setTransactions(prev => prev.map(tx => tx.id === transactionId ? { ...tx, caseId: newCase.id } : tx));
  }, []);

  const handleAddTransactionToCase = useCallback((transactionId: string, caseId: string) => {
    addTransactionToCase(transactionId, caseId);
    setTransactions(prev => prev.map(tx => tx.id === transactionId ? { ...tx, caseId } : tx));
    setCases(getCases()); // Re-fetch to update transactionIds list
  }, []);

  // Keyboard Shortcuts Handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore shortcuts if user is typing in an input or textarea
      const target = e.target as HTMLElement;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) {
        return;
      }

      const currentIndex = filteredTransactions.findIndex(tx => tx.id === selectedTransactionId);

      switch(e.key.toLowerCase()) {
        case 'j': // Select next transaction
          if (currentIndex < filteredTransactions.length - 1) {
            setSelectedTransactionId(filteredTransactions[currentIndex + 1].id);
          }
          break;
        case 'k': // Select previous transaction
          if (currentIndex > 0) {
            setSelectedTransactionId(filteredTransactions[currentIndex - 1].id);
          }
          break;
        case 'a': // Approve
        case 'b': // Block
        case 'e': // Escalate
          if (selectedTransaction && comment.trim() !== '') {
              const actionMap = { a: 'Approved', b: 'Blocked', e: 'Escalated' };
              const actionType = actionMap[e.key.toLowerCase() as keyof typeof actionMap] as TransactionStatus;
              const newAction = { analystId: 'analyst_4', analystName: 'Diana', timestamp: Date.now(), action: actionType, comment };
              handleAnalystAction(selectedTransaction.id, newAction);
          } else if (selectedTransaction) {
              alert('Please provide a comment before taking action with a keyboard shortcut.');
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedTransactionId, filteredTransactions, comment, selectedTransaction, handleAnalystAction]);


  return (
    <div className="flex flex-col h-screen bg-transparent font-sans">
      <Header />
      <main className="flex flex-1 overflow-hidden">
        <div className="w-full lg:w-1/3 border-r border-purple-700/60 flex flex-col">
          <div className="p-4 border-b border-purple-700/60 bg-purple-900/70 backdrop-blur-sm">
            <h2 className="text-xl font-bold text-white mb-4">Suspicious Activity Queue</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                   <SearchIcon className="h-5 w-5 text-purple-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by ID, Account, Merchant..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full bg-purple-800 border border-purple-700 rounded-md py-2 pl-10 pr-4 text-white placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-gold-500"
                />
              </div>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value as TransactionStatus | 'All')}
                className="bg-purple-800 border border-purple-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Blocked">Blocked</option>
                <option value="Escalated">Escalated</option>
              </select>
            </div>
          </div>
          <AlertsQueue
            transactions={filteredTransactions}
            selectedTransactionId={selectedTransactionId}
            onSelectTransaction={handleSelectTransaction}
          />
        </div>
        <div className="hidden lg:flex relative flex-col flex-1 w-2/3 bg-transparent overflow-hidden">
            {/* Background Image Layer */}
            <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
                <div 
                    className="absolute inset-0 bg-cover bg-center animate-slow-pan" 
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?q=80&w=2070&auto=format&fit=crop')" }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-purple-950 via-purple-950/80 to-transparent"></div>
            </div>

            {/* Content Scroller */}
            <div className="relative z-10 w-full h-full flex flex-col">
              <DashboardWidgets transactions={transactions} />
              <div className="flex-1 overflow-y-auto">
                {selectedTransaction ? (
                  <AlertDetails
                    transaction={selectedTransaction}
                    accountHistory={accountHistory}
                    onAnalystAction={handleAnalystAction}
                    cases={cases}
                    onCreateCase={handleCreateCase}
                    onAddToCase={handleAddTransactionToCase}
                    comment={comment}
                    setComment={setComment}
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-purple-400">
                    <div className="bg-transparent p-8 rounded-lg text-center">
                        <p className="text-xl font-semibold">Select a transaction to view details</p>
                        <p className="text-purple-400 mt-2">Your investigation workspace will appear here.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
        </div>
      </main>
    </div>
  );
};

export default App;
