
exports.up = function(knex, Promise) {
    return knex.schema.createTable('blockchain', (table) => {
        table.string('address', 50).primary();
        table.string('address_from', 50).notNullable();
        table.string('address_to', 50).notNullable();
        // Idea is that if all three above are equal - its transaction defining wallet creation
        table.string('amount', 100).notNullable(); // For wallet it should be 0
        table.string('metadata', 65535).comment('Any additional internal data about record, preferably JSON').nullable();
        table.string('payload', 65535).comment('Any data, preferably JSON, attached to transaction, be carefull to not let PII info there').nullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
    }).then(function () {
        return knex('blockchain')
            .insert({
                address_from: '0',
                address_to:  '0', 
                address: '0',
                amount: '0',
                payload: '{info: "God wallet creation"}' // This wallet is able to issue money, despite it always has 0 balance
            })
            .insert({
                address_from: '10',
                address_to:  '10', 
                address: '10',
                amount: '0',
                payload: '{info: "Master wallet creation"}'
            })
            .insert({
                address_from: '0',
                address_to:  '10', 
                address: '20',
                amount: '1000000000.00000000000000000', // 18 decimal places is kinda standard in cryptoworld
                payload: '{info: "God issues money to master"}'
            })
            .insert({
                address_from: '0',
                address_to:  '0', 
                address: '40',
                amount: '0',
                metadata: '{role_restriction: "superuser"}'
            });;
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('blockchain');
};
