/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@workspace/ui'],
  images: {
    domains: [
      // ... any existing domains
      'a.espncdn.com',
      'chui-assets-cdn.espn.com',
      'g.espncdn.com',
    ],
  },
  async rewrites() {
    return [
      {
        source: '/share/:shortCode',
        destination: 'https://api.bracketwrap.com/share/:shortCode',
      },
    ]
  },
}

export default nextConfig
