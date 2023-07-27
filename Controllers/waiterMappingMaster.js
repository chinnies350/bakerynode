const errorHandle = require("../services/errorHandler");
const commonMsgs = require("../CommonMsg.json");
const { poolPromise, sql } = require("../db");
const async = require("async");
const ApiService = require("../services/API_services");

class WaiterMappingMasterController {
  async getWaiterMappingDataByResId(req, res) {
    try {
      if (!req.query.RestaurantId) res.json(commonMsgs.NullMsg);
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

  async getWaiterMappingDataByWaiterId(req, res) {
    try {
      if (!req.query.RestaurantId && !req.query.WaiterId)
        res.json(commonMsgs.NullMsg);
      else {
        const pool = await poolPromise;
        let result = await pool
          .request()
          .input("RestaurantId", req.query.RestaurantId)
          .input("WaiterId", req.query.WaiterId)
          .query(
            `Select * FROM WaiterMappingMaster WHERE RestaurantId = @RestaurantId AND WaiterId = @WaiterId`
          );
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

  async addWaiterMapping(req, res) {
    try {
      if (
        !(
          req.body.RestaurantId &&
          req.body.WaiterId &&
          req.body.DinningId &&
          req.body.CreatedBy
        )
      )
        res.json(commonMsgs.NullMsg);
      else {
        for (let key in req.body) {
          if (req.body[key]) {
            if (req.body[key] == "DinningId") {
              req.body[key].join(",");
            }
          }
        }
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .input("RestaurantId", req.body.RestaurantId)
                        .input("WaiterId", req.body.WaiterId)
                        .input("DinningId",req.body.DinningId)
                        .input("CreatedBy",req.body.CreatedBy)
                        .execute("addWaiterMapping")
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

  // async addWaiterMapping(req, res) {
  //   try {
  //     if (
  //       !(
  //         req.body.RestaurantId &&
  //         req.body.WaiterId &&
  //         req.body.DinningId &&
  //         req.body.CreatedBy
  //       )
  //     )
  //       res.json(commonMsgs.NullMsg);
  //     else {
  //       let ColNameQuery = "ActiveStatus",
  //         ColValueQuery = "'A'";
  //       for (let key in req.body) {
  //         if (req.body[key]) {
  //           if (req.body[key] == "DinningId") {
  //             req.body[key].join(",");
  //           }
  //           ColNameQuery += `${ColNameQuery != `` ? `,` : ``}${key}`;
  //           ColValueQuery += `${ColValueQuery != `` ? `,` : ``}'${
  //             req.body[key]
  //           }'`;
  //         }
  //       }
  //       const pool = await poolPromise;
  //       let result = await pool.query(
  //         `BEGIN
  //           IF NOT EXISTS (SELECT * FROM WaiterMappingMaster 
  //              WHERE RestaurantId='${req.body.RestaurantId}' AND WaiterId = '${req.body.WaiterId}')
  //           BEGIN
  //             INSERT INTO WaiterMappingMaster (${ColNameQuery})
  //             VALUES (${ColValueQuery})
  //           END
  //         END`
  //       );
  //       if (result.rowsAffected.length == 0) {
  //         res.json({ status: false, message: "Waiter Name already exists!" });
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

  async updateWaiterMapping(req, res) {
    try {
      const {
        RestaurantId,
        MappingId,
        WaiterId,
        DinningId,
        UpdatedBy,
        CreatedBy
      } = req.body;
      if (!MappingId || !UpdatedBy) return res.json(commonMsgs.NullMsg);
      else {
        for (let key in req.body) {
          if (req.body[key]) {
            if (req.body[key] === "DinningId") {
              req.body[key].join(",");
            }
          }
        }     
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .input("RestaurantId", req.body.RestaurantId)
                        .input("MappingId", req.body.MappingId)
                        .input("WaiterId",req.body.WaiterId)
                        .input("DinningId",req.body.DinningId)
                        .input("UpdatedBy",req.body.UpdatedBy)
                        .execute("updateWaiterMapping")
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

  // async updateWaiterMapping(req, res) {
  //   try {
  //     const {
  //       RestaurantId,
  //       MappingId,
  //       WaiterId,
  //       DinningId,
  //       UpdatedBy,
  //       CreatedBy
  //     } = req.body;
  //     if (!MappingId || !UpdatedBy) return res.json(commonMsgs.NullMsg);
  //     const pool = await poolPromise;
  //     let queryValue = null;
  //     for (var [key, value] of Object.entries(req.body)) {
  //       if (key != "MappingId") {
  //         if (key == "DinningId") value = value.join(",");
  //         queryValue == null
  //           ? (queryValue = `${key}='${value}'`)
  //           : (queryValue += `,${key}='${value}'`);
  //       }
  //     }
  //     await pool.query(
  //       `UPDATE WaiterMappingMaster SET ${queryValue} WHERE MappingId = ${MappingId}`
  //     );
  //     res.json(commonMsgs.updateMsg);
  //   } catch (error) {
  //     errorHandle.handleError(error, errorRes => {
  //       res.send(errorRes);
  //     });
  //   }
  // }

  async deleteWaiterMapping(req, res) {
    const { RestaurantId, ActiveStatus, MappingId } = req.query;
    try {
      if (!MappingId || !ActiveStatus) return res.json(commonMsgs.NullMsg);
      else {
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .input("ActiveStatus", req.query.ActiveStatus)
                        .input("MappingId", req.query.MappingId)
                        .input("RestaurantId",req.query.RestaurantId)
                        .execute("deleteWaiterMapping")
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

  // async deleteWaiterMapping(req, res) {
  //   const { RestaurantId, ActiveStatus, MappingId } = req.query;
  //   try {
  //     if (!MappingId || !ActiveStatus) return res.json(commonMsgs.NullMsg);
  //     const pool = await poolPromise;
  //     await pool.query(
  //       `UPDATE WaiterMappingMaster SET ActiveStatus = '${ActiveStatus}' WHERE MappingId = '${MappingId}' AND RestaurantId = ${RestaurantId}`
  //     );
  //     res.json(commonMsgs.deleteMsg);
  //   } catch (error) {
  //     errorHandle.handleError(error, errorRes => {
  //       res.send(errorRes);
  //     });
  //   }
  // }
}

async function getWaiterName(RestaurantId, recordSet) {
  // recordSet.forEach(e=>console.log("++++ ",e.WaiterId))
  let promise = new Promise(function(resolve, reject) {
    this.apiService = new ApiService();
    this.apiService.CMCommonReport(RestaurantId, apiResponse => {
      // apiResponse.forEach(ele=>console.log("***** ",ele.EmpId))
      async.map(
        recordSet,
        (value, cb) => {

          if (value.hasOwnProperty("WaiterId") && value.WaiterId != null) {
            let matchingName = apiResponse.filter(val => {
              return val.EmpId == value.WaiterId;
            });
            value["WaiterName"] =
              matchingName.length > 0 ? matchingName[0].EmpName : null;
            cb(null, value);
          } else {
            cb(null, null);
          }
        },
        (err, result) => {
          resolve(null);
        }
      );
    });
  });
  return promise;
}

async function getDinningName(RestaurantId, recordSet, callback) {
  const pool = await poolPromise;
  async.map(
    recordSet,
    (value, cb) => {
      pool.query(
        `select DinningMaster.DinningType FROM DinningMaster WHERE DinningId IN (${value.DinningId}) AND DinningMaster.RestaurantId = ${RestaurantId}`,
        function(err, result) {
          if (result.recordset.length > 0) {
            value["DinningType"] = result.recordset
              .map(function(elem) {
                return elem.DinningType;
              })
              .join(",");
            cb(null);
          } else {
            value["DinningType"] = "";
            cb(null);
          }
        }
      );
    },
    (err, result) => {
      callback(null);
    }
  );
}

const waiterMappingMaster = new WaiterMappingMasterController();

module.exports = waiterMappingMaster;
