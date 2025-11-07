
import React, { useMemo } from 'react';
import { Transaction } from '../types';

interface DashboardWidgetsProps {
    transactions: Transaction[];
}

const Widget: React.FC<{ title: string; value: string | number; description: string }> = ({ title, value, description }) => (
    <div className="bg-purple-900/50 backdrop-blur-sm p-4 rounded-lg border border-purple-700/50 flex-1">
        <p className="text-sm text-purple-400">{title}</p>
        <p className="text-3xl font-bold text-white">{value}</p>
        <p className="text-xs text-purple-300">{description}</p>
    </div>
);

const DashboardWidgets: React.FC<DashboardWidgetsProps> = ({ transactions }) => {
    const stats = useMemo(() => {
        const pending = transactions.filter(tx => tx.status === 'Pending').length;
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        const resolvedToday = transactions.filter(tx => 
            (tx.status === 'Approved' || tx.status === 'Blocked') &&
            tx.analystActions.length > 0 &&
            tx.analystActions[0].timestamp >= startOfDay
        ).length;
        
        return {
            pending,
            resolvedToday,
            avgHandleTime: resolvedToday > 0 ? `${(Math.random() * (3 - 1) + 1).toFixed(2)} min` : 'N/A' // Mocked value
        };
    }, [transactions]);

    return (
        <div className="p-4 border-b border-purple-700/60 w-full">
             <h3 className="text-lg font-semibold text-white mb-3">Daily Stats</h3>
            <div className="flex flex-col sm:flex-row gap-4">
                <Widget 
                    title="Pending Alerts"
                    value={stats.pending}
                    description="Alerts awaiting review"
                />
                <Widget 
                    title="Resolved Today"
                    value={stats.resolvedToday}
                    description="Approved or Blocked since midnight"
                />
                 <Widget 
                    title="Avg. Handle Time"
                    value={stats.avgHandleTime}
                    description="Average time to resolution"
                />
            </div>
        </div>
    );
};

export default DashboardWidgets;
