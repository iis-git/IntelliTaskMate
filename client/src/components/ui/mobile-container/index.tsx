import React, { ReactNode } from 'react';
import styles from './styles.module.scss';

interface MobileContainerProps {
  children: ReactNode;
}

export default function MobileContainer({ children }: MobileContainerProps) {
  return (
    <div className={styles['mobile-container']}>
      {children}
    </div>
  );
}