import React, { useState } from 'react';
import { useBalance } from '../../contexts/BalanceContext';

interface CornSlotGameProps {
    onBack: () => void;
}

const symbols = ['🌽', '🦜', '🥚', '🏆'];
const winMultiplier = { '🌽': 2, '🦜': 3, '🥚': 5, '🏆': 10 };

export const CornSlotGame: React.FC<CornSlotGameProps> = ({ onBack }) => {
    const { balance, updateBalance } = useBalance();
    const [reels, setReels] = useState(['🌽', '🦜', '🥚']);
    const [spinning, setSpinning] = useState(false);
    const [bet, setBet] = useState(10);
    const [message, setMessage] = useState('');
    const [isWin, setIsWin] = useState(false);

    const canSpin = balance >= bet && !spinning;

    const spin = () => {
        if (!canSpin) {
            setMessage(balance < bet ? 'Saldo insuficiente!' : '');
            return;
        }
        updateBalance(-bet);
        setSpinning(true);
        setMessage('');
        setIsWin(false);

        let spinCount = 0;
        const interval = setInterval(() => {
            setReels([
                symbols[Math.floor(Math.random() * symbols.length)],
                symbols[Math.floor(Math.random() * symbols.length)],
                symbols[Math.floor(Math.random() * symbols.length)],
            ]);
            spinCount++;
            if (spinCount > 15) { // Control spin duration
                clearInterval(interval);
                endSpin();
            }
        }, 100);
    };

    const endSpin = () => {
        // Simulate a result
        const newReels = [
            symbols[Math.floor(Math.random() * symbols.length)],
            symbols[Math.floor(Math.random() * symbols.length)],
            symbols[Math.floor(Math.random() * symbols.length)],
        ];
        
        // Sometimes force a win for fun
        if (Math.random() > 0.6) {
            const winningSymbol = symbols[Math.floor(Math.random() * symbols.length)];
            newReels[0] = winningSymbol;
            newReels[1] = winningSymbol;
            newReels[2] = winningSymbol;
        }

        setReels(newReels);
        setSpinning(false);
        checkWin(newReels);
    };

    const checkWin = (finalReels: string[]) => {
        if (finalReels[0] === finalReels[1] && finalReels[1] === finalReels[2]) {
            const symbol = finalReels[0] as keyof typeof winMultiplier;
            const winnings = bet * winMultiplier[symbol];
            updateBalance(winnings);
            setMessage(`Você ganhou R$ ${winnings.toFixed(2)}!`);
            setIsWin(true);
        } else {
            setMessage('Não foi desta vez! Tente de novo.');
        }
    };
    
    return (
         <div className="flex flex-col items-center justify-center p-4 h-full text-white space-y-6">
            <div className="text-center">
                <h2 className="text-3xl font-bold">Caça-Níquel do Milho</h2>
                <p className="text-gray-400">Alinhe 3 símbolos para ganhar!</p>
            </div>

            {/* Reels */}
            <div className="flex justify-center items-center space-x-4 bg-gray-800 p-6 rounded-lg shadow-inner">
                {reels.map((symbol, index) => (
                    <div key={index} className={`w-20 h-24 bg-gray-700 rounded-md flex items-center justify-center text-5xl shadow-md ${isWin ? 'animate-pulse-glow' : ''}`}>
                       {symbol}
                    </div>
                ))}
            </div>

            {/* Message */}
            {message && <p className={`font-bold text-lg ${message.includes('ganhou') ? 'text-green-400' : 'text-red-400'}`}>{message}</p>}

            {/* Bet Controls */}
            <div className="flex items-center space-x-4">
                <button onClick={() => setBet(b => Math.max(1, b - 1))} disabled={spinning} className="bg-gray-600 w-10 h-10 text-2xl rounded-full disabled:opacity-50 btn-press">-</button>
                <span className="text-xl font-bold w-24 text-center">Aposta: R$ {bet}</span>
                <button onClick={() => setBet(b => Math.min(balance, b + 1))} disabled={spinning} className="bg-gray-600 w-10 h-10 text-2xl rounded-full disabled:opacity-50 btn-press">+</button>
            </div>

            {/* Actions */}
            <div className="flex flex-col w-full max-w-xs space-y-3">
                 <button onClick={spin} disabled={!canSpin} className="w-full bg-green-600 text-white font-bold py-4 px-4 rounded-lg text-xl hover:bg-green-700 transition disabled:bg-gray-500 disabled:cursor-not-allowed btn-press">
                    {spinning ? 'Girando...' : 'Girar!'}
                </button>
                <button onClick={onBack} className="w-full bg-gray-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-700 transition btn-press">
                    Voltar ao Cassino
                </button>
            </div>
        </div>
    );
};