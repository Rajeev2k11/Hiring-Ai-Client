"use client";

import { useEffect, useRef } from "react";
import createGlobe from "cobe";

import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";

/** Live locations rendered as markers on the globe. */
export const GLOBE_MARKERS: { location: [number, number]; size: number }[] = [
  { location: [28.6139, 77.209], size: 0.1 }, // India · New Delhi
  { location: [25.2048, 55.2708], size: 0.09 }, // UAE · Dubai
  { location: [51.5074, -0.1278], size: 0.09 }, // UK · London
  { location: [1.3521, 103.8198], size: 0.08 }, // Singapore
  { location: [37.7749, -122.4194], size: 0.1 }, // USA · San Francisco
  { location: [40.7128, -74.006], size: 0.08 }, // USA · New York
  { location: [52.52, 13.405], size: 0.07 }, // Germany · Berlin
  { location: [-33.8688, 151.2093], size: 0.07 }, // Australia · Sydney
];

export function Globe({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phi = useRef(0);
  const widthRef = useRef(0);
  const reduce = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onResize = () => {
      widthRef.current = canvas.offsetWidth;
    };
    window.addEventListener("resize", onResize);
    onResize();

    const globe = createGlobe(canvas, {
      devicePixelRatio: 2,
      width: widthRef.current * 2,
      height: widthRef.current * 2,
      phi: 0,
      theta: 0.22,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.16, 0.18, 0.36],
      markerColor: [0.45, 0.55, 1],
      glowColor: [0.45, 0.32, 0.9],
      markers: GLOBE_MARKERS,
      onRender: (state) => {
        if (!reduce) phi.current += 0.004;
        state.phi = phi.current;
        state.width = widthRef.current * 2;
        state.height = widthRef.current * 2;
      },
    });

    return () => {
      globe.destroy();
      window.removeEventListener("resize", onResize);
    };
  }, [reduce]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("aspect-square w-full max-w-[520px]", className)}
      style={{ contain: "layout paint size" }}
    />
  );
}
