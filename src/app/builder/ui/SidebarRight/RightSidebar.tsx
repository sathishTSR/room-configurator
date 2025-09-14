"use client";
import { useBuilderStore } from "../../store";
import styles from "./rightsidebar.module.scss";
import PointerLockInput from "../components/PointerLockInput";
import RoomDimensionsSection from "../components/RoomDimensionsSection";

export default function RightSidebar() {
  const droppedAssets = useBuilderStore((s) => s.droppedAssets);
  const selectedAssetId = useBuilderStore((s) => s.selectedAssetId);
  const updateSelectedAsset = useBuilderStore((s) => s.updateSelectedAsset);

  const selectedAsset = droppedAssets.find((a) => a.id === selectedAssetId);


  if (!selectedAsset) {
    return (
      <div className={styles.sidebar}>
        <RoomDimensionsSection />
        <h3 className={styles.heading}>No asset selected</h3>
        <p className={styles.empty}>
          Click on an asset to edit its properties.
        </p>
      </div>
    );
  }


  return (
    <div className={styles.sidebar}>
      <RoomDimensionsSection />
      <h3 className={styles.heading}>
        <span>{selectedAsset.type}</span>
      </h3>

      <section className={styles.section}>
        <h4>Transform</h4>
        <div className={styles.transformBlock}>
          <div className={styles.label}>Position</div>
          <div className={styles.inputGroup}>
            {selectedAsset.position.map((val, i) => (
              <PointerLockInput
                key={i}
                value={val}
                onChange={(value) => {
                  const updated = [...selectedAsset.position] as [number, number, number];
                  updated[i] = value;
                  updateSelectedAsset({ position: updated });
                }}
              />
            ))}
          </div>
        </div>

        <div className={styles.transformBlock}>
          <div className={styles.label}>Rotation</div>
          <div className={styles.inputGroup}>
            {selectedAsset.rotation.map((val, i) => (
              <PointerLockInput
                key={i}
                value={val}
                onChange={(value) => {
                  const updated = [...selectedAsset.rotation] as [number, number, number];
                  updated[i] = value;
                  updateSelectedAsset({ rotation: updated });
                }}
              />
            ))}
          </div>
        </div>

        <div className={styles.transformBlock}>
          <div className={styles.label}>Scale</div>
          <div className={styles.inputGroup}>
            {selectedAsset.scale.map((val, i) => (
              <PointerLockInput
                key={i}
                value={val}
                onChange={(value) => {
                  const updated = [...selectedAsset.scale] as [number, number, number];
                  updated[i] = value;
                  updateSelectedAsset({ scale: updated });
                }}
              />
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h4>Product Information</h4>
        <div className={styles.infoBlock}>
          <div className={styles.label}>Purchase Link</div>
          <input
            type="url"
            value={selectedAsset.purchaseUrl || ''}
            onChange={(e) => updateSelectedAsset({ purchaseUrl: e.target.value })}
            placeholder="Enter URL to purchase this item"
            className={styles.textInput}
          />
        </div>

        <div className={styles.infoBlock}>
          <div className={styles.label}>Notes & Details</div>
          <textarea
            value={selectedAsset.description || ''}
            onChange={(e) => updateSelectedAsset({ description: e.target.value })}
            placeholder="Add details about this furniture (size, material, etc.)"
            className={styles.textArea}
            rows={3}
          />
        </div>
      </section>
    </div>
  );
}
