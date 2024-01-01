require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
});
module.exports = {
  siteMetadata: {
    title: "Robb Fox",
    description: "Official",
  },
  plugins: [
    "gatsby-transformer-sharp",
    "gatsby-plugin-react-helmet",
    "gatsby-plugin-sharp",
    "gatsby-plugin-image",
    {
      resolve: "gatsby-source-contentful",
      options: {
        spaceId: process.env.CONTENTFUL_SPACE_ID,
        accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
        host: process.env.CONTENTFUL_HOST,
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: "GatsbyJS",
        short_name: "GatsbyJS",
        start_url: "/",
        background_color: "#6b37bf",
        theme_color: "#6b37bf",
        display: "standalone",
        icon: "./favicon.png", // This path is relative to the root of the site.
        crossOrigin: `use-credentials`,
      },
    },
  ],
};
