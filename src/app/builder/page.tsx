"use client";
import { useState, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import styles from "./builder.module.scss";
import Sidebar from "./ui/Sidebar/Sidebar";
import { useBuilderStore } from "./store";
import Wall from "./components/Wall";
import DroppedAssets from "./components/DroppedAssets";
import { usePlaneIntersection } from "./functions/usePlaneIntersection";
import CanvasWithRefs from "./components/scene/CanvasWithRefs";
import PreviewBox from "./components/scene/PreviewBox";
import RightSidebar from "./ui/SidebarRight/RightSidebar";

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
  const getPlaneIntersection = usePlaneIntersection(canvasRef as React.RefObject<HTMLDivElement>);

  // Canvas drag handlers
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
      <RightSidebar />
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
        <Canvas camera={{ position: [-9.194, 12.056, 14.559], fov: 30 }}>
          <CanvasWithRefs>
            <Environment files={["/hdr/indoor.hdr"]} />
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
