
import React, { useState, useEffect } from 'react';
import { getOtherAnalysts } from '../services/mockApi';
import { UserCircleIcon } from './icons/UserCircleIcon';

interface CollaborationIndicatorProps {
    transactionId: string;
}

const CollaborationIndicator: React.FC<CollaborationIndicatorProps> = ({ transactionId }) => {
    const [viewingAnalyst, setViewingAnalyst] = useState<string | null>(null);

    useEffect(() => {
        setViewingAnalyst(null);
        // Simulate another analyst looking at the transaction
        const shouldShow = Math.random() > 0.5;
        if (shouldShow) {
            const analysts = getOtherAnalysts();
            const analyst = analysts[Math.floor(Math.random() * analysts.length)];
            const timer = setTimeout(() => {
                setViewingAnalyst(analyst);
            }, 1000); // Small delay to appear more natural
            
            const clearTimer = setTimeout(() => {
                setViewingAnalyst(null);
            }, 5000 + Math.random() * 5000); // Show for 5-10 seconds
            
            return () => {
                clearTimeout(timer);
                clearTimeout(clearTimer);
            }
        }
    }, [transactionId]);

    if (!viewingAnalyst) {
        return null;
    }

    return (
        <div className="bg-purple-800/80 text-purple-300 text-xs px-2 py-1 rounded-full flex items-center gap-1.5 animate-pulse-fast">
            <UserCircleIcon className="h-4 w-4" />
            <span>{viewingAnalyst} is also viewing</span>
        </div>
    );
};

export default CollaborationIndicator;
