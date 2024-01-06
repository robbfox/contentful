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
        spaceId: '3k1mhgozm2gw',
        accessToken: '55XBEwjjzyCqMU7dIHn5WCygm-zmoAb-ojqGoN7FlNo',
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
        icon: "./maskable_icon_x512.png", // This path is relative to the root of the site.
        crossOrigin: `use-credentials`,
        icons: [
          {
            src: "./maskable_icon_x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
    },
  ],
};
