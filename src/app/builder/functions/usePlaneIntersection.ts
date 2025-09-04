import { useCallback } from "react";
import { Camera, Plane, Raycaster, Vector2, Vector3 } from "three";

export function usePlaneIntersection(canvasRef: React.RefObject<HTMLDivElement>) {
  return useCallback(
    (event: React.DragEvent | DragEvent) => {
      const { clientX, clientY } = event;
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return null;

      const x = ((clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((clientY - rect.top) / rect.height) * 2 + 1;

      const camera = (window as unknown as { _canvasCamera?: Camera })
        ._canvasCamera;
      if (!camera) return null;

      const mouse = new Vector2(x, y);
      const raycaster = new Raycaster();
      raycaster.setFromCamera(mouse, camera);

      const plane = new Plane(new Vector3(0, 1, 0), 0); // y=0
      const intersection = new Vector3();
      raycaster.ray.intersectPlane(plane, intersection);

      // Clamp inside walls
      const halfWidth = 4.5;
      const halfDepth = 4.5;
      intersection.x = Math.max(-halfWidth, Math.min(halfWidth, intersection.x));
      intersection.z = Math.max(-halfDepth, Math.min(halfDepth, intersection.z));

      return [intersection.x, 0, intersection.z] as [number, number, number];
    },
    [canvasRef]
  );
}
