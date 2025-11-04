import React, { useState, useEffect } from 'react';
import { useBalance } from '../../contexts/BalanceContext';

interface FinalGradeGameProps {
    onBack: () => void;
}

const BET_AMOUNT = 10;
const multipliers = [1.5, 2, 2.5, 3, 4, 5, 7, 10, 15, 25];

const generateGrade = (exclude: number | null = null): number => {
    let newGrade;
    do {
        newGrade = parseFloat((Math.random() * 10).toFixed(1));
    } while (newGrade === exclude);
    return newGrade;
};

export const FinalGradeGame: React.FC<FinalGradeGameProps> = ({ onBack }) => {
    const { balance, updateBalance } = useBalance();
    const [gameState, setGameState] = useState<'betting' | 'playing' | 'lost'>('betting');
    const [currentGrade, setCurrentGrade] = useState<number>(5.0);
    const [nextGrade, setNextGrade] = useState<number | null>(null);
    const [streak, setStreak] = useState(0);
    const [message, setMessage] = useState('');

    const canPlay = balance >= BET_AMOUNT;
    const currentMultiplier = streak > 0 ? multipliers[Math.min(streak - 1, multipliers.length - 1)] : 0;
    const potentialWinnings = BET_AMOUNT * currentMultiplier;

    const startGame = () => {
        if (!canPlay) {
            setMessage('Saldo insuficiente!');
            return;
        }
        updateBalance(-BET_AMOUNT);
        setCurrentGrade(generateGrade());
        setNextGrade(null);
        setStreak(0);
        setGameState('playing');
        setMessage('A próxima nota será maior ou menor?');
    };

    const handleGuess = (guess: 'higher' | 'lower') => {
        if (gameState !== 'playing') return;

        const newGrade = generateGrade(currentGrade);
        setNextGrade(newGrade);

        const isCorrect = (guess === 'higher' && newGrade > currentGrade) || (guess === 'lower' && newGrade < currentGrade);

        if (isCorrect) {
            setStreak(prev => prev + 1);
            setCurrentGrade(newGrade);
            setNextGrade(null); // Hide for next round after animation
             setMessage(`Correto! Próxima nota...`);
        } else {
            setGameState('lost');
            setMessage(`Errado! A nota era ${newGrade.toFixed(1)}.`);
        }
    };

    const cashOut = () => {
        if (streak > 0) {
            updateBalance(potentialWinnings);
        }
        setGameState('betting');
        setStreak(0);
        setMessage(streak > 0 ? `Você ganhou R$ ${potentialWinnings.toFixed(2)}!` : 'Jogo resetado.');
    };
    
    const resetGame = () => {
        setGameState('betting');
        setStreak(0);
        setMessage('');
    };

    return (
        <div className="flex flex-col items-center justify-between p-4 h-full text-white">
            <div className="text-center w-full">
                <h2 className="text-3xl font-bold">Nota Final</h2>
                 <p className="text-gray-400 h-6">{gameState === 'betting' ? 'Adivinhe a sequência de notas!' : `Sequência: ${streak} | Multiplicador: ${currentMultiplier}x`}</p>
            </div>

            <div className="flex items-center justify-center space-x-4 w-full h-40">
                <div className="w-32 h-32 bg-gray-800 rounded-lg flex flex-col items-center justify-center shadow-lg">
                    <p className="text-sm text-gray-400">Nota Atual</p>
                    <p className="text-6xl font-bold">{gameState !== 'betting' ? currentGrade.toFixed(1) : '?'}</p>
                </div>
                 {gameState === 'playing' && <p className="text-4xl font-bold">?</p>}
                {nextGrade !== null && (
                    <div className="w-32 h-32 bg-gray-700 rounded-lg flex flex-col items-center justify-center shadow-lg animate-fade-in">
                         <p className="text-sm text-gray-400">Próxima Nota</p>
                         <p className="text-6xl font-bold">{nextGrade.toFixed(1)}</p>
                    </div>
                )}
            </div>

             <p className={`font-bold text-lg text-center h-8 transition-colors ${gameState === 'lost' ? 'text-red-400' : 'text-green-400'}`}>
                {message}
            </p>

            <div className="flex flex-col w-full max-w-xs space-y-3">
                 {gameState === 'betting' && (
                    <button onClick={startGame} disabled={!canPlay} className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg text-xl hover:bg-green-700 transition disabled:bg-gray-500 disabled:cursor-not-allowed btn-press">
                        {canPlay ? `Apostar R$ ${BET_AMOUNT.toFixed(2)}` : 'Saldo Insuficiente'}
                    </button>
                )}
                {gameState === 'playing' && (
                    <>
                        <div className="flex space-x-2">
                             <button onClick={() => handleGuess('lower')} className="w-1/2 bg-red-500 text-white font-bold py-3 px-4 rounded-lg text-xl hover:bg-red-600 transition btn-press">Menor</button>
                            <button onClick={() => handleGuess('higher')} className="w-1/2 bg-blue-500 text-white font-bold py-3 px-4 rounded-lg text-xl hover:bg-blue-600 transition btn-press">Maior</button>
                        </div>
                         <button onClick={cashOut} disabled={streak === 0} className="w-full bg-yellow-500 text-black font-bold py-3 px-4 rounded-lg text-xl hover:bg-yellow-600 transition disabled:bg-gray-500 disabled:cursor-not-allowed btn-press">
                            Retirar R$ {potentialWinnings.toFixed(2)}
                        </button>
                    </>
                )}
                {gameState === 'lost' && (
                     <button onClick={resetGame} className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg text-xl hover:bg-blue-700 transition btn-press">
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