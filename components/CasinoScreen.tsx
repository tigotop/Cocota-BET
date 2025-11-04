import React from 'react';
import type { CasinoGameName } from '../App';

const mockCasinoGames = [
    {
        name: 'Fuga pela Janela' as const,
        description: 'Defina a altura e torça para o Cocota alcançá-la antes de fugir!',
        icon: '🪟',
        bgColor: 'from-sky-500 to-blue-600'
    },
     {
        name: 'Mochila Misteriosa' as const,
        description: 'O que o Cocota carrega hoje? Abra e descubra tesouros (ou lixo)!',
        icon: '🎒',
        bgColor: 'from-orange-500 to-amber-600'
    },
    {
        name: 'Nota Final' as const,
        description: 'A próxima nota será maior ou menor? Acerte a sequência e ganhe!',
        icon: '📉',
        bgColor: 'from-pink-500 to-rose-600'
    },
    {
        name: 'Qual o Mês?' as const,
        description: 'Adivinhe quando o cocotinha vai nascer e ganhe 10x a aposta!',
        icon: '🐣',
        bgColor: 'from-pink-400 to-rose-500'
    },
    {
        name: 'Guerra de Borracha' as const,
        description: 'A batalha do recreio vale dinheiro! Cocota vai ganhar?',
        icon: '💥',
        bgColor: 'from-slate-500 to-slate-700'
    },
    {
        name: 'Caça-Níquel do Milho' as const,
        description: 'Alinhe os milhos e ganhe o grande prêmio da colheita!',
        icon: '🌽',
        bgColor: 'from-yellow-500 to-yellow-700'
    },
    {
        name: 'Roleta da Granja' as const,
        description: 'Aposte onde a sorte vai parar. Vermelho ou preto?',
        icon: '🥚',
        bgColor: 'from-red-500 to-red-700'
    },
    {
        name: 'Pó-Pó-Pôquer' as const,
        description: 'Você tem a melhor mão de penas? Blefe até a vitória!',
        icon: '🃏',
        bgColor: 'from-blue-500 to-blue-700'
    },
     {
        name: '21 (Blackjack)' as const,
        description: 'Chegue o mais perto de 21 sem estourar. Desafie a banca!',
        icon: '♠️',
        bgColor: 'from-gray-600 to-gray-800'
    },
    {
        name: 'Bingo do Cacarejo' as const,
        description: 'Marque sua cartela ao som dos papagaios. Cuidado para não dormir!',
        icon: '📢',
        bgColor: 'from-purple-500 to-purple-700'
    },
    {
        name: 'Xingo da Aula' as const,
        description: 'De quem o Cocota vai levar bronca hoje? Acerte e ganhe!',
        icon: '🗣️',
        bgColor: 'from-teal-500 to-cyan-600'
    },
    {
        name: 'Onde está o Cocota?' as const,
        description: 'Adivinhe onde o danado se escondeu e ganhe 3x a aposta!',
        icon: '🔍',
        bgColor: 'from-indigo-500 to-purple-600'
    }
];

interface CasinoGameCardProps {
  game: typeof mockCasinoGames[0];
  onPlay: (gameName: CasinoGameName) => void;
}

const CasinoGameCard: React.FC<CasinoGameCardProps> = ({ game, onPlay }) => {
    return (
        <div className={`bg-gradient-to-br ${game.bgColor} rounded-lg p-4 shadow-lg flex flex-col justify-between min-h-[160px] hover:scale-105 transition-transform cursor-pointer btn-press`} onClick={() => onPlay(game.name)}>
            <div>
                <span className="text-4xl">{game.icon}</span>
                <h3 className="text-white text-lg font-bold mt-2">{game.name}</h3>
                <p className="text-white/80 text-xs mt-1">{game.description}</p>
            </div>
            <div 
                className="bg-white/30 text-white font-bold py-1 px-3 rounded-full hover:bg-white/50 transition duration-300 text-xs self-start mt-2 backdrop-blur-sm"
            >
                Jogar Agora
            </div>
        </div>
    );
};


interface CasinoScreenProps {
    onPlayGame: (gameName: CasinoGameName) => void;
}

export const CasinoScreen: React.FC<CasinoScreenProps> = ({ onPlayGame }) => {
    return (
        <main className="flex-1 p-4 space-y-6">
            <div className="text-center">
                <h2 className="text-white text-2xl font-bold">Cassino da Cocota</h2>
                <p className="text-gray-400 text-sm mt-1">Aqui a sorte não é cega, ela é galinácea.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {mockCasinoGames.map(game => (
                    <CasinoGameCard key={game.name} game={game} onPlay={onPlayGame} />
                ))}
            </div>
        </main>
    );
};