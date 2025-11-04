import React, { useState } from 'react';
import { useBalance } from '../../contexts/BalanceContext';

interface RubberEraserWarGameProps {
    onBack: () => void;
}

const BET_AMOUNT = 5;
const WIN_MULTIPLIER = 2;

export const RubberEraserWarGame: React.FC<RubberEraserWarGameProps> = ({ onBack }) => {
    const { balance, updateBalance } = useBalance();
    const [gameState, setGameState] = useState<'betting' | 'fighting' | 'finished'>('betting');
    const [result, setResult] = useState<'win' | 'loss' | null>(null);

    const canPlay = balance >= BET_AMOUNT;

    const message = {
        betting: canPlay ? `Aposte R$ ${BET_AMOUNT.toFixed(2)} na batalha!` : 'Saldo insuficiente!',
        fighting: 'POW! ZAP! PEW!',
        finished: result === 'win' ? `Você ganhou R$ ${(BET_AMOUNT * WIN_MULTIPLIER).toFixed(2)}!` : 'Você perdeu a batalha!',
    }[gameState];
    
    const messageColor = {
        betting: canPlay ? 'text-gray-400' : 'text-red-400',
        fighting: 'text-yellow-400 animate-pulse',
        finished: result === 'win' ? 'text-green-400' : 'text-red-400',
    }[gameState];

    const play = () => {
        if (!canPlay) return;

        updateBalance(-BET_AMOUNT);
        setGameState('fighting');

        setTimeout(() => {
            const isWin = Math.random() > 0.5;
            if (isWin) {
                setResult('win');
                updateBalance(BET_AMOUNT * WIN_MULTIPLIER);
            } else {
                setResult('loss');
            }
            setGameState('finished');
        }, 2000);
    };

    const resetGame = () => {
        setGameState('betting');
        setResult(null);
    };

    return (
        <div className="flex flex-col items-center justify-between p-4 h-full text-white">
            <div className="text-center w-full">
                <h2 className="text-3xl font-bold">Guerra de Borracha</h2>
                <p className={`text-lg font-semibold h-6 mt-2 ${messageColor}`}>{message}</p>
            </div>

            <div className="relative w-full h-48 flex items-center justify-center">
                <div className={`text-7xl transition-transform duration-1000 ${gameState === 'fighting' ? 'translate-x-[-50px] rotate-[-15deg]' : ''}`}>
                    🧽
                </div>
                <div className={`text-7xl transition-transform duration-1000 ${gameState === 'fighting' ? 'translate-x-[50px] rotate-[15deg]' : ''}`}>
                    ✏️
                </div>
                 {gameState === 'finished' && (
                    <div className="absolute text-8xl text-red-500 font-extrabold animate-ping opacity-75">
                       {result === 'win' ? '🏆' : '☠️'}
                    </div>
                )}
            </div>
            
            <div className="flex flex-col w-full max-w-xs space-y-3">
                 {gameState === 'betting' ? (
                    <button onClick={play} disabled={!canPlay} className="w-full bg-green-600 text-white font-bold py-4 px-4 rounded-lg text-xl hover:bg-green-700 transition disabled:bg-gray-500 disabled:cursor-not-allowed btn-press">
                        {canPlay ? `Batalhar por R$ ${BET_AMOUNT.toFixed(2)}` : 'Saldo Insuficiente'}
                    </button>
                ) : gameState === 'fighting' ? (
                     <button disabled className="w-full bg-yellow-500 text-black font-bold py-4 px-4 rounded-lg text-xl transition btn-press animate-pulse">
                        Lutando...
                    </button>
                ) : (
                    <button onClick={resetGame} className="w-full bg-blue-600 text-white font-bold py-4 px-4 rounded-lg text-xl hover:bg-blue-700 transition btn-press">
                        Jogar Novamente
                    </button>
                )}
                <button onClick={onBack} className="w-full bg-gray-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-700 transition btn-press">
                    Voltar ao Cassino
                </button>
            </div>
        </div>
    );
};