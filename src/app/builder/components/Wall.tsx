import { useRef } from "react";
import * as THREE from "three";
import { useBuilderStore } from "../store";

export default function Room() {
  const wallRefs = useRef<THREE.Mesh[]>([]);
  const floorRef = useRef<THREE.Mesh>(null);
  const { width, depth, height } = useBuilderStore((s) => s.roomDimensions);

  const halfWidth = width / 2;
  const halfDepth = depth / 2;
  const halfHeight = height / 2;

  const walls = [
    {
      position: [0, halfHeight, -halfDepth], // back wall
      rotation: [0, 0, 0],
      size: [width, height],
      normal: new THREE.Vector3(0, 0, 1),
    },
    {
      position: [0, halfHeight, halfDepth], // front wall
      rotation: [0, Math.PI, 0],
      size: [width, height],
      normal: new THREE.Vector3(0, 0, -1),
    },
    {
      position: [-halfWidth, halfHeight, 0], // left wall
      rotation: [0, Math.PI / 2, 0],
      size: [depth, height],
      normal: new THREE.Vector3(1, 0, 0),
    },
    {
      position: [halfWidth, halfHeight, 0], // right wall
      rotation: [0, -Math.PI / 2, 0],
      size: [depth, height],
      normal: new THREE.Vector3(-1, 0, 0),
    },
  ];

  return (
    <group>
      {/* Walls */}
      {walls.map((wall, index) => (
        <mesh
          key={index}
          ref={(el) => {
            if (el) wallRefs.current[index] = el;
          }}
          position={wall.position as [number, number, number]}
          rotation={wall.rotation as [number, number, number]}
        >
          <planeGeometry args={wall.size as [number, number]} />
          <meshStandardMaterial color="#888" transparent opacity={1} />
        </mesh>
      ))}

      {/* Floor */}
      <mesh
        ref={floorRef}
        rotation={[-Math.PI / 2, 0, 0]} // flat on XZ
        position={[0, 0, 0]}
      >
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial color="#555" side={2} />
      </mesh>
    </group>
  );
}
