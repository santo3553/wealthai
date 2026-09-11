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
    <header className="px-6 pt-6 pb-4 relative z-10 space-y-3">
      {/* Top Brand Bar with Official Logo */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl p-[2px] bg-gradient-to-tr from-teal-400 via-cyan-400 to-amber-300 shadow-md shadow-cyan-500/20">
            <img
              src="/logo-icon.png"
              alt="WealthAI Logo"
              className="w-full h-full object-cover rounded-[10px]"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-extrabold tracking-wider bg-gradient-to-r from-white via-cyan-100 to-amber-200 bg-clip-text text-transparent uppercase">
                WealthAI
              </span>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-400/15 text-amber-300 border border-amber-400/30 tracking-widest uppercase">
                Private
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1 rounded-full glass-panel border border-white/10 flex items-center gap-1.5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-semibold text-white/80">AI Active</span>
          </div>
        </div>
      </div>

      {/* Greeting & Client Bar */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <span className="text-xs uppercase tracking-widest text-amber-400/80 font-semibold flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            Private Client
          </span>
          <h1 className="text-lg font-bold text-white tracking-tight">
            {getGreeting()}, {settings.userName}
          </h1>
        </div>

        <button
          onClick={onAvatarClick}
          className="relative group focus:outline-none transition-transform active:scale-95"
          aria-label="User Profile"
        >
          {/* Avatar Ring */}
          <div className="w-11 h-11 rounded-full p-[2px] bg-gradient-to-tr from-amber-400 via-orange-500 to-amber-200 shadow-lg shadow-amber-500/20">
            <div className="w-full h-full rounded-full bg-[#120d0b] flex items-center justify-center overflow-hidden border border-white/10">
              <span className="font-serif font-bold text-base text-amber-300">
                {settings.userName.charAt(0)}
              </span>
            </div>
          </div>
          {/* Verification Badge */}
          <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#120d0b] flex items-center justify-center">
            <ShieldCheck className="w-2 h-2 text-white" />
          </div>
        </button>
      </div>
    </header>
  );
};
