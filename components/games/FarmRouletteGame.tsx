import React, { useState, useEffect } from 'react';

interface FarmRouletteGameProps {
    onBack: () => void;
}

type BetOption = 'galo' | 'galinha' | 'ovo';
const options = ['galo', 'galinha', 'galo', 'galinha', 'galo', 'galinha', 'galo', 'galinha', 'galo', 'galinha', 'ovo', 'galo', 'galinha', 'galo', 'galinha'];

export const FarmRouletteGame: React.FC<FarmRouletteGameProps> = ({ onBack }) => {
    const [bet, setBet] = useState<BetOption | null>(null);
    const [spinning, setSpinning] = useState(false);
    const [result, setResult] = useState<BetOption | null>(null);
    const [message, setMessage] = useState('');
    const [activeIndex, setActiveIndex] = useState(0);

    const placeBet = (option: BetOption) => {
        if (spinning) return;
        setBet(option);
        setMessage('');
        setResult(null);
    };

    const spin = () => {
        if (!bet || spinning) return;
        setSpinning(true);
        
        const finalIndex = Math.floor(Math.random() * options.length);
        const totalSpins = 3 * options.length + finalIndex; // 3 full rotations + final position
        let currentSpin = 0;
        
        const interval = setInterval(() => {
            setActiveIndex(currentSpin % options.length);
            currentSpin++;
            if (currentSpin > totalSpins) {
                clearInterval(interval);
                const finalResult = options[finalIndex] as BetOption;
                setResult(finalResult);
                setSpinning(false);
                if (finalResult === bet) {
                    const multiplier = bet === 'ovo' ? 10 : 2;
                    setMessage(`Você ganhou! O resultado foi ${finalResult}.`);
                } else {
                    setMessage(`Você perdeu! O resultado foi ${finalResult}.`);
                }
            }
        }, 75);
    };

    const getOptionClasses = (option: BetOption, isActive: boolean = false) => {
        const base = `w-1/3 py-3 font-bold rounded-lg border-2 transition`;
        const colors = {
            galo: 'border-red-500 hover:bg-red-500/50',
            galinha: 'border-gray-500 hover:bg-gray-500/50',
            ovo: 'border-yellow-400 hover:bg-yellow-400/50'
        };
        const activeColor = {
            galo: 'bg-red-500 text-white',
            galinha: 'bg-gray-500 text-white',
            ovo: 'bg-yellow-400 text-black'
        };
        
        return `${base} ${colors[option]} ${isActive ? activeColor[option] : ''}`;
    };

    const getWheelItemClasses = (option: BetOption, index: number) => {
         const base = `w-8 h-8 flex items-center justify-center font-bold text-lg rounded-full transition-all duration-100`;
         const colors = { galo: 'bg-red-600', galinha: 'bg-gray-600', ovo: 'bg-yellow-400 text-black' };
         return `${base} ${colors[option]} ${index === activeIndex ? 'scale-125 shadow-lg shadow-white/50' : ''}`;
    }

    return (
        <div className="flex flex-col items-center p-4 h-full text-white space-y-6">
            <div className="text-center">
                <h2 className="text-3xl font-bold">Roleta da Granja</h2>
                <p className="text-gray-400">Faça sua aposta e gire!</p>
            </div>

            {/* Wheel */}
            <div className="relative w-full h-20 flex items-center justify-center overflow-hidden">
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex space-x-2 transition-transform duration-100" style={{ transform: `translateX(calc(-${activeIndex * 2.5}rem + 50% - 1rem))` }}>
                     {[...options, ...options].map((opt, i) => (
                        <div key={i} className={getWheelItemClasses(opt as BetOption, -1)}>{opt === 'ovo' ? '🥚' : opt === 'galo' ? '🐓' : '🐔'}</div>
                    ))}
                </div>
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-green-400"></div>
            </div>
            
            {message && <p className={`font-bold text-lg text-center ${message.includes('ganhou') ? 'text-green-400' : 'text-red-400'}`}>{message}</p>}

            {/* Bet Options */}
            <div>
                <p className="text-center mb-2">Sua aposta:</p>
                <div className="flex space-x-2 w-full max-w-xs text-center">
                    <button onClick={() => placeBet('galo')} className={getOptionClasses('galo', bet === 'galo')}>Galo (2x)</button>
                    <button onClick={() => placeBet('galinha')} className={getOptionClasses('galinha', bet === 'galinha')}>Galinha (2x)</button>
                    <button onClick={() => placeBet('ovo')} className={getOptionClasses('ovo', bet === 'ovo')}>Ovo (10x)</button>
                </div>
            </div>

            <div className="flex flex-col w-full max-w-xs space-y-3">
                 <button onClick={spin} disabled={spinning || !bet} className="w-full bg-green-600 text-white font-bold py-4 px-4 rounded-lg text-xl hover:bg-green-700 transition disabled:bg-gray-500 disabled:cursor-not-allowed">
                    {spinning ? 'Girando...' : 'Girar!'}
                </button>
                <button onClick={onBack} className="w-full bg-gray-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-700 transition">
                    Voltar ao Cassino
                </button>
            </div>
        </div>
    );
};