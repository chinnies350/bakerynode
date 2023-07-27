const errorHandle = require("../services/errorHandler");
const commonMsgs = require("../CommonMsg.json");
const { poolPromise, sql } = require("../db");

class FoodTimingMasterController {
  async getData(req, res) {
    try {
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .input("FoodTimingId", req.query.FoodTimingId)
                        .input("RestaurantId", req.query.RestaurantId)
                        .execute("getFoodTimingData")
        if (result.recordset[0].mainData!=null){
          res.json({status: true, data:JSON.parse(result.recordset[0].mainData)})

        }
        else{
          res.json({status: true, data:[]})
        }

    }
    catch (error) {
      errorHandle.handleError(error, errorRes => {
        res.send(errorRes);
      });
    }
  }
  // async getData(req, res) {
  //   try {
  //     if (!req.query.FoodTimingId && !req.query.RestaurantId)
  //       res.json(commonMsgs.NullMsg);
  //     else {
  //       const pool = await poolPromise;
  //       let result = await pool.query(
  //         `select RestaurantId, FoodTimingName, ActiveStatus, FoodTimingId, CreatedBy, UpdatedBy, substring(convert(char(8),StartTime,114), 1, 5) as StartTime, substring(convert(char(8),EndTime,114), 1, 5) as EndTime from FoodTimingMaster where FoodTimingId= ${req.query.FoodTimingId} AND RestaurantId= ${req.query.RestaurantId} AND ActiveStatus='A'`
  //       );
  //       res.json({ status: true, data: result.recordset });
  //     }
  //   } catch (error) {
  //     errorHandle.handleError(error, errorRes => {
  //       res.send(errorRes);
  //     });
  //   }
  // }

  async getAllFoodTimingDataByResId(req, res) {
    try {
      if (!req.query.RestaurantId) res.json(commonMsgs.NullMsg);
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .input("RestaurantId", req.query.RestaurantId)
                        .execute("getFoodTimingData")
        if (result.recordset[0].mainData!=null){
          res.json({status: true, data:JSON.parse(result.recordset[0].mainData)})

        }
        else{
          res.json({status: true, data:[]})
        }

    }
    catch (error) {
      errorHandle.handleError(error, errorRes => {
        res.send(errorRes);
      });
    }
  }
  // async getAllFoodTimingDataByResId(req, res) {
  //   try {
  //     if (!req.query.RestaurantId) res.json(commonMsgs.NullMsg);
  //     else {
  //       const pool = await poolPromise;
  //       let result = await pool.query(
  //         `select RestaurantId, 
  //               FoodTimingName, 
  //               ActiveStatus, 
  //               FoodTimingId, 
  //               CreatedBy, 
  //               UpdatedBy, 
  //               substring(convert(char(8),StartTime,114), 1, 5) as StartTime, 
  //               substring(convert(char(8),EndTime,114), 1, 5) as EndTime 
  //               from FoodTimingMaster 
  //               where RestaurantId= ${req.query.RestaurantId}
  //               ORDER BY FoodTimingId
  //              `
  //       );
  //       res.json({ status: true, data: result.recordset });
  //     }
  //   } catch (error) {
  //     errorHandle.handleError(error, errorRes => {
  //       res.send(errorRes);
  //     });
  //   }
  // }

  async addData(req, res) {
    try {
      if (
        !(
          req.body.RestaurantId &&
          req.body.FoodTimingName &&
          req.body.FoodTimingId &&
          req.body.CreatedBy &&
          req.body.StartTime &&
          req.body.EndTime
        )
      )
        res.json(commonMsgs.NullMsg);
      else {
          const pool = await poolPromise;
          let result = await pool
                          .request()
                          .input("RestaurantId", req.body.RestaurantId)
                          .input("FoodTimingName", req.body.FoodTimingName)
                          .input("FoodTimingId",req.body.FoodTimingId)
                          .input("StartTime",req.body.StartTime)
                          .input("EndTime",req.body.EndTime)
                          .input("CreatedBy",req.body.CreatedBy)
                          .execute("addFoodTimingData")
          if (result.recordset[0][""][1] == 1) {
            res.json(commonMsgs.AddMsg);
          }
          else {
            res.json({status: false, message:result.recordset[0][""][0]})
          }
          }
    } catch (error) {
      errorHandle.handleError(error, errorRes => {
        res.send(errorRes);
      });
    }
  }
  // async addData(req, res) {
  //   try {
  //     if (
  //       !(
  //         req.body.RestaurantId &&
  //         req.body.FoodTimingName &&
  //         req.body.FoodTimingId &&
  //         req.body.CreatedBy &&
  //         req.body.StartTime &&
  //         req.body.EndTime
  //       )
  //     )
  //       res.json(commonMsgs.NullMsg);
  //     else {
  //       let ColNameQuery = "ActiveStatus",
  //         ColValueQuery = "'A'";
  //       for (let key in req.body) {
  //         if (req.body[key]) {
  //           ColNameQuery += `${ColNameQuery != `` ? `,` : ``}${key}`;
  //           ColValueQuery += `${ColValueQuery != `` ? `,` : ``}'${
  //             req.body[key]
  //           }'`;
  //         }
  //       }
  //       const pool = await poolPromise;
  //       //here in query added restaurantId
  //       let result = await pool.query(
  //         `BEGIN
  //               IF NOT EXISTS (SELECT * FROM FoodTimingMaster 
  //                  WHERE FoodTimingId = '${req.body.FoodTimingId}' and RestaurantId='${req.body.RestaurantId}')
                   
  //               BEGIN
  //                 INSERT INTO FoodTimingMaster (${ColNameQuery})
  //                 VALUES (${ColValueQuery})
  //               END
  //             END`
  //       );
  //       if (result.rowsAffected.length == 0) {
  //         res.json({
  //           status: false,
  //           message: "Food Timing name already exists!"
  //         });
  //       } else {
  //         res.json(commonMsgs.AddMsg);
  //       }
  //     }
  //   } catch (error) {
  //     errorHandle.handleError(error, errorRes => {
  //       res.send(errorRes);
  //     });
  //   }
  // }

  async updateData(req, res) {
    try {
      const { FoodTimingId, UpdatedBy } = req.body;
      if (!FoodTimingId || !UpdatedBy) return res.json(commonMsgs.NullMsg);
      else {
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        // .input("UniqueId", req.body.UniqueId)
                        .input("RestaurantId",req.body.RestaurantId)
                        .input("FoodTimingName",req.body.FoodTimingName)
                        .input("FoodTimingId",req.body.FoodTimingId)
                        .input("StartTime",req.body.StartTime)
                        .input("EndTime",req.body.EndTime)
                        .input("Updatedby",req.body.UpdatedBy)
                        .execute("updateFoodTimingData")
        if (result.recordset[0][""][1] == 1) {
          res.json(commonMsgs.updateMsg);
        }
        else {
          res.json({status: false, message:result.recordset[0][""][0]})
        }
        }
    } catch (error) {
      errorHandle.handleError(error, errorRes => {
        res.send(errorRes);
      });
    }
  }
  // async updateData(req, res) {
  //   try {
  //     const { FoodTimingId, UpdatedBy } = req.body;
  //     if (!FoodTimingId || !UpdatedBy) return res.json(commonMsgs.NullMsg);
  //     let queryValue = null;
  //     for (const [key, value] of Object.entries(req.body)) {
  //       if (key != "FoodTimingId")
  //         queryValue == null
  //           ? (queryValue = `${key}='${value}'`)
  //           : (queryValue += `,${key}='${value}'`);
  //     }
  //     const pool = await poolPromise;
  //     await pool.query(
  //       `UPDATE FoodTimingMaster SET ${queryValue} WHERE FoodTimingId = ${FoodTimingId}`
  //     );
  //     res.json(commonMsgs.updateMsg);
  //   } catch (error) {
  //     errorHandle.handleError(error, errorRes => {
  //       res.send(errorRes);
  //     });
  //   }
  // }

  async deleteData(req, res) {
    const { ActiveStatus, FoodTimingId } = req.query;
    try {
      if (!FoodTimingId || !ActiveStatus) return res.json(commonMsgs.NullMsg);
      else {
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .input("ActiveStatus", req.query.ActiveStatus)
                        .input("FoodTimingId", req.query.FoodTimingId)
                        .execute("deleteFoodTimingData")
        if (result.recordset[0][""][1] == 1) {
          res.json(commonMsgs.deleteMsg);
        }
        else {
          res.json({status: false, message:result.recordset[0][""][0]})
        }
        }
    } catch (error) {
      errorHandle.handleError(error, errorRes => {
        res.send(errorRes);
      });
    }
  }
  // async deleteData(req, res) {
  //   const { ActiveStatus, FoodTimingId } = req.query;
  //   try {
  //     if (!FoodTimingId || !ActiveStatus) return res.json(commonMsgs.NullMsg);
  //     const pool = await poolPromise;
  //     await pool.query(
  //       `UPDATE FoodTimingMaster SET ActiveStatus = '${ActiveStatus}'  WHERE FoodTimingId = '${FoodTimingId}'`
  //     );
  //     res.json(commonMsgs.deleteMsg);
  //   } catch (error) {
  //     errorHandle.handleError(error, errorRes => {
  //       res.send(errorRes);
  //     });
  //   }
  // }
}

const FoodTimingMaster = new FoodTimingMasterController();

module.exports = FoodTimingMaster;
