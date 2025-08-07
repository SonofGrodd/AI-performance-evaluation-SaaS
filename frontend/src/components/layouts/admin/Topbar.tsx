// src/components/layout/Topbar.tsx

import React from 'react';
import styles from './Topbar.module.css';

const Topbar = () => {
  return (
    <div className={styles.topbarWrapper}>
      <div className={styles.topbarCard}>
        <h2 className={styles.pageTitle}>Dashboard</h2>
        <div className={styles.actions}>
          {/* Add actions or user info here */}
        </div>
      </div>
    </div>
  );
};

export default Topbar;
