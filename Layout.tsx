
import React from 'react';
import { ViewState } from './types';
import { LayoutDashboard, Scale, Utensils, User, Users } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentView, setView }) => {
  if (currentView === 'login') return <>{children}</>;

  const isStaff = currentView === 'staff-portal';

  const navItems = [
    { id: 'dashboard', label: 'ホーム', icon: LayoutDashboard },
    { id: 'inbody', label: '体重', icon: Scale },
    { id: 'meals', label: '食事', icon: Utensils },
    { id: 'profile', label: '設定', icon: User },
  ];

  return (
    <div className="flex flex-col h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      <header className="bg-white border-b border-slate-100 p-4 sticky top-0 z-40">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center text-white font-black text-sm shadow-sm">整</div>
            <h1 className="font-black text-slate-800 tracking-tight">整骨院AIコーチ</h1>
          </div>
          <button onClick={() => setView('staff-portal')} className="text-[9px] font-black text-slate-300 uppercase tracking-widest hover:text-indigo-500 transition-colors flex items-center gap-1">
            <Users size={12}/> Staff
          </button>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto pb-24 max-w-md mx-auto w-full">
        {children}
      </main>
      <nav className="bg-white border-t border-slate-100 fixed bottom-0 w-full z-40 pb-safe">
        <div className="max-w-md mx-auto flex justify-around p-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button 
                key={item.id} 
                onClick={() => setView(item.id as ViewState)} 
                className={`flex flex-col items-center p-2 w-full transition-all ${isActive ? 'text-teal-600' : 'text-slate-300'}`}
              >
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[9px] font-black uppercase mt-1">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
export default Layout;
