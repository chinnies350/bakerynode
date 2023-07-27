const errorHandle = require("../services/errorHandler");
const commonMsgs = require("../CommonMsg.json");
const { poolPromise, sql } = require("../db");

class QrCodeController {
  async getDinningDataByRestaurantd(req, res) {
    try {
      if (!req.query.RestaurantId) res.json(commonMsgs.NullMsg);
      else {
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .input("RestaurantId", req.query.RestaurantId)
                        .execute("getDinningDataByRestaurantd")
        if (result.recordset[0].mainData!=null){
          res.json({status: true, data:JSON.parse(result.recordset[0].mainData)})

        }
        else{
          res.json({status: true, data: []})
        }
        }
    } catch (error) {
      errorHandle.handleError(error, errorRes => {
        res.send(errorRes);
      });
    }
  }
  // async getDinningDataByRestaurantd(req, res) {
  //   try {
  //     if (!req.query.RestaurantId) res.json(commonMsgs.NullMsg);
  //     else {
  //       const pool = await poolPromise;
  //       let result = await pool.query(
  //         `SELECT DinningId, DinningType from DinningMaster WHERE RestaurantId=${req.query.RestaurantId} AND ActiveStatus='A'`
  //       );
  //       if (result.recordset.length > 0) {
  //         res.json({ status: true, data: result.recordset });
  //       } else {
  //         res.json({ status: true, data: [] });
  //       }
  //     }
  //   } catch (error) {
  //     errorHandle.handleError(error, errorRes => {
  //       res.send(errorRes);
  //     });
  //   }
  // }

  async getTableIdByDinningId(req, res) {
    try {
      if (!req.query.DinningId) res.json(commonMsgs.NullMsg);
      else {
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .input("DinningId", req.query.DinningId)
                        .execute("getDinningTableData")
        if (result.recordset[0].mainData!=null){
          res.json({status: true, data:JSON.parse(result.recordset[0].mainData)})

        }
        else{
          res.json({status: true, data: []})
        }
        }
    } catch (error) {
      errorHandle.handleError(error, errorRes => {
        res.send(errorRes);
      });
    }
  }

  // async getTableIdByDinningId(req, res) {
  //   try {
  //     if (!req.query.DinningId) res.json(commonMsgs.NullMsg);
  //     else {
  //       const pool = await poolPromise;
  //       let result = await pool.query(
  //         `SELECT TableId, TableName, ChairCount FROM DinningTableMaster WHERE DinningId= ${req.query.DinningId} AND ActiveStatus='A'`
  //       );
  //       if (result.recordset.length > 0) {
  //         res.json({ status: true, data: result.recordset });
  //       } else {
  //         res.json({ status: true, data: [] });
  //       }
  //     }
  //   } catch (error) {
  //     errorHandle.handleError(error, errorRes => {
  //       res.send(errorRes);
  //     });
  //   }
  // }
}

const QrCode = new QrCodeController();

module.exports = QrCode;
