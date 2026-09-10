import React from 'react';

/**
 * Background Effects
 * Fixed background with three 120px blurred orbs:
 * a. Top-Left: Indigo (bg-accent-indigo/10)
 * b. Bottom-Right: Fuchsia (bg-fuchsia-600/10)
 * c. Center: Amber (bg-secondary-brand/5)
 */
export const BackgroundOrbs: React.FC = () => {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0" aria-hidden="true">
      {/* a. Top-Left: Indigo */}
      <div
        className="absolute -top-10 -left-10 w-[120px] h-[120px] rounded-full bg-indigo-600/20 blur-[60px]"
        style={{ transform: 'translate3d(0, 0, 0)' }}
      />

      {/* b. Bottom-Right: Fuchsia */}
      <div
        className="absolute -bottom-10 -right-10 w-[120px] h-[120px] rounded-full bg-fuchsia-600/20 blur-[60px]"
        style={{ transform: 'translate3d(0, 0, 0)' }}
      />

      {/* c. Center: Amber */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160px] h-[160px] rounded-full bg-amber-500/10 blur-[70px]"
        style={{ transform: 'translate3d(-50%, -50%, 0)' }}
      />
    </div>
  );
};
