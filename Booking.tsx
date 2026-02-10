
import React from 'react';
import { Match, Player } from '../types';
import { MAX_PLAYERS_PER_MATCH } from '../constants';

interface BookingProps {
  match: Match;
  players: Player[];
  currentUser: Player | null;
  onRegister: (id: string) => void;
  onCancel: (id: string) => void;
}

const Booking: React.FC<BookingProps> = ({ match, players, currentUser, onRegister, onCancel }) => {
  const registeredIds = match.registrations.map(r => r.playerId);
  const confirmedIds = registeredIds.slice(0, MAX_PLAYERS_PER_MATCH);
  const waitingListIds = registeredIds.slice(MAX_PLAYERS_PER_MATCH);
  const nonRegisteredPlayers = players.filter(p => !registeredIds.includes(p.id));
  
  const getPlayer = (id: string) => players.find(p => p.id === id);
  const seatsTaken = confirmedIds.length;
  const progressPercent = (seatsTaken / MAX_PLAYERS_PER_MATCH) * 100;

  const handleWhatsAppShare = () => {
    const dateStr = new Date(match.date).toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' });
    let text = `⚽ *GISELLA'S CUP - PARTITA #${match.sessionNumber}*\n`;
    text += `📅 *${dateStr.toUpperCase()}*\n\n`;
    text += `✅ *CONFERMATI: ${seatsTaken}/${MAX_PLAYERS_PER_MATCH}*\n`;
    
    confirmedIds.forEach((id, i) => {
      const p = getPlayer(id);
      text += `${i + 1}. ${p?.icon} ${p?.name}\n`;
    });

    if (waitingListIds.length > 0) {
      text += `\n⏳ *LISTA D'ATTESA (${waitingListIds.length}):*\n`;
      waitingListIds.forEach((id, i) => {
        const p = getPlayer(id);
        text += `• ${p?.icon} ${p?.name}\n`;
      });
    }

    if (seatsTaken < MAX_PLAYERS_PER_MATCH) {
      text += `\n🏃 *POSTI RIMASTI: ${MAX_PLAYERS_PER_MATCH - seatsTaken}*`;
    }

    text += `\n\nLink app: ${window.location.href}`;

    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encodedText}`, '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-black text-slate-800 uppercase italic tracking-tight leading-none">Convocazioni</h2>
        <div className="h-1 w-12 bg-emerald-500 mx-auto mt-2 rounded-full" />
      </div>

      <section className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex justify-between items-end mb-4">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Stato Iscrizioni</p>
              <h3 className="text-4xl font-black italic">
                {seatsTaken} <span className="text-slate-500 text-xl not-italic">/ {MAX_PLAYERS_PER_MATCH}</span>
              </h3>
            </div>
            <div className="text-right">
              <span className={`text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider ${seatsTaken >= MAX_PLAYERS_PER_MATCH ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                {seatsTaken >= MAX_PLAYERS_PER_MATCH ? 'SOLDOUT' : `${MAX_PLAYERS_PER_MATCH - seatsTaken} LIBERI`}
              </span>
            </div>
          </div>
          
          <div className="h-4 bg-slate-800 rounded-full overflow-hidden border border-slate-700 p-0.5">
             <div 
              className={`h-full rounded-full transition-all duration-1000 ease-out shadow-lg ${progressPercent === 100 ? 'bg-red-500' : 'bg-emerald-500'}`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl" />
      </section>

      <button 
        onClick={handleWhatsAppShare}
        className="w-full bg-[#25D366] text-white font-black py-5 rounded-3xl flex items-center justify-center space-x-3 shadow-lg active:scale-95 transition-transform uppercase text-sm tracking-widest"
      >
        <span className="text-xl">💬</span>
        <span>Copia Lista WhatsApp</span>
      </button>

      <div className="space-y-4 pb-8">
        {/* LISTA CONFERMATI CON POSSIBILITÀ DI ANNULLARE */}
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="bg-emerald-50/50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-black text-emerald-700 uppercase text-[10px] tracking-widest">Confermati</h3>
            <span className="text-[10px] font-black text-emerald-600/50">{confirmedIds.length}/{MAX_PLAYERS_PER_MATCH}</span>
          </div>
          <div className="divide-y divide-slate-50">
            {confirmedIds.map((id, index) => {
              const p = getPlayer(id);
              return (
                <div key={id} className="px-6 py-3.5 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-[10px] font-black text-slate-300 w-4">{index + 1}</span>
                    <span className="text-xl">{p?.icon}</span>
                    <span className="font-bold text-slate-700 text-sm">{p?.name}</span>
                  </div>
                  <button 
                    onClick={() => onCancel(id)}
                    className="p-2 text-red-400 hover:text-red-600 active:scale-90 transition-all text-xs font-black uppercase tracking-tighter"
                  >
                    Annulla
                  </button>
                </div>
              );
            })}
            {confirmedIds.length === 0 && (
              <div className="p-8 text-center text-slate-300 italic text-xs">Ancora nessun iscritto</div>
            )}
          </div>
        </div>

        {/* LISTA ATTESA */}
        {waitingListIds.length > 0 && (
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="bg-amber-50/50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-black text-amber-700 uppercase text-[10px] tracking-widest">Lista d'attesa</h3>
              <span className="text-[10px] font-black text-amber-600/50">{waitingListIds.length}</span>
            </div>
            <div className="divide-y divide-slate-50">
              {waitingListIds.map((id, index) => {
                const p = getPlayer(id);
                return (
                  <div key={id} className="px-6 py-3.5 flex items-center justify-between opacity-70">
                    <div className="flex items-center space-x-4">
                      <span className="text-[10px] font-black text-slate-300 w-4">{index + 1}</span>
                      <span className="text-xl">{p?.icon}</span>
                      <span className="font-bold text-slate-600 text-sm">{p?.name}</span>
                    </div>
                    <button 
                      onClick={() => onCancel(id)}
                      className="text-[10px] font-black text-red-400 uppercase"
                    >
                      Annulla
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* NON ISCRITTI CON PULSANTI PRENOTA */}
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-black text-slate-400 uppercase text-[10px] tracking-widest">Non ancora iscritti</h3>
            <span className="text-[10px] font-black text-slate-300">{nonRegisteredPlayers.length}</span>
          </div>
          <div className="divide-y divide-slate-50 max-h-[400px] overflow-y-auto">
            {nonRegisteredPlayers.map(p => (
              <div key={p.id} className="px-6 py-3.5 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center space-x-4">
                  <span className="text-xl opacity-60">{p.icon}</span>
                  <span className="font-bold text-slate-600 text-sm">{p.name}</span>
                </div>
                <button 
                  onClick={() => onRegister(p.id)}
                  className="bg-emerald-50 text-emerald-600 font-black text-[10px] px-4 py-2 rounded-xl border border-emerald-100 uppercase tracking-widest active:scale-95 transition-all shadow-sm"
                >
                  Prenota
                </button>
              </div>
            ))}
            {nonRegisteredPlayers.length === 0 && (
              <div className="p-8 text-center text-slate-300 italic text-xs">Tutti i giocatori sono iscritti</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
