import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export default function Room() {
  const wallRefs = useRef<THREE.Mesh[]>([]);
  const floorRef = useRef<THREE.Mesh>(null);

  const walls = [
    {
      position: [0, 1.5, -5], // back wall
      rotation: [0, 0, 0],
      size: [10, 3],
      normal: new THREE.Vector3(0, 0, 1),
    },
    {
      position: [0, 1.5, 5], // front wall
      rotation: [0, Math.PI, 0],
      size: [10, 3],
      normal: new THREE.Vector3(0, 0, -1),
    },
    {
      position: [-5, 1.5, 0], // left wall
      rotation: [0, Math.PI / 2, 0],
      size: [10, 3],
      normal: new THREE.Vector3(1, 0, 0),
    },
    {
      position: [5, 1.5, 0], // right wall
      rotation: [0, -Math.PI / 2, 0],
      size: [10, 3],
      normal: new THREE.Vector3(-1, 0, 0),
    },
  ];

  useFrame(({ camera }) => {
    const cameraDirection = new THREE.Vector3();
    camera.getWorldDirection(cameraDirection);

    wallRefs.current.forEach((mesh, i) => {
      if (mesh) {
        const opacity = 1

        const material = mesh.material as THREE.MeshStandardMaterial;
        material.opacity = opacity;
        material.transparent = true;
        material.depthWrite = opacity > 0.5;
      }
    });
  });

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
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#555" />
      </mesh>
    </group>
  );
}
