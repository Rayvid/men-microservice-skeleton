
exports.up = function(knex, Promise) {
    return knex.schema.createTable('blockchain', (table) => {
        table.string('address', 50).unique().notNullable();
        table.string('account_from', 50).notNullable();
        table.string('account_to', 50).notNullable();
        // Idea is that if all three above are equal - its transaction defining wallet creation
        table.string('amount', 100).notNullable();
        table.string('payload', 65535).comment('any JSON attached to transaction').nullable();
        table.string('audit_trail', 65535).comment('JSON array, of events and their results [{"timestamp":unixmilliseconds,"type":"event type-name","payload":{...}},...]').nullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
    }).then(function () {
        return knex('blockchain')
            .insert({
                account_from: '0',
                account_to:  '0', 
                address: '0',
                amount: '1000000000.000000000000000000', // 18 decimal places is kinda standard in cryptoworld
                payload: '{info: "Master wallet creation"}'
            });
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('blockchain');
};
