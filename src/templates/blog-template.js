// BlogIndex.js
import React from 'react';
import { graphql, Link } from 'gatsby';
import get from 'lodash/get';
import Seo from '../components/seo';
import Layout from '../components/layout';
import Hero from '../components/hero';
import BlogGallery3D from '../components/BlogGallery3D';
import ArticlePreview from '../components/article-preview'; // <--- IMPORT THIS
import useMediaQuery from '../hooks/useMediaQuery';      // <--- IMPORT THIS
import './pagination.css';
import '../components/global.css';


const BlogIndex = ({ location, pageContext, data }) => {
  const posts = get(data, 'allContentfulBlogPost.nodes');
  const { currentPage, numPages } = pageContext;
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <Layout location={location}>
      <Seo title={`Blog - Page ${currentPage}`} />
      <Hero title="Blog" />

      {/* Pagination ... (remains the same) ... */}
      {numPages > 1 && (
        <div className="pagination">
          {Array.from({ length: numPages }).map((_, i) => {
            const pageNumber = i + 1;
            const path = pageNumber === 1 ? (pageContext.basePath || '/blog/1') : `${pageContext.basePath || '/blog'}/${pageNumber}`;
            return (
              <React.Fragment key={`pagination-number${pageNumber}`}>
                {pageNumber === currentPage ? (
                  <span className="pagination-link-active button is-primary" title="Current Page" aria-disabled="true" aria-current="page">
                    {pageNumber}
                  </span>
                ) : (
                  <Link
                    className="pagination-link button is-primary is-outlined"
                    to={path}
                  >
                    {pageNumber}
                  </Link>
                )}
              </React.Fragment>
            );
          })}
        </div>
      )}

      {/* Conditional Rendering based on isMobile */}
      {isMobile ? (
        // Mobile view: Pass the 'posts' array directly to ArticlePreview
        <ArticlePreview posts={posts} />
      ) : (
        // Desktop view: Render 3D Gallery
        <BlogGallery3D posts={posts} />
      )}
    </Layout>
  );
};

export default BlogIndex;
// GraphQL query remains the same as it fetches data needed by both views
export const pageQuery = graphql` 
  query BlogIndexQuery($skip: Int!, $limit: Int!) {
    allContentfulBlogPost(
      sort: { publishDate: DESC }
      limit: $limit
      skip: $skip
    ) {
      nodes {
        title
        slug
        publishDate(formatString: "MMMM Do, YYYY")
        tags
        heroImage {
          gatsbyImage(layout: FULL_WIDTH, placeholder: BLURRED, width: 424, height: 212)
        }
        description {
          raw
        }
        # Ensure you fetch all fields needed by ArticlePreview as well
      }
    }
  }
`;