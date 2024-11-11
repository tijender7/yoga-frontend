/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ['dmewjfaaihwxscvhzmxv.supabase.co'],
    },
    typescript: {
      ignoreBuildErrors: true,
    },
    eslint: {
      ignoreDuringBuilds: true,
    },
    async redirects() {
      return [
        {
          source: '/terms-of-service',
          destination: '/terms',
          permanent: true,
        },
        {
          source: '/test-redirect',
          destination: 'https://yogforever.com/auth',
          permanent: false,
        },
      ]
    },
    async headers() {
      return [
        {
          source: '/api/:path*',
          headers: [
            { key: 'Access-Control-Allow-Origin', value: '*' },
            { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
            { key: 'Access-Control-Allow-Headers', value: 'Content-Type' }
          ],
        },
      ]
    },
    env: {
      SMTP_HOST: process.env.SMTP_HOST,
      SMTP_PORT: process.env.SMTP_PORT,
      SMTP_USER: process.env.SMTP_USER,
      SMTP_PASS: process.env.SMTP_PASS,
    },
  }
  
  module.exports = nextConfig