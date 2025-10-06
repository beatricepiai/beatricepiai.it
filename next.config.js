/** @type {import('next').NextConfig} */

const PERMANENT_REDIRECTS = [
  // {"source": /example", "destination": "/example-dest", "permanent": true}
];

const TEMPORARY_REDIRECTS = [
  // {"source": /example", "destination": "/example-dest", "permanent": true}
];

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  sassOptions: {
    prependData: `@import './src/app/styles/core';`,
  },
  async redirects() {
    return [...PERMANENT_REDIRECTS, ...TEMPORARY_REDIRECTS];
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "a.storyblok.com",
        port: "",
        pathname: "**",
      },
    ],
  },
};

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.BUNDLE_ANALYZER === "true",
});

module.exports = withBundleAnalyzer(nextConfig);
