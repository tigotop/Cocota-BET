import React, { useState } from 'react';
import type { MyBet } from '../types';
import { useBets } from '../contexts/BetContext';

const BetCard: React.FC<{ bet: MyBet }> = ({ bet }) => {
    const statusColor = {
        'Aberta': 'bg-gray-600',
        'Ganha': 'bg-green-600',
        'Perdida': 'bg-red-600',
    };

    return (
        <div className="bg-gray-800 rounded-lg p-3 shadow-lg flex flex-col space-y-2 border-l-4 border-gray-600">
             <div className="flex justify-between items-center text-xs text-gray-400">
                <span>{bet.category}</span>
                <span className={`px-2 py-0.5 rounded-full text-white text-[10px] font-bold ${statusColor[bet.status]}`}>{bet.status}</span>
            </div>
            <p className="font-semibold text-white">{bet.event}</p>
            <div className="bg-gray-700/50 p-2 rounded-md text-sm">
                <p><span className="font-bold text-green-400">{bet.selection}</span> @ <span className="font-bold text-white">{bet.odd.toFixed(2)}</span></p>
            </div>
            <div className="flex justify-between items-center text-xs text-gray-300 pt-1">
                <span>Aposta: <span className="font-bold">R$ {bet.stake.toFixed(2)}</span></span>
                <span>Retorno Potencial: <span className="font-bold">R$ {bet.potentialReturn.toFixed(2)}</span></span>
            </div>
        </div>
    )
}

export const MyBetsScreen: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'open' | 'settled'>('open');
    const { myBets } = useBets();
    
    const openBets = myBets.filter(b => b.status === 'Aberta');
    const settledBets = myBets.filter(b => b.status !== 'Aberta');

    return (
        <main className="flex-1 p-4 space-y-4">
            <div className="text-center">
                <h2 className="text-white text-2xl font-bold">Minhas Apostas</h2>
                <p className="text-gray-400 text-sm mt-1">Confira seu histórico de penas e glórias.</p>
            </div>

            {/* Tabs */}
            <div className="bg-gray-800 p-1 rounded-lg flex">
                 <button 
                  onClick={() => setActiveTab('open')} 
                  className={`w-1/2 py-2 text-sm font-bold rounded-md transition-colors btn-press ${activeTab === 'open' ? 'bg-green-600 text-white' : 'text-gray-300'}`}
                >
                  Abertas ({openBets.length})
                </button>
                <button 
                  onClick={() => setActiveTab('settled')} 
                  className={`w-1/2 py-2 text-sm font-bold rounded-md transition-colors btn-press ${activeTab === 'settled' ? 'bg-green-600 text-white' : 'text-gray-300'}`}
                >
                  Resolvidas ({settledBets.length})
                </button>
            </div>

            {/* Bet List */}
            <div className="space-y-3">
                {activeTab === 'open' && (
                    openBets.length > 0 
                        ? openBets.map(bet => <BetCard key={bet.id} bet={bet} />)
                        : <p className="text-center text-gray-400 pt-8">Você não tem apostas abertas. Vá catar um milho!</p>
                )}
                 {activeTab === 'settled' && (
                    settledBets.length > 0 
                        ? settledBets.map(bet => <BetCard key={bet.id} bet={bet} />)
                        : <p className="text-center text-gray-400 pt-8">Nenhuma aposta resolvida ainda. A sorte favorece os que cacarejam!</p>
                )}
            </div>
        </main>
    );
};