"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, RoundedBox, Sparkles, Torus } from "@react-three/drei";
import type { Group, Mesh } from "three";

import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";

/* ── Pricing: a slow-rotating premium gem (value / plans) ───────────────── */
export function PricingGem() {
  const ref = useRef<Mesh>(null!);
  const reduce = usePrefersReducedMotion();
  useFrame((_, d) => {
    if (!reduce && ref.current) ref.current.rotation.y += d * 0.35;
  });
  return (
    <Float speed={reduce ? 0 : 1.4} rotationIntensity={0.4} floatIntensity={0.9}>
      <mesh ref={ref}>
        <icosahedronGeometry args={[1.35, 0]} />
        <MeshDistortMaterial
          color="#6d8bff"
          emissive="#3722c9"
          emissiveIntensity={0.5}
          roughness={0.12}
          metalness={0.65}
          distort={0.28}
          speed={reduce ? 0 : 2}
        />
      </mesh>
      <mesh scale={1.34}>
        <icosahedronGeometry args={[1.35, 0]} />
        <meshBasicMaterial color="#a855f7" wireframe transparent opacity={0.22} />
      </mesh>
      <Sparkles count={36} scale={6} size={2.4} speed={reduce ? 0 : 0.4} color="#a855f7" />
    </Float>
  );
}

/* ── Company: a low-poly HQ tower (stacked floors) ──────────────────────── */
export function CompanyTower() {
  const g = useRef<Group>(null!);
  const reduce = usePrefersReducedMotion();
  useFrame((_, d) => {
    if (!reduce && g.current) g.current.rotation.y += d * 0.4;
  });
  const floors = [0, 1, 2, 3, 4];
  return (
    <Float speed={reduce ? 0 : 1.2} rotationIntensity={0.25} floatIntensity={0.7}>
      <group ref={g} position={[0, -0.2, 0]}>
        {floors.map((i) => (
          <RoundedBox
            key={i}
            args={[1.9 - i * 0.28, 0.5, 1.9 - i * 0.28]}
            radius={0.05}
            smoothness={3}
            position={[0, -1.1 + i * 0.55, 0]}
          >
            <meshStandardMaterial
              color={i % 2 ? "#4d7cfe" : "#7c5cff"}
              metalness={0.45}
              roughness={0.3}
              emissive="#16205c"
              emissiveIntensity={0.35}
            />
          </RoundedBox>
        ))}
        {/* glowing rooftop beacon */}
        <mesh position={[0, 1.55, 0]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshBasicMaterial color="#22d3ee" />
        </mesh>
      </group>
      <Sparkles count={28} scale={6} size={2} speed={reduce ? 0 : 0.3} color="#4d7cfe" />
    </Float>
  );
}

/* ── Candidate: a stylized person with a matching orbit ─────────────────── */
export function CandidateAvatar() {
  const g = useRef<Group>(null!);
  const orbit = useRef<Group>(null!);
  const reduce = usePrefersReducedMotion();
  useFrame((state, d) => {
    if (reduce) return;
    if (g.current) g.current.rotation.y += d * 0.5;
    if (orbit.current) orbit.current.rotation.z = state.clock.elapsedTime * 0.8;
  });
  return (
    <Float speed={reduce ? 0 : 1.3} rotationIntensity={0.3} floatIntensity={0.8}>
      <group ref={g}>
        {/* head */}
        <mesh position={[0, 0.85, 0]}>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial color="#b58bff" metalness={0.4} roughness={0.25} emissive="#5b21b6" emissiveIntensity={0.4} />
        </mesh>
        {/* body */}
        <mesh position={[0, -0.25, 0]}>
          <capsuleGeometry args={[0.5, 0.7, 8, 24]} />
          <meshStandardMaterial color="#7c5cff" metalness={0.4} roughness={0.3} emissive="#3b1f87" emissiveIntensity={0.35} />
        </mesh>
      </group>
      {/* orbiting match node + ring */}
      <group ref={orbit}>
        <Torus args={[1.5, 0.025, 16, 90]} rotation={[Math.PI / 2.2, 0, 0]}>
          <meshBasicMaterial color="#22d3ee" transparent opacity={0.5} />
        </Torus>
        <mesh position={[1.5, 0, 0]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshBasicMaterial color="#22d3ee" />
        </mesh>
      </group>
      <Sparkles count={30} scale={6} size={2.2} speed={reduce ? 0 : 0.35} color="#22d3ee" />
    </Float>
  );
}
