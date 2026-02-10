
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Player, Match, AppTab, MatchRegistration } from './types';
import { 
  INITIAL_PLAYERS, 
  MAX_PLAYERS_PER_MATCH, 
  TOTAL_SESSIONS, 
  WIN_POINTS, 
  DRAW_POINTS,
  CLOSE_LOSS_POINTS, 
  CAPTAIN_WIN_BONUS,
  MVP_THRESHOLD,
  MVP_BONUS 
} from './constants';
import Rules from './components/Rules';
import Standings from './components/Standings';
import Admin from './components/Admin';
import Dashboard from './components/Dashboard';
import MatchManager from './components/MatchManager';
import History from './components/History';
import PlayerDetail from './components/PlayerDetail';

const App: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>(() => {
    const saved = localStorage.getItem('gisella_players');
    return saved ? JSON.parse(saved) : INITIAL_PLAYERS;
  });

  const [matches, setMatches] = useState<Match[]>(() => {
    const saved = localStorage.getItem('gisella_matches');
    if (saved) return JSON.parse(saved);
    
    return [{
      id: '1',
      date: new Date().toISOString(),
      sessionNumber: 1,
      registrations: [],
      isCompleted: false
    }];
  });

  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.DASHBOARD);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('gisella_players', JSON.stringify(players));
    localStorage.setItem('gisella_matches', JSON.stringify(matches));
  }, [players, matches]);

  const currentMatch = useMemo(() => {
    return matches.find(m => !m.isCompleted) || matches[matches.length - 1];
  }, [matches]);

  const registerForMatch = useCallback((playerId: string) => {
    setMatches(prevMatches => {
      const matchIndex = prevMatches.findIndex(m => m.id === currentMatch.id);
      if (matchIndex === -1) return prevMatches;
      const match = prevMatches[matchIndex];
      if (match.registrations.some(r => r.playerId === playerId)) return prevMatches;
      const newRegistrations = [...match.registrations, { playerId, timestamp: Date.now() }];
      const updatedMatch = { ...match, registrations: newRegistrations };
      const nextMatches = [...prevMatches];
      nextMatches[matchIndex] = updatedMatch;
      return nextMatches;
    });
  }, [currentMatch.id]);

  const cancelRegistration = useCallback((playerId: string) => {
    setMatches(prevMatches => {
      const matchIndex = prevMatches.findIndex(m => m.id === currentMatch.id);
      if (matchIndex === -1) return prevMatches;
      const match = prevMatches[matchIndex];
      const newRegistrations = match.registrations.filter(r => r.playerId !== playerId);
      const updatedMatch = { ...match, registrations: newRegistrations };
      const nextMatches = [...prevMatches];
      nextMatches[matchIndex] = updatedMatch;
      return nextMatches;
    });
  }, [currentMatch.id]);

  const completeMatch = useCallback((matchId: string, teamAScore: number, teamBScore: number, mvpIds: string[], teamAIds: string[], teamBIds: string[], captains: string[]) => {
    setMatches(prevMatches => {
      return prevMatches.map(m => {
        if (m.id === matchId) {
          return {
            ...m,
            score: { teamA: teamAScore, teamB: teamBScore },
            mvps: mvpIds,
            teamA: teamAIds,
            teamB: teamBIds,
            captains: captains,
            isCompleted: true
          };
        }
        return m;
      });
    });

    setPlayers(prevPlayers => {
      return prevPlayers.map(p => {
        let newP = { ...p };
        const isInTeamA = teamAIds.includes(p.id);
        const isInTeamB = teamBIds.includes(p.id);
        const isCaptain = captains.includes(p.id);
        if (!isInTeamA && !isInTeamB) return p;
        newP.matchesPlayed += 1;
        const myScore = isInTeamA ? teamAScore : teamBScore;
        const opponentScore = isInTeamA ? teamBScore : teamAScore;
        const isDraw = teamAScore === teamBScore;
        const diff = myScore - opponentScore;
        if (isDraw) { newP.totalPoints += DRAW_POINTS; }
        else if (diff > 0) {
          newP.wins += 1;
          newP.totalPoints += WIN_POINTS;
          if (isCaptain) {
            newP.totalPoints += CAPTAIN_WIN_BONUS;
            newP.captainWins += 1;
          }
        } else if (diff >= -4) {
          newP.totalPoints += CLOSE_LOSS_POINTS;
          newP.losses += 1;
        } else { newP.losses += 1; }
        if (mvpIds.includes(p.id)) {
          newP.mvpPoints += 1;
          if (newP.mvpPoints % MVP_THRESHOLD === 0) { newP.totalPoints += MVP_BONUS; }
        }
        return newP;
      });
    });

    if (currentMatch.sessionNumber < TOTAL_SESSIONS) {
      setMatches(prev => [...prev, {
        id: (prev.length + 1).toString(),
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        sessionNumber: currentMatch.sessionNumber + 1,
        registrations: [],
        isCompleted: false
      }]);
    }
    setActiveTab(AppTab.HISTORY);
  }, [currentMatch.sessionNumber]);

  const addPlayer = useCallback((name: string, icon: string, isPastWinner: boolean) => {
    const newPlayer: Player = {
      id: Date.now().toString(),
      name,
      icon: icon || '⚽',
      isPastWinner,
      totalPoints: 0,
      mvpPoints: 0,
      matchesPlayed: 0,
      wins: 0,
      losses: 0,
      captainWins: 0
    };
    setPlayers(prev => [...prev, newPlayer]);
  }, []);

  const updatePlayer = useCallback((updatedPlayer: Player) => {
    setPlayers(prev => prev.map(p => p.id === updatedPlayer.id ? updatedPlayer : p));
  }, []);

  const deletePlayer = useCallback((playerId: string) => {
    setPlayers(prev => prev.filter(p => p.id !== playerId));
  }, []);

  return (
    <div className="min-h-screen flex flex-col max-w-lg mx-auto bg-slate-50 shadow-2xl pb-20">
      <header className="bg-emerald-600 text-white p-5 sticky top-0 z-50 shadow-md">
        <div className="flex justify-center items-center">
          <div className="flex items-center space-x-3" onClick={() => setActiveTab(AppTab.DASHBOARD)}>
            <span className="text-3xl">🏆</span>
            <h1 className="text-2xl font-black uppercase italic tracking-tighter cursor-pointer">Gisella's Cup</h1>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 overflow-y-auto">
        {selectedPlayerId && (
          <PlayerDetail 
            playerId={selectedPlayerId} 
            players={players} 
            matches={matches} 
            onClose={() => setSelectedPlayerId(null)} 
          />
        )}
        {!selectedPlayerId && (
          <>
            {activeTab === AppTab.DASHBOARD && (
              <Dashboard 
                currentMatch={currentMatch} 
                players={players} 
                onRegister={registerForMatch}
                onCancel={cancelRegistration}
              />
            )}
            {activeTab === AppTab.MATCH && (
              <MatchManager 
                currentMatch={currentMatch} 
                players={players} 
                onComplete={completeMatch}
                matches={matches}
              />
            )}
            {activeTab === AppTab.STANDINGS && (
              <Standings players={players} onSelectPlayer={setSelectedPlayerId} />
            )}
            {activeTab === AppTab.HISTORY && (
              <History matches={matches} players={players} />
            )}
            {activeTab === AppTab.ADMIN && (
              <Admin 
                players={players} 
                onAddPlayer={addPlayer}
                onUpdatePlayer={updatePlayer}
                onDeletePlayer={deletePlayer}
              />
            )}
          </>
        )}
      </main>

      <nav className="bg-white border-t border-slate-200 fixed bottom-0 left-0 right-0 max-w-lg mx-auto flex h-16 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] z-50">
        <NavItem active={activeTab === AppTab.DASHBOARD} onClick={() => {setActiveTab(AppTab.DASHBOARD); setSelectedPlayerId(null);}} label="Home" icon="🏠" />
        <NavItem active={activeTab === AppTab.MATCH} onClick={() => {setActiveTab(AppTab.MATCH); setSelectedPlayerId(null);}} label="Partita" icon="⚽" />
        <NavItem active={activeTab === AppTab.STANDINGS} onClick={() => {setActiveTab(AppTab.STANDINGS); setSelectedPlayerId(null);}} label="Rank" icon="📊" />
        <NavItem active={activeTab === AppTab.HISTORY} onClick={() => {setActiveTab(AppTab.HISTORY); setSelectedPlayerId(null);}} label="Storia" icon="📖" />
        <NavItem active={activeTab === AppTab.ADMIN} onClick={() => {setActiveTab(AppTab.ADMIN); setSelectedPlayerId(null);}} label="Admin" icon="⚙️" />
      </nav>
    </div>
  );
};

const NavItem: React.FC<{ active: boolean, onClick: () => void, label: string, icon: string }> = ({ active, onClick, label, icon }) => (
  <button 
    onClick={onClick}
    className={`flex-1 flex flex-col items-center justify-center transition-colors ${active ? 'text-emerald-600' : 'text-slate-400'}`}
  >
    <span className="text-xl mb-0.5">{icon}</span>
    <span className="text-[10px] uppercase font-bold tracking-wider">{label}</span>
  </button>
);

export default App;
