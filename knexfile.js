const config = require('config');

module.exports = {

  development: {
    client: 'sqlite3',
    connection: { filename: config.get('sqlite_db_file') },
    migrations: { tableName: 'knex_migrations' },
  },

  staging: {},

  production: {},

};
