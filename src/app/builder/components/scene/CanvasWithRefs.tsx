import { useFrame, useThree } from "@react-three/fiber";
import { Camera } from "three";

export default function CanvasWithRefs({ children }: { children: React.ReactNode }) {
  const { camera } = useThree();
  useFrame(() => {
    (window as unknown as { _canvasCamera?: Camera })._canvasCamera = camera;
  });
  return <>{children}</>;
}
