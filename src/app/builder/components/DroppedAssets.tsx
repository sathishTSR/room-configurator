import { useBuilderStore } from "../store";
import React, { Suspense } from "react";
import { Gltf, useProgress } from "@react-three/drei";
import HUDLoader from "./Loader";




function DroppedFurniture({
  type,
  position,
}: {
  type: string;
  position: [number, number, number];
}) {
  if (type === "chair") {
    return <Gltf src="/models/chair.glb" position={position} scale={[1, 1, 1]} />;
  }
  if (type === "sofa") {
    return <Gltf src="/models/sofa.glb" position={position} scale={[1, 1, 1]} />;
  }
  // fallback for unknown types
  return (
    <mesh position={position}>
      <boxGeometry args={[1, 1, 1]} />
      <meshNormalMaterial />
    </mesh>
  );
}

function DroppedAssetsInner() {
  const droppedAssets = useBuilderStore((s) => s.droppedAssets);
  return (
    <>
      {droppedAssets.map((asset, i) => (
        <Suspense key={i} fallback={<HUDLoader position={asset.position} />}>
          <DroppedFurniture type={asset.type === "bed" ? "sofa" : asset.type} position={asset.position} />
        </Suspense>
      ))}
    </>
  );
}

export default function DroppedAssets() {
  return <DroppedAssetsInner />;
}
