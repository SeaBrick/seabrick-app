/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding")
    config.resolve.fallback = { fs: false }
    return config
  },
  redirects: async () => {
    return []
  },
}

module.exports = nextConfig
