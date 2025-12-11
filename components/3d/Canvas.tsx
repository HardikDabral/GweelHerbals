"use client";

import { Canvas as R3FCanvas } from "@react-three/fiber";
import { Suspense } from "react";
import { use3DStore } from "@/lib/store/use3DStore";
import { useReducedMotion } from "@/lib/hooks/useWebGLSupport";

interface CanvasProps {
  children: React.ReactNode;
  className?: string;
  fallback?: React.ReactNode;
  performance?: "low" | "medium" | "high";
}

export function Canvas({ children, className, fallback, performance = "high" }: CanvasProps) {
  const { is3DEnabled, isWebGLSupported } = use3DStore();
  const reducedMotion = useReducedMotion();

  if (!isWebGLSupported || !is3DEnabled) {
    return <>{fallback}</>;
  }

  const dpr = performance === "low" ? 1 : performance === "medium" ? 1.5 : 2;

  return (
    <div className={className}>
      <R3FCanvas
        dpr={dpr}
        gl={{
          antialias: performance !== "low",
          alpha: true,
          powerPreference: performance === "low" ? "low-power" : "high-performance",
        }}
        camera={{ position: [0, 0, 5], fov: 50 }}
      >
        <Suspense fallback={null}>
          {children}
        </Suspense>
      </R3FCanvas>
    </div>
  );
}

