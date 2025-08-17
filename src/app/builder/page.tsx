"use client";
import { useState, useRef, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import styles from "./builder.module.scss";
import { Environment, OrbitControls } from "@react-three/drei";
import Sidebar from "./components/Sidebar/Sidebar";
import { useBuilderStore } from "./store";
import * as THREE from "three";
import Wall from "./components/Wall";
import { a, useSpring } from "@react-spring/three";

function DroppedAssets() {
  const droppedAssets = useBuilderStore((s) => s.droppedAssets);
  return (
    <>
      {droppedAssets.map((asset, i) => (
        <DroppedFurniture key={i} position={asset.position} />
      ))}
    </>
  );
}

function DroppedFurniture({
  position,
}: {
  position: [number, number, number];
}) {
  return (
    <mesh position={position}>
      <boxGeometry args={[1, 1, 1]} />
      <meshNormalMaterial />
    </mesh>
  );
}

function PreviewBox({
  droppingAsset,
  addDroppedAsset,
  setDroppingAsset,
}: {
  droppingAsset: { position: [number, number, number]; type: string } | null;
  addDroppedAsset: (asset: {
    type: string;
    position: [number, number, number];
  }) => void;
  setDroppingAsset: (
    asset: { position: [number, number, number]; type: string } | null
  ) => void;
}) {
  const previewPosition = useBuilderStore((s) => s.previewPosition);
  const draggingAsset = useBuilderStore((s) => s.draggingAsset);

  const { scale } = useSpring({
    to: { scale: droppingAsset ? [0, 0, 0] : [1, 1, 1] },
    from: { scale: [1, 1, 1] },
    config: { tension: 220, friction: 16 },
    onRest: () => {
      if (droppingAsset) {
        addDroppedAsset(droppingAsset);
        setDroppingAsset(null);
      }
    },
  });

  const position = droppingAsset ? droppingAsset.position : previewPosition;

  if (!position || (!draggingAsset && !droppingAsset)) return null;

  return (
    <a.mesh position={position} scale={scale as any} visible={!!position}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color="#6a82fb" opacity={0.5} transparent />
    </a.mesh>
  );
}

export default function Builder() {
  const [droppingAsset, setDroppingAsset] = useState<{
    position: [number, number, number];
    type: string;
  } | null>(null);
  const setPreviewPosition = useBuilderStore((s) => s.setPreviewPosition);
  const addDroppedAsset = useBuilderStore((s) => s.addDroppedAsset);
  const draggingAsset = useBuilderStore((s) => s.draggingAsset);
  const clearDragState = useBuilderStore((s) => s.clearDragState);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Helper: get intersection with ground plane
  const getPlaneIntersection = useCallback(
    (event: React.DragEvent | DragEvent) => {
      const { clientX, clientY } = event;
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return null;
      const x = ((clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((clientY - rect.top) / rect.height) * 2 + 1;
      const camera = (window as any)._canvasCamera as THREE.Camera;
      if (!camera) return null;
      const mouse = new THREE.Vector2(x, y);
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);
      const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0); // y=0
      const intersection = new THREE.Vector3();
      raycaster.ray.intersectPlane(plane, intersection);

      // Clamp the intersection point to be within the walls
      const halfWidth = 4.5;
      const halfDepth = 4.5;
      intersection.x = Math.max(
        -halfWidth,
        Math.min(halfWidth, intersection.x)
      );
      intersection.z = Math.max(
        -halfDepth,
        Math.min(halfDepth, intersection.z)
      );

      return [intersection.x, 0.5, intersection.z] as [number, number, number];
    },
    []
  );

  // Canvas event handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    const pos = getPlaneIntersection(e);
    if (pos) setPreviewPosition(pos);
  };
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    const pos = getPlaneIntersection(e);
    if (pos) setPreviewPosition(pos);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const pos = getPlaneIntersection(e);
    if (pos && draggingAsset) {
      setDroppingAsset({ type: draggingAsset, position: pos });
    }
    clearDragState();
  };

  // Provide camera/scene refs for intersection math
  function CanvasWithRefs(props: { children: React.ReactNode }) {
    const { camera } = useThree();
    useFrame(() => {
      (window as any)._canvasCamera = camera;
    });
    return <>{props.children}</>;
  }

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Sidebar />
      {/* Canvas always fills the space */}
      <div
        className={styles.canvas}
        style={{
          height: "100%",
          width: "100%",
          position: "absolute",
          top: 0,
          left: 0,
        }}
        ref={canvasRef}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDrop={handleDrop}
      >
        <Canvas camera={{ position: [0, 3, 5] }}>
          <CanvasWithRefs>
            <Environment preset="city" />
            <Wall />
            <DroppedAssets />
            <PreviewBox
              droppingAsset={droppingAsset}
              addDroppedAsset={addDroppedAsset}
              setDroppingAsset={setDroppingAsset}
            />
            <OrbitControls />
          </CanvasWithRefs>
        </Canvas>
      </div>
    </div>
  );
}
