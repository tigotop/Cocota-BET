import React from 'react';
import { HomeIcon, SportsIcon, CasinoIcon, MyBetsIcon } from '../constants';

const navItems = [
    { name: 'Início', icon: HomeIcon },
    { name: 'Esportes', icon: SportsIcon },
    { name: 'Cassino', icon: CasinoIcon },
    { name: 'Minhas Apostas', icon: MyBetsIcon },
] as const; // Use "as const" for stronger typing of names

type NavItemName = typeof navItems[number]['name'];

interface BottomNavProps {
    activeItem: NavItemName;
    onNavigate: (item: NavItemName) => void;
}


export const BottomNav: React.FC<BottomNavProps> = ({ activeItem, onNavigate }) => {
    return (
        <footer className="bg-gray-800/80 backdrop-blur-sm fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md border-t border-gray-700">
            <div className="flex justify-around items-center h-16">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeItem === item.name;
                    return (
                        <button 
                            key={item.name} 
                            onClick={() => onNavigate(item.name)}
                            className={`flex flex-col items-center justify-center w-full transition-colors duration-200 p-2 ${isActive ? 'text-green-400' : 'text-gray-400 hover:text-white'}`}
                        >
                            <Icon className="h-6 w-6 mb-1" />
                            <span className="text-xs font-medium">{item.name}</span>
                        </button>
                    );
                })}
            </div>
        </footer>
    );
};