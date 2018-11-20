const schema = require('../schema');
const integrationInitializer = require('./integration');
const { ModelException } = require('../../exceptions');
const mongoose = require('mongoose');

module.exports = (dbConnection) => {
  // Sometimes you need model constructor to run mongoose stuff like validators
  const SportsAppUserIntegrationConstructor =
    schema.sportsAppUserIntegrationSchema(dbConnection);
  // Lets called decoupled from db models - repo
  const integrationRepo = integrationInitializer(dbConnection);

  return {
    getUserAppIntegration:
      async (integrationName, userId, lean = true) => {
        const integration = await integrationRepo.getIntegration(integrationName);

        if (!integration) {
          throw new ModelException({ message: `Non existent integration - '${integrationName}'` });
        }

        const result = schema
          .sportsAppUserIntegrationSchema(dbConnection)
          // eslint-disable-next-line no-underscore-dangle
          .findOne({ userId, integrationId: integration._id });

        return (lean) ? result.lean() : result;
      },

    saveOrUpdateUserIntegration:
      async ({ userId, integrationId, accessToken, expiresIn, refreshToken, authPayload }) => {
        const lastSyncTimestamp = Math.floor(new Date() / 1000);
        const sportsAppUserIntegration =
          new SportsAppUserIntegrationConstructor({
            userId,
            integrationId,
            accessToken,
            expiresIn,
            refreshToken,
            authPayload,
            lastSyncTimestamp,
          });

        sportsAppUserIntegration.validateSync();

        // Funny working update pattern found on stack overflow. If do update straight
        // with mongoose object, some error about 'unable to update _id' is raised
        // so cloning and deleting _id before proceeding
        /* eslint-disable no-underscore-dangle */
        let objectToUpdate = {};
        objectToUpdate = Object.assign(objectToUpdate, sportsAppUserIntegration._doc);
        delete objectToUpdate._id;
        /* eslint-enable no-underscore-dangle */

        return schema
          .sportsAppUserIntegrationSchema(dbConnection)
          .findOneAndUpdate({
            userId,
            integrationId: mongoose.Types.ObjectId(integrationId.toString()),
          }, objectToUpdate, { upsert: true });
      },
  };
};
