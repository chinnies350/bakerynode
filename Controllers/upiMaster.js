const errorHandle = require("../services/errorHandler");
const commonMsgs = require("../CommonMsg.json");
const { poolPromise, sql } = require("../db");
const async = require("async");

class UPIMasterController {
  async getAllUPIDataByResId(req, res) {
    try {
      if (!req.query.RestaurantId) res.json(commonMsgs.NullMsg);
      else {
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .input("RestaurantId",req.query.RestaurantId)
                        .execute("getAllUPIDataByResId")
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
  // async getAllUPIDataByResId(req, res) {
  //   try {
  //     if (!req.query.RestaurantId) res.json(commonMsgs.NullMsg);
  //     else {
  //       const pool = await poolPromise;
  //       let result = await pool
  //         .request()
  //         .input("RestaurantId", req.query.RestaurantId)
  //         .query(`SELECT * FROM UPIMaster WHERE RestaurantId = @RestaurantId`);
  //       res.json({ status: true, data: result.recordset });
  //     }
  //   } catch (error) {
  //     errorHandle.handleError(error, errorRes => {
  //       res.send(errorRes);
  //     });
  //   }
  // }

  async getUPIDataByUPIId(req, res) {
    try {
      if (!req.query.RestaurantId && !req.query.UPIMasterId)
        res.json(commonMsgs.NullMsg);
        else {
          const pool = await poolPromise;
          let result = await pool
                          .request()
                          .input("RestaurantId",req.query.RestaurantId)
                          .input("UPIMasterId",req.query.UPIMasterId)
                          .execute("getAllUPIDataByResId")
          if (result.recordset[0].mainData!=null){
            res.json({status: true, data:JSON.parse(result.recordset[0].mainData)})
  
          }
          else{
            res.json({status: true, message: "No data Found!" })
          }
          }
    } catch (error) {
      errorHandle.handleError(error, errorRes => {
        res.send(errorRes);
      });
    }
  }

  // async getUPIDataByUPIId(req, res) {
  //   try {
  //     if (!req.query.RestaurantId && !req.query.UPIMasterId)
  //       res.json(commonMsgs.NullMsg);
  //     const pool = await poolPromise;
  //     const result = await pool
  //       .request()
  //       .input("RestaurantId", req.query.RestaurantId)
  //       .input("UPIMasterId", req.query.UPIMasterId)
  //       .query(
  //         `SELECT * FROM UPIMaster WHERE RestaurantId = @RestaurantId AND UPIMasterId = @UPIMasterId`
  //       );
  //     if (result.recordset.length > 0) {
  //       res.json({ status: true, data: result.recordset });
  //     } else {
  //       res.json({ status: true, message: "No data Found!" });
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
          req.body.Name &&
          req.body.Mobile &&
          req.body.UPIId &&
          req.body.CreatedBy
        )
      )
        res.json(commonMsgs.NullMsg);
      else {
          const pool = await poolPromise;
          let result = await pool
                          .request()
                          .input("RestaurantId", req.body.RestaurantId)
                          .input("Name", req.body.Name)
                          .input("Mobile",req.body.Mobile)
                          .input("UPIId",req.body.UPIId)
                          .input("CreatedBy",req.body.CreatedBy)
                          .execute("addUPIData")
          if (result.recordset[0][""][1] == 1) {
            res.json({status: true, message:result.recordset[0][""][0]});
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
  //         req.body.Name &&
  //         req.body.Mobile &&
  //         req.body.UPIId &&
  //         req.body.CreatedBy
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
  //       let result = await pool.query(
  //         `BEGIN
  //           IF NOT EXISTS (SELECT * FROM UPIMaster 
  //              WHERE RestaurantId='${req.body.RestaurantId}' AND UPIId = '${req.body.UPIId}')
  //           BEGIN
  //             INSERT INTO UPIMaster (${ColNameQuery})
  //             VALUES (${ColValueQuery})
  //           END
  //         END`
  //       );
  //       if (result.rowsAffected.length == 0) {
  //         res.json({ status: false, message: "UPI Id already exists!" });
  //       } else {
  //         pool.query(
  //           `SELECT Top 1 UPIMasterId FROM UPIMaster ORDER BY UPIMasterId DESC`,
  //           function(err, result) {
  //             if (err) {
  //               throw err;
  //             } else {
  //               pool.query(
  //                 `UPDATE UPIMaster SET ActiveStatus = 'D' WHERE UPIMasterId != ${result.recordset[0].UPIMasterId}`,
  //                 function(err, result) {
  //                   if (err) {
  //                     throw err;
  //                   }
  //                   res.json(commonMsgs.AddMsg);
  //                 }
  //               );
  //             }
  //           }
  //         );
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
      const { RestaurantId, UPIMasterId, UpdatedBy } = req.body;
      if (!RestaurantId || !UPIMasterId || !UpdatedBy)
        return res.json(commonMsgs.NullMsg);
      else {
          const pool = await poolPromise;
          let result = await pool
                          .request()
                          .input("RestaurantId", req.body.RestaurantId)
                          .input("UPIMasterId", req.body.UPIMasterId)
                          .input("Name",req.body.Name)
                          .input("Mobile",req.body.Mobile)
                          .input("UPIId",req.body.UPIId)
                          .input("UpdatedBy",req.body.UpdatedBy)
                          .execute("updateUPIData")
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
  //     const { RestaurantId, UPIMasterId, UpdatedBy } = req.body;
  //     if (!RestaurantId || !UPIMasterId || !UpdatedBy)
  //       return res.json(commonMsgs.NullMsg);
  //     let queryValue = null;
  //     for (const [key, value] of Object.entries(req.body)) {
  //       if (key != "UPIMasterId")
  //         queryValue == null
  //           ? (queryValue = `${key}='${value}'`)
  //           : (queryValue += `,${key}='${value}'`);
  //     }
  //     const pool = await poolPromise;
  //     await pool.query(
  //       `UPDATE UPIMaster SET ${queryValue}, UpdatedDate = GETDATE()  WHERE UPIMasterId = ${UPIMasterId} AND RestaurantId = ${RestaurantId}`
  //     );
  //     res.json(commonMsgs.updateMsg);
  //   } catch (error) {
  //     errorHandle.handleError(error, errorRes => {
  //       res.send(errorRes);
  //     });
  //   }
  // }


  async deleteData(req, res) {
    const { RestaurantId, ActiveStatus, UPIMasterId } = req.query;
    try {
      if (!UPIMasterId || !ActiveStatus) return res.json(commonMsgs.NullMsg);
      else {
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .input("ActiveStatus", req.query.ActiveStatus)
                        .input("UPIMasterId", req.query.UPIMasterId)
                        .input("RestaurantId",req.query.RestaurantId)
                        .execute("deleteUPIData")
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
  //   const { RestaurantId, ActiveStatus, UPIMasterId } = req.query;
  //   try {
  //     if (!UPIMasterId || !ActiveStatus) return res.json(commonMsgs.NullMsg);
  //     const pool = await poolPromise;
  //     await pool.query(
  //       `UPDATE UPIMaster SET ActiveStatus = '${ActiveStatus}' WHERE UPIMasterId = '${UPIMasterId}' AND RestaurantId = ${RestaurantId}; UPDATE UPIMaster SET ActiveStatus = 'D' WHERE UPIMasterId != '${UPIMasterId}' AND RestaurantId = ${RestaurantId}`
  //     );
  //     res.json(commonMsgs.deleteMsg);
  //   } catch (error) {
  //     errorHandle.handleError(error, errorRes => {
  //       res.send(errorRes);
  //     });
  //   }
  // }
}

const upiMaster = new UPIMasterController();

module.exports = upiMaster;
