import React, { useState, useEffect } from 'react';

interface ChickenBingoGameProps {
    onBack: () => void;
}

const totalChickens = 12;

export const ChickenBingoGame: React.FC<ChickenBingoGameProps> = ({ onBack }) => {
    const [selectedChicken, setSelectedChicken] = useState<number | null>(null);
    const [winningChicken, setWinningChicken] = useState<number | null>(null);
    const [gameState, setGameState] = useState<'picking' | 'revealing' | 'finished'>('picking');
    
    const message = {
        picking: 'Escolha sua galinha da sorte!',
        revealing: 'E a galinha premiada é...',
        finished: selectedChicken === winningChicken ? `Você ganhou! A galinha ${winningChicken! + 1} era a premiada!` : `Não foi dessa vez. A galinha premiada era a ${winningChicken! + 1}.`,
    }[gameState];

    const messageColor = {
        picking: 'text-gray-400',
        revealing: 'text-yellow-400 animate-pulse',
        finished: selectedChicken === winningChicken ? 'text-green-400' : 'text-red-400',
    }[gameState];

    const selectChicken = (index: number) => {
        if (gameState === 'picking') {
            setSelectedChicken(index);
        }
    };
    
    const play = () => {
        if (selectedChicken === null) {
            alert("Você precisa escolher uma galinha primeiro!");
            return;
        }
        setGameState('revealing');
        const winner = Math.floor(Math.random() * totalChickens);
        
        setTimeout(() => {
            setWinningChicken(winner);
            setGameState('finished');
        }, 2000);
    };

    const reset = () => {
        setSelectedChicken(null);
        setWinningChicken(null);
        setGameState('picking');
    };

    const getChickenClasses = (index: number) => {
        const base = "w-16 h-16 rounded-full flex items-center justify-center text-4xl cursor-pointer transition-all duration-300";
        if (gameState === 'finished') {
            if (index === winningChicken) {
                return `${base} bg-yellow-400 scale-110 shadow-lg shadow-yellow-400/50 ring-4 ring-white`;
            }
            if (index === selectedChicken) {
                return `${base} bg-red-600`;
            }
            return `${base} bg-gray-700 opacity-50`;
        }
        if (index === selectedChicken) {
            return `${base} bg-green-600 scale-110 ring-2 ring-white`;
        }
        return `${base} bg-gray-800 hover:bg-gray-700`;
    };

    return (
        <div className="flex flex-col items-center p-4 h-full text-white space-y-5">
            <div className="text-center">
                <h2 className="text-3xl font-bold">Bingo do Cacarejo</h2>
                <p className={`text-lg font-semibold h-6 ${messageColor}`}>{message}</p>
            </div>

            <div className="grid grid-cols-3 gap-4">
                {[...Array(totalChickens)].map((_, i) => (
                    <button key={i} onClick={() => selectChicken(i)} disabled={gameState !== 'picking'} className={getChickenClasses(i)}>
                       🐔
                    </button>
                ))}
            </div>

            <div className="flex flex-col w-full max-w-xs space-y-3 pt-4">
                 {gameState === 'picking' ? (
                     <button onClick={play} disabled={selectedChicken === null} className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg text-xl hover:bg-green-700 transition disabled:bg-gray-500 disabled:cursor-not-allowed">
                        Confirmar Aposta
                    </button>
                 ) : (
                     <button onClick={reset} className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg text-xl hover:bg-blue-700 transition">
                        Jogar Novamente
                    </button>
                 )}
                <button onClick={onBack} className="w-full bg-gray-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-700 transition">
                    Voltar ao Cassino
                </button>
            </div>
        </div>
    );
};
