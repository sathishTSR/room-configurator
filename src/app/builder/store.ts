import { create } from "zustand";
import { Vector3 } from "three";

export type DroppedAsset = {
  type: string;
  position: [number, number, number];
};

interface BuilderState {
  droppedAssets: DroppedAsset[];
  draggingAsset: string | null;
  previewPosition: [number, number, number] | null;
  setDraggingAsset: (type: string | null) => void;
  setPreviewPosition: (pos: [number, number, number] | null) => void;
  addDroppedAsset: (asset: DroppedAsset) => void;
  clearDragState: () => void;
}

export const useBuilderStore = create<BuilderState>((set) => ({
  droppedAssets: [],
  draggingAsset: null,
  previewPosition: null,
  setDraggingAsset: (type) => set({ draggingAsset: type }),
  setPreviewPosition: (pos) => set({ previewPosition: pos }),
  addDroppedAsset: (asset) =>
    set((state) => ({
      droppedAssets: [...state.droppedAssets, asset],
      previewPosition: null,
      draggingAsset: null,
    })),
  clearDragState: () => set({ previewPosition: null, draggingAsset: null }),
}));
