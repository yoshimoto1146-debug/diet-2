
import React, { useState, useRef } from 'react';
import { InBodyData } from './types';
import { analyzeInBodyImage } from './geminiService';
import { Save, Scale, Trash2, Calendar, Camera, Loader2 } from 'lucide-react';

const InBodyManager: React.FC<{ history: InBodyData[]; onAddEntry: (d: InBodyData) => void; onDelete: (id: string) => void }> = ({ history, onAddEntry, onDelete }) => {
  const [weight, setWeight] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    const wNum = parseFloat(weight);
    if (!wNum || isNaN(wNum)) return alert("数値を入力してください");
    onAddEntry({ id: Date.now().toString(), date, weightKg: wNum, isManual: true });
    setWeight('');
  };

  const handleCamera = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsProcessing(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64 = (reader.result as string).split(',')[1];
        const res = await analyzeInBodyImage(base64);
        if (res.weightKg) {
          onAddEntry({ id: Date.now().toString(), date, weightKg: res.weightKg, muscleMassKg: res.muscleMassKg, bodyFatMassKg: res.bodyFatMassKg, isManual: false });
          alert("解析完了！");
        }
      } catch (err) {
        alert("解析失敗");
      } finally {
        setIsProcessing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="p-5 space-y-6">
      <div className="bg-white p-6 rounded-[40px] shadow-xl border border-slate-100 space-y-6 relative overflow-hidden">
        {isProcessing && (
           <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
             <Loader2 className="animate-spin text-teal-600 mb-2" />
             <p className="text-[10px] font-black text-teal-600 uppercase">AI Scanning...</p>
           </div>
        )}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600"><Scale size={20} /></div>
            <h2 className="font-black text-slate-800">体重を記録</h2>
          </div>
          <button onClick={() => fileInputRef.current?.click()} className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:text-teal-600 transition-colors">
            <Camera size={20} />
          </button>
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleCamera} />
        </div>
        
        <div className="space-y-4">
          <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full p-4 bg-slate-50 rounded-2xl font-bold border-none outline-none" />
          <input type="number" step="0.1" value={weight} onChange={e => setWeight(e.target.value)} placeholder="00.0" className="w-full p-5 bg-slate-50 rounded-3xl text-4xl font-black text-center text-teal-600 outline-none border-none placeholder:text-slate-200" />
        </div>

        <button onClick={handleSave} className="w-full py-5 bg-teal-600 text-white font-black rounded-3xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2">
          <Save size={20} /> 保存する
        </button>
      </div>

      <div className="space-y-3">
        {history.map(entry => (
          <div key={entry.id} className="bg-white p-5 rounded-[32px] flex justify-between items-center shadow-sm border border-slate-50">
            <div className="flex items-center gap-4">
              <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{entry.date}</div>
              <div className="text-xl font-black text-slate-800">{entry.weightKg}kg</div>
            </div>
            <button onClick={() => onDelete(entry.id)} className="text-slate-200 hover:text-rose-500 p-2"><Trash2 size={18} /></button>
          </div>
        ))}
      </div>
    </div>
  );
};
export default InBodyManager;
