/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: config => {
      config.externals.push('pino-pretty', 'lokijs', 'encoding')
      return config
    },
    redirects: async () => {
      return []
      // return [{
      //   source: "/",
      //   destination: "/buy",
      //   permanent: true
      // }]
    }
  }

module.exports = nextConfig
