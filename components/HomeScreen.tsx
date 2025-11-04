import React from 'react';
import type { GameEvent } from '../types';

const mockGames: GameEvent[] = [
    { id: 7, category: 'UFC - Evento Principal', teamA: 'Caio', teamB: 'DK', time: 'A seguir', odds: { teamA: 1.5, draw: 0, teamB: 5.0 } },
    { id: 8, category: 'Apostas Especiais', eventName: 'A bancada vai cair?', teamA: 'Sim', teamB: 'Não', time: 'Hoje', odds: { teamA: 1.7, draw: 0, teamB: 5.0 } },
    { id: 9, category: 'Apostas Especiais', eventName: 'Vai ser menino ou menina?', teamA: 'Menino', teamB: 'Menina', time: 'Em breve', odds: { teamA: 1.85, draw: 0, teamB: 1.95 } },
    { id: 1, category: 'Futebol - Brasileirão', teamA: 'Galináceos FC', teamB: 'Pintinhos United', time: 'Ao Vivo', odds: { teamA: 1.85, draw: 3.5, teamB: 4.2 } },
    { id: 2, category: 'Futebol - Premier League', teamA: 'Liverpool', teamB: 'Man City', time: '20:00', odds: { teamA: 2.5, draw: 3.2, teamB: 2.8 } },
    { id: 3, category: 'Basquete - NBA', teamA: 'LA Lakers', teamB: 'Boston Celtics', time: '22:30', odds: { teamA: 1.9, draw: 0, teamB: 2.1 } },
    { id: 4, category: 'Corrida de Galinhas', teamA: 'Garnizé Veloz', teamB: 'Cocota PÉS', time: 'A seguir', odds: { teamA: 1.5, draw: 0, teamB: 5.0 } },
    { id: 5, category: 'Futebol - La Liga', teamA: 'Real Madrid', teamB: 'Barcelona', time: 'Amanhã', odds: { teamA: 2.1, draw: 3.4, teamB: 3.0 } },
    { id: 6, category: 'E-Sports - CS:GO', teamA: 'Fallen Angels', teamB: 'Chicken Rush', time: 'Amanhã', odds: { teamA: 1.4, draw: 0, teamB: 6.2 } },
];

const GameCard: React.FC<{ game: GameEvent; onPlaceBet: (game: GameEvent, selection: string, odd: number) => void; }> = ({ game, onPlaceBet }) => {
    const isUfcEvent = game.category === 'UFC - Evento Principal';

    return (
        <div className="bg-gray-800 rounded-lg p-4 shadow-lg flex flex-col space-y-3 hover:bg-gray-700/50 transition-colors">
            <div className="flex justify-between items-center text-xs text-gray-400">
                <span>{game.category}</span>
                <span className={`font-bold ${game.time === 'Ao Vivo' ? 'text-red-500 animate-pulse' : ''}`}>{game.time}</span>
            </div>
            
            {isUfcEvent ? (
                <div className="flex justify-around items-center text-white font-bold text-lg py-2">
                    <div className="flex flex-col items-center space-y-2 text-center">
                        <img src="https://i.ibb.co/WWDkPkwx/IMG-20251104-WA0026.jpg" alt="Caio" className="w-16 h-16 rounded-full object-cover border-2 border-gray-600"/>
                        <span>{game.teamA}</span>
                    </div>
                    <span className="mx-2 text-gray-500 text-2xl">vs</span>
                     <div className="flex flex-col items-center space-y-2 text-center">
                        <img src="https://i.ibb.co/Q7hrv3kT/IMG-20251104-WA0022.jpg" alt="DK" className="w-16 h-16 rounded-full object-cover border-2 border-gray-600"/>
                        <span>{game.teamB}</span>
                    </div>
                </div>
            ) : (
                <div className="text-center text-white font-bold text-lg min-h-[28px] flex items-center justify-center">
                    {game.eventName ? (
                        <span>{game.eventName}</span>
                    ) : (
                        <>
                            <span>{game.teamA}</span>
                            <span className="mx-2 text-gray-500">vs</span>
                            <span>{game.teamB}</span>
                        </>
                    )}
                </div>
            )}

            <div className="grid grid-cols-3 gap-2 text-center text-sm">
                <button onClick={() => onPlaceBet(game, game.teamA, game.odds.teamA)} className="bg-gray-700 p-2 rounded hover:bg-green-600 transition btn-press">
                    <span className="text-white truncate">{game.teamA.split(' ')[0]}</span>
                    <span className="block font-bold text-green-400">{game.odds.teamA.toFixed(2)}</span>
                </button>
                 <button onClick={() => onPlaceBet(game, 'Empate', game.odds.draw)} className="bg-gray-700 p-2 rounded hover:bg-green-600 transition disabled:opacity-50 btn-press" disabled={game.odds.draw === 0}>
                    <span className="text-white">Empate</span>
                    <span className="block font-bold text-green-400">{game.odds.draw > 0 ? game.odds.draw.toFixed(2) : '-'}</span>
                </button>
                <button onClick={() => onPlaceBet(game, game.teamB, game.odds.teamB)} className="bg-gray-700 p-2 rounded hover:bg-green-600 transition btn-press">
                    <span className="text-white truncate">{game.teamB.split(' ')[0]}</span>
                    <span className="block font-bold text-green-400">{game.odds.teamB.toFixed(2)}</span>
                </button>
            </div>
        </div>
    )
}

export const HomeScreen: React.FC<{ onPlaceBet: (game: GameEvent, selection: string, odd: number) => void; }> = ({ onPlaceBet }) => {
    return (
        <main className="flex-1 p-4 space-y-6">
            <div className="bg-gradient-to-r from-green-500 to-green-700 rounded-lg p-4 text-center shadow-lg">
                 <h2 className="text-white text-xl font-bold">Bem-vindo à Cocota BET!</h2>
                 <p className="text-green-100 text-sm mt-1">Sua sorte está a um pio de distância. Lembre-se de jogar com responsabilidade (e com milho).</p>
            </div>
            
            <div>
                <h3 className="text-white text-lg font-semibold mb-3 px-1">Ao Vivo & A Seguir</h3>
                <div className="space-y-4">
                    {mockGames.filter(g => g.time === 'Ao Vivo' || g.time === 'A seguir' || g.time === 'Hoje' || g.time === 'Em breve').map(game => <GameCard key={game.id} game={game} onPlaceBet={onPlaceBet} />)}
                </div>
            </div>
            
            <div>
                <h3 className="text-white text-lg font-semibold mb-3 mt-6 px-1">Próximos Eventos</h3>
                <div className="space-y-4">
                    {mockGames.filter(g => g.time !== 'Ao Vivo' && g.time !== 'A seguir' && g.time !== 'Hoje' && g.time !== 'Em breve').map(game => <GameCard key={game.id} game={game} onPlaceBet={onPlaceBet} />)}
                </div>
            </div>
        </main>
    );
};