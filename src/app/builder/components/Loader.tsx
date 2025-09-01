import { useRef, useState, useEffect } from "react";
import { useSprings, a } from "@react-spring/three";
import { Billboard, Text } from "@react-three/drei";
import * as THREE from "three";

type HUDLoaderProps = {
  position?: [number, number, number];
};

const ringDefs = [
  { inner: 2.7, outer: 2.85, y: 0.8, isProgress: true },
  { inner: 2.8, outer: 2.85, y: 0.6 },
  { inner: 2.2, outer: 2.25, y: 0.2 },
  { inner: 1.6, outer: 1.65, y: -0.2 },
];

export default function HUDLoader({ position = [0, 0, 0] }: HUDLoaderProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev < 100 ? prev + 1 : 100));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const springs = useSprings(
    ringDefs.length,
    ringDefs.map((r, i) => ({
      from: { scale: 0, y: 0 },
      to: { scale: 1, y: r.y },
      delay: i * 150,
      config: { mass: 1, tension: 220, friction: 18 },
    }))
  );

  const adjustedPosition: [number, number, number] = [
    position[0],
    position[1] + 1,
    position[2],
  ];

  return (
    <group scale={0.5} ref={groupRef} position={adjustedPosition}>
      {springs.map((props, i) => {
        const def = ringDefs[i];
        return (
          <a.mesh
            key={i}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={props.scale}
            position-y={props.y}
          >
            {def.isProgress ? (
              <ringGeometry
                args={[
                  def.inner,
                  def.outer,
                  64,
                  1,
                  0,
                  (Math.PI * 2 * progress) / 100,
                ]}
              />
            ) : (
              <ringGeometry args={[def.inner, def.outer, 64]} />
            )}
            <meshBasicMaterial
              color={def.isProgress ? "#ffffff" : "#555"}
              transparent
              opacity={def.isProgress ? 1 : 0.4 - i * 0.1}
            />
          </a.mesh>
        );
      })}

      {/* Progress Number as Billboard */}
      <Billboard position={[0, 1.2, 0]} follow={true} lockX={false} lockY={false} lockZ={false}>
        <Text fontSize={0.6} color="#ffffff" anchorX="center" anchorY="middle">
          {progress}
        </Text>
      </Billboard>

      {/* Label as Billboard */}
      <Billboard position={[0, 0.6, 0]} follow={true} lockX={false} lockY={false} lockZ={false}>
        <Text fontSize={0.2} color="#aaaaaa" anchorX="center" anchorY="middle">
          PERCENT
        </Text>
      </Billboard>
    </group>
  );
}
