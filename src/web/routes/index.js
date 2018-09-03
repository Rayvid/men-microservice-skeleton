const healthCheckRoutes = require('./healthcheck');
const versionCheck = require('./versionCheck');

module.exports = {
  healthCheck: healthCheckRoutes.healthCheck,
  sentryPing: healthCheckRoutes.sentryPing,
  versionCheck,
};
