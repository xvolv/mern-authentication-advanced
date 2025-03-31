export const globalErrorHandler = async (err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message,
    error: err.stack,
  });
};
