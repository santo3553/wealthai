import React from 'react';
import { Home, ArrowLeftRight, Plus, PieChart, User } from 'lucide-react';

export type NavTab = 'dashboard' | 'transactions' | 'analytics' | 'profile';

interface BottomNavProps {
  activeTab: NavTab;
  onChangeTab: (tab: NavTab) => void;
  onOpenAddModal: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onChangeTab,
  onOpenAddModal,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-6 pt-2 pointer-events-auto">
      <div className="max-w-md mx-auto relative">
        {/* Navigation Glass Bar */}
        <div className="heavy-glass rounded-3xl px-3 py-2 flex items-center justify-around shadow-2xl shadow-black/80 border border-white/15 backdrop-blur-2xl">
          {/* Dashboard */}
          <button
            onClick={() => onChangeTab('dashboard')}
            className={`flex flex-col items-center justify-center w-14 py-1.5 transition-all duration-200 ${
              activeTab === 'dashboard' ? 'text-amber-400 scale-105' : 'text-white/40 hover:text-white/70'
            }`}
            aria-label="Dashboard"
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] font-medium mt-1">Home</span>
            {activeTab === 'dashboard' && (
              <span className="w-1 h-1 rounded-full bg-amber-400 mt-0.5" />
            )}
          </button>

          {/* Transactions */}
          <button
            onClick={() => onChangeTab('transactions')}
            className={`flex flex-col items-center justify-center w-14 py-1.5 transition-all duration-200 ${
              activeTab === 'transactions' ? 'text-amber-400 scale-105' : 'text-white/40 hover:text-white/70'
            }`}
            aria-label="Transactions"
          >
            <ArrowLeftRight className="w-5 h-5" />
            <span className="text-[10px] font-medium mt-1">History</span>
            {activeTab === 'transactions' && (
              <span className="w-1 h-1 rounded-full bg-amber-400 mt-0.5" />
            )}
          </button>

          {/* Center Luxury Add Button */}
          <div className="relative -top-5 flex flex-col items-center">
            <button
              onClick={onOpenAddModal}
              className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-300 p-[2px] shadow-xl shadow-amber-500/30 active:scale-95 transition-transform group"
              aria-label="Add Transaction"
            >
              <div className="w-full h-full rounded-full bg-[#120d0b] flex items-center justify-center group-hover:bg-opacity-80 transition-colors">
                <Plus className="w-6 h-6 text-amber-300 stroke-[2.5]" />
              </div>
            </button>
            <span className="text-[9px] font-semibold tracking-wider text-amber-400/80 uppercase mt-1">
              Add
            </span>
          </div>

          {/* Analytics */}
          <button
            onClick={() => onChangeTab('analytics')}
            className={`flex flex-col items-center justify-center w-14 py-1.5 transition-all duration-200 ${
              activeTab === 'analytics' ? 'text-amber-400 scale-105' : 'text-white/40 hover:text-white/70'
            }`}
            aria-label="Analytics"
          >
            <PieChart className="w-5 h-5" />
            <span className="text-[10px] font-medium mt-1">Insights</span>
            {activeTab === 'analytics' && (
              <span className="w-1 h-1 rounded-full bg-amber-400 mt-0.5" />
            )}
          </button>

          {/* Profile */}
          <button
            onClick={() => onChangeTab('profile')}
            className={`flex flex-col items-center justify-center w-14 py-1.5 transition-all duration-200 ${
              activeTab === 'profile' ? 'text-amber-400 scale-105' : 'text-white/40 hover:text-white/70'
            }`}
            aria-label="Profile"
          >
            <User className="w-5 h-5" />
            <span className="text-[10px] font-medium mt-1">Profile</span>
            {activeTab === 'profile' && (
              <span className="w-1 h-1 rounded-full bg-amber-400 mt-0.5" />
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};
