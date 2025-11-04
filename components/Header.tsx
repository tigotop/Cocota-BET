
import React from 'react';

export const Header: React.FC = () => {
    const showDepositAlert = () => {
        alert("Isso é apenas uma demonstração! Nenhum depósito é necessário ou possível. Divirta-se!");
    };
    
    return (
        <header className="bg-gray-800/80 backdrop-blur-sm shadow-md sticky top-0 z-10">
            <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex-shrink-0">
                         <h1 className="text-2xl font-extrabold text-white">
                            COCOTA <span className="text-green-400">BET</span>
                        </h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="text-right">
                            <p className="text-sm text-gray-400">Saldo</p>
                            <p className="text-white font-bold">R$ 100,00</p>
                        </div>
                        <button 
                            onClick={showDepositAlert}
                            className="bg-green-500 text-white font-bold py-2 px-4 rounded-md hover:bg-green-600 transition duration-300 text-sm"
                        >
                            Depositar
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};
