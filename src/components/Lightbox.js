// src/components/Lightbox.js (New Component)
import React, { useState } from 'react';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import * as styles from './lightbox.module.css'; // Create this CSS module

const Lightbox = ({ image, onClose }) => {
  return (
    <div className={styles.lightboxOverlay} onClick={onClose}>
      <div className={styles.lightboxContent}>
        <button className={styles.closeButton} onClick={onClose}>
          &times; {/* Close button */}
        </button>
        <GatsbyImage image={getImage(image)} alt="" className={styles.lightboxImage} />
      </div>
    </div>
  );
};

export default Lightbox;