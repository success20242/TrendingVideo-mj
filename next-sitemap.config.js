/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://trendifyhub.vercel.app",
  generateRobotsTxt: true, // will also generate robots.txt
  sitemapSize: 5000,
  changefreq: "daily",
  priority: 0.7,
  exclude: ["/404", "/500"],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
  },
}
