// eslint-disable-next-line no-unused-vars
export default (error, req, res, next) => res.status(500).json({
  success: false,
  error: error.message,
});
