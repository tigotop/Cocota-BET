import React from 'react';

const mockCategories = [
    { name: 'Futebol', icon: '⚽' },
    { name: 'Basquete', icon: '🏀' },
    { name: 'Tênis', icon: '🎾' },
    { name: 'E-Sports', icon: '🎮' },
    { name: 'Corrida de Galinhas', icon: '🦜' },
    { name: 'MMA de Galos', icon: '🥊' },
];

const ComingSoonCard = ({ title }: { title: string }) => (
    <div className="bg-gray-800 rounded-lg p-4 shadow-lg text-center">
        <h4 className="font-bold text-white">{title}</h4>
        <p className="text-sm text-gray-400 mt-2">Em breve, mais eventos galináceos para você!</p>
    </div>
);

export const SportsScreen: React.FC = () => {
    return (
        <main className="flex-1 p-4 space-y-6">
            <div className="text-center">
                <h2 className="text-white text-2xl font-bold">Apostas Esportivas</h2>
                <p className="text-gray-400 text-sm mt-1">As melhores odds do galinheiro.</p>
            </div>
            
            <div>
                <h3 className="text-white text-lg font-semibold mb-3 px-1">Categorias</h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 text-center">
                    {mockCategories.map(cat => (
                        <div key={cat.name} className="bg-gray-800 p-4 rounded-lg flex flex-col items-center justify-center space-y-2 hover:bg-gray-700 cursor-pointer transition-colors">
                            <span className="text-3xl">{cat.icon}</span>
                            <span className="text-xs font-medium text-white">{cat.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-white text-lg font-semibold mb-3 px-1">Destaques</h3>
                <ComingSoonCard title="Final do Campeonato de MilhoBall" />
                <ComingSoonCard title="Clássico: Galos de Briga vs Frangos de Elite" />
            </div>
        </main>
    );
};