"use client";

import { Physics } from "@react-three/cannon";
import { use3DStore } from "@/lib/store/use3DStore";

interface PhysicsProviderProps {
  children: React.ReactNode;
  gravity?: [number, number, number];
  enabled?: boolean;
}

export function PhysicsProvider({ 
  children, 
  gravity = [0, -9.81, 0],
  enabled = true 
}: PhysicsProviderProps) {
  const { is3DEnabled, reducedMotion } = use3DStore();

  if (!enabled || !is3DEnabled || reducedMotion) {
    return <>{children}</>;
  }

  return (
    <Physics gravity={gravity} defaultContactMaterial={{ friction: 0.4, restitution: 0.3 }}>
      {children}
    </Physics>
  );
}

