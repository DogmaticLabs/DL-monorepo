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
        destination:
          'https://bracket-wrap-qaj2wo7wh-ryan-marcus-projects.vercel.app/share/:shortCode',
      },
    ]
  },
}

export default nextConfig
