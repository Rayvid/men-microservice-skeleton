const exceptions = require('../../exceptions');

module.exports = {
  // eslint-disable-next-line no-unused-vars
  healthCheck: async (req, res) => {
    // eslint-disable-next-line prefer-const
    let result = { status: 'healthy' };
    try {
      try {
        await (await res.locals.getModels()).createIntegration({ provider: 'strava', connectionParams: { param1: '1', param2: '2' } });
      } catch (err) {
        // It can fail if run multiple times - it is fine
      }

      result = {
        status: 'healthy',
        // eslint-disable-next-line no-underscore-dangle
        stravaId: (await (await res.locals.getModels()).getStravaIntegration())._id,
      };
    } catch (err) {
      throw new exceptions.Exception({ message: 'Health check failed', innerError: err });
    }

    res.status(200).json(result);
  },
  // eslint-disable-next-line no-unused-vars
  sentryPing: async (req, res) => {
    throw new exceptions.Exception({ message: 'Pinging sentry' });
  },
};
