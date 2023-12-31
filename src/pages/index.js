import React from 'react'
import { graphql } from 'gatsby'
import get from 'lodash/get'
import Layout from '../components/layout'
import Hero from '../components/hero'
import ArticlePreview from '../components/article-preview'
import { motion } from 'framer-motion'
import Img from 'gatsby-image'  // Import the Img component

const RootIndex = ({ data, location }) => {
  const posts = get(data, 'allContentfulBlogPost.nodes')
  const [author] = get(data, 'allContentfulPerson.nodes')

  return (
    <motion.div
      animate={{ opacity: 1 }}
      initial={{ opacity: 0 }}
      transition={{ duration: 1.5 }}
    >
      <Layout location={location}>
        <Hero
          image={author.heroImage.gatsbyImage}
          title={author.name}
          content={author.shortBio}
        />
        {/* Add loading="eager" to disable lazy loading for the hero image */}
        <Img
          loading="eager"
          fluid={author.heroImage.gatsbyImage}
          alt={author.name}
        />
        <ArticlePreview posts={posts} />
      </Layout>
    </motion.div>
  )
}

export default RootIndex

export const pageQuery = graphql`
  query HomeQuery {
    allContentfulBlogPost(sort: { publishDate: DESC } limit: 2) {
      nodes {
        title
        slug
        publishDate(formatString: "MMMM Do, YYYY")
        tags
        heroImage {
          gatsbyImage(
            layout: FULL_WIDTH
            placeholder: BLURRED
            width: 424
            height: 212
          )
        }
        description {
          raw
        }
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
        heroImage: image {
          gatsbyImage(layout: CONSTRAINED, placeholder: BLURRED, width: 1180)
        }
      }
    }
  }
`
