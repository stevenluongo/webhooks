/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    PROD_URL: process.env.PROD_URL,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    NEXT_PUBLIC_STRIPE_PUBLIC_KEY: process.env.NEXT_STRIPE_PUBLIC_KEY,
  },
};

module.exports = nextConfig;
