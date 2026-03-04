/** @type {import('next').NextConfig} */
const repository = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? '';
const isUserOrOrgPagesRepo = repository.endsWith('.github.io');
const basePath =
  process.env.GITHUB_ACTIONS && repository && !isUserOrOrgPagesRepo
    ? `/${repository}`
    : '';

const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath,
  assetPrefix: basePath,
};

module.exports = nextConfig;
