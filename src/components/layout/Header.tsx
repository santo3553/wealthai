import React from 'react';
import { ShieldCheck, Sparkles } from 'lucide-react';
import { useAppSettings } from '../../context/AppSettingsContext';

interface HeaderProps {
  onAvatarClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onAvatarClick }) => {
  const { settings } = useAppSettings();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <header className="flex items-center justify-between px-6 pt-6 pb-4 relative z-10">
      <div className="flex items-center gap-3">
        <button
          onClick={onAvatarClick}
          className="relative group focus:outline-none transition-transform active:scale-95"
          aria-label="User Profile"
        >
          {/* Avatar Ring */}
          <div className="w-12 h-12 rounded-full p-[2px] bg-gradient-to-tr from-amber-400 via-orange-500 to-amber-200 shadow-lg shadow-amber-500/20">
            <div className="w-full h-full rounded-full bg-[#120d0b] flex items-center justify-center overflow-hidden border border-white/10">
              <span className="font-serif font-bold text-lg text-amber-300">
                {settings.userName.charAt(0)}
              </span>
            </div>
          </div>
          {/* Verification Badge */}
          <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#120d0b] flex items-center justify-center">
            <ShieldCheck className="w-2.5 h-2.5 text-white" />
          </div>
        </button>

        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs uppercase tracking-widest text-amber-400/80 font-semibold flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              Private Client
            </span>
          </div>
          <h1 className="text-lg font-bold text-white tracking-tight">
            {getGreeting()}, {settings.userName}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="px-3 py-1 rounded-full glass-panel border border-white/10 flex items-center gap-1.5 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-medium text-white/70">AI Active</span>
        </div>
      </div>
    </header>
  );
};
