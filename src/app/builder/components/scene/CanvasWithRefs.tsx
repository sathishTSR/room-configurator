import { useFrame, useThree } from "@react-three/fiber";
import { Camera } from "three";
import { EffectComposer, Outline, Selection } from "@react-three/postprocessing";

export default function CanvasWithRefs({ children }: { children: React.ReactNode }) {
  const { camera } = useThree();
  useFrame(() => {
    (window as unknown as { _canvasCamera?: Camera })._canvasCamera = camera;
  });
  
  return (
    <>
      <Selection>
        {children}
        <EffectComposer multisampling={8} autoClear={false}>
          <Outline 
            edgeStrength={3}
            visibleEdgeColor={0xffffff}
            hiddenEdgeColor={0xffffff}
            width={1024} // render target size for sharp edges
            thickness={2} // edge thickness
          />
        </EffectComposer>
      </Selection>
    </>
  );
}
