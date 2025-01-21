/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true
  },
  env: {
    PORT: 5001,
  },
  serverOptions: {
    port: 5001,
  },
}

module.exports = nextConfig 