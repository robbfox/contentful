import React, { useEffect } from 'react';
import { Link } from 'gatsby';
import { GatsbyImage } from 'gatsby-plugin-image';
import { renderRichText } from 'gatsby-source-contentful/rich-text';
import Tags from './Tags';
import * as styles from './article-preview.module.css';
import Container from './Container';

import 'lightbox2/dist/css/lightbox.min.css'; // CSS is safe to import

const ArticlePreview = ({ posts }) => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Dynamically import lightbox JS only in browser
      require('lightbox2/dist/js/lightbox.min.js');
    }
  }, []);

  return (
    <Container>
      <ul className={styles.articleList}>
        {posts.map((post) => (
          <li key={post.slug}>
            <a
              href={post.heroImage.gatsbyImage.images.sources[0].srcSet.split(' ')[0]}
              data-lightbox="gallery"
              data-title={post.title}
            >
              <GatsbyImage
                alt={post.heroImage.alt || 'Preview image'}
                image={post.heroImage.gatsbyImage}
                className={styles.imageWrapper}
              />
            </a>

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
