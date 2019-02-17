const schema = require('../schema');
const integrationRepoInitializer = require('./integration');
const { ModelException } = require('../../exceptions');
const mongoose = require('mongoose');

module.exports = (dbConnection) => {
  // Using mongoose constructor is mandatory when constructing mongoose objects.
  // It ensures schema validation logic is performed
  const SportsAppUserIntegrationConstructor =
    schema.sportsAppUserIntegrationSchema.getActiveSchema(dbConnection);
  const integrationRepo = integrationRepoInitializer(dbConnection);

  return {
    getUserAppIntegration:
      // Lean is recommended
      // - saves alot of resources by returning plain object instead mongoose wrapper
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
        // Keeping create and update separately you will save alot of code lines and complexity,
        // just want to demonstrate thats possible usign mongoose to merge these two if badly needed

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

        let promiseComplete;
        let promiseReject;
        const validationPromise = new Promise((complete, reject) => {
          promiseComplete = complete;
          promiseReject = reject;
        });
        sportsAppUserIntegration.validate((err) => {
          if (err) {
            promiseReject(err);
          } else {
            promiseComplete();
          }
        });
        await validationPromise;

        // Funny working update pattern found on stack overflow. If do update straight
        // with mongoose object, some error about 'unable to update _id' is raised
        // so cloning and deleting _id before proceeding
        /* eslint-disable no-underscore-dangle */
        let objectToUpdate = {};
        objectToUpdate = Object.assign(objectToUpdate, sportsAppUserIntegration._doc);
        delete objectToUpdate._id;
        /* eslint-enable no-underscore-dangle */

        return schema
          .sportsAppUserIntegrationSchema.getActiveSchema(dbConnection)
          .findOneAndUpdate({
            userId,
            integrationId: mongoose.Types.ObjectId(integrationId.toString()),
          }, objectToUpdate, { upsert: true });
      },
  };
};
