/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Fully static build in ./out — served by GitHub Pages.
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
