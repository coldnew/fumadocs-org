import { createMDX } from 'fumadocs-org/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  output: 'export', // Enables static site generation
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default withMDX(config);
