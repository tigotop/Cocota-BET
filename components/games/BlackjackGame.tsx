import React, { useState, useEffect, useMemo } from 'react';
import { useBalance } from '../../contexts/BalanceContext';

// Card logic
const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
const suits = ['🦜', '🥚', '🌽', '🏆'];
const cardValue: { [key: string]: number } = { '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, 'T': 10, 'J': 10, 'Q': 10, 'K': 10, 'A': 11 };

interface Card {
    rank: string;
    suit: string;
    id: string;
}

const createDeck = (): Card[] => {
    const deck: Card[] = [];
    for (const suit of suits) {
        for (const rank of ranks) {
            deck.push({ rank, suit, id: `${rank}-${suit}` });
        }
    }
    return deck;
};

const shuffleDeck = (deck: Card[]): Card[] => {
    return [...deck].sort(() => Math.random() - 0.5);
}

const calculateHandValue = (hand: Card[]): number => {
    let value = hand.reduce((sum, card) => sum + cardValue[card.rank], 0);
    let aces = hand.filter(card => card.rank === 'A').length;
    while (value > 21 && aces > 0) {
        value -= 10;
        aces--;
    }
    return value;
};


// UI Components
const CardComponent: React.FC<{ card: Card | null; isHidden?: boolean }> = ({ card, isHidden }) => (
    <div className={`w-20 h-28 md:w-24 md:h-36 bg-gray-800 border-2 border-gray-600 rounded-lg flex flex-col justify-between items-center p-1 shadow-lg transition-transform transform ${!isHidden && 'animate-card-flip'}`}>
        {isHidden || !card ? (
            <div className="w-full h-full bg-green-800 rounded-md flex items-center justify-center text-4xl">🦜</div>
        ) : (
            <>
                <span className="text-xl font-bold self-start">{card.rank}{card.suit}</span>
                <span className="text-4xl">{card.suit}</span>
                <span className="text-xl font-bold self-end rotate-180">{card.rank}{card.suit}</span>
            </>
        )}
    </div>
);

const HandComponent: React.FC<{ title: string; hand: Card[]; value: number; isDealer?: boolean; hideFirstCard?: boolean; }> = ({ title, hand, value, isDealer, hideFirstCard }) => (
    <div className="text-center">
        <p className="font-bold mb-2 text-lg">{title} {value > 0 && `(${value})`}</p>
        <div className="flex justify-center items-center space-x-2 min-h-[112px] md:min-h-[144px]">
             {hand.map((card, index) => (
                <CardComponent key={card.id} card={card} isHidden={isDealer && index === 0 && hideFirstCard} />
            ))}
        </div>
    </div>
);


interface BlackjackGameProps {
    onBack: () => void;
}

export const BlackjackGame: React.FC<BlackjackGameProps> = ({ onBack }) => {
    const { balance, updateBalance } = useBalance();
    const [deck, setDeck] = useState<Card[]>([]);
    const [playerHand, setPlayerHand] = useState<Card[]>([]);
    const [dealerHand, setDealerHand] = useState<Card[]>([]);
    const [bet, setBet] = useState(10);
    const [gameState, setGameState] = useState<'betting' | 'player_turn' | 'dealer_turn' | 'finished'>('betting');
    const [message, setMessage] = useState('Faça sua aposta!');

    const playerValue = useMemo(() => calculateHandValue(playerHand), [playerHand]);
    const dealerValue = useMemo(() => calculateHandValue(dealerHand), [dealerHand]);
    const canBet = balance >= bet;

    useEffect(() => {
        setDeck(shuffleDeck(createDeck()));
    }, []);
    
    const deal = () => {
        if (!canBet) {
            setMessage("Saldo insuficiente!");
            return;
        }
        updateBalance(-bet);
        const newDeck = shuffleDeck(createDeck());
        const pHand = [newDeck.pop()!, newDeck.pop()!];
        const dHand = [newDeck.pop()!, newDeck.pop()!];

        setPlayerHand(pHand);
        setDealerHand(dHand);
        setDeck(newDeck);
        setGameState('player_turn');
        setMessage('Sua vez! Hit ou Stand?');
        
        const pValue = calculateHandValue(pHand);
        if (pValue === 21) {
            stand(pHand, dHand, newDeck); // Player has Blackjack
        }
    }

    const hit = () => {
        if (gameState !== 'player_turn' || !deck.length) return;
        const newDeck = [...deck];
        const newCard = newDeck.pop()!;
        const newPlayerHand = [...playerHand, newCard];
        setPlayerHand(newPlayerHand);
        setDeck(newDeck);

        const newValue = calculateHandValue(newPlayerHand);
        if (newValue > 21) {
            setMessage("Bust! Você perdeu.");
            setGameState('finished');
        }
    };
    
    const stand = (currentPHand = playerHand, currentDHand = dealerHand, currentDeck = deck) => {
        setGameState('dealer_turn');
        
        let dHand = [...currentDHand];
        let dValue = calculateHandValue(dHand);
        let tempDeck = [...currentDeck];

        while(dValue < 17 && tempDeck.length > 0) {
            dHand.push(tempDeck.pop()!);
            dValue = calculateHandValue(dHand);
        }

        setDealerHand(dHand);
        setDeck(tempDeck);

        const pValue = calculateHandValue(currentPHand);
        
        if (dValue > 21) {
            setMessage("Dealer Bust! Você ganhou!");
            updateBalance(bet * 2);
        } else if (pValue > dValue) {
             if (pValue === 21 && currentPHand.length === 2) {
                setMessage("Blackjack! Você ganhou!");
                updateBalance(bet + bet * 1.5); // 3:2 payout
             } else {
                setMessage("Você ganhou!");
                updateBalance(bet * 2);
             }
        } else if (dValue > pValue) {
            setMessage("Dealer ganhou.");
        } else {
            setMessage("Push! Aposta devolvida.");
            updateBalance(bet);
        }
        setGameState('finished');
    };
    
    const resetGame = () => {
        setPlayerHand([]);
        setDealerHand([]);
        setGameState('betting');
        setMessage('Faça sua aposta para a próxima rodada!');
        if (bet > balance) {
            setBet(balance);
        }
    };
    
    const isPlayerTurn = gameState === 'player_turn';
    const isBetting = gameState === 'betting';
    const isFinished = gameState === 'finished';

    return (
        <div className="flex flex-col items-center justify-between p-4 h-full text-white space-y-2">
            <div className="text-center w-full">
                <h2 className="text-3xl font-bold">21 (Blackjack)</h2>
                <p className="text-gray-400">Chegue o mais perto de 21!</p>
            </div>

            <HandComponent title="Dealer" hand={dealerHand} value={isPlayerTurn ? cardValue[dealerHand[1]?.rank] || 0 : dealerValue} isDealer hideFirstCard={isPlayerTurn} />
            
            <div className={`p-2 rounded-lg text-lg font-bold text-center h-8 transition-colors ${isFinished ? 'bg-black/30' : ''}`}>
                 <p className={
                     message.includes('ganhou') ? 'text-green-400' : 
                     message.includes('perdeu') || message.includes('Bust') || message.includes('ganho') ? 'text-red-400' :
                     message.includes('Push') ? 'text-yellow-400' : 'text-white'}>{message}
                 </p>
            </div>

            <HandComponent title="Você" hand={playerHand} value={playerValue} />

            <div className="w-full max-w-xs space-y-3">
                {isBetting && (
                    <>
                        <div className="flex items-center justify-center space-x-4 bg-gray-800 p-2 rounded-lg">
                            <button onClick={() => setBet(b => Math.max(5, b - 5))} disabled={bet <= 5} className="bg-gray-600 w-10 h-10 text-2xl rounded-full disabled:opacity-50 btn-press">-</button>
                            <span className="text-xl font-bold w-32 text-center">Aposta: R$ {bet}</span>
                            <button onClick={() => setBet(b => Math.min(balance, b + 5))} disabled={bet >= balance} className="bg-gray-600 w-10 h-10 text-2xl rounded-full disabled:opacity-50 btn-press">+</button>
                        </div>
                        <button onClick={deal} disabled={!canBet || bet <= 0} className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg text-xl hover:bg-green-700 transition disabled:bg-gray-500 disabled:cursor-not-allowed btn-press">
                            Apostar
                        </button>
                    </>
                )}
                {isPlayerTurn && (
                    <div className="flex space-x-2">
                        <button onClick={hit} className="w-1/2 bg-yellow-500 text-black font-bold py-3 px-4 rounded-lg text-xl hover:bg-yellow-600 transition btn-press">Hit</button>
                        <button onClick={() => stand()} className="w-1/2 bg-blue-500 text-white font-bold py-3 px-4 rounded-lg text-xl hover:bg-blue-600 transition btn-press">Stand</button>
                    </div>
                )}
                {isFinished && (
                     <button onClick={resetGame} className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg text-xl hover:bg-green-700 transition btn-press">
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