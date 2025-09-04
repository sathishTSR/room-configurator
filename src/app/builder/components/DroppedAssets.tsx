import { useBuilderStore } from "../store";
import React, { Suspense } from "react";
import { Gltf } from "@react-three/drei";
import HUDLoader from "./Loader";
import { ThreeEvent } from "@react-three/fiber";

function DroppedFurniture({
  asset,
}: {
  asset: {
    id: string;
    type: string;
    position: [number, number, number];
    rotation: [number, number, number];
    scale: [number, number, number];
  };
}) {
  const setSelectedAssetId = useBuilderStore((s) => s.setSelectedAssetId);
  const selectedAssetId = useBuilderStore((s) => s.selectedAssetId);

  const isSelected = selectedAssetId === asset.id;

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation(); // prevent click bubbling to scene
    setSelectedAssetId(asset.id);
  };

  let model = null;
  if (asset.type === "chair") {
    model = <Gltf src="/models/chair.glb" />;
  } else if (asset.type === "sofa") {
    model = <Gltf src="/models/sofa.glb" />;
  } else {
    model = (
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshNormalMaterial />
      </mesh>
    );
  }

  return (
    <group
      position={asset.position}
      rotation={asset.rotation}
      scale={asset.scale}
      onClick={handleClick}
    >
      {model}
      {isSelected && (
        <mesh>
          <boxGeometry args={[1.2, 1.2, 1.2]} />
          <meshBasicMaterial color="yellow" wireframe />
        </mesh>
      )}
    </group>
  );
}

function DroppedAssetsInner() {
  const droppedAssets = useBuilderStore((s) => s.droppedAssets);
  return (
    <>
      {droppedAssets.map((asset) => (
        <Suspense
          key={asset.id}
          fallback={<HUDLoader position={asset.position} />}
        >
          <DroppedFurniture asset={asset} />
        </Suspense>
      ))}
    </>
  );
}

export default function DroppedAssets() {
  return <DroppedAssetsInner />;
}
