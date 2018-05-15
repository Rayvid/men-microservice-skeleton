exports.up = function (knex, Promise) {
    return knex.schema.createTable('transactions', (table) => {
        table.increments('id').unsigned().primary();
        table.string('amount', 100).notNullable();
        table.integer('status').comment('1 - pending, 2 - accepted, 3 - persisted to blockchain, 4 - rejected ... add more on will').notNullable().defaultTo(1);
        table.string('payload', 65535).comment('any JSON attached to transaction').nullable();
        table.string('audit_trail', 65535).comment('JSON array, of events and their results [{"type":"event type-name","payload":{...}},...]').nullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at');
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('transactions');
};
