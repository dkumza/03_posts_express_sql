const handleErrors = (err, req, res, next) => {
   console.error(err);
   res.status(500).json({
      error: err.message,
   });
};

function asyncHandler(fn) {
   return (req, res, next) => {
      Promise.resolve(fn(req, res, next)).catch((err) => {
         console.error(err);
         res.status(500).json({
            error: 'An error occurred while processing your request.',
         });
      });
   };
}

module.exports = {
   handleErrors,
   asyncHandler,
};
