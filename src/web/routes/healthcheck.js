module.exports = async (req, res) => {
  // Uncomment next line if you need Mongo connectivity check
  // res.locals.getModels();
  res.status(200).json({ status: 'healthy' });
};
