import { createOrg } from 'fumadocs-org/next';

const withOrg = createOrg();

/** @type {import('next').NextConfig} */
const config = {
  output: 'export', // Enables static site generation
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default withOrg(config);
