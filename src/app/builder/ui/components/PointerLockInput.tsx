"use client";
import React from 'react';
import styles from '../SidebarRight/rightsidebar.module.scss';

interface PointerLockInputProps {
  value: number;
  onChange: (value: number) => void;
  step?: number;
  title?: string;
  min?: number;
  max?: number;
}

export default function PointerLockInput({
  value,
  onChange,
  step = 0.1,
  title,
  min = -Infinity,
  max = Infinity
}: PointerLockInputProps) {
  const handlePointerDown = (e: React.PointerEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    input.setPointerCapture(e.pointerId);
    input.requestPointerLock();
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    input.releasePointerCapture(e.pointerId);
    document.exitPointerLock();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLInputElement>) => {
    if (e.buttons === 1) { // Left button is pressed
      const movement = e.movementX * 0.1; // Scale the movement
      const currentValue = parseFloat(e.currentTarget.value) || 0;
      const newValue = Math.min(Math.max(currentValue + movement, min), max);
      onChange(newValue);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    if (!isNaN(newValue)) {
      const clampedValue = Math.min(Math.max(newValue, min), max);
      onChange(clampedValue);
    }
  };

  return (
    <input
      type="number"
      step={step}
      value={value.toFixed(1)}
      onChange={handleChange}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className={styles.input}
      title={title}
    />
  );
}
