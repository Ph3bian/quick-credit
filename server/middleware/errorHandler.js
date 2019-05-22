// eslint-disable-next-line no-unused-vars
export default (error, req, res, next) => {
  return res.status(500).json({
    status: 500,
    error: error.message,
  });
};
