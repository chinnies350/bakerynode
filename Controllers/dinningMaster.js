const errorHandle = require("../services/errorHandler");
const commonMsgs = require("../CommonMsg.json");
const utiityFile = require("../utility");
const { poolPromise, sql } = require("../db");
var API_Services = require("../services/API_services");

class DinningMasterController {
  async getData(req, res) {
    try {
      if (!req.query.DinningId) res.json(commonMsgs.NullMsg);
      else {
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .input("DinningId", req.query.DinningId)
                        .execute("getDinningData")
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
  // async getData(req, res) {
  //   try {
  //     if (!req.query.DinningId) res.json(commonMsgs.NullMsg);
  //     else {
  //       const pool = await poolPromise;
  //       let result = await pool.query(
  //         `select * from DinningMaster where DinningId= ${req.query.DinningId} AND ActiveStatus='A'`
  //       );
  //       res.json({ status: true, data: result.recordset });
  //     }
  //   } catch (error) {
  //     errorHandle.handleError(error, errorRes => {
  //       res.send(errorRes);
  //     });
  //   }
  // }
  async getDataByResId(req, res) {
    try {
      if (!req.query.RestaurantId) res.json(commonMsgs.NullMsg);
      else {
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .input("RestaurantId", req.query.RestaurantId)
                        .execute("getDinningData")
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
  // async getDataByResId(req, res) {
  //   try {
  //     if (!req.query.RestaurantId) res.json(commonMsgs.NullMsg);
  //     else {
  //       const pool = await poolPromise;
  //       let result = await pool.query(
  //         // `select * from DinningMaster where RestaurantId= ${req.query.RestaurantId} AND ActiveStatus='A'`
  //         `select * from DinningMaster where RestaurantId= ${req.query.RestaurantId}`
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
        !(req.body.RestaurantId && req.body.DinningType && req.body.CreatedBy)
      )
        res.json(commonMsgs.NullMsg);
      else {
          const pool = await poolPromise;
          let result = await pool
                          .request()
                          .input("RestaurantId", req.body.RestaurantId)
                          .input("DinningType", req.body.DinningType)
                          .input("CreatedBy",req.body.CreatedBy)
                          .execute("addDinningData")
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
  //       !(req.body.RestaurantId && req.body.DinningType && req.body.CreatedBy)
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
  //               IF NOT EXISTS (SELECT * FROM DinningMaster 
  //                  WHERE DinningType = '${req.body.DinningType}' and RestaurantId='${req.body.RestaurantId}')
  //               BEGIN
  //                 INSERT INTO DinningMaster (${ColNameQuery})
  //                 VALUES (${ColValueQuery})
  //               END
  //             END`
  //       );
  //       if (result.rowsAffected.length == 0) {
  //         res.json({ status: false, message: "Dinning type already exists!" });
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
      const { DinningId, UpdatedBy, RestaurantId } = req.body;
      if (!DinningId || !UpdatedBy || !RestaurantId) return res.json(commonMsgs.NullMsg);
      else {
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .input("DinningId", req.body.DinningId)
                        .input("RestaurantId",req.body.RestaurantId)
                        .input("DinningType",req.body.DinningType)
                        .input("UpdatedBy",req.body.UpdatedBy)
                        .execute("updateDinningData")
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
  //     const { DinningId, UpdatedBy, RestaurantId } = req.body;
  //     if (!DinningId || !UpdatedBy || !RestaurantId) return res.json(commonMsgs.NullMsg);
  //     let queryValue = null;
  //     for (const [key, value] of Object.entries(req.body)) {
  //       if (key != "DinningId")
  //         queryValue == null
  //           ? (queryValue = `${key}='${value}'`)
  //           : (queryValue += `,${key}='${value}'`);
  //     }
      
  //     const pool = await poolPromise;
  //     const updateResult=await pool.request()
  //     .input("DinningId",req.body.DinningId)
  //     .input("RestaurantId",req.body.RestaurantId)
  //     .input("DinningType",req.body.DinningType)
  //     .query(
  //       `IF NOT EXISTS(SELECT * From DinningMaster 
  //       WHERE DinningId!=@DinningId AND RestaurantId=@RestaurantId AND DinningType=@DinningType) UPDATE DinningMaster SET ${queryValue}, UpdatedDate = GETDATE()  WHERE DinningId = ${DinningId}
  //         `
  //       // `UPDATE DinningMaster SET ${queryValue}, UpdatedDate = GETDATE()  WHERE DinningId = ${DinningId}`
  //     );
  //     if (updateResult.rowsAffected.length == 0) {
  //       res.json({ status: false, message: "Dinning type already exists!" });
  //     } else {
  //       res.json(commonMsgs.updateMsg);
  //     }

  //   } catch (error) {
  //     errorHandle.handleError(error, errorRes => {
  //       res.send(errorRes);
  //     });
  //   }
  // }

  async deleteData(req, res) {
    const { ActiveStatus, DinningId } = req.query;
    try {
      if (!DinningId || !ActiveStatus) return res.json(commonMsgs.NullMsg);
      else {
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .input("ActiveStatus", req.query.ActiveStatus)
                        .input("DinningId", req.query.DinningId)
                        .execute("deleteDinningData")
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
  //   const { ActiveStatus, DinningId } = req.query;
  //   try {
  //     if (!DinningId || !ActiveStatus) return res.json(commonMsgs.NullMsg);
  //     const pool = await poolPromise;
  //     await pool.query(
  //       `UPDATE DinningMaster SET ActiveStatus = '${ActiveStatus}'  WHERE DinningId = '${DinningId}';
  //       UPDATE DinningTableMaster SET ActiveStatus = '${ActiveStatus}' WHERE DinningId = '${DinningId}'`
  //     );
  //     res.json(commonMsgs.deleteMsg);
  //   } catch (error) {
  //     errorHandle.handleError(error, errorRes => {
  //       res.send(errorRes);
  //     });
  //   }
  // }
}

const dinningMaster = new DinningMasterController();

module.exports = dinningMaster;
