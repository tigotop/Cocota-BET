import React, { useState } from 'react';
import { useBalance } from '../../contexts/BalanceContext';

interface ClassroomScoldingGameProps {
    onBack: () => void;
}

const options = ['Regiane', 'Lawrence', 'Kátia', 'Kate', 'Carlos'];

export const ClassroomScoldingGame: React.FC<ClassroomScoldingGameProps> = ({ onBack }) => {
    const { balance, updateBalance } = useBalance();
    const [selectedPerson, setSelectedPerson] = useState<string | null>(null);
    const [winningPerson, setWinningPerson] = useState<string | null>(null);
    const [gameState, setGameState] = useState<'picking' | 'revealing' | 'finished'>('picking');

    const betAmount = 10;
    const winMultiplier = 4.5;
    const winnings = betAmount * winMultiplier;
    const canPlay = balance >= betAmount && selectedPerson !== null;

    const hasWon = gameState === 'finished' && winningPerson === selectedPerson;

    const message = {
        picking: canPlay ? `Aposta: R$ ${betAmount.toFixed(2)}` : (selectedPerson ? 'Saldo insuficiente!' : 'Escolha um professor!'),
        revealing: 'O Cocota está conversando... quem vai reclamar?',
        finished: hasWon ? `Você ganhou R$ ${winnings.toFixed(2)}! ${winningPerson} brigou com o Cocota.` : `Não foi dessa vez. Quem brigou foi ${winningPerson}.`,
    }[gameState];

    const messageColor = {
        picking: canPlay ? 'text-gray-400' : 'text-red-400',
        revealing: 'text-yellow-400 animate-pulse',
        finished: hasWon ? 'text-green-400' : 'text-red-400',
    }[gameState];

    const handleSelect = (person: string) => {
        if (gameState === 'picking') {
            setSelectedPerson(person);
        }
    };

    const play = () => {
        if (!canPlay) return;

        setGameState('revealing');
        updateBalance(-betAmount);
        const winner = options[Math.floor(Math.random() * options.length)];

        setTimeout(() => {
            setWinningPerson(winner);
            setGameState('finished');
            if (winner === selectedPerson) {
                updateBalance(winnings);
            }
        }, 2500);
    };

    const reset = () => {
        setSelectedPerson(null);
        setWinningPerson(null);
        setGameState('picking');
    };

    const getButtonClasses = (person: string) => {
        const base = "w-full text-center p-4 rounded-lg font-bold transition-all duration-300 transform btn-press";
        const isSelected = selectedPerson === person;

        if (gameState === 'finished') {
            if (person === winningPerson) {
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
        <div className="flex flex-col items-center p-4 h-full text-white space-y-6">
            <div className="text-center">
                <h2 className="text-3xl font-bold">Xingo da Aula</h2>
                <p className={`text-lg font-semibold h-12 mt-2 flex items-center justify-center ${messageColor}`}>{message}</p>
            </div>

            <div className="w-full max-w-xs space-y-3">
                {options.map(person => (
                    <button key={person} onClick={() => handleSelect(person)} disabled={gameState !== 'picking'} className={getButtonClasses(person)}>
                        {person}
                    </button>
                ))}
            </div>

            <div className="flex flex-col w-full max-w-xs space-y-3 pt-4">
                {gameState === 'picking' ? (
                    <button onClick={play} disabled={!canPlay} className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg text-xl hover:bg-green-700 transition disabled:bg-gray-500 disabled:cursor-not-allowed btn-press">
                        {selectedPerson ? `Apostar em ${selectedPerson}` : 'Selecione uma opção'}
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