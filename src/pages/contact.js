import React from "react";
import { graphql } from "gatsby";
import Layout from "../components/layout";
import Seo from "../components/seo";

import Hero from "../components/hero";
import '../components/bulma/css/bulma.css';

class ContactIndex extends React.Component {
  render() {
    const { nodes: [contact] } = this.props.data.allContentfulContact;

    return (
      <Layout location={this.props.location}>
        <Seo title="Contact" />
        <Hero title="Contact" image={contact.heroImage.gatsbyImage} contactImage={contact.contactImage} />

        <div class="container">
  <div class="columns is-justify-content-left">
    <div class="column is-6-tablet is-11-mobile is-5-desktop is-4-widescreen is-3-fullh">
    <form action="https://formspree.io/f/xayzpawa" method="post">
    <div className="columns">
  <div className="column is-full">
    {/* Name input */}
    <label className="labelWithColor is-block mb-4" style={{ marginLeft: '4%' }}>
      <span className="is-block mb-2">Your name</span>
      <input
        name="name"
        type="text"
        className="input"
        placeholder="Joe Bloggs"
      />
    </label>

    {/* Email input */}
    
    <label className="labelWithColor is-block mb-4" style={{ marginLeft: '4%' }}>
      <span className="is-block mb-2">Email address</span>
      <input
        required
        name="email"
        type="email"
        className="input"
        placeholder="joe.bloggs@example.com"
       />
       
  
    </label>
  </div>
  <div className="column is-half">
<label className="labelWithColor is-block mb-4" style={{ marginLeft: '4%' }}>
      <span className="is-block mb-2">Message</span>
      <textarea
        name="message"
        className="textarea"
        rows="5"
        placeholder="Tell us what you're thinking about..."></textarea>
  </label>
  <button type="submit" className="button is-success" style={{ marginLeft: '4%' }}>Send</button>
  <input type="reset" className="button is-danger" style={{ marginLeft: '4%' }} value="Clear" />
</div>
</div>
</form>
   
    </div>
  </div>
</div>
              </Layout>
    )
  }
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
