export const asyncErrorHandler = (func) => {
  return async (req, res, next) => {
    return await func(req, res, next).catch((error) => {
      next(error);
    });
  };
};
