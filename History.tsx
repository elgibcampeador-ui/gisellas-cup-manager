
import React from 'react';
import { Match, Player } from '../types';

interface HistoryProps {
  matches: Match[];
  players: Player[];
}

const History: React.FC<HistoryProps> = ({ matches, players }) => {
  const completedMatches = [...matches].filter(m => m.isCompleted).sort((a, b) => b.sessionNumber - a.sessionNumber);

  const getPlayerName = (id: string) => players.find(p => p.id === id)?.name || '???';
  const getPlayerIcon = (id: string) => players.find(p => p.id === id)?.icon || '⚽';

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black text-slate-800 uppercase italic tracking-tight leading-none">Storico</h2>
        <div className="h-1 w-12 bg-emerald-500 mx-auto mt-2 rounded-full" />
        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-3 italic">Le Battaglie della Gisella</p>
      </div>

      {completedMatches.length === 0 && (
        <div className="bg-white p-12 rounded-[2.5rem] text-center border-2 border-dashed border-slate-100">
          <p className="text-slate-400 italic text-sm">Ancora nessuna partita archiviata.</p>
        </div>
      )}

      <div className="space-y-8 pb-10">
        {completedMatches.map(match => (
          <div key={match.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-500">
            <div className="bg-slate-900 px-6 py-4 border-b border-slate-800 flex justify-between items-center text-white">
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Partita #{match.sessionNumber}</span>
              <span className="text-[10px] font-bold opacity-60 uppercase tracking-widest">{new Date(match.date).toLocaleDateString('it-IT', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </div>
            
            <div className="p-8">
              {/* Scoreline ad alto contrasto */}
              <div className="flex justify-between items-center mb-8 px-2">
                <div className="text-center flex-1">
                  <div className="text-[11px] font-black text-emerald-600 uppercase mb-2 tracking-[0.1em]">BIANCHI</div>
                  <div className="text-7xl font-black italic text-black drop-shadow-md leading-none">{match.score?.teamA}</div>
                </div>
                <div className="text-slate-200 font-black italic text-3xl px-6">VS</div>
                <div className="text-center flex-1">
                  <div className="text-[11px] font-black text-slate-800 uppercase mb-2 tracking-[0.1em]">NERI</div>
                  <div className="text-7xl font-black italic text-black drop-shadow-md leading-none">{match.score?.teamB}</div>
                </div>
              </div>

              {/* Dettagli Match */}
              <div className="grid grid-cols-2 gap-6 border-t border-slate-50 pt-6">
                <div className="space-y-3">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">🎖️ Capitani</p>
                  <div className="flex flex-col space-y-2">
                    {match.captains?.map(id => (
                      <div key={id} className="flex items-center space-x-2 text-xs font-bold text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100/50">
                        <span>{getPlayerIcon(id)}</span>
                        <span className="truncate">{getPlayerName(id)}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">🌟 Migliori in campo</p>
                  <div className="flex flex-col space-y-2">
                    {match.mvps?.length ? match.mvps.map(id => (
                      <div key={id} className="flex items-center space-x-2 text-xs font-black text-amber-700 bg-amber-50 p-2.5 rounded-xl border border-amber-100">
                        <span>{getPlayerIcon(id)}</span>
                        <span className="truncate">{getPlayerName(id)}</span>
                      </div>
                    )) : (
                      <div className="text-slate-300 italic text-[10px] p-2.5 bg-slate-50/50 rounded-xl">Non assegnato</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;
