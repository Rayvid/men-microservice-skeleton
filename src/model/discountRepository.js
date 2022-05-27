import * as schema from './schema/index.js';

export default (dbConnection) => ({
  getDiscount: async (code, lean = true) => {
    const result = schema
        .discount.connect(dbConnection)
        .findOne({code});

    return (lean) ? result.lean() : result;
  },

  createDiscount: async (discount) => schema
      .discount.connect(dbConnection)
      .create(discount),
});
