const mongoose = require('mongoose');
const lympoMainStoreInitializer = require('lympo-mainstore');
const config = require('config');
const log = require('../util').logger;

module.exports = (app) => {
  // Connect to MongoDB
  // Probably this requires some explanation, because handled in quite awkward manner.
  //
  // Theres two main methods of handling any db connection - per request or globally pooled/managed.
  // Per request is universal, but bit slow for most db drivers
  // We are trying to not hardbind to mongo, so thats general statement.
  //
  // So we are using standard pooled mongoose implementation for now, but still retain
  // flexibility to be able to produce connections in custom manner in future
  //
  // EDIT: adding per database connection as result of discussion to decouple domains
  // probably with time we will need to add more generic connection handler to handle
  // different underlaying databases - for now using mongoose
  const connectedDatabases = {};
  const dbConnectionFactory = (database) => {
    if (!connectedDatabases[database]) {
      mongoose
        .connect(config.get('db').mongoUrl.replace('{dbName}', database)) // Use one connection string for all DBs for now
        .catch((err) => {
          log.error(`Mongo connection problems - ${err.message}`);
          process.exit(1); // Not much else we can do just restart in hopes to recover
        });
      connectedDatabases[database] = mongoose.connection;
    }
    return connectedDatabases[database];
  };

  // To not even initialize db wheres its not needed, models are lazy, populated by getModels
  app.use(async (req, res, next) => {
    res.locals.getModels = function getModels(database = 'Users') {
      if (!res.locals.models) {
        res.locals.models = [];
      }

      if (!res.locals.models[database]) {
        res.locals.models[database] = lympoMainStoreInitializer(dbConnectionFactory(database));
      }

      return res.locals.models[database];
    };

    next();
  });
};
