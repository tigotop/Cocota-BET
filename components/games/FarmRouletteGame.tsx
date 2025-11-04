import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useBalance } from '../../contexts/BalanceContext';

interface FarmRouletteGameProps {
    onBack: () => void;
}

type BetOption = 'galo' | 'galinha' | 'ovo';
const options: BetOption[] = ['galo', 'galinha', 'galo', 'galinha', 'galo', 'galinha', 'galo', 'galinha', 'galo', 'galinha', 'ovo', 'galo', 'galinha', 'galo', 'galinha'];

export const FarmRouletteGame: React.FC<FarmRouletteGameProps> = ({ onBack }) => {
    const { balance, updateBalance } = useBalance();
    const [bet, setBet] = useState<BetOption | null>(null);
    const [spinning, setSpinning] = useState(false);
    const [message, setMessage] = useState('');
    const [wheelStyle, setWheelStyle] = useState<React.CSSProperties>({});
    const resultRef = useRef<BetOption | null>(null);

    const reelStrip = useMemo(() => Array(5).fill(options).flat(), []);

    const betAmount = 10;
    const canSpin = balance >= betAmount && !spinning && !!bet;

    useEffect(() => {
        // Set initial position of the wheel without animation
        const resetIndex = options.length;
        const itemWidthRem = 2.5;
        const resetPosition = `translateX(calc(-${resetIndex * itemWidthRem}rem + 50% - ${itemWidthRem / 2}rem))`;
        setWheelStyle({ transform: resetPosition, transition: 'none' });
    }, []);


    const onSpinEnd = () => {
        if (!spinning) return;

        const finalResult = resultRef.current;
        if (finalResult === bet) {
            const multiplier = bet === 'ovo' ? 10 : 2;
            const winnings = betAmount * multiplier;
            updateBalance(winnings);
            setMessage(`Você ganhou R$ ${winnings.toFixed(2)}! O resultado foi ${finalResult}.`);
        } else {
            setMessage(`Você perdeu! O resultado foi ${finalResult}.`);
        }
        setSpinning(false);

        setTimeout(() => {
            const resetIndex = options.length;
            const itemWidthRem = 2.5;
            const resetPosition = `translateX(calc(-${resetIndex * itemWidthRem}rem + 50% - ${itemWidthRem / 2}rem))`;
            setWheelStyle({ transform: resetPosition, transition: 'none' });
        }, 2000);
    };


    const placeBet = (option: BetOption) => {
        if (spinning) return;
        setBet(option);
        setMessage('');
    };

    const spin = () => {
        if (!canSpin) {
            setMessage(balance < betAmount ? 'Saldo insuficiente!' : 'Escolha uma opção para apostar!');
            return;
        }
        setSpinning(true);
        updateBalance(-betAmount);
        
        const finalIndex = Math.floor(Math.random() * options.length);
        resultRef.current = options[finalIndex];

        const landingIndex = options.length * 3 + finalIndex;
        const itemWidthRem = 2.5;
        const targetPosition = `translateX(calc(-${landingIndex * itemWidthRem}rem + 50% - ${itemWidthRem / 2}rem))`;

        setWheelStyle({
            transform: targetPosition,
            transition: `transform 4s cubic-bezier(0.25, 0.1, 0.25, 1)`
        });
    };

    const getOptionClasses = (option: BetOption, isActive: boolean = false) => {
        const base = `w-1/3 py-3 font-bold rounded-lg border-2 transition btn-press`;
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

    const getWheelItemClasses = (option: BetOption) => {
         const base = `w-8 h-8 flex items-center justify-center font-bold text-lg rounded-full flex-shrink-0`;
         const colors = { galo: 'bg-red-600', galinha: 'bg-gray-600', ovo: 'bg-yellow-400 text-black' };
         return `${base} ${colors[option]}`;
    }

    return (
        <div className="flex flex-col items-center p-4 h-full text-white space-y-6">
            <div className="text-center">
                <h2 className="text-3xl font-bold">Roleta da Granja</h2>
                <p className="text-gray-400">Faça sua aposta e gire!</p>
            </div>

            {/* Wheel */}
            <div className="relative w-full h-20 flex items-center justify-center overflow-hidden bg-gray-900/50 rounded-lg">
                <div 
                    className="absolute left-0 top-1/2 -translate-y-1/2 flex space-x-2" 
                    style={wheelStyle}
                    onTransitionEnd={onSpinEnd}
                >
                     {reelStrip.map((opt, i) => (
                        <div key={i} className={getWheelItemClasses(opt as BetOption)}>{opt === 'ovo' ? '🥚' : '🦜'}</div>
                    ))}
                </div>
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-green-400 z-10"></div>
                 <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-full bg-green-400/20"></div>
            </div>
            
            {message && <p className={`font-bold text-lg text-center h-6 ${message.includes('ganhou') ? 'text-green-400' : 'text-red-400'}`}>{message}</p>}

            {/* Bet Options */}
            <div>
                <p className="text-center mb-2">Sua aposta (R$ {betAmount.toFixed(2)}):</p>
                <div className="flex space-x-2 w-full max-w-xs text-center">
                    <button onClick={() => placeBet('galo')} className={getOptionClasses('galo', bet === 'galo')}>Vermelho (2x)</button>
                    <button onClick={() => placeBet('galinha')} className={getOptionClasses('galinha', bet === 'galinha')}>Cinza (2x)</button>
                    <button onClick={() => placeBet('ovo')} className={getOptionClasses('ovo', bet === 'ovo')}>Ovo (10x)</button>
                </div>
            </div>

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