export interface GameEvent {
  id: number;
  category: string;
  teamA: string;
  teamB: string;
  time: string;
  odds: {
    teamA: number;
    draw: number;
    teamB: number;
  };
}

export interface MyBet {
  id: number;
  event: string;
  category: string;
  stake: number; // Valor apostado
  odd: number;
  potentialReturn: number;
  status: 'Aberta' | 'Ganha' | 'Perdida';
  selection: string; // O que foi apostado
}