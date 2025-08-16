"use client";
import { useState, useRef, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import styles from "./builder.module.scss";
import { OrbitControls } from "@react-three/drei";
import Sidebar from "./components/Sidebar";
import { useBuilderStore } from "./store";
import * as THREE from "three";
import { a, useSpring, useChain, useSpringRef } from "@react-spring/three";

const SIDEBAR_WIDTH = 280;

function DroppedAssets() {
  const droppedAssets = useBuilderStore((s) => s.droppedAssets);
  return (
    <>
      {droppedAssets.map((asset, i) => (
        <AnimatedDroppedFurniture key={i} position={asset.position} />
      ))}
    </>
  );
}

function AnimatedDroppedFurniture({ position }: { position: [number, number, number] }) {
  // Furniture drop: fall from above, rotate, scale down to normal
  const springRef = useSpringRef();
  const [mounted, setMounted] = useState(false);
  const { pos, rot, scale } = useSpring({
    ref: springRef,
    from: {
      pos: [position[0], 3, position[2]],
      rot: [0.3, Math.random() * 0.6 - 0.3, 0.2],
      scale: [1.2, 1.2, 1.2],
    },
    to: async (next) => {
      await next({
        pos: [position[0], 0.7, position[2]],
        rot: [0.1, 0, 0.05],
        scale: [1.05, 1.05, 1.05],
        config: { tension: 180, friction: 10 },
      });
    //   await next({
    //     pos: [position[0], 0.5, position[2]],
    //     rot: [0, 0, 0],
    //     scale: [1, 1, 1],
    //     config: { tension: 120, friction: 14 },
    //   });
    },
    onRest: () => setMounted(true),
    config: { tension: 200, friction: 12 },
  });
  useChain([springRef], [0]);
  return (
    <a.mesh position={pos as any} rotation={rot as any} scale={scale as any}>
      <boxGeometry args={[1, 1, 1]} />
      <meshNormalMaterial />
    </a.mesh>
  );
}

function PreviewBox() {
  const previewPosition = useBuilderStore((s) => s.previewPosition);
  const draggingAsset = useBuilderStore((s) => s.draggingAsset);
  const { scale } = useSpring({
    scale: previewPosition && draggingAsset ? [1.1, 1.1, 1.1] : [0.8, 0.8, 0.8],
    config: { tension: 220, friction: 16 },
  });
  if (!previewPosition || !draggingAsset) return null;
  return (
    <a.mesh position={previewPosition} scale={scale as any} visible={!!previewPosition}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color="#6a82fb" opacity={0.5} transparent />
    </a.mesh>
  );
}

export default function Builder() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const setPreviewPosition = useBuilderStore((s) => s.setPreviewPosition);
  const addDroppedAsset = useBuilderStore((s) => s.addDroppedAsset);
  const draggingAsset = useBuilderStore((s) => s.draggingAsset);
  const clearDragState = useBuilderStore((s) => s.clearDragState);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Helper: get intersection with ground plane
  const getPlaneIntersection = useCallback((event: React.DragEvent | DragEvent) => {
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
    return [intersection.x, 0.5, intersection.z] as [number, number, number];
  }, []);

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
      addDroppedAsset({ type: draggingAsset, position: pos });
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
    <div style={{ height: "100vh", width: "100vw", position: "relative", overflow: "hidden" }}>
      {/* Canvas always fills the space */}
      <div
        className={styles.canvas}
        style={{ height: "100%", width: "100%", position: "absolute", top: 0, left: 0 }}
        ref={canvasRef}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDrop={handleDrop}
      >
        <Canvas camera={{ position: [0, 3, 5] }}>
          <CanvasWithRefs>
            <DroppedAssets />
            <PreviewBox />
            <OrbitControls />
          </CanvasWithRefs>
        </Canvas>
      </div>
      {/* Sidebar overlay */}
      {sidebarOpen && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: SIDEBAR_WIDTH,
            height: "100%",
            zIndex: 200,
            boxShadow: "4px 0 24px 0 rgba(0,0,0,0.10)",
            pointerEvents: "auto",
          }}
        >
          <Sidebar sidebarOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        </div>
      )}
      {/* Burger Menu - glassmorphic, floating, circular */}
      {!sidebarOpen && (
        <div style={{ position: "absolute", top: 24, left: 24, zIndex: 300 }}>
          <button
            aria-label="Open sidebar"
            onClick={() => setSidebarOpen(true)}
            style={{
              background: "rgba(40,42,50,0.72)",
              backdropFilter: "blur(12px)",
              border: "none",
              borderRadius: "50%",
              padding: 14,
              cursor: "pointer",
              boxShadow: "0 4px 18px rgba(0,0,0,0.18)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.18s, box-shadow 0.18s",
            }}
          >
            <span style={{ display: "block", width: 24, height: 18, position: "relative" }}>
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  style={{
                    position: "absolute",
                    left: 0,
                    top: i * 8,
                    width: 24,
                    height: 3,
                    background: "#f3f3f3",
                    borderRadius: 2,
                    transition: "all 0.2s cubic-bezier(.4,2,.6,1)",
                  }}
                />
              ))}
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
