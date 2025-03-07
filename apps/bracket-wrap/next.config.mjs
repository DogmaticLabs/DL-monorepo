/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@workspace/ui'],
  images: {
    domains: [
      // ... any existing domains
      'a.espncdn.com',
      'chui-assets-cdn.espn.com',
    ],
  },
}

export default nextConfig
