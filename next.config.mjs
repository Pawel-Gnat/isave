import { withSentryConfig } from '@sentry/nextjs';

const nextConfig = {};

export default withSentryConfig(nextConfig, {
  org: 'pawe-a2',
  project: 'isave',
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: false,
  hideSourceMaps: true,
  tunnelRoute: '/monitoring-tunnel',
});
