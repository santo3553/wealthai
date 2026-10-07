'use client';

import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

export interface PhoneMeshProps {
  color?: string;
  conditionGrade?: 'PRISTINE' | 'GOOD' | 'FAIR';
  explodeFactor?: number; // 0 to 1
  rotation?: [number, number, number];
  scale?: number;
  interactive?: boolean;
}

export function PhoneMesh({
  color = '#8e8d89', // Natural titanium default
  conditionGrade = 'PRISTINE',
  explodeFactor = 0,
  rotation = [0, 0, 0],
  scale = 1,
}: PhoneMeshProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Dynamic wear and roughness based on cosmetic condition
  const { frameRoughness, frameMetalness, scuffBumpScale } = useMemo(() => {
    switch (conditionGrade) {
      case 'FAIR':
        return { frameRoughness: 0.52, frameMetalness: 0.65, scuffBumpScale: 0.08 };
      case 'GOOD':
        return { frameRoughness: 0.35, frameMetalness: 0.8, scuffBumpScale: 0.03 };
      case 'PRISTINE':
      default:
        return { frameRoughness: 0.18, frameMetalness: 0.92, scuffBumpScale: 0.0 };
    }
  }, [conditionGrade]);

  // Screen canvas texture: dynamic lock screen UI
  const screenTexture = useMemo(() => {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Wallpaper gradient
      const grad = ctx.createLinearGradient(0, 0, 512, 1024);
      grad.addColorStop(0, '#0f172a');
      grad.addColorStop(0.5, '#1e1b4b');
      grad.addColorStop(1, '#052e16');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 1024);

      // Dynamic Island / Pill
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.roundRect(196, 40, 120, 36, 18);
      ctx.fill();

      // Camera dot
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(220, 58, 8, 0, Math.PI * 2);
      ctx.fill();

      // Time
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 84px -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('09:41', 256, 260);

      // Date
      ctx.font = '32px -apple-system, sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('Wednesday, October 7', 256, 320);

      // Certified badge
      ctx.fillStyle = 'rgba(34, 197, 94, 0.15)';
      ctx.beginPath();
      ctx.roundRect(86, 600, 340, 80, 24);
      ctx.fill();
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#4ade80';
      ctx.font = 'bold 28px -apple-system, sans-serif';
      ctx.fillText('⚡ 100% CERTIFIED USED', 256, 650);

      // Battery status
      ctx.font = '24px -apple-system, sans-serif';
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText('Diagnostic Health: Verified', 256, 730);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, []);

  // Internal Logic Board Texture
  const chipTexture = useMemo(() => {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Circuit board green/dark base
      ctx.fillStyle = '#0a1912';
      ctx.fillRect(0, 0, 512, 512);

      // Copper trace lines
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 2;
      for (let i = 20; i < 500; i += 30) {
        ctx.beginPath();
        ctx.moveTo(i, 20);
        ctx.lineTo(i + 40, 256);
        ctx.lineTo(i, 480);
        ctx.stroke();
      }

      // Processor Chip die in center
      ctx.fillStyle = '#18181b';
      ctx.fillRect(156, 156, 200, 200);
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 3;
      ctx.strokeRect(156, 156, 200, 200);

      // Chip branding
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 28px -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('A17 PRO', 256, 240);
      ctx.font = '18px -apple-system, sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('3nm 6-CORE GPU', 256, 280);
      ctx.fillText('NEURAL ENGINE', 256, 310);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, []);

  // Smooth breathing animation if not exploding
  useFrame((state) => {
    if (groupRef.current && explodeFactor === 0) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.06;
    }
  });

  // Displacement offsets for exploded view
  const screenZ = 0.18 + explodeFactor * 0.9;
  const chipZ = -0.05 - explodeFactor * 0.5;
  const batteryZ = -0.1 - explodeFactor * 0.9;
  const backGlassZ = -0.18 - explodeFactor * 1.4;

  return (
    <group
      ref={groupRef}
      rotation={new THREE.Euler(...rotation)}
      scale={scale}
      dispose={null}
    >
      {/* 1. MAIN CHASSIS / FRAME */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[2.8, 5.8, 0.32]} />
        <meshStandardMaterial
          color={color}
          roughness={frameRoughness}
          metalness={frameMetalness}
          bumpScale={scuffBumpScale}
        />
      </mesh>

      {/* 2. FRONT OLED DISPLAY GLASS */}
      <group position={[0, 0, screenZ]}>
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[2.62, 5.58]} />
          {screenTexture ? (
            <meshBasicMaterial map={screenTexture} toneMapped={false} />
          ) : (
            <meshStandardMaterial color="#09090b" roughness={0.1} />
          )}
        </mesh>
        {/* Bezel frame */}
        <mesh position={[0, 0, -0.01]}>
          <planeGeometry args={[2.7, 5.68]} />
          <meshBasicMaterial color="#000000" />
        </mesh>
      </group>

      {/* 3. EXPLODED LAYER: LOGIC BOARD & CHIP */}
      {explodeFactor > 0.05 && (
        <group position={[0, 0.8, chipZ]}>
          <mesh>
            <boxGeometry args={[2.2, 2.2, 0.04]} />
            {chipTexture ? (
              <meshStandardMaterial map={chipTexture} roughness={0.4} metalness={0.7} />
            ) : (
              <meshStandardMaterial color="#1e293b" />
            )}
          </mesh>
        </group>
      )}

      {/* 4. EXPLODED LAYER: CERTIFIED BATTERY PACK */}
      {explodeFactor > 0.05 && (
        <group position={[0, -1.1, batteryZ]}>
          <mesh>
            <boxGeometry args={[2.1, 2.8, 0.06]} />
            <meshStandardMaterial color="#18181b" roughness={0.6} metalness={0.3} />
          </mesh>
          {/* MagSafe copper induction coil */}
          <mesh position={[0, 0, -0.04]}>
            <torusGeometry args={[0.75, 0.06, 16, 48]} />
            <meshStandardMaterial color="#b45309" roughness={0.3} metalness={0.9} />
          </mesh>
        </group>
      )}

      {/* 5. BACK GLASS & CAMERA ISLAND */}
      <group position={[0, 0, backGlassZ]}>
        {/* Back Matte Glass */}
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[2.7, 5.7]} />
          <meshPhysicalMaterial
            color={color}
            roughness={frameRoughness + 0.15}
            metalness={0.2}
            clearcoat={0.9}
            clearcoatRoughness={0.1}
          />
        </mesh>

        {/* Camera Bump Island */}
        <mesh position={[-0.55, 1.9, -0.05]}>
          <boxGeometry args={[1.3, 1.4, 0.1]} />
          <meshStandardMaterial color={color} roughness={0.2} metalness={0.8} />
        </mesh>

        {/* Triple Camera Lenses */}
        {/* Lens 1 (Top Left) */}
        <mesh position={[-0.8, 2.2, -0.14]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.24, 0.24, 0.08, 32]} />
          <meshStandardMaterial color="#09090b" roughness={0.1} metalness={0.95} />
        </mesh>
        <mesh position={[-0.8, 2.2, -0.18]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.16, 0.16, 0.02, 32]} />
          <meshBasicMaterial color="#1e3a8a" />
        </mesh>

        {/* Lens 2 (Bottom Left) */}
        <mesh position={[-0.8, 1.6, -0.14]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.24, 0.24, 0.08, 32]} />
          <meshStandardMaterial color="#09090b" roughness={0.1} metalness={0.95} />
        </mesh>
        <mesh position={[-0.8, 1.6, -0.18]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.16, 0.16, 0.02, 32]} />
          <meshBasicMaterial color="#1e3a8a" />
        </mesh>

        {/* Lens 3 (Right Center Telephoto) */}
        <mesh position={[-0.3, 1.9, -0.14]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.24, 0.24, 0.08, 32]} />
          <meshStandardMaterial color="#09090b" roughness={0.1} metalness={0.95} />
        </mesh>
        <mesh position={[-0.3, 1.9, -0.18]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.16, 0.16, 0.02, 32]} />
          <meshBasicMaterial color="#1e3a8a" />
        </mesh>

        {/* TrueTone Flash */}
        <mesh position={[-0.3, 2.3, -0.11]}>
          <circleGeometry args={[0.09, 32]} />
          <meshBasicMaterial color="#fef08a" />
        </mesh>

        {/* LiDAR Dot */}
        <mesh position={[-0.3, 1.5, -0.11]}>
          <circleGeometry args={[0.07, 32]} />
          <meshBasicMaterial color="#020617" />
        </mesh>
      </group>

      {/* 6. SIDE BUTTONS & PORTS */}
      {/* Power Button Right */}
      <mesh position={[1.42, 0.8, 0]}>
        <boxGeometry args={[0.04, 0.7, 0.06]} />
        <meshStandardMaterial color={color} metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Volume Up Left */}
      <mesh position={[-1.42, 1.0, 0]}>
        <boxGeometry args={[0.04, 0.45, 0.06]} />
        <meshStandardMaterial color={color} metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Volume Down Left */}
      <mesh position={[-1.42, 0.4, 0]}>
        <boxGeometry args={[0.04, 0.45, 0.06]} />
        <meshStandardMaterial color={color} metalness={0.9} roughness={0.2} />
      </mesh>
      {/* USB-C Port Bottom */}
      <mesh position={[0, -2.92, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.4, 0.04, 0.12]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
    </group>
  );
}
