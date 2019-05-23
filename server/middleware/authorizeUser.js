export default async (req, res, next) => {
  const { isAdmin } = req.user;
  if (!isAdmin) {
    return res.status(401).json({
      status: 401,
      error: 'Unauthorized',
    });
  }
  next();
};
