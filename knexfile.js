module.exports = {

  development: {
    client: 'sqlite3',
    connection: { filename: './db/wallet.db' },
    migrations: { tableName: 'knex_migrations' },
  },

  staging: {},

  production: {},

};
