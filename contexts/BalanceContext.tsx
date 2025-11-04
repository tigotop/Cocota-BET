import React, { createContext, useState, useContext, ReactNode } from 'react';

interface BalanceContextType {
    balance: number;
    updateBalance: (amount: number) => void;
}

const BalanceContext = createContext<BalanceContextType | undefined>(undefined);

export const BalanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [balance, setBalance] = useState(100); // Starting balance

    const updateBalance = (amount: number) => {
        setBalance(prevBalance => prevBalance + amount);
    };

    return (
        <BalanceContext.Provider value={{ balance, updateBalance }}>
            {children}
        </BalanceContext.Provider>
    );
};

export const useBalance = (): BalanceContextType => {
    const context = useContext(BalanceContext);
    if (context === undefined) {
        throw new Error('useBalance must be used within a BalanceProvider');
    }
    return context;
};
