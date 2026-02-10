
import React, { useEffect, useState } from 'react';
import { InBodyData, UserProfile, MealLog, ViewState } from './types';
import { getDailyCoachTip, evaluateDailyDiet } from './geminiService';

const Dashboard: React.FC<{ user: UserProfile; inBodyHistory: InBodyData[]; mealLogs: MealLog[]; setView: (v: ViewState) => void }> = ({ user, inBodyHistory, mealLogs, setView }) => {
  const [tip, setTip] = useState('');
  const [scoreData, setScoreData] = useState<{ score: number; comment: string } | null>(null);

  useEffect(() => {
    getDailyCoachTip(user).then(setTip);
    const today = new Date().toISOString().split('T')[0];
    const todaysMeals = mealLogs.filter(m => m.date === today);
    evaluateDailyDiet(todaysMeals, user).then(setScoreData);
  }, [mealLogs.length]);

  const currentWeight = inBodyHistory.length > 0 ? inBodyHistory[0].weightKg : '--';

  return (
    <div className="p-4 space-y-5">
      <div className="bg-teal-600 rounded-[32px] p-6 text-white shadow-xl shadow-teal-600/20">
        <h3 className="text-[10px] font-black uppercase opacity-80 tracking-widest">Coach Advice</h3>
        <p className="text-lg font-bold leading-tight mt-2 italic">「{tip || "読み込み中..."}」</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-[32px] p-5 shadow-sm border border-slate-100 text-center">
           <p className="text-[10px] font-black text-slate-400 uppercase mb-1">現在の体重</p>
           <div className="text-2xl font-black text-slate-800">{currentWeight}<span className="text-xs ml-1 font-bold">kg</span></div>
        </div>
        <div className="bg-white rounded-[32px] p-5 shadow-sm border border-slate-100 text-center">
           <p className="text-[10px] font-black text-slate-400 uppercase mb-1">食事スコア</p>
           <div className="text-2xl font-black text-teal-600">{scoreData?.score || 0}<span className="text-xs ml-1 font-bold">点</span></div>
        </div>
      </div>
      <div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-100">
        <h3 className="text-[10px] font-black text-slate-400 uppercase mb-2">AI総評</h3>
        <p className="text-sm font-bold text-slate-700 leading-relaxed">{scoreData?.comment || "今日の記録を待ちましょう"}</p>
      </div>
    </div>
  );
};
export default Dashboard;
