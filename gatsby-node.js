const path = require('path');

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions;

  // Define a template for blog post
  const blogPost = path.resolve('./src/templates/blog-post.js');

  const result = await graphql(`
    {
      allContentfulBlogPost {
        nodes {
          title
          slug
        }
      }
    }
  `);

  if (result.errors) {
    reporter.panicOnBuild(
      `There was an error loading your Contentful posts`,
      result.errors
    );
    return;
  }

  const posts = result.data.allContentfulBlogPost.nodes;
  const postsPerPage = 6;
  const numPages = Math.ceil(posts.length / postsPerPage);

  // Create blog posts pages
  if (posts.length > 0) {
    posts.forEach((post, index) => {
      const previousPostSlug = index === 0 ? null : posts[index - 1].slug;
      const nextPostSlug =
        index === posts.length - 1 ? null : posts[index + 1].slug;

      createPage({
        path: `/blog/${post.slug}/`,
      component: blogPost,
      context: {
          slug: post.slug,
          previousPostSlug,
          nextPostSlug,
        },
      });
    });
  }

  // Create paginated blog index pages
  Array.from({ length: numPages }).forEach((_, i) => {
    const currentPage = i + 1;
    const skip = i * postsPerPage;

    createPage({
      path: i === 0 ? `/blog` : `/blog/${currentPage}`,
      component: path.resolve('./src/templates/blog-template.js'),
      context: {
        limit: postsPerPage,
        skip,
        numPages,
        currentPage,
      },
    });
  });
};
