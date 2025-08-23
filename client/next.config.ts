/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: [
      'puppeteer-core',
      '@sparticuz/chromium-min' // or '@sparticuz/chromium'
    ],
    outputFileTracingIncludes: {
      '/api/pdf': ['./node_modules/@sparticuz/chromium-min/**']
    }
  },
}

module.exports = nextConfig;
