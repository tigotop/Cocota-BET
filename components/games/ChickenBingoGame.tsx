import React, { useState } from 'react';
import { useBalance } from '../../contexts/BalanceContext';

interface ChickenBingoGameProps {
    onBack: () => void;
}

const totalChickens = 12;

export const ChickenBingoGame: React.FC<ChickenBingoGameProps> = ({ onBack }) => {
    const { balance, updateBalance } = useBalance();
    const [selectedChickens, setSelectedChickens] = useState<number[]>([]);
    const [winningChicken, setWinningChicken] = useState<number | null>(null);
    const [gameState, setGameState] = useState<'picking' | 'revealing' | 'finished'>('picking');
    
    const betPerChicken = 5;
    const totalBet = betPerChicken * selectedChickens.length;
    const winnings = betPerChicken * totalChickens;
    const canPlay = balance >= totalBet && selectedChickens.length > 0;
    const hasWon = gameState === 'finished' && winningChicken !== null && selectedChickens.includes(winningChicken);

    const message = {
        picking: canPlay ? `Aposta: R$ ${totalBet.toFixed(2)}` : (selectedChickens.length > 0 ? 'Saldo insuficiente!' : 'Escolha até 3 papagaios!'),
        revealing: 'E o papagaio premiado é...',
        finished: hasWon ? `Você ganhou R$ ${winnings.toFixed(2)}! O papagaio ${winningChicken! + 1} era o premiado!` : `Não foi dessa vez. O premiado era o ${winningChicken! + 1}.`,
    }[gameState];

    const messageColor = {
        picking: canPlay ? 'text-gray-400' : 'text-red-400',
        revealing: 'text-yellow-400 animate-pulse',
        finished: hasWon ? 'text-green-400' : 'text-red-400',
    }[gameState];

    const selectChicken = (index: number) => {
        if (gameState !== 'picking') return;

        const isSelected = selectedChickens.includes(index);
        if (isSelected) {
            setSelectedChickens(selectedChickens.filter(i => i !== index));
        } else if (selectedChickens.length < 3) {
            setSelectedChickens([...selectedChickens, index]);
        }
    };
    
    const play = () => {
        if (!canPlay) return;

        setGameState('revealing');
        updateBalance(-totalBet);
        const winner = Math.floor(Math.random() * totalChickens);
        
        setTimeout(() => {
            setWinningChicken(winner);
            setGameState('finished');
            if (selectedChickens.includes(winner)) {
                updateBalance(winnings);
            }
        }, 2000);
    };

    const reset = () => {
        setSelectedChickens([]);
        setWinningChicken(null);
        setGameState('picking');
    };

    const getChickenClasses = (index: number) => {
        const base = "w-16 h-16 rounded-full flex items-center justify-center text-4xl cursor-pointer transition-all duration-300 transform";
        const isSelected = selectedChickens.includes(index);

        if (gameState === 'finished') {
            if (index === winningChicken) {
                return `${base} bg-yellow-400 scale-125 shadow-lg shadow-yellow-400/50 ring-4 ring-white z-10`;
            }
            if (isSelected) {
                return `${base} bg-red-600`;
            }
            return `${base} bg-gray-700 opacity-50`;
        }
        if (gameState === 'revealing') {
            return `${base} bg-gray-800 animate-bounce`;
        }
        if (isSelected) {
            return `${base} bg-green-600 scale-110 ring-2 ring-white`;
        }
        return `${base} bg-gray-800 hover:bg-gray-700 hover:scale-105`;
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
                       🦜
                    </button>
                ))}
            </div>

            <div className="flex flex-col w-full max-w-xs space-y-3 pt-4">
                 {gameState === 'picking' ? (
                     <button onClick={play} disabled={!canPlay} className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg text-xl hover:bg-green-700 transition disabled:bg-gray-500 disabled:cursor-not-allowed btn-press">
                        {selectedChickens.length > 0 ? `Apostar R$ ${totalBet.toFixed(2)}` : 'Selecione um papagaio'}
                    </button>
                 ) : (
                     <button onClick={reset} className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg text-xl hover:bg-blue-700 transition btn-press">
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