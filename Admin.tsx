
import React, { useState } from 'react';
import { Player } from '../types';

interface AdminProps {
  players: Player[];
  onAddPlayer: (name: string, icon: string, isPastWinner: boolean) => void;
  onUpdatePlayer: (player: Player) => void;
  onDeletePlayer: (id: string) => void;
}

const ICONS = ['⚽', '🧤', '🏃', '⚡', '🔥', '🎯', '🦁', '🦅', '🐺', '🐻', '🦊', '🐼', '🕶️', '👑', '💣', '🛡️'];

const Admin: React.FC<AdminProps> = ({ 
  players, 
  onAddPlayer,
  onUpdatePlayer,
  onDeletePlayer
}) => {
  // Player Management State
  const [newPlayerName, setNewPlayerName] = useState('');
  const [newPlayerIcon, setNewPlayerIcon] = useState('⚽');
  const [newPlayerIsWinner, setNewPlayerIsWinner] = useState(false);
  
  // Editing State
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);

  const handleEditClick = (player: Player) => {
    setEditingPlayer({ ...player });
  };

  const handleStatChange = (field: keyof Player, value: string | number | boolean) => {
    if (!editingPlayer) return;
    setEditingPlayer({
      ...editingPlayer,
      [field]: value
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300 pb-10">
      <div className="text-center">
        <h2 className="text-2xl font-black text-slate-800 uppercase italic tracking-tight leading-none">Anagrafica & Admin</h2>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Gestione Classifica & Spogliatoio</p>
      </div>

      {/* Aggiunta Giocatore */}
      <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl space-y-6">
        <h3 className="font-black text-slate-800 text-base uppercase tracking-tight flex items-center">
          <span className="mr-3 text-xl">🆕</span> Nuovo Giocatore
        </h3>
        <form onSubmit={(e) => {
          e.preventDefault();
          if (newPlayerName.trim()) {
            onAddPlayer(newPlayerName.trim(), newPlayerIcon, newPlayerIsWinner);
            setNewPlayerName('');
            setNewPlayerIcon('⚽');
            setNewPlayerIsWinner(false);
          }
        }} className="space-y-6">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Nome Completo</label>
            <input 
              type="text" 
              placeholder="Esempio: Mario Rossi" 
              value={newPlayerName}
              onChange={e => setNewPlayerName(e.target.value)}
              className="w-full bg-slate-50 border-2 border-transparent focus:border-emerald-500 rounded-2xl px-5 py-4 text-sm font-bold transition-all outline-none text-slate-900"
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Avatar</label>
            <div className="grid grid-cols-6 gap-2">
              {ICONS.map(emoji => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setNewPlayerIcon(emoji)}
                  className={`w-full aspect-square flex items-center justify-center text-xl rounded-xl transition-all ${newPlayerIcon === emoji ? 'bg-emerald-100 border-2 border-emerald-500 scale-110' : 'bg-slate-50 border-2 border-transparent grayscale opacity-60'}`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl">
            <div className="pr-4">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Vincitore Cup?</label>
              <p className="text-[9px] text-slate-400 font-medium italic">Se ha già vinto il trofeo</p>
            </div>
            <button 
              type="button"
              onClick={() => setNewPlayerIsWinner(!newPlayerIsWinner)}
              className={`w-14 h-7 rounded-full transition-all relative flex-shrink-0 ${newPlayerIsWinner ? 'bg-amber-400' : 'bg-slate-200'}`}
            >
              <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform shadow-sm ${newPlayerIsWinner ? 'translate-x-7' : ''}`} />
            </button>
          </div>

          <button 
            type="submit"
            className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl text-xs uppercase tracking-[0.2em] shadow-lg active:scale-95 transition-all"
          >
            AGGIUNGI IN LISTA
          </button>
        </form>
      </section>

      {/* Lista Giocatori */}
      <section className="space-y-4">
        <h3 className="font-black text-slate-400 text-[10px] uppercase tracking-[0.3em] px-4">Giocatori Registrati ({players.length})</h3>
        <div className="space-y-3">
          {players.map(player => (
            <div key={player.id} className="bg-white p-4 rounded-[1.8rem] border border-slate-100 flex flex-col group hover:shadow-md transition-all overflow-hidden">
              {editingPlayer?.id === player.id ? (
                <div className="space-y-6 animate-in fade-in duration-200 p-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-2xl">{editingPlayer.icon}</div>
                    <input 
                      type="text" 
                      value={editingPlayer.name}
                      onChange={e => handleStatChange('name', e.target.value)}
                      className="flex-1 bg-slate-50 border-2 border-emerald-200 rounded-xl px-4 py-3 text-sm font-black text-slate-900 outline-none uppercase"
                    />
                  </div>
                  
                  {/* Grid Modifica Statistiche Classifica */}
                  <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div className="space-y-1">
                      <label className="text-[8px] font-black text-slate-400 uppercase px-1">Punti Totali (PTS)</label>
                      <input 
                        type="number" 
                        value={editingPlayer.totalPoints} 
                        onChange={e => handleStatChange('totalPoints', parseInt(e.target.value) || 0)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-black text-slate-700"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] font-black text-slate-400 uppercase px-1">MVP 🌟</label>
                      <input 
                        type="number" 
                        value={editingPlayer.mvpPoints} 
                        onChange={e => handleStatChange('mvpPoints', parseInt(e.target.value) || 0)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-black text-slate-700"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] font-black text-slate-400 uppercase px-1">Giocate (PG)</label>
                      <input 
                        type="number" 
                        value={editingPlayer.matchesPlayed} 
                        onChange={e => handleStatChange('matchesPlayed', parseInt(e.target.value) || 0)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-black text-slate-700"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] font-black text-slate-400 uppercase px-1">Vittorie (W)</label>
                      <input 
                        type="number" 
                        value={editingPlayer.wins} 
                        onChange={e => handleStatChange('wins', parseInt(e.target.value) || 0)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-black text-slate-700"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] font-black text-slate-400 uppercase px-1">Sconfitte (L)</label>
                      <input 
                        type="number" 
                        value={editingPlayer.losses} 
                        onChange={e => handleStatChange('losses', parseInt(e.target.value) || 0)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-black text-slate-700"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] font-black text-slate-400 uppercase px-1">Vittorie Cap 🎖️</label>
                      <input 
                        type="number" 
                        value={editingPlayer.captainWins} 
                        onChange={e => handleStatChange('captainWins', parseInt(e.target.value) || 0)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-black text-slate-700"
                      />
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button onClick={() => {
                      onUpdatePlayer(editingPlayer);
                      setEditingPlayer(null);
                    }} className="flex-1 bg-emerald-600 text-white font-black py-4 rounded-xl text-xs uppercase tracking-widest shadow-lg shadow-emerald-200">Salva Modifiche</button>
                    <button onClick={() => setEditingPlayer(null)} className="flex-1 bg-slate-200 text-slate-600 font-black py-4 rounded-xl text-xs uppercase tracking-widest">Annulla</button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-11 h-11 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl shadow-inner">
                      {player.icon}
                    </div>
                    <div>
                      <p className="font-black text-slate-800 text-sm leading-none uppercase">{player.name}</p>
                      <div className="flex items-center mt-1.5 space-x-2">
                        <span className="text-[9px] bg-slate-100 text-slate-500 font-black px-1.5 py-0.5 rounded uppercase tracking-tighter">
                          {player.totalPoints} PTS
                        </span>
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">
                          {player.matchesPlayed} PG • {player.isPastWinner ? '🏆 Campione' : 'Rookie'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button onClick={() => handleEditClick(player)} className="p-2.5 rounded-xl border border-slate-100 bg-slate-50 text-slate-400 hover:text-emerald-500 transition-all shadow-sm">✏️</button>
                    <button onClick={() => onDeletePlayer(player.id)} className="p-2.5 rounded-xl bg-red-50 text-red-500 border border-red-100 hover:bg-red-500 hover:text-white transition-all shadow-sm">✕</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Admin;
