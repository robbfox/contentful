// BlogIndex.js
import React from 'react';
import { graphql, Link } from 'gatsby';
import get from 'lodash/get';
import Seo from '../components/seo';
import Layout from '../components/layout';
import Hero from '../components/hero';
import ArticlePreview from '../components/article-preview';
import { motion } from 'framer-motion';
import './pagination.css';

class BlogIndex extends React.Component {
  render() {
    const { location, pageContext } = this.props;
    const posts = get(this, 'props.data.allContentfulBlogPost.nodes');
    const { currentPage, numPages } = pageContext;

    return (
      <motion.div
        animate={{ opacity: 1 }}
        initial={{ opacity: 0 }}
        transition={{ duration: 1.5 }}
      >
        <Layout location={location}>
          <Seo title={`Blog - Page ${currentPage}`} />
          <Hero title="Blog" />
          
          <div className="pagination">
            {Array.from({ length: numPages }).map((_, i) => (
              <React.Fragment key={`pagination-number${i + 1}`}>
                {i + 1 === currentPage ? (
                  <span className="pagination-link-active button is-primary" Title = "disabled-button" disabled>{i + 1}</span>
                ) : (
                  <Link
                    className="pagination-link button is-primary is-outlined"
                    to={i === -1 ? '/blog' : `/blog/${i + 1}`}
                  >
                    {i + 1}
                  </Link>
                )}
              </React.Fragment>
            ))}
          </div>
          
          <ArticlePreview posts={posts} />
        </Layout>
      </motion.div>
    );
  }
}

export default BlogIndex;

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
      }
    }
  }
`;
