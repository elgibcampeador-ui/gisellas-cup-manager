
import React, { useState, useMemo, useEffect } from 'react';
import { Match, Player } from '../types';
import { MAX_PLAYERS_PER_MATCH, TOTAL_SESSIONS } from '../constants';

interface MatchManagerProps {
  currentMatch: Match;
  players: Player[];
  onComplete: (matchId: string, teamAScore: number, teamBScore: number, mvpIds: string[], teamAIds: string[], teamBIds: string[], captains: string[]) => void;
  matches: Match[];
}

const MatchManager: React.FC<MatchManagerProps> = ({ 
  currentMatch, 
  players, 
  onComplete, 
  matches
}) => {
  // Match Management State
  const [teamAScore, setTeamAScore] = useState(0);
  const [teamBScore, setTeamBScore] = useState(0);
  const [mvpIds, setMvpIds] = useState<string[]>([]);
  const [teamAIds, setTeamAIds] = useState<string[]>([]);
  const [teamBIds, setTeamBIds] = useState<string[]>([]);

  const confirmedPlayers = useMemo(() => {
    return currentMatch.registrations
      .slice(0, MAX_PLAYERS_PER_MATCH)
      .map(r => players.find(p => p.id === r.playerId))
      .filter(Boolean) as Player[];
  }, [currentMatch.registrations, players]);

  const captains = useMemo(() => {
    const session = currentMatch.sessionNumber;
    if (session === TOTAL_SESSIONS) {
      const sorted = [...players].sort((a, b) => b.totalPoints - a.totalPoints);
      return [sorted[0]?.id, sorted[1]?.id].filter(Boolean);
    }
    if (session > TOTAL_SESSIONS - 3) {
      const sortedByPoints = [...confirmedPlayers].sort((a, b) => a.totalPoints - b.totalPoints);
      return [sortedByPoints[0]?.id, sortedByPoints[1]?.id].filter(Boolean);
    }
    const pastCaptains = matches.flatMap(m => m.captains || []);
    const availableCaptains = confirmedPlayers.filter(p => !pastCaptains.includes(p.id));
    if (availableCaptains.length >= 2) {
      return [availableCaptains[0].id, availableCaptains[1].id];
    }
    return confirmedPlayers.slice(0, 2).map(p => p.id);
  }, [currentMatch.sessionNumber, confirmedPlayers, players, matches]);

  useEffect(() => {
    if (teamAIds.length === 0 && teamBIds.length === 0 && captains.length >= 2 && confirmedPlayers.length > 0) {
      setTeamAIds([captains[0]]);
      setTeamBIds([captains[1]]);
    }
  }, [captains, confirmedPlayers.length]);

  const unassignedPlayers = confirmedPlayers.filter(
    p => !teamAIds.includes(p.id) && !teamBIds.includes(p.id)
  );

  const moveToTeam = (playerId: string, target: 'A' | 'B' | 'U') => {
    setTeamAIds(prev => prev.filter(id => id !== playerId));
    setTeamBIds(prev => prev.filter(id => id !== playerId));
    if (target === 'A') setTeamAIds(prev => [...prev, playerId]);
    if (target === 'B') setTeamBIds(prev => [...prev, playerId]);
  };

  const toggleMvp = (playerId: string) => {
    setMvpIds(prev => prev.includes(playerId) ? prev.filter(id => id !== playerId) : [...prev, playerId]);
  };

  const isFormValid = teamAIds.length > 0 && teamBIds.length > 0 && (teamAIds.length + teamBIds.length === confirmedPlayers.length);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="text-center">
        <h2 className="text-2xl font-black text-slate-800 uppercase italic tracking-tight">Centro Partita</h2>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Gestione Campo - Sessione #{currentMatch.sessionNumber}</p>
      </div>
      
      {/* Teams Division */}
      <section className="space-y-4">
        <h3 className="font-black text-slate-400 text-[10px] uppercase tracking-[0.2em] px-2 text-center">Divisione Squadre</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className={`bg-white rounded-3xl border-2 p-3 min-h-[220px] transition-all ${teamAIds.length > 0 ? 'border-emerald-500 shadow-lg' : 'border-slate-100'}`}>
            <div className="text-center mb-3">
              <span className="bg-emerald-600 text-white text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-tighter">BIANCHI ({teamAIds.length})</span>
            </div>
            <div className="space-y-2">
              {teamAIds.map(id => {
                const p = players.find(x => x.id === id);
                return (
                  <button key={id} onClick={() => moveToTeam(id, 'U')} className="w-full text-left p-2.5 bg-white rounded-2xl text-[11px] font-black border-2 border-slate-100 flex justify-between items-center shadow-sm">
                    <div className="flex items-center space-x-2 truncate text-slate-950">
                      <span>{p?.icon}</span>
                      <span className="truncate uppercase">{p?.name}</span>
                    </div>
                    {captains.includes(id) && <span>🎖️</span>}
                  </button>
                );
              })}
            </div>
          </div>
          <div className={`bg-white rounded-3xl border-2 p-3 min-h-[220px] transition-all ${teamBIds.length > 0 ? 'border-slate-800 shadow-lg' : 'border-slate-100'}`}>
            <div className="text-center mb-3">
              <span className="bg-slate-800 text-white text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-tighter">NERI ({teamBIds.length})</span>
            </div>
            <div className="space-y-2">
              {teamBIds.map(id => {
                const p = players.find(x => x.id === id);
                return (
                  <button key={id} onClick={() => moveToTeam(id, 'U')} className="w-full text-left p-2.5 bg-white rounded-2xl text-[11px] font-black border-2 border-slate-100 flex justify-between items-center shadow-sm">
                    <div className="flex items-center space-x-2 truncate text-slate-950">
                      <span>{p?.icon}</span>
                      <span className="truncate uppercase">{p?.name}</span>
                    </div>
                    {captains.includes(id) && <span>🎖️</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {unassignedPlayers.length > 0 && (
          <div className="bg-slate-50 p-6 rounded-[2rem] border-2 border-dashed border-slate-200">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center mb-4">Seleziona Squadra</p>
            <div className="flex flex-wrap gap-2.5 justify-center">
              {unassignedPlayers.map(p => (
                <div key={p.id} className="flex flex-col items-center bg-white p-3 rounded-2xl border border-slate-100 shadow-sm min-w-[95px]">
                  <div className="text-2xl mb-1">{p.icon}</div>
                  <span className="text-[11px] font-black text-slate-900 mb-2 text-center truncate w-full uppercase">{p.name}</span>
                  <div className="flex space-x-2 w-full">
                    <button onClick={() => moveToTeam(p.id, 'A')} className="flex-1 bg-emerald-600 text-white py-2 rounded-lg text-[10px] font-black shadow-sm">B</button>
                    <button onClick={() => moveToTeam(p.id, 'B')} className="flex-1 bg-slate-800 text-white py-2 rounded-lg text-[10px] font-black shadow-sm">N</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Scoreboard */}
      <section className="space-y-4">
        <h3 className="font-black text-slate-400 text-[10px] uppercase tracking-[0.2em] px-2 text-center">Scoreboard Live</h3>
        <div className="bg-white rounded-[2rem] border border-slate-100 p-8 flex justify-between items-center shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500 opacity-20" />
          <div className="flex flex-col items-center space-y-3">
            <p className="text-[10px] font-black text-emerald-600 tracking-widest uppercase">BIANCHI</p>
            <button onClick={() => setTeamAScore(s => s + 1)} className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full font-black text-2xl shadow-sm hover:bg-emerald-100 active:scale-90">+</button>
            <span className="text-7xl font-black italic text-black leading-none">{teamAScore}</span>
            <button onClick={() => setTeamAScore(s => Math.max(0, s - 1))} className="w-12 h-12 bg-slate-50 text-slate-300 rounded-full font-black text-2xl shadow-sm hover:bg-slate-100 active:scale-90">-</button>
          </div>
          <div className="text-3xl font-black text-slate-100 italic">VS</div>
          <div className="flex flex-col items-center space-y-3">
            <p className="text-[10px] font-black text-slate-800 tracking-widest uppercase">NERI</p>
            <button onClick={() => setTeamBScore(s => s + 1)} className="w-12 h-12 bg-slate-800 text-white rounded-full font-black text-2xl shadow-sm hover:bg-black active:scale-90">+</button>
            <span className="text-7xl font-black italic text-black leading-none">{teamBScore}</span>
            <button onClick={() => setTeamBScore(s => Math.max(0, s - 1))} className="w-12 h-12 bg-slate-50 text-slate-300 rounded-full font-black text-2xl shadow-sm hover:bg-slate-100 active:scale-90">-</button>
          </div>
        </div>
      </section>

      {/* MVP Voting */}
      <section className="space-y-4">
        <h3 className="font-black text-slate-400 text-[10px] uppercase tracking-[0.2em] px-2 text-center">Chi è stato l'MVP? 🌟</h3>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-wrap gap-2.5 justify-center">
          {confirmedPlayers.map(p => (
            <button 
              key={p.id}
              onClick={() => toggleMvp(p.id)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-2xl border transition-all active:scale-95 ${mvpIds.includes(p.id) ? 'bg-amber-400 border-amber-500 text-white shadow-md' : 'bg-slate-50 border-slate-100 text-slate-700 grayscale'}`}
            >
              <span className="text-xl">{p.icon}</span>
              <span className="text-[10px] font-black uppercase tracking-tighter truncate max-w-[85px]">{p.name}</span>
            </button>
          ))}
        </div>
      </section>

      <button 
        onClick={() => onComplete(currentMatch.id, teamAScore, teamBScore, mvpIds, teamAIds, teamBIds, captains)}
        disabled={!isFormValid}
        className="w-full bg-emerald-600 text-white font-black py-6 rounded-3xl shadow-xl disabled:opacity-30 disabled:grayscale transition-all uppercase tracking-widest text-sm active:scale-95 mb-8"
      >
        CONFERMA E SALVA RISULTATI
      </button>
    </div>
  );
};

export default MatchManager;
