const handleErrors = (err, req, res, next) => {
   console.error(err);
   res.status(500).json({
      error: 'An error occurred while processing your request.',
   });
};

function asyncHandler(fn) {
   return (req, res, next) => {
      Promise.resolve(fn(req, res, next)).catch(next);
   };
}

module.exports = {
   handleErrors,
   asyncHandler,
};
