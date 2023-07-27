const errorHandle = require("../services/errorHandler");
const commonMsgs = require("../CommonMsg.json");
const { poolPromise, sql } = require("../db");
const async = require("async");
const ApiService = require("../services/API_services");

class uploadImage{
  async upload(req, res) {
    try {
      if (!req.query.image) res.json(commonMsgs.NullMsg);
      else {
        const pool = await poolPromise;
        let result = await pool
          .request()
          .input("RestaurantId", req.query.RestaurantId)
          .query(
            `Select * FROM WaiterMappingMaster WHERE RestaurantId = @RestaurantId`
          );
          // console.log("+++",result.recordset)
        if (result.recordset.length > 0) {
          async.waterfall(
            [
              function(cb) {
                getWaiterName(req.query.RestaurantId, result.recordset).then(
                  () => {
                    cb(null);
                  }
                );
              },
              function(cb) {
                getDinningName(req.query.RestaurantId, result.recordset, () => {
                  cb(null);
                });
              }
            ],
            function(err, response) {
              res.json({ status: true, data: result.recordset });
            }
          );
        } else {
          res.json({ status: true, data: [] });
        }
      }
    } catch (error) {
      errorHandle.handleError(error, errorRes => {
        res.send(errorRes);
      });
    }
  }

}




const uploadImage = new uploadImage();

module.exports = uploadImage;
