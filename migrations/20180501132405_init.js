exports.up = function (knex, Promise) {
    return knex.schema.createTable('transactions', (table) => {
        table.uuid('id').primary();
        table.string('amount', 100).notNullable();
        table.integer('status').comment('1 - pending, 2 - accepted, 3 - done and persisted to blockchain, 4 - rejected ... add more on will').notNullable().defaultTo(1);
        table.string('payload', 65535).comment('Any data, preferably JSON, attached to transaction, be carefull to not let PII info there').nullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at');
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('transactions');
};

// TODO - create audit_trail table and any other tables for internal relationships