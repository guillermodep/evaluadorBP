/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true
  },
  env: {
    PORT: 5001,
    GROQ_API_KEY: process.env.GROQ_API_KEY,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  serverOptions: {
    port: 5001,
  },
  images: {
    domains: ['localhost'],
  }
}

module.exports = nextConfig 