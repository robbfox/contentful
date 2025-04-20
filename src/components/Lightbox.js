import React from 'react';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import * as styles from './lightbox.module.css';

const Lightbox = ({ image, onClose }) => {
  console.log('Lightbox received image:', image);

  if (!image || !getImage(image)) {
    console.error('Invalid image data in Lightbox:', image);
    return null;
  }

  return (
    <div className={styles.lightboxOverlay} onClick={onClose}>
      <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose} aria-label="Close">
          &times;
        </button>
        <GatsbyImage
          image={getImage(image)}
          alt=""
          className={styles.lightboxImage}
        />
      </div>
    </div>
  );
};

export default Lightbox;