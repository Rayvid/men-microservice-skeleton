const healthCheckRoutes = require('./healthcheck');

module.exports = {
  healthCheck: healthCheckRoutes.healthCheck,
  sentryPing: healthCheckRoutes.sentryPing,
};
