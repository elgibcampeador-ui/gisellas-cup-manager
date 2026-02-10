
export interface Player {
  id: string;
  name: string;
  icon: string;
  isPastWinner: boolean;
  totalPoints: number;
  mvpPoints: number;
  matchesPlayed: number;
  wins: number;
  losses: number;
  captainWins: number;
}

export interface MatchRegistration {
  playerId: string;
  timestamp: number;
}

export interface Match {
  id: string;
  date: string;
  sessionNumber: number; // 1 to 12
  registrations: MatchRegistration[];
  score?: {
    teamA: number;
    teamB: number;
  };
  teamA?: string[];
  teamB?: string[];
  captains?: string[];
  mvps?: string[]; // Player IDs who got MVP in this match
  isCompleted: boolean;
}

export enum AppTab {
  DASHBOARD = 'DASHBOARD',
  MATCH = 'MATCH',
  STANDINGS = 'STANDINGS',
  HISTORY = 'HISTORY',
  ADMIN = 'ADMIN',
  RULES = 'RULES'
}
