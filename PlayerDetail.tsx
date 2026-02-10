
import React from 'react';
import { Player, Match } from '../types';
import { WIN_POINTS, DRAW_POINTS, CLOSE_LOSS_POINTS, CAPTAIN_WIN_BONUS } from '../constants';

interface PlayerDetailProps {
  playerId: string;
  players: Player[];
  matches: Match[];
  onClose: () => void;
}

const PlayerDetail: React.FC<PlayerDetailProps> = ({ playerId, players, matches, onClose }) => {
  const player = players.find(p => p.id === playerId);
  const playerMatches = matches.filter(m => 
    m.isCompleted && 
    (m.teamA?.includes(playerId) || m.teamB?.includes(playerId))
  ).sort((a, b) => b.sessionNumber - a.sessionNumber);

  if (!player) return null;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300 pb-10">
      {/* Back Button */}
      <button 
        onClick={onClose}
        className="flex items-center text-emerald-600 font-black text-xs uppercase tracking-widest mb-4 hover:opacity-70"
      >
        <span className="mr-2">←</span> Torna alla Classifica
      </button>

      {/* Profile Header */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl text-center relative overflow-hidden">
        <div className="absolute top-4 right-6 text-4xl opacity-10 font-black italic">#{player.matchesPlayed} PG</div>
        <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center text-5xl mx-auto mb-4 shadow-inner">
          {player.icon}
        </div>
        <h2 className="text-2xl font-black text-slate-800 uppercase italic tracking-tight leading-none mb-2">{player.name}</h2>
        {player.isPastWinner && (
          <span className="bg-amber-100 text-amber-700 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-amber-200">Campione Trophy 🏆</span>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-emerald-50 p-4 rounded-3xl border border-emerald-100 text-center">
          <p className="text-[9px] font-black text-emerald-600 uppercase mb-1">Vittorie</p>
          <p className="text-2xl font-black text-emerald-800">{player.wins}</p>
        </div>
        <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100 text-center">
          <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Sconfitte</p>
          <p className="text-2xl font-black text-slate-800">{player.losses}</p>
        </div>
        <div className="bg-amber-50 p-4 rounded-3xl border border-amber-100 text-center">
          <p className="text-[9px] font-black text-amber-600 uppercase mb-1">MVP</p>
          <p className="text-2xl font-black text-amber-800">{player.mvpPoints}</p>
        </div>
      </div>

      {/* Match List */}
      <div className="space-y-4">
        <h3 className="font-black text-slate-400 text-[10px] uppercase tracking-[0.2em] px-4">Partite Giocate</h3>
        {playerMatches.length === 0 ? (
          <div className="text-center py-10 text-slate-400 italic text-sm">Nessuna partita disputata in questa Cup.</div>
        ) : (
          playerMatches.map(match => {
            const isInTeamA = match.teamA?.includes(playerId);
            const myScore = isInTeamA ? match.score?.teamA : match.score?.teamB;
            const oppScore = isInTeamA ? match.score?.teamB : match.score?.teamA;
            const isDraw = match.score?.teamA === match.score?.teamB;
            const diff = (myScore || 0) - (oppScore || 0);
            const isCaptain = match.captains?.includes(playerId);
            const isMVP = match.mvps?.includes(playerId);
            
            let pointsWon = 0;
            if (isDraw) pointsWon = DRAW_POINTS;
            else if (diff > 0) pointsWon = WIN_POINTS + (isCaptain ? CAPTAIN_WIN_BONUS : 0);
            else if (diff >= -4) pointsWon = CLOSE_LOSS_POINTS;

            return (
              <div key={match.id} className="bg-white p-5 rounded-[1.5rem] border border-slate-100 flex items-center justify-between shadow-sm">
                <div className="flex items-center space-x-4">
                  <div className="bg-slate-50 w-10 h-10 rounded-xl flex items-center justify-center font-black text-slate-400 text-xs">
                    #{match.sessionNumber}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="font-black text-slate-700 text-sm">
                        {myScore}-{oppScore}
                      </p>
                      <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase ${
                        isDraw ? 'bg-amber-100 text-amber-700' :
                        diff > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-50 text-red-400'
                      }`}>
                        {isDraw ? 'DRAW' : diff > 0 ? 'WIN' : 'LOSS'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                       {isCaptain && <span className="text-[8px] bg-slate-100 text-slate-500 font-bold px-1 rounded uppercase tracking-tighter">Capitano</span>}
                       {isMVP && <span className="text-[8px] bg-amber-400 text-white font-bold px-1 rounded uppercase tracking-tighter">MVP 🌟</span>}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-black text-slate-800 italic">+{pointsWon} <span className="text-[9px] not-italic text-slate-400">PTS</span></p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default PlayerDetail;
