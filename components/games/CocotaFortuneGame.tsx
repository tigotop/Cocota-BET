import React, { useState, useEffect, useRef } from 'react';
import { useBalance } from '../../contexts/BalanceContext';

interface CocotaFortuneGameProps {
    onBack: () => void;
}

// --- Game Constants ---
const SYMBOLS = {
    COCOTA: '🦜', // Wild
    EGG: '🥚',
    CORN: '🌽',
    PEN: '🖊️',
    ERASER: '🧽',
    APPLE: '🍎',
};

const PAYOUTS: { [key: string]: number } = {
    [SYMBOLS.COCOTA]: 2.0,
    [SYMBOLS.EGG]: 1.0,
    [SYMBOLS.CORN]: 0.5,
    [SYMBOLS.PEN]: 0.2,
    [SYMBOLS.ERASER]: 0.2,
    [SYMBOLS.APPLE]: 0.1,
};

const ALL_SYMBOLS = Object.values(SYMBOLS);

const PAYLINES = [
    [[0, 0], [0, 1], [0, 2]], // Top row
    [[1, 0], [1, 1], [1, 2]], // Middle row
    [[2, 0], [2, 1], [2, 2]], // Bottom row
    [[0, 0], [1, 1], [2, 2]], // Diagonal L-R
    [[0, 2], [1, 1], [2, 0]], // Diagonal R-L
];

const generateRandomReels = (): string[][] => {
    return Array(3).fill(null).map(() =>
        Array(3).fill(null).map(() => ALL_SYMBOLS[Math.floor(Math.random() * ALL_SYMBOLS.length)])
    );
};

const SuperWinOverlay: React.FC<{ amount: number }> = ({ amount }) => (
    <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-50 animate-fade-in overflow-hidden">
        <style>{`
            @keyframes coin-fall {
                0% { transform: translateY(-100%); opacity: 1; }
                100% { transform: translateY(100vh); opacity: 0; }
            }
            .coin {
                position: absolute;
                top: -50px;
                width: 30px;
                height: 30px;
                background-color: #FFD700;
                border-radius: 50%;
                opacity: 0.8;
                animation: coin-fall 2s linear infinite;
                box-shadow: 0 0 10px #FFD700;
            }
        `}</style>
        {Array.from({ length: 30 }).map((_, i) => (
            <div key={i} className="coin" style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random() * 2}s`
            }}></div>
        ))}
        <h2 className="text-6xl font-extrabold text-yellow-400 drop-shadow-lg" style={{ textShadow: '0 0 20px #fef08a' }}>NOTA 10!</h2>
        <p className="text-4xl font-bold text-white mt-4">+ R$ {amount.toFixed(2)}</p>
    </div>
);

const WinFXOverlay: React.FC = () => {
    const particles = Array.from({ length: 40 });

    return (
        <div className="absolute inset-0 pointer-events-none z-40 overflow-hidden">
            <style>{`
                @keyframes fly-up {
                    0% {
                        transform: translateY(100%) scale(0.5);
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(-200px) scale(1.5);
                        opacity: 0;
                    }
                }
                .particle {
                    position: absolute;
                    bottom: -50px;
                    animation: fly-up linear;
                    will-change: transform, opacity;
                }
            `}</style>
            {particles.map((_, i) => (
                <div
                    key={i}
                    className="particle"
                    style={{
                        left: `${Math.random() * 100}%`,
                        fontSize: `${1.5 + Math.random() * 1.5}rem`,
                        animationDuration: `${2 + Math.random() * 3}s`,
                        animationDelay: `${Math.random() * 0.5}s`,
                        transform: `translateX(-50%)`,
                    }}
                >
                    {Math.random() > 0.5 ? '🦜' : '💰'}
                </div>
            ))}
        </div>
    );
};

export const CocotaFortuneGame: React.FC<CocotaFortuneGameProps> = ({ onBack }) => {
    const { balance, updateBalance } = useBalance();
    const [reels, setReels] = useState<string[][]>(generateRandomReels());
    const [spinning, setSpinning] = useState(false);
    const [bet, setBet] = useState(10);
    const [message, setMessage] = useState('Escolha sua aposta e gire!');
    const [lastWin, setLastWin] = useState(0);
    const [isAutoSpin, setIsAutoSpin] = useState(false);
    const [showSuperWin, setShowSuperWin] = useState(false);
    const [showWinFX, setShowWinFX] = useState(false);

    const winningCells = useRef<Set<string>>(new Set());
    const autoSpinRef = useRef(isAutoSpin);

    useEffect(() => {
        autoSpinRef.current = isAutoSpin;
        if (isAutoSpin && !spinning) {
            spin();
        }
    }, [isAutoSpin]);


    const canSpin = balance >= bet && !spinning;

    const calculateWinnings = (currentReels: string[][]) => {
        let totalWinnings = 0;
        const newWinningCells = new Set<string>();

        for (const line of PAYLINES) {
            const symbolsOnLine = line.map(([r, c]) => currentReels[r][c]);

            let lineSymbol = symbolsOnLine[0];
            if (lineSymbol !== SYMBOLS.COCOTA) {
                const nonWild = symbolsOnLine.find(s => s !== SYMBOLS.COCOTA);
                if (nonWild) lineSymbol = nonWild;
            }

            const isWin = symbolsOnLine.every(symbol => symbol === lineSymbol || symbol === SYMBOLS.COCOTA);

            if (isWin) {
                totalWinnings += bet * PAYOUTS[lineSymbol];
                line.forEach(([r, c]) => newWinningCells.add(`${r}-${c}`));
            }
        }
        winningCells.current = newWinningCells;
        return totalWinnings;
    };


    const spin = () => {
        if (!canSpin) {
            setMessage(balance < bet ? 'Saldo insuficiente!' : '');
            setIsAutoSpin(false);
            return;
        }
        if (bet === 0) {
            setMessage('Aposta deve ser maior que R$ 0');
            setIsAutoSpin(false);
            return;
        }

        updateBalance(-bet);
        setSpinning(true);
        setMessage('');
        setLastWin(0);
        setShowWinFX(false);
        winningCells.current.clear();

        let spinCount = 0;
        const spinInterval = setInterval(() => {
            setReels(generateRandomReels());
            spinCount++;
            if (spinCount > 12) {
                clearInterval(spinInterval);
                endSpin();
            }
        }, 100);
    };

    const endSpin = () => {
        let finalReels = generateRandomReels();
        
        if (Math.random() < 0.35) {
             const winningSymbol = ALL_SYMBOLS[Math.floor(Math.random() * ALL_SYMBOLS.length)];
             const lineIndex = Math.floor(Math.random() * PAYLINES.length);
             PAYLINES[lineIndex].forEach(([r,c]) => {
                 finalReels[r][c] = Math.random() < 0.2 ? SYMBOLS.COCOTA : winningSymbol;
             })
        }

        setReels(finalReels);
        let winnings = calculateWinnings(finalReels);
        
        const fullScreenSymbol = isFullScreen(finalReels);
        const gotMultiplier = (fullScreenSymbol && Math.random() < 0.1) || (winnings > 0 && Math.random() < 0.01);


        if (winnings > 0) {
            if(gotMultiplier) {
                 winnings *= 10;
                 setMessage(`NOTA 10! Você ganhou R$ ${winnings.toFixed(2)}!`);
                 setShowSuperWin(true);
                 setTimeout(() => setShowSuperWin(false), 3000);
            } else {
                 setMessage(`Você ganhou R$ ${winnings.toFixed(2)}!`);
            }
            updateBalance(winnings);
            setLastWin(winnings);
            setShowWinFX(true);
            setTimeout(() => setShowWinFX(false), 3000);
        } else {
            setMessage('Tente novamente!');
        }
        
        setSpinning(false);

        if (autoSpinRef.current) {
            setTimeout(() => spin(), 2000);
        }
    };
    
    const isFullScreen = (currentReels: string[][]) => {
        const firstSymbol = currentReels[0][0];
        let mainSymbol = firstSymbol;
        if (firstSymbol === SYMBOLS.COCOTA) {
            const nonWild = currentReels.flat().find(s => s !== SYMBOLS.COCOTA);
            if (!nonWild) return SYMBOLS.COCOTA; 
            mainSymbol = nonWild;
        }
        
        for (let r = 0; r < 3; r++) {
            for (let c = 0; c < 3; c++) {
                 if (currentReels[r][c] !== mainSymbol && currentReels[r][c] !== SYMBOLS.COCOTA) {
                     return null;
                 }
            }
        }
        return mainSymbol;
    }
    
    const toggleAutoSpin = () => {
        setIsAutoSpin(prev => !prev);
    };
    
    const handleBetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value === '') {
            setBet(0);
            return;
        }
        let numValue = parseInt(value, 10);
        if (isNaN(numValue)) return;
        
        numValue = Math.max(0, numValue);
        numValue = Math.min(numValue, balance + bet); // Allow up to current balance + current bet
        
        setBet(numValue);
    };


    return (
        <div 
            className="relative flex flex-col items-center justify-between p-4 h-full text-white overflow-hidden"
            style={{ 
                backgroundImage: 'url(https://i.ibb.co/N2VSywbD/IMG-20251009-WA0004.jpg)', 
                backgroundSize: '150px', 
                backgroundRepeat: 'repeat'
            }}
        >
            <div className="absolute inset-0 bg-black/60 z-0"></div>
            {showSuperWin && <SuperWinOverlay amount={lastWin} />}
            {showWinFX && !showSuperWin && <WinFXOverlay />}

            <div className="text-center w-full z-10">
                <div className="absolute top-2 left-4 text-4xl animate-bounce">🦜</div>
                <h2 className="text-3xl font-bold text-white" style={{ textShadow: '2px 2px 4px #000' }}>Cocota da Sorte</h2>
                <p className="text-green-100">Alinhe 3 símbolos para ganhar!</p>
            </div>

             {/* Reels */}
            <div className="grid grid-cols-3 gap-2 bg-black/30 p-3 rounded-lg border-4 border-amber-400 shadow-lg z-10">
                {reels.flat().map((symbol, index) => {
                    const row = Math.floor(index / 3);
                    const col = index % 3;
                    const isWinning = winningCells.current.has(`${row}-${col}`);
                    return (
                        <div key={index} className={`w-20 h-20 bg-gray-800/80 rounded-md flex items-center justify-center text-5xl shadow-inner transition-all duration-300 ${isWinning ? 'animate-pulse-glow scale-110' : ''} ${spinning ? 'blur-sm' : ''}`}>
                            {symbol}
                        </div>
                    );
                })}
            </div>

            {/* Message & Win Display */}
            <div className="h-16 flex flex-col items-center justify-center text-center z-10">
                 {lastWin > 0 && !showSuperWin && (
                    <p className="font-bold text-2xl text-green-300 animate-fade-in">
                        + R$ {lastWin.toFixed(2)}
                    </p>
                 )}
                 <p className={`font-bold text-lg ${lastWin > 0 ? 'text-amber-300' : 'text-white'}`}>{message}</p>
            </div>
           
            {/* Bet Controls */}
             <div className="flex flex-col items-center space-y-2 bg-black/20 p-2 rounded-lg w-full max-w-sm z-10">
                <p className="text-sm text-amber-200">Valor da Aposta</p>
                <div className="flex items-center space-x-2 w-full">
                    <button onClick={() => setBet(b => Math.max(1, b - 1))} disabled={spinning || isAutoSpin} className="bg-amber-500 w-10 h-10 text-2xl rounded-full disabled:opacity-50 btn-press flex-shrink-0">-</button>
                    <div className="relative flex-grow">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">R$</span>
                        <input
                            type="number"
                            value={bet === 0 ? '' : bet}
                            onChange={handleBetChange}
                            onBlur={() => { if (bet === 0) setBet(1); }}
                            disabled={spinning || isAutoSpin}
                            className="bg-gray-900/50 text-white font-bold text-xl text-center w-full h-12 rounded-lg border-2 border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-300 pl-10 pr-4"
                        />
                    </div>
                    <button onClick={() => setBet(b => Math.min(balance + (spinning ? bet : 0), b + 1))} disabled={spinning || isAutoSpin} className="bg-amber-500 w-10 h-10 text-2xl rounded-full disabled:opacity-50 btn-press flex-shrink-0">+</button>
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col w-full max-w-xs space-y-3 z-10">
                <div className="flex items-center space-x-2">
                    <button onClick={spin} disabled={!canSpin || isAutoSpin || bet === 0} className="w-full bg-green-600 text-white font-bold py-4 px-4 rounded-lg text-xl hover:bg-green-700 transition disabled:bg-gray-500 disabled:cursor-not-allowed btn-press shadow-lg border-b-4 border-green-800">
                        {spinning ? 'Girando...' : 'Girar'}
                    </button>
                    <button onClick={toggleAutoSpin} className={`w-28 font-bold py-4 px-2 rounded-lg text-xl transition shadow-lg border-b-4 btn-press ${isAutoSpin ? 'bg-red-500 border-red-700' : 'bg-blue-500 border-blue-700'}`}>
                        {isAutoSpin ? 'Parar' : 'Auto'}
                    </button>
                </div>
                <button onClick={onBack} className="w-full bg-gray-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-700 transition btn-press">
                    Voltar ao Cassino
                </button>
            </div>
        </div>
    );
};