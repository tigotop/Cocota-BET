import React, { useState, useEffect } from 'react';
import { useBalance } from '../../contexts/BalanceContext';

interface WhereIsCocotaGameProps {
    onBack: () => void;
}

const BET_AMOUNT = 10;
const WIN_MULTIPLIER = 3;
const POSITIONS = [0, 1, 2];

// Helper to shuffle an array
const shuffle = (array: number[]) => {
    return [...array].sort(() => Math.random() - 0.5);
};

export const WhereIsCocotaGame: React.FC<WhereIsCocotaGameProps> = ({ onBack }) => {
    const { balance, updateBalance } = useBalance();
    const [gameState, setGameState] = useState<'betting' | 'shuffling' | 'picking' | 'finished'>('betting');
    const [cocotaPosition, setCocotaPosition] = useState(1); // Start in the middle
    const [shuffledOrder, setShuffledOrder] = useState(POSITIONS);
    const [playerSelection, setPlayerSelection] = useState<number | null>(null);

    const canPlay = balance >= BET_AMOUNT;

    const hasWon = gameState === 'finished' && playerSelection === cocotaPosition;

    const message = {
        betting: canPlay ? `Aposte R$ ${BET_AMOUNT.toFixed(2)} para começar!` : 'Saldo insuficiente!',
        shuffling: 'Preste atenção... 🦜',
        picking: 'Onde está o Cocota?',
        finished: hasWon ? `Você achou! Ganhou R$ ${(BET_AMOUNT * WIN_MULTIPLIER).toFixed(2)}!` : 'Que pena! O Cocota estava em outra casa.',
    }[gameState];

    const messageColor = {
        betting: canPlay ? 'text-gray-400' : 'text-red-400',
        shuffling: 'text-yellow-400 animate-pulse',
        picking: 'text-white',
        finished: hasWon ? 'text-green-400' : 'text-red-400',
    }[gameState];

    const startGame = () => {
        if (!canPlay) return;

        updateBalance(-BET_AMOUNT);
        setCocotaPosition(Math.floor(Math.random() * 3));
        setGameState('shuffling');

        setTimeout(() => {
            setShuffledOrder(shuffle(POSITIONS));
            setTimeout(() => {
                setGameState('picking');
            }, 1000); // Wait for shuffle animation to finish
        }, 1500); // Shuffle after showing for a bit
    };
    
    const selectCoop = (index: number) => {
        if (gameState !== 'picking') return;
        setPlayerSelection(index);
        setGameState('finished');
        if (index === cocotaPosition) {
            updateBalance(BET_AMOUNT * WIN_MULTIPLIER);
        }
    };
    
    const resetGame = () => {
        setGameState('betting');
        setPlayerSelection(null);
        setCocotaPosition(1);
        setShuffledOrder(POSITIONS);
    };

    const getCoopClasses = (index: number) => {
        const base = `w-24 h-24 rounded-lg flex items-center justify-center text-5xl transition-all duration-500 cursor-pointer`;
        const positionTransforms = ['-translate-x-full', 'translate-x-0', 'translate-x-full'];
        
        let transformClass = '';
        if (gameState === 'shuffling' || gameState === 'picking' || gameState === 'finished') {
             transformClass = `absolute ${positionTransforms[shuffledOrder.indexOf(index)]}`;
        } else {
             transformClass = `relative`;
        }

        if (gameState === 'finished') {
            if (index === cocotaPosition) return `${base} ${transformClass} bg-yellow-400`;
            if (index === playerSelection) return `${base} ${transformClass} bg-red-600`;
            return `${base} ${transformClass} bg-gray-700 opacity-60`;
        }
        
        if (gameState === 'picking') {
            return `${base} ${transformClass} bg-green-600 hover:bg-green-500 hover:scale-105 btn-press`;
        }

        return `${base} ${transformClass} bg-green-700`;
    };

    return (
        <div className="flex flex-col items-center p-4 h-full text-white space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold">Onde está o Cocota?</h2>
                <p className={`text-lg font-semibold h-6 mt-2 ${messageColor}`}>{message}</p>
            </div>
            
            <div className="relative w-full flex justify-center items-center h-24">
                {POSITIONS.map(i => (
                    <div key={i} className={getCoopClasses(i)} onClick={() => selectCoop(i)}>
                        { (gameState !== 'shuffling' && gameState !== 'picking' && i === cocotaPosition) 
                            ? '🦜' 
                            : (gameState === 'finished' && i !== cocotaPosition)
                            ? '🪹'
                            : '🛖' 
                        }
                    </div>
                ))}
            </div>

            <div className="flex flex-col w-full max-w-xs space-y-3 pt-4">
                {gameState === 'betting' ? (
                    <button onClick={startGame} disabled={!canPlay} className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg text-xl hover:bg-green-700 transition disabled:bg-gray-500 disabled:cursor-not-allowed btn-press">
                        Apostar R$ {BET_AMOUNT.toFixed(2)}
                    </button>
                ) : (gameState === 'finished') ? (
                    <button onClick={resetGame} className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg text-xl hover:bg-blue-700 transition btn-press">
                        Jogar Novamente
                    </button>
                ) : (
                    <div className="h-[52px]"></div> // Placeholder to keep layout consistent
                )}
                <button onClick={onBack} className="w-full bg-gray-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-700 transition btn-press">
                    Voltar ao Cassino
                </button>
            </div>
        </div>
    );
};