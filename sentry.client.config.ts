import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: 'https://431b75ece452928152ebe75ff2e5c435@o4507709229891584.ingest.de.sentry.io/4507709232971856',
  integrations: [Sentry.replayIntegration()],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});
