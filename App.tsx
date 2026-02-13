
import React, { useState, useEffect } from 'react';
import { ViewState, InBodyData, MealLog, UserProfile, DietGoal } from './types';
import Layout from './Layout';
import Dashboard from './Dashboard';
import InBodyManager from './InBodyManager';
import MealTracker from './MealTracker';
import StaffPortal from './StaffPortal';
import { LogOut } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setView] = useState<ViewState>('login');
  
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('coach_user_data');
      return saved ? JSON.parse(saved) : { patientId: '', name: '', goal: DietGoal.GENERAL };
    } catch {
      return { patientId: '', name: '', goal: DietGoal.GENERAL };
    }
  });

  const [inBodyHistory, setInBodyHistory] = useState<InBodyData[]>(() => {
    try {
      const saved = localStorage.getItem('coach_inbody_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [mealLogs, setMealLogs] = useState<MealLog[]>(() => {
    try {
      const saved = localStorage.getItem('coach_meal_logs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('coach_user_data', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('coach_inbody_history', JSON.stringify(inBodyHistory));
  }, [inBodyHistory]);

  useEffect(() => {
    localStorage.setItem('coach_meal_logs', JSON.stringify(mealLogs));
  }, [mealLogs]);

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const patientId = fd.get('patientId') as string;
    if (patientId) {
      setUser(prev => ({ ...prev, patientId }));
      setView('dashboard');
    }
  };

  const renderContent = () => {
    if (currentView === 'login') return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-6 text-center">
          <div className="w-20 h-20 bg-teal-600 rounded-[24px] mx-auto flex items-center justify-center text-white font-black text-3xl shadow-2xl shadow-teal-600/30">整</div>
          <div className="space-y-2">
            <h1 className="text-2xl font-black text-slate-800">整骨院AIコーチ</h1>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Diet & Health Management</p>
          </div>
          <div className="space-y-4">
            <input 
              name="patientId" 
              required 
              placeholder="診察券番号を入力" 
              className="w-full p-5 rounded-2xl bg-white shadow-sm border-none outline-none font-bold text-center text-slate-700 placeholder:text-slate-300 focus:ring-2 focus:ring-teal-500 transition-all" 
            />
            <button className="w-full py-5 bg-teal-600 text-white font-black rounded-2xl shadow-xl shadow-teal-600/20 active:scale-95 transition-all">ログイン</button>
          </div>
        </form>
      </div>
    );

    if (currentView === 'staff-portal') {
      return <StaffPortal onLogout={() => setView('login')} />;
    }

    switch (currentView) {
      case 'dashboard':
        return <Dashboard user={user} inBodyHistory={inBodyHistory} mealLogs={mealLogs} setView={setView} />;
      case 'inbody':
        return (
          <InBodyManager 
            history={inBodyHistory} 
            onAddEntry={(d: InBodyData) => setInBodyHistory(prev => [d, ...prev])} 
            onDelete={(id: string) => setInBodyHistory(prev => prev.filter(p => p.id !== id))}
          />
        );
      case 'meals':
        return (
          <MealTracker 
            logs={mealLogs} 
            onAddLog={(l: MealLog) => setMealLogs(prev => [l, ...prev])} 
            onDeleteLog={(id: string) => setMealLogs(prev => prev.filter(m => m.id !== id))} 
            user={user} 
          />
        );
      case 'profile':
        return (
          <div className="p-6 space-y-6">
            <h2 className="text-xl font-black text-slate-800">プロフィール設定</h2>
            <div className="bg-white p-6 rounded-[32px] shadow-xl border border-slate-100 space-y-5">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">お名前</label>
                <input value={user.name} onChange={e => setUser({...user, name: e.target.value})} placeholder="名前" className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none focus:bg-white focus:ring-1 focus:ring-teal-500 transition-all" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">ダイエット目標</label>
                <select value={user.goal} onChange={e => setUser({...user, goal: e.target.value as DietGoal})} className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none appearance-none cursor-pointer">
                  {Object.values(DietGoal).map(goal => <option key={goal} value={goal}>{goal}</option>)}
                </select>
              </div>
              <div className="pt-4 space-y-3">
                <button onClick={() => setView('dashboard')} className="w-full py-4 bg-teal-600 text-white font-black rounded-2xl shadow-lg active:scale-95 transition-all">保存して戻る</button>
                <button onClick={() => setView('login')} className="w-full py-2 text-rose-400 font-bold flex items-center justify-center gap-1 hover:text-rose-600 transition-colors"><LogOut size={16}/>ログアウト</button>
              </div>
            </div>
          </div>
        );
      default: return null;
    }
  };

  return <Layout currentView={currentView} setView={setView}>{renderContent()}</Layout>;
};

export default App;
