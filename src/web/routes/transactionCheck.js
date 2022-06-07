export const getTransactions = async (req, res) => {
  const models = await res.locals.getModels();
  let limit = 10;

  if (req.query.last) {
    if (!isFinite(req.query.last)) {
      limit = 10;
    } else {
      limit = parseInt(req.query.last);
    }
  } else {
    limit = 10;
  }

  const transactions = await models.transaction.getTransaction(req.params.address, limit);
  res.status(200).json(transactions);
};

