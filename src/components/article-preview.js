import React, { useState } from 'react';
import { Link } from 'gatsby';
import { GatsbyImage } from 'gatsby-plugin-image';
import Lightbox from './Lightbox'; // Your custom lightbox
import { renderRichText } from 'gatsby-source-contentful/rich-text';
import Tags from './Tags'; // Assuming you're using a Tags component
import * as styles from './article-preview.module.css'; // Your CSS Module
import Container from './Container'; // Assuming you have a layout wrapper

const ArticlePreview = ({ posts }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null);

  const openLightbox = (image) => {
    setLightboxImage(image);
    setLightboxOpen(true);
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
            <div
              role="button"
              tabIndex={0}
              className={styles.imageWrapper}
              onClick={() => openLightbox(post.heroImage)}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && openLightbox(post.heroImage)}
            >
              <GatsbyImage
                alt={post.heroImage.alt || 'Preview image'}
                image={post.heroImage.gatsbyImage}
              />
            </div>

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
