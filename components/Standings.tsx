
import React from 'react';
import { Player } from '../types';

interface StandingsProps {
  players: Player[];
  onSelectPlayer: (id: string) => void;
}

const Standings: React.FC<StandingsProps> = ({ players, onSelectPlayer }) => {
  const sortedPlayers = [...players].sort((a, b) => {
    if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
    if (a.isPastWinner !== b.isPastWinner) return a.isPastWinner ? 1 : -1;
    return b.wins - a.wins;
  });

  const exportToText = () => {
    let text = "🏆 CLASSICA GISELLA'S CUP 🏆\n\n";
    sortedPlayers.forEach((p, i) => {
      text += `${i + 1}. ${p.icon} ${p.name} - ${p.totalPoints} pts (${p.matchesPlayed} PG)\n`;
    });
    
    navigator.clipboard.writeText(text).then(() => {
      alert("Classifica copiata negli appunti! 📋");
    });
  };

  const exportToCSV = () => {
    let csv = "Pos;Icon;Player;Matches;Points\n";
    sortedPlayers.forEach((p, i) => {
      csv += `${i + 1};${p.icon};${p.name};${p.matchesPlayed};${p.totalPoints}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "classifica_gisella_cup.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-4">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black text-slate-800 uppercase italic tracking-tight leading-none">Classifica</h2>
        <div className="h-1 w-12 bg-emerald-500 mx-auto mt-2 rounded-full" />
        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-3">Gisella's Cup Tournament</p>
      </div>

      <div className="flex space-x-2 px-2">
        <button 
          onClick={exportToText}
          className="flex-1 bg-white border border-slate-200 text-slate-600 font-black py-3 rounded-2xl text-[10px] uppercase tracking-widest flex items-center justify-center hover:bg-slate-50 active:scale-95 transition-all shadow-sm"
        >
          <span className="mr-2">📋</span> Copia Testo
        </button>
        <button 
          onClick={exportToCSV}
          className="flex-1 bg-white border border-slate-200 text-slate-600 font-black py-3 rounded-2xl text-[10px] uppercase tracking-widest flex items-center justify-center hover:bg-slate-50 active:scale-95 transition-all shadow-sm"
        >
          <span className="mr-2">📊</span> Scarica Excel
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">#</th>
              <th className="px-2 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Player</th>
              <th className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">PG</th>
              <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">PTS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {sortedPlayers.map((player, index) => {
              const isFirst = index === 0;
              return (
                <tr 
                  key={player.id} 
                  onClick={() => onSelectPlayer(player.id)}
                  className={`${isFirst ? 'bg-amber-50/40' : 'hover:bg-slate-50/50'} transition-colors cursor-pointer active:bg-slate-100`}
                >
                  <td className="px-6 py-5">
                    <span className={`
                      flex items-center justify-center w-7 h-7 rounded-lg text-xs font-black
                      ${index === 0 ? 'bg-amber-400 text-white shadow-[0_4px_10px_rgba(251,191,36,0.4)]' : 
                        index === 1 ? 'bg-slate-300 text-white shadow-sm' : 
                        index === 2 ? 'bg-orange-300 text-white shadow-sm' : 'text-slate-400 bg-slate-50'}
                    `}>
                      {index + 1}
                    </span>
                  </td>
                  <td className="px-2 py-5">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{player.icon}</span>
                      <div>
                        <p className="font-bold text-slate-700 text-sm">{player.name}</p>
                        {player.isPastWinner && (
                           <span className="text-[8px] bg-slate-100 text-slate-500 font-black px-1.5 rounded-sm uppercase tracking-tighter">Vincitore 🏆</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-5 text-sm text-slate-500 text-center font-bold">
                    {player.matchesPlayed}
                  </td>
                  <td className="px-6 py-5 text-right font-black text-slate-800 text-xl italic">
                    {player.totalPoints}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="text-[9px] text-center text-slate-300 uppercase tracking-widest font-black italic">Tocca un giocatore per i dettagli</p>
    </div>
  );
};

export default Standings;
