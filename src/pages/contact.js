import React from "react";
import { graphql } from "gatsby";
import Layout from "../components/layout";
import Seo from "../components/seo";
import '../components/customStyles.css'
import Hero from "../components/hero";
import 'bulma/css/bulma.min.css';
import { motion } from "framer-motion";

const ContactIndex = ({location, data}) => {
  const { nodes: [contact] } = data.allContentfulContact;

    return (
      <motion.div
      animate={{ opacity: 1 }}
      initial={{ opacity: 0 }}
      transition={{ duration: 1.5 }}>
      <Layout location={location}>
        <Seo title="Contact" />
        <Hero title="Contact" image={contact.heroImage.gatsbyImage} contactImage={contact.contactImage} />

        <div class="container">
  <div class="columns is-justify-content-left">
    <div class="column is-6-tablet is-11-mobile is-5-desktop is-4-widescreen is-3-fullh">
    <form action="https://formspree.io/f/xayzpawa" method="post">
    <div className="columns">
  <div className="column is-full">
    {/* Name input */}
    <label className="labelWithColor is-block mb-4" style={{ marginLeft: '8%' }}>
      <span className="is-block mb-2">Your name</span>
      <input
        name="name"
        type="text"
        className="input"
        placeholder="that's a nice name"
      />
    </label>

    {/* Email input */}
    
    <label className="labelWithColor is-block mb-4" style={{ marginLeft: '8%' }}>
      <span className="is-block mb-2">Email address</span>
      <input
        required
        name="email"
        type="email"
        className="input"
        placeholder="omg@whatever.com"
       />
       
  
    </label>
  </div>
  <div className="column is-half">
<label className="labelWithColor is-block mb-4" style={{ marginLeft: '8%' }}>
      <span className="is-block mb-2">Message</span>
      <textarea
        name="message"
        className="textarea"
        rows="5"
        style={{ minWidth: '320px' }} 
        placeholder="share your thoughts...">
    </textarea>
  </label>
  <button type="submit" className="button is-primary is-outlined" style={{ marginLeft: '8%' }}>Send</button>
  <input type="reset" className="button is-danger is-outlined" style={{ marginLeft: '8%' }} value="Clear" />
</div>
</div>
</form>
   
    </div>
  </div>
</div>
              </Layout>
 </motion.div>
 )
  }


export default ContactIndex;

export const pageQuery = graphql`
  query HomeQuery {
    allContentfulBlogPost(sort: { publishDate: DESC }) {
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
    allContentfulContact(
      filter: { contentful_id: { eq: "571IbVKndavt4XVg4C7WjA" } }
    ) {
      nodes {
        heroImage: contactImage {
          gatsbyImage(layout: CONSTRAINED, placeholder: BLURRED, width: 1180)
        }
      }
    }
  }
`;
