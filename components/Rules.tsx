
import React from 'react';

const Rules: React.FC = () => {
  return (
    <div className="space-y-6 pb-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-black text-slate-800 uppercase italic tracking-tight">Vademecum & Regolamento</h2>
        <p className="text-slate-500 text-sm">Gisella's Cup Tournament</p>
      </div>

      <div className="space-y-4">
        <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="font-black text-emerald-600 uppercase text-xs tracking-widest mb-3">🕒 QUANDO E DOVE</h3>
          <p className="text-slate-700 text-sm leading-relaxed">
            Ogni giovedì per un totale di 12 partite. Al <strong>Couver/Tennis Club Abano</strong>.
          </p>
        </section>

        <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="font-black text-emerald-600 uppercase text-xs tracking-widest mb-3">✅ CONFERMA PRESENZA</h3>
          <p className="text-slate-700 text-sm leading-relaxed mb-2">
            Le iscrizioni aprono dal giovedì precedente alle <strong>22:30</strong> via WhatsApp.
          </p>
          <p className="text-slate-700 text-sm leading-relaxed font-bold">
            I primi 12 a confermare hanno il posto garantito.
          </p>
        </section>

        <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="font-black text-emerald-600 uppercase text-xs tracking-widest mb-3">🎖️ CAPITANI</h3>
          <ul className="text-slate-700 text-sm leading-relaxed space-y-2 list-disc pl-4">
            <li><strong>Prime partite:</strong> I primi due a confermare che non sono ancora stati capitani.</li>
            <li><strong>Ultime 3 partite:</strong> I punteggi più bassi tra chi può ancora vincere matematicamente.</li>
            <li><strong>Ultima partita:</strong> Il primo e il secondo in classifica (Direttore's Choice).</li>
          </ul>
        </section>

        <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="font-black text-emerald-600 uppercase text-xs tracking-widest mb-3">📊 SISTEMA PUNTI</h3>
          <div className="grid grid-cols-2 gap-3 mt-2">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <p className="text-xs font-bold text-slate-400 mb-1">VITTORIA</p>
              <p className="text-lg font-black text-emerald-600">3 Punti</p>
            </div>
            <div className="bg-amber-50 p-3 rounded-xl border border-amber-100">
              <p className="text-xs font-bold text-amber-600 mb-1">PAREGGIO</p>
              <p className="text-lg font-black text-amber-600">2 Punti</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <p className="text-xs font-bold text-slate-400 mb-1">SCONFITTA &lt; 5 GOL</p>
              <p className="text-lg font-black text-slate-600">1 Punto</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <p className="text-xs font-bold text-slate-400 mb-1">CAPITANO VINCENTE</p>
              <p className="text-lg font-black text-amber-500">+1 Bonus</p>
            </div>
          </div>
          <p className="text-[10px] text-slate-400 mt-4 italic font-medium leading-relaxed">
            *Nota: In caso di pareggio, tutti i partecipanti ricevono 2 punti indipendentemente dal ruolo.
          </p>
        </section>

        <section className="bg-emerald-600 p-6 rounded-2xl text-white shadow-lg">
          <h3 className="font-black uppercase text-xs tracking-widest mb-3 text-emerald-100">⚽ REGOLE SPECIALI</h3>
          <p className="text-sm leading-relaxed mb-3">
            • Si segna da rimessa laterale solo se c'è un tocco.
          </p>
          <p className="text-sm leading-relaxed">
            • Nel retropassaggio è consentito toccare la palla con le mani (Portiere).
          </p>
        </section>
      </div>
    </div>
  );
};

export default Rules;
