var request = require("request");
var opencagedataKey = require("../config.json").opencagedataKey;
const errorHandle = require("./errorHandler");

var GoogleServices = function () {};

module.exports = GoogleServices;

GoogleServices.prototype.getCityLatLong = function (city, cb) {
  try {
    request.get(
      `https://api.opencagedata.com/geocode/v1/json?q=${city}&key=${opencagedataKey}`,
      (err, res, body) => {
        if (err) throw err;
        body = JSON.parse(body);
        if (body.hasOwnProperty("results")) {
          cb(body.results);
        } else {
          cb(null);
        }
      }
    );
  } catch (err) {
    errorHandle.handleError(err, (errorRes) => {
      res.send(errorRes);
    });
  }
};
