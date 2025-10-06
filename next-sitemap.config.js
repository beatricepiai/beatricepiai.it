// REF: https://www.npmjs.com/package/next-sitemap#create-config-file
/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.DOMAIN_URL || "https://example.com",
  generateRobotsTxt: true, // (optional)
  // exclude: ['/service-pages'],
  exclude: ["/main-footer", "/main-header", "/server-sitemap.xml", "/home"],
  sitemapSize: 1000,
  // ...other options
};
