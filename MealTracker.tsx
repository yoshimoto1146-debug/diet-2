
import React, { useState } from 'react';
import { MealLog, UserProfile, MealCategory } from './types';
import { analyzeMeal } from './geminiService';
import { Plus, Loader2, Trash2, Utensils, Calendar } from 'lucide-react';

const MealTracker: React.FC<{ logs: MealLog[]; onAddLog: (l: MealLog) => void; onDeleteLog: (id: string) => void; user: UserProfile; }> = ({ logs, onAddLog, onDeleteLog, user }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [description, setDescription] = useState('');
  const [viewDate, setViewDate] = useState(new Date().toISOString().split('T')[0]);

  const handleAdd = async () => {
    if (!description.trim()) return;
    setIsAnalyzing(true);
    try {
      const analysis = await analyzeMeal(description);
      onAddLog({
        id: Date.now().toString(),
        date: viewDate,
        category: '昼食',
        description: description,
        ...analysis
      });
      setDescription('');
    } catch (error) {
      alert("解析に失敗しました。");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const filtered = logs.filter(m => m.date === viewDate);

  return (
    <div className="p-5 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
          <Utensils size={24} className="text-teal-600" /> 食事の記録
        </h2>
        <div className="bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-2">
          <Calendar size={14} className="text-slate-400" />
          <input type="date" value={viewDate} onChange={e => setViewDate(e.target.value)} className="text-[10px] font-black text-slate-700 outline-none bg-transparent" />
        </div>
      </div>

      <div className="bg-white p-6 rounded-[32px] shadow-xl space-y-4 border border-slate-100 relative overflow-hidden">
        {isAnalyzing && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex flex-col items-center justify-center space-y-2">
            <Loader2 className="animate-spin text-teal-600" size={32} />
            <p className="text-[10px] font-black text-teal-700 uppercase tracking-widest">AI Analyzing...</p>
          </div>
        )}
        <textarea 
          value={description} 
          onChange={e => setDescription(e.target.value)} 
          disabled={isAnalyzing}
          placeholder="食べたものを教えてください（例：おにぎりとサラダ）" 
          className="w-full p-4 bg-slate-50 rounded-2xl font-bold h-28 outline-none resize-none border-none placeholder:text-slate-300 focus:bg-slate-100 transition-colors" 
        />
        <button 
          onClick={handleAdd} 
          disabled={isAnalyzing || !description.trim()} 
          className="w-full py-5 bg-teal-600 text-white font-black rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-teal-600/20 active:scale-95 transition-all disabled:opacity-50"
        >
          {isAnalyzing ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
          AIで解析・記録
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 ml-2">
           <div className="w-1 h-3 bg-teal-500 rounded-full"></div>
           <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Meal History</h3>
        </div>
        
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-16 bg-white/50 rounded-[40px] border-2 border-dashed border-slate-200">
              <Utensils className="mx-auto text-slate-200 mb-3" size={40} />
              <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">No Records Today</p>
            </div>
          ) : (
            filtered.map(log => (
              <div key={log.id} className="bg-white p-5 rounded-[32px] flex items-center gap-4 shadow-sm border border-slate-50 group hover:shadow-md transition-all">
                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl shadow-inner group-hover:bg-teal-50 transition-colors">
                  🍽️
                </div>
                <div className="flex-1 space-y-1">
                  <p className="font-bold text-sm text-slate-800">{log.description}</p>
                  <div className="flex gap-2">
                    <span className="text-[9px] font-black text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">{log.calories} kcal</span>
                    <span className="text-[9px] font-black text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full">P: {log.protein}g</span>
                  </div>
                  {log.aiAnalysis && (
                    <p className="text-[10px] text-slate-400 font-medium italic mt-1 leading-tight">"{log.aiAnalysis}"</p>
                  )}
                </div>
                <button onClick={() => onDeleteLog(log.id)} className="text-slate-200 hover:text-rose-500 transition-colors p-2">
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
export default MealTracker;
