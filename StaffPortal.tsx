
import React from 'react';
import { Users, AlertCircle, ChevronRight, LogOut } from 'lucide-react';

const StaffPortal: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const patients = [
    { id: 'P-1001', name: '佐藤 健一', alert: true, lastSync: '15分前' },
    { id: 'P-1002', name: '鈴木 美香', alert: false, lastSync: '2時間前' },
  ];

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center px-1">
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">スタッフ管理</h2>
        <button onClick={onLogout} className="p-3 text-rose-500 bg-rose-50 rounded-2xl active:scale-90 transition-all">
          <LogOut size={20} />
        </button>
      </div>
      
      <div className="bg-indigo-600 rounded-[32px] p-6 text-white shadow-xl shadow-indigo-600/20">
        <h3 className="text-[10px] font-black uppercase opacity-60 tracking-widest mb-2">Notice</h3>
        <p className="text-xs font-bold leading-relaxed">来院時のInBody測定を忘れずに。食事のP（タンパク質）不足が目立つ患者様には声掛けをしましょう。</p>
      </div>

      <div className="space-y-3">
        {patients.map(p => (
          <div key={p.id} className="bg-white rounded-[28px] p-5 shadow-sm flex items-center gap-4 border border-slate-100">
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center font-black text-indigo-500 text-lg">
              {p.name[0]}
            </div>
            <div className="flex-1">
              <h3 className="font-black text-slate-800">{p.name}</h3>
              <p className="text-[10px] text-slate-300 font-bold uppercase">{p.id} • {p.lastSync}</p>
            </div>
            {p.alert && <AlertCircle size={18} className="text-rose-500" />}
            <ChevronRight size={18} className="text-slate-200" />
          </div>
        ))}
      </div>
    </div>
  );
};
export default StaffPortal;