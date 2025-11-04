import React, { useState } from 'react';
import type { GameEvent } from '../types';
import { useBalance } from '../contexts/BalanceContext';
import { useBets } from '../contexts/BetContext';

interface BetSlipProps {
    selection: {
        event: GameEvent;
        selection: string;
        odd: number;
    };
    onClose: () => void;
}

export const BetSlip: React.FC<BetSlipProps> = ({ selection, onClose }) => {
    const [stake, setStake] = useState<number>(10);
    const [message, setMessage] = useState('');
    const { balance, updateBalance } = useBalance();
    const { addBet } = useBets();

    const { event, selection: selectedOption, odd } = selection;
    const potentialReturn = stake * odd;

    const handleStakeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Allow empty input for clearing, but treat as 0
        if (value === '') {
            setStake(0);
        } else {
             const numValue = parseFloat(value);
             if (!isNaN(numValue)) {
                setStake(numValue);
             }
        }
        setMessage(''); // Clear message on change
    };

    const handleConfirmBet = () => {
        if (stake <= 0) {
            setMessage('A aposta deve ser maior que R$ 0,00.');
            return;
        }
        if (stake > balance) {
            setMessage('Saldo insuficiente.');
            return;
        }

        updateBalance(-stake);
        addBet(event, selectedOption, odd, stake);
        onClose();
    };

    const quickStakeValues = [10, 25, 50, 100];

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-end z-50 animate-fade-in">
            <div className="bg-gray-800 w-full max-w-md rounded-t-2xl p-4 shadow-lg flex flex-col space-y-4 animate-slide-up">
                <div className="flex justify-between items-center">
                    <h3 className="font-bold text-lg text-white">Boletim de Apostas</h3>
                    <button onClick={onClose} className="text-gray-400 text-3xl leading-none hover:text-white">&times;</button>
                </div>

                <div className="bg-gray-700 p-3 rounded-lg">
                    <p className="text-sm text-gray-300">{event.category}</p>
                    <p className="font-semibold text-white">{event.eventName || `${event.teamA} vs ${event.teamB}`}</p>
                    <div className="flex justify-between items-center mt-2">
                        <span className="font-bold text-green-400">{selectedOption}</span>
                        <span className="font-bold text-white text-lg">@{odd.toFixed(2)}</span>
                    </div>
                </div>

                <div>
                    <label htmlFor="stake" className="block text-sm font-medium text-gray-400 mb-1">Valor da Aposta (R$)</label>
                    <input
                        id="stake"
                        type="number"
                        value={stake === 0 ? '' : stake}
                        onChange={handleStakeChange}
                        placeholder="0,00"
                        className="appearance-none block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm bg-gray-900 text-white"
                    />
                     <div className="flex justify-start space-x-2 mt-2">
                        {quickStakeValues.map(val => (
                            <button key={val} onClick={() => setStake(val)} className="bg-gray-600 text-xs px-3 py-1 rounded-full hover:bg-gray-500 transition btn-press">
                                {val}
                            </button>
                        ))}
                         <button onClick={() => setStake(parseFloat(balance.toFixed(2)))} className="bg-gray-600 text-xs px-3 py-1 rounded-full hover:bg-gray-500 transition btn-press">
                                MAX
                         </button>
                    </div>
                </div>
                
                {message && <p className="text-red-400 text-sm text-center">{message}</p>}

                <div className="flex justify-between items-center text-gray-300">
                    <span>Retorno Potencial</span>
                    <span className="font-bold text-white text-lg">R$ {potentialReturn.toFixed(2)}</span>
                </div>

                <button
                    onClick={handleConfirmBet}
                    disabled={stake <= 0 || stake > balance}
                    className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg text-lg hover:bg-green-700 transition disabled:bg-gray-500 disabled:cursor-not-allowed btn-press"
                >
                    Apostar R$ {stake > 0 ? stake.toFixed(2) : '0.00'}
                </button>
            </div>
            <style>{`
                @keyframes slideUp {
                    from { transform: translateY(100%); }
                    to { transform: translateY(0); }
                }
                .animate-slide-up {
                    animation: slideUp 0.3s ease-out;
                }
            `}</style>
        </div>
    );
};
