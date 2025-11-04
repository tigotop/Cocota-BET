import React, { useState, useMemo } from 'react';
import { useBalance } from '../../contexts/BalanceContext';

interface MysteryBackpackGameProps {
    onBack: () => void;
}

type Rarity = 'Comum' | 'Incomum' | 'Raro' | 'Épico' | 'Lendário';
interface BackpackItem {
    name: string;
    icon: string;
    rarity: Rarity;
}

const allItems: BackpackItem[] = [
    { name: 'Apontador', icon: '✏️', rarity: 'Comum' },
    { name: 'Sanduíche', icon: '🥪', rarity: 'Comum' },
    { name: 'Borracha', icon: '🧽', rarity: 'Comum' },
    { name: 'Maçã', icon: '🍎', rarity: 'Comum' },
    { name: 'Caneta 10 cores', icon: '🖊️', rarity: 'Incomum' },
    { name: 'Calculadora', icon: '🧮', rarity: 'Incomum' },
    { name: 'Espada de plástico', icon: '🗡️', rarity: 'Incomum' },
    { name: 'Peteca', icon: '🏸', rarity: 'Incomum' },
    { name: 'Copia da prova', icon: '📝', rarity: 'Raro' },
    { name: 'Figurinha', icon: '✨', rarity: 'Raro' },
    { name: 'Pílula suspeita', icon: '💊', rarity: 'Raro' },
    { name: 'Bomba de fumaça', icon: '💣', rarity: 'Raro' },
    { name: 'Atestado médico', icon: '📜', rarity: 'Épico' },
    { name: 'Raio-X do pé', icon: '🩻', rarity: 'Épico' },
    { name: 'Vaso antigo', icon: '🏺', rarity: 'Épico' },
    { name: 'Sapo dissecado', icon: '🐸', rarity: 'Épico' },
    { name: 'Chave da moto', icon: '🏍️', rarity: 'Lendário' },
    { name: 'Diamante', icon: '💎', rarity: 'Lendário' },
    { name: 'Chave da escola', icon: '🔑', rarity: 'Lendário' },
    { name: 'Fóssil', icon: '🦴', rarity: 'Lendário' },
];

const payoutScale: { [key: number]: number } = {
    6: 2,
    7: 5,
    8: 15,
    9: 50,
    10: 200,
};

const BET_AMOUNT = 10;
const SELECTION_LIMIT = 10;

export const MysteryBackpackGame: React.FC<MysteryBackpackGameProps> = ({ onBack }) => {
    const { balance, updateBalance } = useBalance();
    const [gameState, setGameState] = useState<'selecting' | 'revealing' | 'finished'>('selecting');
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [drawnItems, setDrawnItems] = useState<string[]>([]);
    const [matches, setMatches] = useState(0);

    const canPlay = balance >= BET_AMOUNT && selectedItems.length === SELECTION_LIMIT;
    const winnings = payoutScale[matches] ? BET_AMOUNT * payoutScale[matches] : 0;

    const message = useMemo(() => {
        if (gameState === 'finished') {
            if (winnings > 0) {
                return `Você acertou ${matches} itens e ganhou R$ ${winnings.toFixed(2)}!`;
            }
            return `Você acertou ${matches} itens. Tente de novo!`;
        }
        if (gameState === 'revealing') {
            return 'Abrindo a mochila...';
        }
        return `Selecione ${SELECTION_LIMIT - selectedItems.length} itens.`;
    }, [gameState, selectedItems.length, matches, winnings]);

    const handleItemSelect = (icon: string) => {
        if (gameState !== 'selecting') return;
        
        const newSelection = selectedItems.includes(icon)
            ? selectedItems.filter(i => i !== icon)
            : [...selectedItems, icon];

        if (newSelection.length <= SELECTION_LIMIT) {
            setSelectedItems(newSelection);
        }
    };

    const playGame = () => {
        if (!canPlay) return;

        updateBalance(-BET_AMOUNT);
        setGameState('revealing');

        setTimeout(() => {
            const shuffled = [...allItems].sort(() => 0.5 - Math.random());
            const drawn = shuffled.slice(0, 10).map(item => item.icon);
            setDrawnItems(drawn);

            const userMatches = selectedItems.filter(item => drawn.includes(item));
            const matchCount = userMatches.length;
            setMatches(matchCount);

            const finalWinnings = payoutScale[matchCount] ? BET_AMOUNT * payoutScale[matchCount] : 0;
            if (finalWinnings > 0) {
                updateBalance(finalWinnings);
            }
            setGameState('finished');
        }, 2000);
    };

    const resetGame = () => {
        setGameState('selecting');
        setSelectedItems([]);
        setDrawnItems([]);
        setMatches(0);
    };
    
    const getItemClasses = (itemIcon: string) => {
        const base = "w-16 h-16 rounded-lg flex items-center justify-center text-3xl cursor-pointer transition-all duration-200 transform border-2";
        const isSelected = selectedItems.includes(itemIcon);
        
        if (gameState === 'finished') {
            const isDrawn = drawnItems.includes(itemIcon);
            if (isSelected && isDrawn) {
                return `${base} bg-yellow-500 border-yellow-300 scale-110 animate-pulse-glow`; // Match
            }
            if (isSelected && !isDrawn) {
                return `${base} bg-red-800 border-red-600 opacity-70`; // Selected but not drawn
            }
            if (!isSelected && isDrawn) {
                return `${base} bg-blue-800 border-blue-600`; // Drawn but not selected
            }
            return `${base} bg-gray-900 border-gray-700 opacity-50`; // Not involved
        }
        
        if (isSelected) {
            return `${base} bg-green-700 border-green-500 scale-105`;
        }
        
        return `${base} bg-gray-800 border-gray-700 hover:bg-gray-700 hover:scale-105`;
    };

    return (
        <div className="flex flex-col p-4 h-full text-white">
            <div className="text-center w-full">
                <h2 className="text-3xl font-bold">Mochila Misteriosa</h2>
                <p className="text-gray-400 h-6 mt-1">{message}</p>
            </div>

            <div className="grid grid-cols-5 gap-2 my-4 flex-grow content-start">
                {allItems.map(item => (
                    <button key={item.icon} onClick={() => handleItemSelect(item.icon)} disabled={gameState !== 'selecting'} className={getItemClasses(item.icon)}>
                        {item.icon}
                    </button>
                ))}
            </div>
            
            <div className="flex flex-col w-full max-w-md mx-auto space-y-3">
                {gameState === 'selecting' ? (
                    <button onClick={playGame} disabled={!canPlay} className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg text-xl hover:bg-green-700 transition disabled:bg-gray-500 disabled:cursor-not-allowed btn-press">
                        {selectedItems.length === SELECTION_LIMIT ? `Apostar R$ ${BET_AMOUNT.toFixed(2)}` : 'Selecione 10 itens'}
                    </button>
                ) : gameState === 'revealing' ? (
                     <button disabled className="w-full bg-yellow-500 text-black font-bold py-3 px-4 rounded-lg text-xl transition btn-press animate-pulse">
                        Sorteando...
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
