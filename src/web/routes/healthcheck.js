// Uncomment if you need Mongo connectivity check
const exceptions = require('../../exceptions');

module.exports = {
  healthCheck: async (req, res) => {
    // eslint-disable-next-line prefer-const
    let result = { status: 'healthy' };
    // Sample of Mongo connectivity check, if will fail on your mongo, its just to give idea
    // try {
    //   result = {
    //     status: 'healthy',
    //     stravaId: (await (await res.locals.getModels()).getStravaIntegration())._id,
    //   };
    // } catch (err) {
    //   throw new exceptions.Exception({ message: 'Health check failed', innerError: err, fields: [{id:1}] });
    // }
    //

    res.status(200).json(result);
  },
  /* eslint-disable no-unused-vars */
  sentryPing: async (req, res) => {
    /* eslint-enable no-unused-vars */
    throw new exceptions.Exception({ message: 'Pinging sentry' });
  },
};
