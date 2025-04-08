import React from 'react';
import styles from './styles.module.scss';

interface SwitchProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  id?: string;
}

export function Switch({
  checked = false,
  onCheckedChange,
  disabled = false,
  size = 'md',
  id,
}: SwitchProps) {
  // Generate a unique ID if not provided
  const switchId = id || `switch-${Math.random().toString(36).substring(2, 9)}`;
  
  // Determine size class
  const sizeClass = size === 'md' ? '' : styles[`switch--${size}`];
  
  // Combine classes
  const switchClass = `${styles.switch} ${sizeClass}`;
  
  return (
    <label className={switchClass} htmlFor={switchId}>
      <input
        type="checkbox"
        id={switchId}
        className={styles.switch__input}
        checked={checked}
        onChange={(e) => onCheckedChange?.(e.target.checked)}
        disabled={disabled}
      />
      <span className={styles.switch__slider}></span>
    </label>
  );
}