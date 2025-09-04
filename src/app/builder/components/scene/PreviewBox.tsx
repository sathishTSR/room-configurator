"use client";
import { a, useSpring } from "@react-spring/three";
import { useBuilderStore } from "../../store";

type Props = {
  droppingAsset: { position: [number, number, number]; type: string } | null;
  addDroppedAsset: (asset: { type: string; position: [number, number, number] }) => void;
  setDroppingAsset: (asset: { position: [number, number, number]; type: string } | null) => void;
};

export default function PreviewBox({ droppingAsset, addDroppedAsset, setDroppingAsset }: Props) {
  const previewPosition = useBuilderStore((s) => s.previewPosition);
  const draggingAsset = useBuilderStore((s) => s.draggingAsset);

  const { scale } = useSpring({
    to: { scale: droppingAsset ? [0.5, 0.5, 0.5] : [1, 1, 1] },
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
    <a.mesh
      position={position}
      scale={scale as unknown as [number, number, number]}
      visible={!!position}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color="#6a82fb" opacity={0.5} transparent />
    </a.mesh>
  );
}
