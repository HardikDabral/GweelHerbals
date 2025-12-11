"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { DirectionalLight, PointLight, AmbientLight } from "three";
import { use3DStore } from "@/lib/store/use3DStore";

interface LightsProps {
  mousePosition?: [number, number];
  intensity?: number;
}

export function Lights({ mousePosition = [0, 0], intensity = 1 }: LightsProps) {
  const directionalLightRef = useRef<DirectionalLight>(null);
  const { reducedMotion } = use3DStore();

  useFrame(() => {
    if (directionalLightRef.current && !reducedMotion) {
      // Subtle light movement based on mouse position
      directionalLightRef.current.position.x = mousePosition[0] * 2;
      directionalLightRef.current.position.y = mousePosition[1] * 2 + 5;
    }
  });

  return (
    <>
      <ambientLight intensity={0.4 * intensity} />
      <directionalLight
        ref={directionalLightRef}
        position={[0, 5, 5]}
        intensity={0.8 * intensity}
        castShadow
      />
      <pointLight position={[-5, 5, -5]} intensity={0.3 * intensity} />
      <pointLight position={[5, 5, -5]} intensity={0.3 * intensity} />
    </>
  );
}

