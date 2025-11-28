import React, { createContext, useContext, useState, useEffect } from 'react';

interface CompletionContextType {
    completedItems: Set<number>;
    toggleItem: (id: number) => void;
    isCompleted: (id: number) => boolean;
}

const CompletionContext = createContext<CompletionContextType | undefined>(undefined);

export const CompletionProvider = ({ children }: { children: React.ReactNode }) => {
    const [completedItems, setCompletedItems] = useState<Set<number>>(() => {
        const saved = localStorage.getItem('executionTracker');
        return saved ? new Set(JSON.parse(saved)) : new Set();
    });

    useEffect(() => {
        localStorage.setItem('executionTracker', JSON.stringify(Array.from(completedItems)));
    }, [completedItems]);

    const toggleItem = (id: number) => {
        setCompletedItems(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const isCompleted = (id: number) => completedItems.has(id);

    return (
        <CompletionContext.Provider value={{ completedItems, toggleItem, isCompleted }}>
            {children}
        </CompletionContext.Provider>
    );
};

export const useCompletion = () => {
    const context = useContext(CompletionContext);
    if (context === undefined) {
        throw new Error('useCompletion must be used within a CompletionProvider');
    }
    return context;
};
