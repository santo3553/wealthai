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

  // Generate 1400 particles with dual-chromatic Aurora Hyperpop palette
  const { positions, colors } = useMemo(() => {
    const count = 1400;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const coral = new THREE.Color('#f43f5e');   // Sunset Coral
    const peach = new THREE.Color('#f97316');   // Neon Peach
    const aurora = new THREE.Color('#a855f7');  // Aurora Violet
    const magenta = new THREE.Color('#ec4899'); // Electric Magenta

    for (let i = 0; i < count; i++) {
      // Cylindrical/spherical spread
      const radius = 5 + Math.random() * 24;
      const theta = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 26;

      positions[i * 3] = Math.cos(theta) * radius;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = Math.sin(theta) * radius;

      // Color variation across Aurora palette
      const rand = Math.random();
      const c =
        rand > 0.75
          ? coral
          : rand > 0.5
          ? peach
          : rand > 0.25
          ? aurora
          : magenta;

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
      pointsRef.current.rotation.y += delta * 0.045;
      pointsRef.current.rotation.x =
        mousePosition.current.y * 0.18 + Math.sin(state.clock.elapsedTime * 0.25) * 0.06;
      pointsRef.current.position.x = mousePosition.current.x * 0.9;
    }

    // Dynamic floating tech rings
    if (ringsRef.current) {
      ringsRef.current.rotation.z += delta * 0.04;
      ringsRef.current.rotation.y += delta * 0.06;
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
          size={0.09}
          vertexColors
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Floating Holographic Cyber Rings in Aurora tones */}
      <group ref={ringsRef} position={[0, -2, -10]}>
        <mesh rotation={[Math.PI / 3, 0, 0]}>
          <torusGeometry args={[9, 0.025, 16, 90]} />
          <meshBasicMaterial color="#f43f5e" transparent opacity={0.25} />
        </mesh>
        <mesh rotation={[-Math.PI / 4, Math.PI / 6, 0]}>
          <torusGeometry args={[13, 0.02, 16, 100]} />
          <meshBasicMaterial color="#a855f7" transparent opacity={0.22} />
        </mesh>
        <mesh rotation={[Math.PI / 6, -Math.PI / 4, 0]}>
          <torusGeometry args={[16, 0.018, 16, 100]} />
          <meshBasicMaterial color="#f97316" transparent opacity={0.18} />
        </mesh>
      </group>
    </>
  );
}

export function DynamicBackground3D() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#06070d]">
      {/* Gen-Z Aurora Hyperpop Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-[650px] h-[650px] bg-rose-600/12 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 right-1/4 w-[750px] h-[750px] bg-purple-600/15 rounded-full blur-[170px]" />
      <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[140px]" />

      {/* Interactive 3D WebGL Canvas */}
      <Canvas
        camera={{ position: [0, 0, 14], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: false, powerPreference: 'low-power' }}
      >
        <fog attach="fog" args={['#06070d', 8, 28]} />
        <ParticleGalaxy />
      </Canvas>
    </div>
  );
}
