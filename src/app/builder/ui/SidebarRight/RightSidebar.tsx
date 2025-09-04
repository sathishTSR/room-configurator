"use client";
import { useBuilderStore } from "../../store";
import styles from "./rightsidebar.module.scss";

export default function RightSidebar() {
  const droppedAssets = useBuilderStore((s) => s.droppedAssets);
  const selectedAssetId = useBuilderStore((s) => s.selectedAssetId);
  const updateSelectedAsset = useBuilderStore((s) => s.updateSelectedAsset);

  const selectedAsset = droppedAssets.find((a) => a.id === selectedAssetId);

  if (!selectedAsset) {
    return (
      <div className={styles.sidebar}>
        <h3 className={styles.heading}>No asset selected</h3>
        <p className={styles.empty}>
          Click on an asset to edit its properties.
        </p>
      </div>
    );
  }

  const handleChange =
    (field: "position" | "rotation" | "scale", index: number) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseFloat(e.target.value);
      const updated = [...selectedAsset[field]] as [number, number, number];
      updated[index] = isNaN(value) ? 0 : value;
      updateSelectedAsset({ [field]: updated } as any);
    };

  const axisLabels = ["X", "Y", "Z"];

  return (
    <div className={styles.sidebar}>
      <h3 className={styles.heading}>
        Selected:
        <br /> <span>{selectedAsset.type}</span>
      </h3>

      <section className={styles.section}>
        <h4>Position</h4>
        <div className={styles.axisGroup}>
          {selectedAsset.position.map((val, i) => (
            <label key={i} className={styles.label}>
              {axisLabels[i]}
              <input
                type="number"
                step="0.1"
                value={val}
                onChange={handleChange("position", i)}
                className={styles.input}
              />
            </label>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h4>Rotation</h4>
        <div className={styles.axisGroup}>
          {selectedAsset.rotation.map((val, i) => (
            <label key={i} className={styles.label}>
              {axisLabels[i]}
              <input
                type="number"
                step="0.1"
                value={val}
                onChange={handleChange("rotation", i)}
                className={styles.input}
              />
            </label>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h4>Scale</h4>
        <div className={styles.axisGroup}>
          {selectedAsset.scale.map((val, i) => (
            <label key={i} className={styles.label}>
              {axisLabels[i]}
              <input
                type="number"
                step="0.1"
                value={val}
                onChange={handleChange("scale", i)}
                className={styles.input}
              />
            </label>
          ))}
        </div>
      </section>
    </div>
  );
}
