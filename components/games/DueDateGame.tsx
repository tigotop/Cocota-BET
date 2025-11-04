import React, { useState } from 'react';
import { useBalance } from '../../contexts/BalanceContext';

interface DueDateGameProps {
    onBack: () => void;
}

const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];
const BET_AMOUNT = 10;
const WIN_MULTIPLIER = 10;

export const DueDateGame: React.FC<DueDateGameProps> = ({ onBack }) => {
    const { balance, updateBalance } = useBalance();
    const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
    const [winningMonth, setWinningMonth] = useState<string | null>(null);
    const [gameState, setGameState] = useState<'picking' | 'revealing' | 'finished'>('picking');

    const canPlay = balance >= BET_AMOUNT && selectedMonth !== null;
    const winnings = BET_AMOUNT * WIN_MULTIPLIER;
    const hasWon = gameState === 'finished' && winningMonth === selectedMonth;

    const message = {
        picking: canPlay ? `Aposta: R$ ${BET_AMOUNT.toFixed(2)}` : (selectedMonth ? 'Saldo insuficiente!' : 'Escolha um mês!'),
        revealing: 'O cocotinha está vindo... 🐣',
        finished: hasWon ? `Você ganhou R$ ${winnings.toFixed(2)}! Nasceu em ${winningMonth}!` : `Não foi dessa vez. Nasceu em ${winningMonth}.`,
    }[gameState];

    const messageColor = {
        picking: canPlay ? 'text-gray-400' : 'text-red-400',
        revealing: 'text-yellow-400 animate-pulse',
        finished: hasWon ? 'text-green-400' : 'text-red-400',
    }[gameState];

    const handleSelect = (month: string) => {
        if (gameState === 'picking') {
            setSelectedMonth(month);
        }
    };

    const play = () => {
        if (!canPlay) return;

        setGameState('revealing');
        updateBalance(-BET_AMOUNT);
        const winner = months[Math.floor(Math.random() * months.length)];

        setTimeout(() => {
            setWinningMonth(winner);
            setGameState('finished');
            if (winner === selectedMonth) {
                updateBalance(winnings);
            }
        }, 2500);
    };

    const reset = () => {
        setSelectedMonth(null);
        setWinningMonth(null);
        setGameState('picking');
    };

    const getButtonClasses = (month: string) => {
        const base = "w-full text-center p-3 rounded-lg font-bold transition-all duration-300 transform btn-press text-xs";
        const isSelected = selectedMonth === month;

        if (gameState === 'finished') {
            if (month === winningMonth) {
                return `${base} bg-yellow-400 text-black scale-110 shadow-lg shadow-yellow-400/50 ring-4 ring-white z-10`;
            }
            if (isSelected) {
                return `${base} bg-red-600`;
            }
            return `${base} bg-gray-700 opacity-50`;
        }
        
        if (isSelected) {
            return `${base} bg-green-600 scale-105 ring-2 ring-white`;
        }

        return `${base} bg-gray-800 hover:bg-gray-700`;
    };

    return (
        <div className="flex flex-col items-center p-4 h-full text-white space-y-5">
            <div className="text-center">
                <h2 className="text-3xl font-bold">Qual o Mês?</h2>
                <p className={`text-lg font-semibold h-10 mt-2 flex items-center justify-center ${messageColor}`}>{message}</p>
            </div>

            <div className="w-full max-w-sm grid grid-cols-3 gap-2">
                {months.map(month => (
                    <button key={month} onClick={() => handleSelect(month)} disabled={gameState !== 'picking'} className={getButtonClasses(month)}>
                        {month}
                    </button>
                ))}
            </div>

            <div className="flex flex-col w-full max-w-xs space-y-3 pt-4">
                {gameState === 'picking' ? (
                    <button onClick={play} disabled={!canPlay} className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg text-xl hover:bg-green-700 transition disabled:bg-gray-500 disabled:cursor-not-allowed btn-press">
                        {selectedMonth ? `Apostar R$ ${BET_AMOUNT.toFixed(2)}` : 'Selecione um mês'}
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