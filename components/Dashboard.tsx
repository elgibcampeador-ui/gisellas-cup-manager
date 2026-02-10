
import React from 'react';
import { Match, Player } from '../types';
import { MAX_PLAYERS_PER_MATCH, TOTAL_SESSIONS } from '../constants';
import Booking from './Booking';

interface DashboardProps {
  currentMatch: Match;
  players: Player[];
  onRegister: (id: string) => void;
  onCancel: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ currentMatch, players, onRegister, onCancel }) => {
  const seatsTaken = currentMatch.registrations.length;
  const seatsRemaining = Math.max(0, MAX_PLAYERS_PER_MATCH - seatsTaken);

  return (
    <div className="space-y-6">
      {/* Welcome & Info Section */}
      <section className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-3xl shadow-inner border border-emerald-50">
            ⚽
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-800 leading-tight">Pronto per la prossima partita?</h2>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mt-1">Gisella's Cup - Sessione #{currentMatch.sessionNumber}</p>
          </div>
        </div>
      </section>

      {/* Progress Card */}
      <section className="bg-emerald-600 p-6 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="bg-white/20 text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-widest backdrop-blur-sm">STADIO COUVER</span>
              <h3 className="text-3xl font-black mt-2 leading-tight italic uppercase">Giovedì Sera</h3>
              <p className="opacity-80 text-xs font-medium">Abano Terme (PD)</p>
            </div>
            <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-md border border-white/10 text-center min-w-[70px]">
              <span className="text-3xl font-black block leading-none">{seatsRemaining}</span>
              <p className="text-[9px] font-black opacity-80 uppercase mt-1">posti</p>
            </div>
          </div>
          <div className="h-3 bg-black/10 rounded-full overflow-hidden mb-2 border border-white/10">
            <div 
              className="h-full bg-white transition-all duration-700 ease-out shadow-[0_0_10px_rgba(255,255,255,0.5)]" 
              style={{ width: `${(Math.min(seatsTaken, MAX_PLAYERS_PER_MATCH) / MAX_PLAYERS_PER_MATCH) * 100}%` }}
            />
          </div>
        </div>
        <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[120px] opacity-10 rotate-12 select-none font-black italic">
          #{currentMatch.sessionNumber}
        </div>
      </section>

      {/* Embedded Booking Section */}
      <div className="bg-slate-50 -mx-4 px-4 py-2">
        <Booking 
          match={currentMatch} 
          players={players} 
          currentUser={null}
          onRegister={onRegister}
          onCancel={onCancel}
        />
      </div>
    </div>
  );
};

export default Dashboard;
