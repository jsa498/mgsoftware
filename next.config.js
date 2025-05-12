// add at the top of next.config.js to extract Supabase domain dynamically
const { NEXT_PUBLIC_SUPABASE_URL } = process.env;
if (!NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing environment variable NEXT_PUBLIC_SUPABASE_URL for Supabase domain');
}
const supabaseHostname = new URL(NEXT_PUBLIC_SUPABASE_URL).hostname;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Improve handling of cached data between refreshes
  onDemandEntries: {
    // Keep inactive pages in memory for longer (1 hour)
    maxInactiveAge: 60 * 60 * 1000,
    // Track more pages in memory
    pagesBufferLength: 10,
  },
  images: {
    domains: [supabaseHostname],
  },
  // Add custom headers to help prevent caching issues
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
          {
            key: 'Expires',
            value: '0',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig; 