const sportsAppModelInitializer = require('./sportsApp');

module.exports = dbConnection => sportsAppModelInitializer(dbConnection);
