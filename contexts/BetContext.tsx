import React, { createContext, useState, useContext, ReactNode } from 'react';
import type { MyBet, GameEvent } from '../types';

// Initial data to populate the screen
const mockMyBets: MyBet[] = [
    { id: 2, event: 'Garnizé Veloz vs Cocota PÉS', category: 'Corrida de Galinhas', stake: 25, odd: 1.5, potentialReturn: 37.50, status: 'Ganha', selection: 'Garnizé Veloz' },
    { id: 3, event: 'LA Lakers vs Boston Celtics', category: 'Basquete - NBA', stake: 5, odd: 2.1, potentialReturn: 10.50, status: 'Perdida', selection: 'Boston Celtics' },
    { id: 4, event: 'Fallen Angels vs Chicken Rush', category: 'E-Sports - CS:GO', stake: 15, odd: 1.4, potentialReturn: 21.00, status: 'Ganha', selection: 'Fallen Angels' },
];

interface BetContextType {
    myBets: MyBet[];
    addBet: (event: GameEvent, selection: string, odd: number, stake: number) => void;
}

const BetContext = createContext<BetContextType | undefined>(undefined);

export const BetProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [myBets, setMyBets] = useState<MyBet[]>(mockMyBets);

    const addBet = (event: GameEvent, selection: string, odd: number, stake: number) => {
        const newBet: MyBet = {
            id: Date.now(), // simple unique id
            event: event.eventName || `${event.teamA} vs ${event.teamB}`,
            category: event.category,
            stake,
            odd,
            potentialReturn: stake * odd,
            status: 'Aberta',
            selection,
        };
        setMyBets(prevBets => [newBet, ...prevBets]);
    };

    return (
        <BetContext.Provider value={{ myBets, addBet }}>
            {children}
        </BetContext.Provider>
    );
};

export const useBets = (): BetContextType => {
    const context = useContext(BetContext);
    if (context === undefined) {
        throw new Error('useBets must be used within a BetProvider');
    }
    return context;
};
