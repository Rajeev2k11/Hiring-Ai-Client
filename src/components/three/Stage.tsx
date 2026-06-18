"use client";

import { Suspense, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";

import { useMounted } from "@/hooks/useMounted";
import { cn } from "@/lib/utils";

interface StageProps {
  children: ReactNode;
  className?: string;
  camera?: { position: [number, number, number]; fov?: number };
}

/**
 * Client-only R3F canvas. Renders a soft gradient placeholder during SSR / before
 * mount so there are no hydration issues and the 3D chunk loads lazily.
 */
export function Stage({ children, className, camera }: StageProps) {
  const mounted = useMounted();

  return (
    <div className={cn("relative", className)}>
      {/* ambient glow that sits behind the canvas */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-3/4 w-3/4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-electric/20 blur-[80px]" />
      {!mounted ? (
        <div className="absolute inset-0 grid place-items-center">
          <div className="h-28 w-28 animate-pulse rounded-full bg-brand-gradient opacity-40 blur-xl" />
        </div>
      ) : (
        <Canvas
          className="!absolute inset-0"
          dpr={[1, 1.6]}
          camera={{ position: camera?.position ?? [0, 0, 5], fov: camera?.fov ?? 45 }}
          gl={{ antialias: true, alpha: true }}
        >
          <ambientLight intensity={0.7} />
          <directionalLight position={[4, 6, 5]} intensity={1.4} />
          <pointLight position={[-5, -3, -4]} intensity={30} color="#a855f7" />
          <pointLight position={[5, 2, 4]} intensity={20} color="#4d7cfe" />
          <Suspense fallback={null}>{children}</Suspense>
        </Canvas>
      )}
    </div>
  );
}
