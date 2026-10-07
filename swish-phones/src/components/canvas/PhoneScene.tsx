'use client';

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Environment, Float } from '@react-three/drei';
import { PhoneMesh } from './PhoneMesh';

export interface PhoneSceneProps {
  color?: string;
  conditionGrade?: 'PRISTINE' | 'GOOD' | 'FAIR';
  explodeFactor?: number;
  rotation?: [number, number, number];
  enableOrbit?: boolean;
  autoRotate?: boolean;
  floating?: boolean;
  cameraPosition?: [number, number, number];
  scale?: number;
}

export function PhoneScene({
  color = '#8e8d89',
  conditionGrade = 'PRISTINE',
  explodeFactor = 0,
  rotation = [0, 0, 0],
  enableOrbit = true,
  autoRotate = false,
  floating = false,
  cameraPosition = [0, 0, 8.5],
  scale = 1,
}: PhoneSceneProps) {
  return (
    <div className="relative w-full h-full min-h-[360px] flex items-center justify-center">
      <Canvas
        camera={{ position: cameraPosition, fov: 45 }}
        dpr={[1, 1.8]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        className="cursor-grab active:cursor-grabbing"
      >
        <Suspense fallback={null}>
          {/* Studio Lighting Setup */}
          <ambientLight intensity={0.7} />
          <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow />
          <directionalLight position={[-10, -10, -5]} intensity={0.5} />
          <pointLight position={[0, 5, 2]} intensity={0.8} color="#e0f2fe" />

          {/* Environment Reflections */}
          <Environment preset="city" />

          {/* Model with optional floating physics */}
          {floating ? (
            <Float speed={2} rotationIntensity={0.3} floatIntensity={0.4}>
              <PhoneMesh
                color={color}
                conditionGrade={conditionGrade}
                explodeFactor={explodeFactor}
                rotation={rotation}
                scale={scale}
              />
            </Float>
          ) : (
            <PhoneMesh
              color={color}
              conditionGrade={conditionGrade}
              explodeFactor={explodeFactor}
              rotation={rotation}
              scale={scale}
            />
          )}

          {/* Ground Soft Contact Shadow */}
          <ContactShadows
            position={[0, -3.2, 0]}
            opacity={0.65}
            scale={10}
            blur={2.4}
            far={4}
            color="#000000"
          />

          {/* Camera Controls */}
          {enableOrbit && (
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              autoRotate={autoRotate}
              autoRotateSpeed={1.5}
              minPolarAngle={Math.PI / 4}
              maxPolarAngle={Math.PI / 1.5}
            />
          )}
        </Suspense>
      </Canvas>
    </div>
  );
}
