import { useBuilderStore } from "../store";
import React, { Suspense, useRef, useEffect, useState, forwardRef } from "react";
import { Gltf, TransformControls } from "@react-three/drei";
import HUDLoader from "./Loader";
import { ThreeEvent } from "@react-three/fiber";
import { Box3, Vector3, Group } from "three";

const DroppedFurniture = forwardRef<Group, {
  asset: {
    id: string;
    type: string;
    position: [number, number, number];
    rotation: [number, number, number];
    scale: [number, number, number];
  };
}>(({ asset }, ref) => {
  const setSelectedAssetId = useBuilderStore((s) => s.setSelectedAssetId);


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
      ref={ref}
      position={asset.position}
      rotation={asset.rotation}
      scale={asset.scale}
      onClick={(e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation(); // prevent bubbling to outer plane
        if (e.delta <= 0) {
          console.log('asset clicked');
          setSelectedAssetId(asset.id);
        }
      }}
    >
      {model}
    </group>
  );
});

DroppedFurniture.displayName = 'DroppedFurniture';

function DroppedAssetsInner() {
  const droppedAssets = useBuilderStore((s) => s.droppedAssets);
  const selectedAssetId = useBuilderStore((s) => s.selectedAssetId);
  const setSelectedAssetId = useBuilderStore((s) => s.setSelectedAssetId);
  const updateSelectedAsset = useBuilderStore((s) => s.updateSelectedAsset);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const transformRef = useRef<any>(null);
  const selectedAssetRef = useRef<Group>(null);
  const [boxSize, setBoxSize] = useState<[number, number, number]>([1, 1, 1]);

  // Handle transform changes only when user interaction ends
  const handleTransformEnd = () => {
    if (selectedAssetRef.current && selectedAssetId) {
      const position = selectedAssetRef.current.position.toArray() as [number, number, number];
      const rotation = selectedAssetRef.current.rotation.toArray().slice(0, 3) as [number, number, number];
      const scale = selectedAssetRef.current.scale.toArray() as [number, number, number];
      
      updateSelectedAsset({
        position,
        rotation,
        scale,
      });
    }
  };

  // Measure bounding box when selected asset changes
  useEffect(() => {
    if (selectedAssetRef.current && selectedAssetId) {
      const box = new Box3().setFromObject(selectedAssetRef.current);
      const size = new Vector3();
      box.getSize(size);
      setBoxSize([size.x * 1.1, size.y * 1.1, size.z * 1.1]); // add 10% padding
    }
  }, [selectedAssetId]);

  // Get the selected asset
  const selectedAsset = droppedAssets.find(asset => asset.id === selectedAssetId);

  return (
    <>
      {/* Invisible ground plane to catch clicks */}
      <mesh
        position={[0, -0.01, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        onClick={(event) => {
          event.stopPropagation(); // prevent bubbling to outer plane
          if (event.delta <= 0) {
            console.log('plane clicked');
            setSelectedAssetId(null);
          }
        }}
      >
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {droppedAssets.map((asset) => (
        <Suspense
          key={asset.id}
          fallback={<HUDLoader position={asset.position} />}
        >
          <DroppedFurniture 
            ref={asset.id === selectedAssetId ? selectedAssetRef : undefined}
            asset={asset} 
          />
        </Suspense>
      ))}

      {/* Transform Controls for selected asset */}
      {selectedAsset && selectedAssetRef.current && (
        <TransformControls
          ref={transformRef}
          object={selectedAssetRef.current}
          mode="translate"
          onMouseUp={handleTransformEnd}
          size={0.7}
        />
      )}
    </>
  );
}

export default function DroppedAssets() {
  return <DroppedAssetsInner />;
}
