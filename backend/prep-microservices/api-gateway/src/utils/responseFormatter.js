exports.formatSuccessResponse = (data, message = "Success") => ({
  success: true,
  message,
  data,
});

exports.formatErrorResponse = (message, statusCode) => ({
  success: false,
  message,
  errorCode: statusCode,
});
