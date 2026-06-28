const errorHandler = (err, req, res, next) => {
  console.error(err);
  return res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};

export default errorHandler;
