const sportsAppRepositoryInitializer = require('./sportsAppRepository');

module.exports = (dbConnection) => sportsAppRepositoryInitializer(dbConnection);
