import React, { useState, useEffect } from 'react';
import { Link } from 'gatsby';
import { GatsbyImage } from 'gatsby-plugin-image';

import { renderRichText } from 'gatsby-source-contentful/rich-text';
import Tags from './Tags'; // Assuming you're using a Tags component
import * as styles from './article-preview.module.css'; // Your CSS Module
import Container from './Container'; // Assuming you have a layout wrapper
import 'lightbox2/dist/css/lightbox.min.css';
import Lightbox from 'lightbox2/dist/js/lightbox.min.js';

const ArticlePreview = ({ posts }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null);

  useEffect(() => {
    console.log('Lightbox state updated:', lightboxOpen);
  }, [lightboxOpen]);
  
  const openLightbox = (image) => {
    console.log('Image passed to Lightbox:', image);
    const formattedImage = {
      gatsbyImageData: image.gatsbyImage,
    };
    setLightboxImage(formattedImage);
    setLightboxOpen(true);
    console.log('Lightbox state:', lightboxOpen);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  return (
    <Container>
      {lightboxOpen && <Lightbox image={lightboxImage} onClose={closeLightbox} />}

      <ul className={styles.articleList}>
        {posts.map((post) => (
          <li key={post.slug}>
            {/* Image opens lightbox */}
            <a
        href={post.heroImage.gatsbyImage.images.sources[0].srcSet.split(' ')[0]} // Full-size image URL
        data-lightbox="gallery" // Group images under the same gallery
        data-title={post.title} // Optional: Add a caption
      >
        <GatsbyImage
          alt={post.heroImage.alt || 'Preview image'}
          image={post.heroImage.gatsbyImage}
          className={styles.imageWrapper}
        />
      </a>


            {/* Title and content links to the article */}
            <Link to={`/blog/${post.slug}`} className={styles.link}>
              <h2 className={styles.title}>{post.title}</h2>
            </Link>

            <div>
              {post.description?.raw && renderRichText(post.description)}
            </div>

            <div className={styles.meta}>
              <small className="meta">{post.publishDate}</small>
              <Tags tags={post.tags} />
            </div>
          </li>
        ))}
      </ul>
    </Container>
  );
};

export default ArticlePreview;
