"use client";
import React from 'react';
import { useBuilderStore } from '../../store';
import styles from '../SidebarRight/rightsidebar.module.scss';
import PointerLockInput from './PointerLockInput';

const ROOM_DIMENSION_LIMITS = {
  width: [3, 20],
  depth: [3, 20],
  height: [2, 5]
} as const;

type DimensionKey = keyof typeof ROOM_DIMENSION_LIMITS;

const InfoIcon = () => (
  <svg className={styles.infoIcon} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
  </svg>
);

const DimensionInput = ({ 
  dimension, 
  value, 
  onChange 
}: { 
  dimension: DimensionKey; 
  value: number; 
  onChange: (value: number) => void;
}) => {
  const [min, max] = ROOM_DIMENSION_LIMITS[dimension];
  
  return (
    <PointerLockInput
      value={value}
      onChange={onChange}
      min={min}
      max={max}
      title={`${dimension.charAt(0).toUpperCase() + dimension.slice(1)} (${min}-${max}m)`}
    />
  );
};

export default function RoomDimensionsSection() {
  const roomDimensions = useBuilderStore((s) => s.roomDimensions);
  const updateRoomDimensions = useBuilderStore((s) => s.updateRoomDimensions);

  const handleDimensionChange = (dimension: DimensionKey) => (value: number) => {
    updateRoomDimensions({ [dimension]: value });
  };

  return (
    <section className={styles.section}>
      <h4>
        Room Dimensions
        <InfoIcon />
      </h4>
      <div className={styles.dimensionInputs}>
        <div className={`${styles.inputGroup} ${styles.roomInputs}`}>
          <DimensionInput
            dimension="width"
            value={roomDimensions.width}
            onChange={handleDimensionChange("width")}
          />
          <span>×</span>
          <DimensionInput
            dimension="depth"
            value={roomDimensions.depth}
            onChange={handleDimensionChange("depth")}
          />
          <span>×</span>
          <DimensionInput
            dimension="height"
            value={roomDimensions.height}
            onChange={handleDimensionChange("height")}
          />
        </div>
      </div>
    </section>
  );
}
