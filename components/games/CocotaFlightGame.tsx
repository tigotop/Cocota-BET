import React, { useState, useEffect, useRef } from 'react';
import { useBalance } from '../../contexts/BalanceContext';

interface CocotaFlightGameProps {
    onBack: () => void;
}

// Generate a crash point with a higher chance of lower numbers
const generateCrashPoint = () => {
    const r = Math.random();
    // This formula creates a distribution where lower multipliers are more common
    return Math.max(1.01, 1 / (1 - r));
};

// Function to calculate visual position from multiplier (logarithmic scale feels better)
const getPositionFromMultiplier = (multiplier: number) => {
    // Clamp between 0 and 100
    return Math.min(100, Math.log(multiplier) / Math.log(25) * 100);
};

export const CocotaFlightGame: React.FC<CocotaFlightGameProps> = ({ onBack }) => {
    const { balance, updateBalance } = useBalance();
    const [gameState, setGameState] = useState<'setting_bet' | 'playing' | 'finished'>('setting_bet');
    
    const [betAmount, setBetAmount] = useState(10);
    const [targetMultiplier, setTargetMultiplier] = useState(2.0);
    
    const [currentMultiplier, setCurrentMultiplier] = useState(1.00);
    const [resultMessage, setResultMessage] = useState('');
    
    const crashPoint = useRef(1.0);
    const animationFrameId = useRef<number>();

    const canPlay = balance >= betAmount;

    useEffect(() => {
        // Cleanup on unmount
        return () => {
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        };
    }, []);

    const resetGame = () => {
        setGameState('setting_bet');
        setCurrentMultiplier(1.00);
        setResultMessage('');
        if (animationFrameId.current) {
            cancelAnimationFrame(animationFrameId.current);
        }
    };

    const startGame = () => {
        if (!canPlay) {
            setResultMessage('Saldo insuficiente!');
            return;
        }

        updateBalance(-betAmount);
        crashPoint.current = generateCrashPoint();
        setGameState('playing');
        setResultMessage('');
        
        const startTime = performance.now();
        
        const update = (currentTime: number) => {
            const elapsedTime = (currentTime - startTime) / 1000; // in seconds
            const newMultiplier = 1 + elapsedTime * 0.5 + Math.pow(elapsedTime, 2) * 0.1;

            // Check win condition first
            if (newMultiplier >= targetMultiplier) {
                setCurrentMultiplier(targetMultiplier);
                setGameState('finished');
                const winnings = betAmount * targetMultiplier;
                updateBalance(winnings);
                setResultMessage(`Meta alcançada! Ganhou R$ ${winnings.toFixed(2)}!`);
                return; // Stop animation
            }

            // Check loss condition
            if (newMultiplier >= crashPoint.current) {
                setCurrentMultiplier(crashPoint.current);
                setGameState('finished');
                setResultMessage(`Fugiu em ${crashPoint.current.toFixed(2)}x! Tente de novo.`);
                return; // Stop animation
            }

            // Continue animation
            setCurrentMultiplier(newMultiplier);
            animationFrameId.current = requestAnimationFrame(update);
        };
        
        animationFrameId.current = requestAnimationFrame(update);
    };
    
    const isBetting = gameState === 'setting_bet';

    const multiplierColor = gameState === 'playing' 
        ? 'text-white' 
        : resultMessage.includes('Ganhou') 
        ? 'text-green-400' 
        : 'text-red-400';

    const cocotaPosition = getPositionFromMultiplier(currentMultiplier);
    const targetPosition = getPositionFromMultiplier(targetMultiplier);

    return (
        <div className="flex flex-col items-center justify-between p-4 h-full text-white">
            <div className="text-center w-full">
                <h2 className="text-3xl font-bold">Fuga pela Janela</h2>
                <p className="text-gray-400">Defina sua meta e torça!</p>
            </div>
            
            <div className="relative w-full h-64 bg-gray-800 rounded-lg overflow-hidden border-4 border-yellow-800" style={{ backgroundImage: 'linear-gradient(to top, #4a3a2a, #6b5a4a)' }}>
                {/* Visual elements for classroom/window */}
                <div className="absolute inset-0 bg-sky-400"></div>
                 <div className="absolute top-1/2 left-0 w-full h-1 bg-yellow-800"></div>
                 <div className="absolute left-1/2 top-0 w-1 h-full bg-yellow-800"></div>
                
                {(isBetting || gameState === 'playing') && (
                    <div 
                        className="absolute w-full h-1 bg-green-400 z-10 border-t-2 border-dashed border-white/50"
                        style={{ bottom: `${targetPosition}%`}}
                    >
                         <span className="absolute right-1 -top-3 text-xs bg-green-500 px-1 rounded">Sua Meta: {targetMultiplier.toFixed(2)}x</span>
                    </div>
                )}
                
                {gameState !== 'setting_bet' && (
                    <div 
                        className="absolute left-1/2 -translate-x-1/2 text-5xl transition-all duration-100 ease-linear"
                        style={{ bottom: `${cocotaPosition}%` }}
                    >
                        {gameState === 'finished' && resultMessage.includes('Fugiu') ? '💨' : '🦜'}
                    </div>
                )}

                 <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center bg-black/30 p-4 rounded-lg">
                        <p className={`text-5xl font-bold transition-colors ${multiplierColor}`}>
                            {currentMultiplier.toFixed(2)}x
                        </p>
                        {resultMessage && <p className={`mt-2 font-semibold ${multiplierColor}`}>{resultMessage}</p>}
                    </div>
                </div>
            </div>
            
            {isBetting && (
                <div className="w-full max-w-sm flex flex-col space-y-2 py-1">
                     <div className="flex justify-between items-center bg-gray-700/50 p-2 rounded-lg">
                         <span className="font-bold">Aposta</span>
                         <div className="flex items-center space-x-2">
                             <button onClick={() => setBetAmount(b => Math.max(1, b - 5))} className="bg-gray-600 w-10 h-8 text-xl rounded-md btn-press">-</button>
                            <span className="text-lg font-bold w-20 text-center">R$ {betAmount}</span>
                            <button onClick={() => setBetAmount(b => Math.min(balance, b + 5))} className="bg-gray-600 w-10 h-8 text-xl rounded-md btn-press">+</button>
                         </div>
                     </div>
                      <div className="flex justify-between items-center bg-gray-700/50 p-2 rounded-lg">
                         <span className="font-bold">Meta</span>
                         <div className="flex items-center space-x-2">
                             <button onClick={() => setTargetMultiplier(m => parseFloat(Math.max(1.01, m - 0.1).toFixed(2)))} className="bg-gray-600 w-10 h-8 text-xl rounded-md btn-press">-</button>
                            <span className="text-lg font-bold w-20 text-center">{targetMultiplier.toFixed(2)}x</span>
                            <button onClick={() => setTargetMultiplier(m => parseFloat((m + 0.1).toFixed(2)))} className="bg-gray-600 w-10 h-8 text-xl rounded-md btn-press">+</button>
                         </div>
                     </div>
                </div>
            )}

            <div className="flex flex-col w-full max-w-xs space-y-3">
                {gameState === 'setting_bet' ? (
                     <button onClick={startGame} disabled={!canPlay} className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg text-xl hover:bg-green-700 transition disabled:bg-gray-500 disabled:cursor-not-allowed btn-press">
                        {canPlay ? `Iniciar Fuga (R$ ${betAmount.toFixed(2)})` : 'Saldo Insuficiente'}
                    </button>
                ) : gameState === 'playing' ? (
                     <button disabled className="w-full bg-yellow-500 text-black font-bold py-3 px-4 rounded-lg text-xl transition animate-pulse">
                        Voando...
                    </button>
                ) : (
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