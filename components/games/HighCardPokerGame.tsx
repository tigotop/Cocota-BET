import React, { useState } from 'react';

interface HighCardPokerGameProps {
    onBack: () => void;
}

const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
const suits = ['🐔', '🥚', '🌽', '🏆'];
const rankValue: { [key: string]: number } = { '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, 'T': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14 };

interface Card {
    rank: string;
    suit: string;
}

const createDeck = () => {
    const deck: Card[] = [];
    for (const suit of suits) {
        for (const rank of ranks) {
            deck.push({ rank, suit });
        }
    }
    return deck;
};

const getRandomCard = (deck: Card[]): Card => {
    return deck[Math.floor(Math.random() * deck.length)];
}

const CardComponent: React.FC<{ card: Card | null; isHidden?: boolean }> = ({ card, isHidden }) => (
    <div className="w-28 h-40 bg-gray-800 border-2 border-gray-600 rounded-lg flex flex-col justify-between items-center p-2 shadow-lg">
        {isHidden || !card ? (
            <div className="w-full h-full bg-green-800 rounded-md flex items-center justify-center text-5xl">🐔</div>
        ) : (
            <>
                <span className="text-2xl font-bold self-start">{card.rank}{card.suit}</span>
                <span className="text-6xl">{card.suit}</span>
                <span className="text-2xl font-bold self-end rotate-180">{card.rank}{card.suit}</span>
            </>
        )}
    </div>
);

export const HighCardPokerGame: React.FC<HighCardPokerGameProps> = ({ onBack }) => {
    const [deck] = useState(createDeck());
    const [playerCard, setPlayerCard] = useState<Card | null>(null);
    const [houseCard, setHouseCard] = useState<Card | null>(null);
    const [gameState, setGameState] = useState<'start' | 'played' | 'won' | 'lost' | 'tie'>('start');

    const deal = () => {
        const pCard = getRandomCard(deck);
        let hCard = getRandomCard(deck);
        // Ensure cards are different
        while (hCard.rank === pCard.rank && hCard.suit === pCard.suit) {
             hCard = getRandomCard(deck);
        }
        
        setPlayerCard(pCard);
        setHouseCard(hCard);
        setGameState('played');

        if (rankValue[pCard.rank] > rankValue[hCard.rank]) {
            setGameState('won');
        } else if (rankValue[pCard.rank] < rankValue[hCard.rank]) {
            setGameState('lost');
        } else {
            setGameState('tie');
        }
    };
    
    const reset = () => {
        setPlayerCard(null);
        setHouseCard(null);
        setGameState('start');
    }

    const message = {
        start: 'Faça sua aposta para começar!',
        played: '...',
        won: 'Você ganhou! Parabéns!',
        lost: 'O Galinheiro venceu. Mais sorte na próxima!',
        tie: 'Empate! A aposta é devolvida.',
    }[gameState];

    const messageColor = {
        start: 'text-gray-400',
        played: 'text-white',
        won: 'text-green-400',
        lost: 'text-red-400',
        tie: 'text-yellow-400',
    }[gameState];

    return (
        <div className="flex flex-col items-center p-4 h-full text-white space-y-4">
            <div className="text-center">
                <h2 className="text-3xl font-bold">Pó-Pó-Pôquer</h2>
                <p className="text-gray-400">A carta mais alta ganha!</p>
            </div>

            {/* House Hand */}
            <div className="text-center">
                <p className="font-bold mb-2">Galinheiro</p>
                <CardComponent card={houseCard} isHidden={gameState === 'start'} />
            </div>

            {/* Player Hand */}
            <div className="text-center">
                 <CardComponent card={playerCard} isHidden={gameState === 'start'} />
                <p className="font-bold mt-2">Sua Mão</p>
            </div>

             <p className={`font-bold text-lg h-6 ${messageColor}`}>{message}</p>

            {/* Actions */}
            <div className="flex flex-col w-full max-w-xs space-y-3 pt-4">
                 {gameState === 'start' ? (
                     <button onClick={deal} className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg text-xl hover:bg-green-700 transition">
                        Apostar R$ 10
                    </button>
                 ) : (
                     <button onClick={reset} className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg text-xl hover:bg-blue-700 transition">
                        Jogar Novamente
                    </button>
                 )}
                <button onClick={onBack} className="w-full bg-gray-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-700 transition">
                    Voltar ao Cassino
                </button>
            </div>
        </div>
    );
};
