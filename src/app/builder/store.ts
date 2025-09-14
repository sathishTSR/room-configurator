import { create } from "zustand";

export type DroppedAsset = {
  id: string; // 🔹 unique ID
  type: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  purchaseUrl?: string; // URL to purchase the item
  description?: string; // Additional details/notes about the item
};

interface RoomDimensions {
  width: number;
  depth: number;
  height: number;
}

interface RoomBoundaries {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  minZ: number;
  maxZ: number;
}

const getRoomBoundaries = (dimensions: RoomDimensions): RoomBoundaries => {
  const halfWidth = dimensions.width / 2;
  const halfDepth = dimensions.depth / 2;
  return {
    minX: -halfWidth + 0.1, // Add small margin from walls
    maxX: halfWidth - 0.1,
    minY: 0,
    maxY: dimensions.height - 0.1,
    minZ: -halfDepth + 0.1,
    maxZ: halfDepth - 0.1
  };
};

const isPositionInRoom = (position: [number, number, number], boundaries: RoomBoundaries): boolean => {
  const [x, y, z] = position;
  return (
    x >= boundaries.minX && x <= boundaries.maxX &&
    y >= boundaries.minY && y <= boundaries.maxY &&
    z >= boundaries.minZ && z <= boundaries.maxZ
  );
};

interface BuilderState {
  droppedAssets: DroppedAsset[];
  draggingAsset: string | null;
  previewPosition: [number, number, number] | null;
  selectedAssetId: string | null; // 🔹 track selection
  roomDimensions: RoomDimensions;

  // actions
  setDraggingAsset: (type: string | null) => void;
  setPreviewPosition: (pos: [number, number, number] | null) => void;
  addDroppedAsset: (asset: { type: string; position: [number, number, number] }) => void;
  clearDragState: () => void;
  setSelectedAssetId: (id: string | null) => void;
  updateSelectedAsset: (updates: Partial<Omit<DroppedAsset, "id" | "type">>) => void;
  updateRoomDimensions: (dimensions: Partial<RoomDimensions>) => void;
}

// Load saved assets from localStorage
const loadSavedAssets = (): DroppedAsset[] => {
  if (typeof window === 'undefined') return [];
  
  const saved = localStorage.getItem('droppedAssets');
  if (!saved) return [];

  try {
    return JSON.parse(saved);
  } catch (e) {
    console.error('Failed to load saved assets:', e);
    return [];
  }
};

// Save assets to localStorage
const saveAssets = (assets: DroppedAsset[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('droppedAssets', JSON.stringify(assets));
};

export const useBuilderStore = create<BuilderState>((set) => ({
  droppedAssets: loadSavedAssets(),
  draggingAsset: null,
  previewPosition: null,
  selectedAssetId: null,
  roomDimensions: {
    width: 10,
    depth: 10,
    height: 3
  },

  setDraggingAsset: (type) => set({ draggingAsset: type }),
  setPreviewPosition: (pos) => 
    set((state) => {
      // Only update preview if position is within room boundaries
      if (!pos || isPositionInRoom(pos, getRoomBoundaries(state.roomDimensions))) {
        return { previewPosition: pos };
      }
      return {};
    }),

  addDroppedAsset: (asset) =>
    set((state) => {
      // Only add asset if position is within room boundaries
      if (!isPositionInRoom(asset.position, getRoomBoundaries(state.roomDimensions))) {
        return state;
      }

      // Generate a stable ID based on timestamp and random number
      const timestamp = Date.now().toString(36);
      const random = Math.random().toString(36).slice(2, 7);
      const id = `${asset.type}-${timestamp}-${random}`;

      const newAsset: DroppedAsset = {
        id,
        type: asset.type,
        position: asset.position,
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
      };

      const updatedAssets = [...state.droppedAssets, newAsset];
      saveAssets(updatedAssets);

      return {
        droppedAssets: updatedAssets,
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

      // Check if new position is within room boundaries
      if (updates.position) {
        const boundaries = getRoomBoundaries(state.roomDimensions);
        if (!isPositionInRoom(updates.position, boundaries)) {
          return state;
        }
      }

      const updatedAssets = state.droppedAssets.map((asset) =>
        asset.id === state.selectedAssetId ? { ...asset, ...updates } : asset
      );

      // Save changes to localStorage
      saveAssets(updatedAssets);

      return { droppedAssets: updatedAssets };
    }),

  updateRoomDimensions: (dimensions) =>
    set((state) => {
      const newDimensions = {
        ...state.roomDimensions,
        ...dimensions
      };

      // Get new boundaries
      const boundaries = getRoomBoundaries(newDimensions);

      // Filter out assets that would be outside the new room dimensions
      const validAssets = state.droppedAssets.filter(asset => 
        isPositionInRoom(asset.position, boundaries)
      );

      // Clear selection if selected asset would be removed
      const selectedAsset = validAssets.find(asset => asset.id === state.selectedAssetId);

      return {
        roomDimensions: newDimensions,
        droppedAssets: validAssets,
        selectedAssetId: selectedAsset ? state.selectedAssetId : null
      };
    }),
}));
