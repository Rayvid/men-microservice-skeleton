
exports.up = function (knex, Promise) {
    return knex.schema.createTable('wallets', (table) => {
        table.uuid('id').notNullable().primary();
        table.integer('status').comment('1 - open, 2 - closed ... add more on will').notNullable().defaultTo(1);
        table.string('balance', 100).notNullable();
        table.string('metadata', 65535).comment('JSON').notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at');
    }).then(function () {
        return knex('wallets')
            .insert({
                id: 'd6cb9bfb-61fb-4851-9344-c842f2cd6873',
                balance: '1000000000.000000000000000000', // 18 decimal places is kinda standard in cryptoworld
                metadata: '{"blockchain_address": 0, "account_type": "Master lympo wallet", "reference_account_id": null}'
            });
    }).then(function () {
        return knex.schema.table('transactions', function (table) {
            table.uuid('account_from').references('id').inTable('wallets').notNullable().default('d6cb9bfb-61fb-4851-9344-c842f2cd6873');
            table.uuid('account_to').references('id').inTable('wallets').notNullable().default('d6cb9bfb-61fb-4851-9344-c842f2cd6873');
        });
    });
}

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('wallets');
};
