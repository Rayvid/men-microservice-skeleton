import * as exceptions from '../../exceptions/index.js';
import {logger as log} from '../../util/index.js';

// eslint-disable-next-line no-unused-vars
export const healthCheck = async (req, res) => {
  let result = {status: 'healthy'};
  const models = await res.locals.getModels();
  try {
    try {
      await models.createIntegration({provider: 'strava', connectionParams: {param1: '1', param2: '2'}});
    } catch (err) {
      // It can fail if run multiple times due uniqueness - it is fine
      log.warn(err);
    }

    result = {
      status: 'healthy',
      // eslint-disable-next-line no-underscore-dangle
      stravaId: (await models.getStravaIntegration())._id,
    };
  } catch (err) {
    throw new exceptions.Exception({message: 'Health check failed', innerError: err});
  }

  res.status(200).json(result);
};

// eslint-disable-next-line no-unused-vars
export const sentryPing = async (req, res) => {
  throw new exceptions.Exception({message: 'Pinging sentry'});
};
