const config = require('./src/config');

module.exports = {

  development: {
    client: 'sqlite3',
    connection: { filename: config.db.sqliteDbFile },
    migrations: { tableName: 'knex_migrations' },
  },

  staging: {},

  production: {},

};
