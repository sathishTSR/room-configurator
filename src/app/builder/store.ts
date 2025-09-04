import { create } from "zustand";

export type DroppedAsset = {
  id: string; // 🔹 unique ID
  type: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
};

interface BuilderState {
  droppedAssets: DroppedAsset[];
  draggingAsset: string | null;
  previewPosition: [number, number, number] | null;
  selectedAssetId: string | null; // 🔹 track selection

  // actions
  setDraggingAsset: (type: string | null) => void;
  setPreviewPosition: (pos: [number, number, number] | null) => void;
  addDroppedAsset: (asset: { type: string; position: [number, number, number] }) => void;
  clearDragState: () => void;
  setSelectedAssetId: (id: string | null) => void;
  updateSelectedAsset: (updates: Partial<Omit<DroppedAsset, "id" | "type">>) => void;
}

export const useBuilderStore = create<BuilderState>((set) => ({
  droppedAssets: [],
  draggingAsset: null,
  previewPosition: null,
  selectedAssetId: null,

  setDraggingAsset: (type) => set({ draggingAsset: type }),
  setPreviewPosition: (pos) => set({ previewPosition: pos }),

  addDroppedAsset: (asset) =>
    set((state) => {
      const newAsset: DroppedAsset = {
        id: Math.random().toString(36).slice(2),
        type: asset.type,
        position: asset.position,
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
      };
      return {
        droppedAssets: [...state.droppedAssets, newAsset],
        previewPosition: null,
        draggingAsset: null,
        selectedAssetId: newAsset.id, // auto-select on drop
      };
    }),

  clearDragState: () => set({ previewPosition: null, draggingAsset: null }),

  setSelectedAssetId: (id) => set({ selectedAssetId: id }),

  updateSelectedAsset: (updates) =>
    set((state) => {
      if (!state.selectedAssetId) return state;
      const updatedAssets = state.droppedAssets.map((asset) =>
        asset.id === state.selectedAssetId ? { ...asset, ...updates } : asset
      );
      return { droppedAssets: updatedAssets };
    }),
}));
