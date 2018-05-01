exports.up = function (knex, Promise) {
    return knex.schema.createTable('transactions', (table) => { table.increments('id').unsigned().primary() });
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('transactions');
};
