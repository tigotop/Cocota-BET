import React, { useState } from 'react';
import { AuthScreen } from './components/AuthScreen';
import { HomeScreen } from './components/HomeScreen';
import { SportsScreen } from './components/SportsScreen';
import { CasinoScreen } from './components/CasinoScreen';
import { MyBetsScreen } from './components/MyBetsScreen';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { BalanceProvider } from './contexts/BalanceContext';

// Import casino games
import { CornSlotGame } from './components/games/CornSlotGame';
import { FarmRouletteGame } from './components/games/FarmRouletteGame';
import { HighCardPokerGame } from './components/games/HighCardPokerGame';
import { ChickenBingoGame } from './components/games/ChickenBingoGame';
import { BlackjackGame } from './components/games/BlackjackGame';
import { ClassroomScoldingGame } from './components/games/ClassroomScoldingGame';
import { WhereIsCocotaGame } from './components/games/WhereIsCocotaGame';
import { CocotaFlightGame } from './components/games/CocotaFlightGame';
import { MysteryBackpackGame } from './components/games/MysteryBackpackGame';
import { RubberEraserWarGame } from './components/games/RubberEraserWarGame';
import { FinalGradeGame } from './components/games/FinalGradeGame';
import { DueDateGame } from './components/games/DueDateGame';

type ScreenName = 'Início' | 'Esportes' | 'Cassino' | 'Minhas Apostas';
export type CasinoGameName = 'Caça-Níquel do Milho' | 'Roleta da Granja' | 'Pó-Pó-Pôquer' | '21 (Blackjack)' | 'Bingo do Cacarejo' | 'Xingo da Aula' | 'Onde está o Cocota?' | 'Fuga pela Janela' | 'Mochila Misteriosa' | 'Guerra de Borracha' | 'Nota Final' | 'Qual o Mês?' | null;


const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeScreen, setActiveScreen] = useState<ScreenName>('Início');
  const [activeCasinoGame, setActiveCasinoGame] = useState<CasinoGameName>(null);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };
  
  const handleNavigate = (screen: ScreenName) => {
    setActiveCasinoGame(null); // Reset casino game when changing main screens
    setActiveScreen(screen);
  }

  const renderCasinoScreen = () => {
    switch (activeCasinoGame) {
      case 'Caça-Níquel do Milho':
        return <CornSlotGame onBack={() => setActiveCasinoGame(null)} />;
      case 'Roleta da Granja':
        return <FarmRouletteGame onBack={() => setActiveCasinoGame(null)} />;
      case 'Pó-Pó-Pôquer':
          return <HighCardPokerGame onBack={() => setActiveCasinoGame(null)} />;
      case '21 (Blackjack)':
          return <BlackjackGame onBack={() => setActiveCasinoGame(null)} />;
      case 'Bingo do Cacarejo':
          return <ChickenBingoGame onBack={() => setActiveCasinoGame(null)} />;
      case 'Xingo da Aula':
          return <ClassroomScoldingGame onBack={() => setActiveCasinoGame(null)} />;
      case 'Onde está o Cocota?':
          return <WhereIsCocotaGame onBack={() => setActiveCasinoGame(null)} />;
      case 'Fuga pela Janela':
          return <CocotaFlightGame onBack={() => setActiveCasinoGame(null)} />;
      case 'Mochila Misteriosa':
          return <MysteryBackpackGame onBack={() => setActiveCasinoGame(null)} />;
      case 'Guerra de Borracha':
          return <RubberEraserWarGame onBack={() => setActiveCasinoGame(null)} />;
      case 'Nota Final':
          return <FinalGradeGame onBack={() => setActiveCasinoGame(null)} />;
      case 'Qual o Mês?':
          return <DueDateGame onBack={() => setActiveCasinoGame(null)} />;
      default:
        return <CasinoScreen onPlayGame={setActiveCasinoGame} />;
    }
  }

  const renderScreen = () => {
    switch (activeScreen) {
      case 'Início':
        return <HomeScreen />;
      case 'Esportes':
        return <SportsScreen />;
      case 'Cassino':
        return renderCasinoScreen();
      case 'Minhas Apostas':
        return <MyBetsScreen />;
      default:
        return <HomeScreen />;
    }
  };

  if (!isLoggedIn) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  return (
    <BalanceProvider>
      <div className="bg-gray-900 text-white min-h-screen font-sans">
        <div className="relative max-w-md mx-auto h-screen flex flex-col bg-gray-900 shadow-2xl shadow-black">
          <Header />
          <div key={activeScreen + (activeCasinoGame || '')} className="flex-1 overflow-y-auto pb-20 animate-fade-in">
            {renderScreen()}
          </div>
          <BottomNav activeItem={activeScreen} onNavigate={handleNavigate} />
        </div>
      </div>
    </BalanceProvider>
  );
};

export default App;