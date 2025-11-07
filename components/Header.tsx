import React from 'react';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';
import { UserCircleIcon } from './icons/UserCircleIcon';

export const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between p-4 bg-purple-900/70 backdrop-blur-sm border-b border-purple-700/60">
      <div className="flex items-center gap-3">
        <ShieldCheckIcon className="h-8 w-8 text-gold-500" />
        <h1 className="text-2xl font-bold text-white tracking-tight">Fraud Detection Console</h1>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-purple-300">Analyst: Diana</span>
        <UserCircleIcon className="h-8 w-8 text-purple-300" />
      </div>
    </header>
  );
};