exports.up = knex =>
  knex.schema.createTable('transactions', (table) => {
    table.increments('id').unsigned().primary();
  });

exports.down = knex => knex.schema.dropTable('transactions');
