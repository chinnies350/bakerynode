module.exports.handleError = function(error, cb) {
  if (error.name == "RequestError") {
    if (error.message.includes("Violation of PRIMARY KEY")) {
      error = "You are trying to add a duplicate value.";
    }
  }
  cb(
    error.hasOwnProperty("message")
      ? { status: false, message: error.message }
      : { status: false, message: error }
  );
};
