require("dotenv").config({
  path: `.env`,
})

module.exports = {
  siteMetadata: {
    title: `Beer Time`,
    description: `I'm not paying for any Doodles. Suck it!`,
    author: `Toni Suominen`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-styled-components`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-default`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/gatsby-icon.png`, // This path is relative to the root of the site.
      },
    },
    {
      resolve: "gatsby-source-entryapi",
      options: {
        baseUrl:
          "https://doodlereplacement.azurewebsites.net/api/GetScoresForPartition?code=DsdcT7Nn7u6HG8H4WtERoAIv1DbLKBbK2T1F7SZ7UavKxGOajuTTuQ==",
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
}
