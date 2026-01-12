import { createMDX } from 'fumadocs-org/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  output: 'export',
  reactStrictMode: true,
  trailingSlash: true,
};

export default withMDX(config);
