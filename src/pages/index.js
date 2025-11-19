import React from 'react';
import { graphql, Link } from 'gatsby'; // Added Link in case you want a "View All Posts" link
import get from 'lodash/get';
import Layout from '../components/layout';
import Hero from '../components/hero';
import BlogGallery3D from '../components/BlogGallery3D';
import ArticlePreview from '../components/article-preview'; // <--- IMPORT THIS
import useMediaQuery from '../hooks/useMediaQuery';   

const RootIndex = ({ data, location }) => {
  const posts = get(data, 'allContentfulBlogPost.nodes');
  const [author] = get(data, 'allContentfulPerson.nodes');
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <Layout location={location}>
      <Hero
        image={author.heroImage.gatsbyImage}
        // Pass the new image here (with optional chaining in case it's empty)
        experimentalImage={author.experimentalImage?.gatsbyImage} 
        title={author.name}
        content={author.shortBio}
      />

      {/* Conditional Rendering for posts section */}
      {posts && posts.length > 0 && ( // Only render if there are posts
        <section className="homepage-posts-section"> {/* Optional wrapper */}
     
          {isMobile ? (
            // Mobile view: Render ArticlePreview
            <ArticlePreview posts={posts} />
          ) : (
            // Desktop view: Render 3D Gallery
            <BlogGallery3D posts={posts} autoRotateSpeed={0.007}  />
          )}

          {/* Optional: Link to the main blog page */}
          <div style={{ textAlign: 'center', margin: '2rem 0' }}>
            <Link to="/blog/1" activeClassName="active">View All Posts →</Link>
          </div>
        </section>
      )}
    </Layout>
  );
};

export default RootIndex;

// GraphQL query for the homepage
export const pageQuery = graphql`
  query HomeQuery {
    # This query fetches up to 3 posts. Both views will use these 3 posts.
    allContentfulBlogPost(sort: { publishDate: DESC }, limit: 4
    ) {
      nodes {
        title
        slug
        publishDate(formatString: "MMMM Do, YYYY")
        tags
        heroImage {
          gatsbyImage(
            layout: FULL_WIDTH
            placeholder: BLURRED
            width: 424 # Consider if these dimensions are ideal for ArticlePreview card images
            height: 212
          )
        }
        description {
          raw
        }
        # Ensure all fields needed by ArticlePreview are here too
      }
    }
    allContentfulPerson(
      filter: { contentful_id: { eq: "15jwOBqpxqSAOy2eOO4S0m" } }
    ) {
      nodes {
        name
        shortBio {
          raw
        }
        title
        # Keep the professional image as the default
        heroImage: image {
          gatsbyImage(layout: CONSTRAINED, placeholder: BLURRED, width: 3000)
        }
        # ADD THIS NEW FIELD (Make sure the name matches your Contentful ID exactly)
        experimentalImage {
          gatsbyImage(layout: CONSTRAINED, placeholder: BLURRED, width: 3000)
        }
      }
    }
  }
`;
