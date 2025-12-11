"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh, Vector3 } from "three";
import { useBox } from "@react-three/cannon";
import { Text } from "@react-three/drei";

interface PodiumProps {
  position: [number, number, number];
  label: string;
  isSelected?: boolean;
  onClick?: () => void;
}

export function Podium({ position, label, isSelected, onClick }: PodiumProps) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<Mesh>(null);

  const [ref] = useBox(() => ({
    mass: 0,
    position,
    args: [1.5, 0.5, 1.5],
    type: "Static",
  }));

  useFrame((state) => {
    if (meshRef.current) {
      const scale = isSelected ? 1.2 : hovered ? 1.1 : 1;
      meshRef.current.scale.lerp(new Vector3(scale, scale, scale), 0.1);
      
      // Gentle floating animation
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.1;
    }
  });

  return (
    <group
      ref={ref}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={onClick}
    >
      {/* Podium base */}
      <mesh ref={meshRef} castShadow receiveShadow>
        <boxGeometry args={[1.5, 0.5, 1.5]} />
        <meshStandardMaterial
          color={isSelected ? "#ff6b6b" : hovered ? "#4ecdc4" : "#6c5ce7"}
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>

      {/* Podium top */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <cylinderGeometry args={[0.8, 0.8, 0.1, 32]} />
        <meshStandardMaterial
          color={isSelected ? "#ff8787" : "#8b7fd4"}
          metalness={0.5}
          roughness={0.3}
        />
      </mesh>

      {/* Label */}
      <Text
        position={[0, 1, 0]}
        fontSize={0.3}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>
    </group>
  );
}

