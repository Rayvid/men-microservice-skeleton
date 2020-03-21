const mongoose = require('mongoose');
const schema = require('../schema');
const integrationRepoInitializer = require('./integration');
const { ModelException } = require('../../exceptions');

module.exports = (dbConnection) => {
  // Using mongoose constructor is mandatory when constructing mongoose objects.
  // It ensures schema validation logic is performed
  const SportsAppUserIntegrationConstructor = schema
    .sportsAppUserIntegrationSchema
    .connect(dbConnection);
  const integrationRepo = integrationRepoInitializer(dbConnection);

  return {
    getUserIntegration:
      // Lean is recommended
      // - saves alot of resources by returning plain object instead mongoose wrapper
      async (integrationName, userId, lean = true) => {
        const integration = await integrationRepo.getIntegration(integrationName);

        if (!integration) {
          throw new ModelException({ message: `Non existent integration - '${integrationName}'` });
        }

        const result = schema
          .sportsAppUserIntegrationSchema
          .connect(dbConnection)
          // eslint-disable-next-line no-underscore-dangle
          .findOne({ userId, integrationId: integration._id });

        return (lean) ? result.lean() : result;
      },

    saveOrUpdateUserIntegration:
      async ({ userId, integrationId, accessToken, expiresIn, refreshToken, authPayload }) => {
        // Keeping create and update separately you will save alot of code lines and complexity,
        // just want to demonstrate thats possible usign mongoose to merge these two if badly needed

        const lastSyncTimestamp = Math.floor(new Date() / 1000);
        const sportsAppUserIntegration = new SportsAppUserIntegrationConstructor({
          userId,
          integrationId,
          accessToken,
          expiresIn,
          refreshToken,
          authPayload,
          lastSyncTimestamp,
        });

        // TODO use some promisification lib instead custom code
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

        // Deleting _id property, because it's enforced when you use mongoose model
        /* eslint-disable no-underscore-dangle */
        let objectToUpdate = {};
        objectToUpdate = Object.assign(objectToUpdate, sportsAppUserIntegration._doc);
        delete objectToUpdate._id;
        /* eslint-enable no-underscore-dangle */

        return schema
          .sportsAppUserIntegrationSchema.connect(dbConnection)
          .findOneAndUpdate({
            userId,
            integrationId: mongoose.Types.ObjectId(integrationId.toString()),
          }, objectToUpdate, { upsert: true });
      },
  };
};
