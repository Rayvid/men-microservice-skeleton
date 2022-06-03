export const getNfts = async (req, res) => {
  const models = await res.locals.getModels();
  res.status(200).json(await models.nfts.getNfts());
};

export const setNftTransfered = async (req, res) => {
  const models = await res.locals.getModels();
  await models.nfts.setNftTransfered(req.body.mint, req.body.destinationWallet);
  res.status(200).json(await models.nfts.getNfts());
};
