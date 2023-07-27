var request = require("request");
const { TTDC_Live_API,TTDC_Live_API_Dev } = require("../config.json");

var API_Services = function() {};

module.exports = API_Services;

API_Services.prototype.getHotelConfig = function(id, cb) {
  try {
    var req = {
      url: "http://prematix.solutions/TTDCAPI/api/ConfigMstrList/Type",
      body: {
        TypeId: id
      },
      json: true
    };

    request.post(req, (err, res, body) => {
      if (body.hasOwnProperty("Response")) {
        cb(body.Response);
      } else {
        cb(null);
      }
    });
  } catch (err) {
    throw err;
  }
};

API_Services.prototype.getUserNames = function(cb) {
  try {
    request.get(
      "http://ttdc.in/TTDCAPI/api/EmpMstr/ListAll",
      (err, res, body) => {
        body = JSON.parse(body);
        if (body.hasOwnProperty("Response")) {
          cb(body.Response);
        } else {
          cb(null);
        }
      }
    );
  } catch (err) {
    throw err;
  }
};

API_Services.prototype.CMCommonReport = function(RestaurantId, cb) {
  try {
    var req = {
      url: TTDC_Live_API + "CM_CommonReport",
      body: {
        QueryType: "GetEmpMaster",
        ServiceType: "User",
        CorpId: "",
        Input1: "3",
        Input2: RestaurantId,
        Input3: "",
        Input4: "",
        Input5: ""
      },
      json: true
    };
    // console.log("req",req)

    request.post(req, (err, res, body) => {
      // console.log("Body...", body);
      if (body.hasOwnProperty("Table")) {
        cb(body.Table);
      } else {
        cb(null);
      }
    });
  } catch (err) {
    throw err;
  }
};
