// Uncomment if you need Mongo connectivity check
const exceptions = require('../../exceptions');

module.exports = {
  healthCheck: async (req, res) => {
    // Sample of Mongo connectivity check
    // try {
    //   (await (await res.locals.getModels()).getStravaIntegration()).provider.toString();
    // } catch (err) {
    //   throw new exceptions.Exception({ message: 'Health check failed', innerError: err });
    // }

    res.status(200).json({ status: 'healthy' });
  },
  /* eslint-disable no-unused-vars */
  sentryPing: async (req, res) => {
    /* eslint-enable no-unused-vars */
    throw new exceptions.Exception({ message: 'Pinging sentry' });
  },
};
