import { useBuilderStore } from "../store";
import React, { Suspense, useRef, useEffect, useState } from "react";
import { Gltf } from "@react-three/drei";
import HUDLoader from "./Loader";
import { ThreeEvent } from "@react-three/fiber";
import { Box3, Vector3, Group } from "three";

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

  const groupRef = useRef<Group>(null);
  const [boxSize, setBoxSize] = useState<[number, number, number]>([1, 1, 1]);

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation(); // prevent bubbling to outer plane
    setSelectedAssetId(asset.id);
  };

  // Measure bounding box when selected
  useEffect(() => {
    if (groupRef.current && isSelected) {
      const box = new Box3().setFromObject(groupRef.current);
      const size = new Vector3();
      box.getSize(size);
      setBoxSize([size.x * 1.1, size.y * 1.1, size.z * 1.1]); // add 10% padding
    }
  }, [isSelected]);

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
      ref={groupRef}
      position={asset.position}
      rotation={asset.rotation}
      scale={asset.scale}
      onClick={handleClick}
    >
      {model}
      {isSelected && (
        <mesh>
          <boxGeometry args={boxSize} />
          <meshBasicMaterial color="yellow" wireframe />
        </mesh>
      )}
    </group>
  );
}

function DroppedAssetsInner() {
  const droppedAssets = useBuilderStore((s) => s.droppedAssets);
  const setSelectedAssetId = useBuilderStore((s) => s.setSelectedAssetId);

  const handleOuterClick = () => {
    setSelectedAssetId(null);
  };

  return (
    <>
      {/* Invisible ground plane to catch clicks */}
      <mesh
        position={[0, -0.01, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        onClick={handleOuterClick}
      >
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

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
