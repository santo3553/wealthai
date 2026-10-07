'use client';

import React, { useRef, useState } from 'react';

interface HologramTiltCardProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number; // Tilt strength, default 15
}

export function HologramTiltCard({
  children,
  className = '',
  intensity = 15,
}: HologramTiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [glint, setGlint] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const normalX = x / rect.width; // 0 to 1
    const normalY = y / rect.height; // 0 to 1

    const rotX = (normalY - 0.5) * -intensity;
    const rotY = (normalX - 0.5) * intensity;

    setRotate({ x: rotX, y: rotY });
    setGlint({
      x: normalX * 100,
      y: normalY * 100,
      opacity: 0.6,
    });
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
    setGlint((prev) => ({ ...prev, opacity: 0 }));
    setIsHovered(false);
  };

  return (
    <div
      style={{ perspective: 1000 }}
      className="relative transition-transform duration-300"
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: isHovered
            ? `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale3d(1.025, 1.025, 1.025)`
            : 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
          transformStyle: 'preserve-3d',
          transition: isHovered
            ? 'transform 0.12s cubic-bezier(0.2, 0, 0, 1)'
            : 'transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)',
        }}
        className={`relative overflow-hidden rounded-3xl will-change-transform ${className}`}
      >
        {/* Child Content */}
        <div className="relative z-10">{children}</div>

        {/* Iridescent Rainbow Specular Glint Sheen */}
        <div
          style={{
            opacity: glint.opacity,
            background: `radial-gradient(circle 350px at ${glint.x}% ${glint.y}%, rgba(255, 255, 255, 0.45) 0%, rgba(251, 113, 133, 0.3) 25%, rgba(192, 132, 252, 0.3) 50%, rgba(251, 146, 60, 0.2) 75%, transparent 100%)`,
            transition: isHovered ? 'opacity 0.2s ease-out' : 'opacity 0.6s ease-out',
          }}
          className="pointer-events-none absolute inset-0 z-20 mix-blend-screen"
        />

        {/* Holographic foil diagonal sweep shimmer */}
        {isHovered && (
          <div
            style={{
              background:
                'linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.15) 30%, rgba(244,63,94,0.2) 40%, rgba(168,85,247,0.2) 50%, transparent 60%)',
            }}
            className="pointer-events-none absolute inset-0 z-20 animate-shimmer-glint opacity-75"
          />
        )}
      </div>
    </div>
  );
}
