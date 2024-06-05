await import('./src/env.js');

/** @type {import("next").NextConfig} */
const config = {
  experimental: {
    reactCompiler: true,
  },
  productionBrowserSourceMaps: true,
};

export default config;
