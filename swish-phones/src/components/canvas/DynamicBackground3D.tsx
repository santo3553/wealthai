'use client';

import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function ParticleGalaxy() {
  const pointsRef = useRef<THREE.Points>(null);
  const ringsRef = useRef<THREE.Group>(null);
  const mousePosition = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  // Listen to mousemove for smooth 3D camera parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.current.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      mousePosition.current.targetY = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Generate 1500 particles with colors
  const { positions, colors } = useMemo(() => {
    const count = 1200;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const emerald = new THREE.Color('#10b981');
    const cyan = new THREE.Color('#06b6d4');
    const darkSlate = new THREE.Color('#334155');

    for (let i = 0; i < count; i++) {
      // Cylindrical/spherical spread
      const radius = 6 + Math.random() * 22;
      const theta = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 24;

      positions[i * 3] = Math.cos(theta) * radius;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = Math.sin(theta) * radius;

      // Color variation
      const rand = Math.random();
      const c = rand > 0.6 ? emerald : rand > 0.3 ? cyan : darkSlate;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    return { positions, colors };
  }, []);

  useFrame((state, delta) => {
    // Smooth mouse inertia damping
    mousePosition.current.x +=
      (mousePosition.current.targetX - mousePosition.current.x) * 0.05;
    mousePosition.current.y +=
      (mousePosition.current.targetY - mousePosition.current.y) * 0.05;

    // Slow ambient rotation of galaxy
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.04;
      pointsRef.current.rotation.x =
        mousePosition.current.y * 0.15 + Math.sin(state.clock.elapsedTime * 0.2) * 0.05;
      pointsRef.current.position.x = mousePosition.current.x * 0.8;
    }

    // Gentle floating tech rings
    if (ringsRef.current) {
      ringsRef.current.rotation.z += delta * 0.03;
      ringsRef.current.rotation.y += delta * 0.05;
    }
  });

  return (
    <>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[colors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.085}
          vertexColors
          transparent
          opacity={0.7}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Floating Holographic Cyber Rings in deep space */}
      <group ref={ringsRef} position={[0, -2, -10]}>
        <mesh rotation={[Math.PI / 3, 0, 0]}>
          <torusGeometry args={[9, 0.02, 16, 80]} />
          <meshBasicMaterial color="#10b981" transparent opacity={0.15} />
        </mesh>
        <mesh rotation={[-Math.PI / 4, Math.PI / 6, 0]}>
          <torusGeometry args={[14, 0.015, 16, 90]} />
          <meshBasicMaterial color="#06b6d4" transparent opacity={0.12} />
        </mesh>
      </group>
    </>
  );
}

export function DynamicBackground3D() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#09090b]">
      {/* Deep Cyber Radial Gradients */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[140px]" />
      <div className="absolute bottom-0 right-1/4 w-[700px] h-[700px] bg-cyan-600/10 rounded-full blur-[160px]" />

      {/* Interactive 3D WebGL Canvas */}
      <Canvas
        camera={{ position: [0, 0, 14], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: false, powerPreference: 'low-power' }}
      >
        <fog attach="fog" args={['#09090b', 8, 26]} />
        <ParticleGalaxy />
      </Canvas>
    </div>
  );
}
