import React, { useState, useEffect, useRef } from 'react';
import { useBalance } from '../contexts/BalanceContext';

export const Header: React.FC = () => {
    const { balance, updateBalance } = useBalance();
    const [balanceChange, setBalanceChange] = useState<'increase' | 'decrease' | null>(null);
    const prevBalanceRef = useRef<number>();

    useEffect(() => {
        if (prevBalanceRef.current !== undefined && balance !== prevBalanceRef.current) {
            setBalanceChange(balance > prevBalanceRef.current ? 'increase' : 'decrease');
            const timer = setTimeout(() => setBalanceChange(null), 600);
            return () => clearTimeout(timer);
        }
    }, [balance]);

    useEffect(() => {
        prevBalanceRef.current = balance;
    });


    const handleDeposit = () => {
        updateBalance(50);
    };
    
    const balanceColorClass = balanceChange === 'increase'
        ? 'text-green-400'
        : balanceChange === 'decrease'
        ? 'text-red-400'
        : 'text-white';

    return (
        <header className="bg-gray-800/80 backdrop-blur-sm shadow-md sticky top-0 z-10">
            <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex-shrink-0">
                         <h1 className="text-2xl font-extrabold text-white">
                            COCOTA <span className="text-green-400">BET</span>
                        </h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="text-right">
                            <p className="text-sm text-gray-400">Saldo</p>
                            <p className={`font-bold transition-colors duration-500 ${balanceColorClass}`}>
                                R$ {balance.toFixed(2).replace('.', ',')}
                            </p>
                        </div>
                        <button 
                            onClick={handleDeposit}
                            className="bg-green-500 text-white font-bold py-2 px-4 rounded-md hover:bg-green-600 transition duration-300 text-sm btn-press"
                        >
                            Depositar
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};