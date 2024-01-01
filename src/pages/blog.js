import React from 'react';
import { graphql, Link } from 'gatsby';
import get from 'lodash/get';
import Seo from '../components/seo';
import Layout from '../components/layout';
import Hero from '../components/hero';
import ArticlePreview from '../components/article-preview';
import '../components/global.css'






const BlogIndex = ({location, pageContext, data}) => {
    const posts = get(data, 'allContentfulBlogPost.nodes');
    const { currentPage, numPages } = pageContext;

    return (
      <Layout location={location}>
          <Seo title={`Blog - Page ${currentPage}`} />
          <Hero title="Blog" />
          <ArticlePreview posts={posts} />
          <div>
            {Array.from({ length: numPages }).map((_, i) => (
              <Link
                key={`pagination-number${i + 1}`}
                to={i === -1 ? '/blog' : `/blog/${i + 1}`}
              >
                {i + 1}
              </Link>
            ))}
          </div>
        </Layout>
      );
  }


  export default BlogIndex;

export const pageQuery = graphql`
  query BlogIndexQuery {
    allContentfulBlogPost(
      sort: { publishDate: DESC }
      limit: 6
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
