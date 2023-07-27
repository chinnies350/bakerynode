const errorHandle = require("../services/errorHandler");
const commonMsgs = require("../CommonMsg.json");
const utiityFile = require("../utility");
const { poolPromise, sql } = require("../db");
const async = require("async");

class ComplementaryMasterController {
  async getData(req, res) {
    try {
      if (!req.query.RestaurantId) res.json(commonMsgs.NullMsg);
      else {
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .input("RestaurantId", req.query.RestaurantId)
                        .input("time",req.query.time)
                        .execute("getComplementaryData")
        if (result.recordset[0].mainData!=null){
          res.json({status: true, data:JSON.parse(result.recordset[0].mainData)})

        }
        else{
          res.json({status: true, data:[]})
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
  //     if (!req.query.RestaurantId) res.json(commonMsgs.NullMsg);
  //     else {
  //       let resId = req.query.RestaurantId;
  //       const pool = await poolPromise;
  //       let result = await pool.query(
  //         `SELECT FoodTimingId FROM FoodTimingMaster WHERE '${req.query.time}' BETWEEN StartTime AND EndTime AND RestaurantId='${req.query.RestaurantId}'`
  //       );
  //       if (result.recordset.length > 0) {
  //         async.waterfall(
  //           [
  //             function(callback) {
  //               getComplementaryData(
  //                 result.recordset[0],
  //                 resId,
  //                 complementaryData => {
  //                   callback(null, complementaryData);
  //                 }
  //               );
  //             },
  //             function(complementaryData, callback) {
  //               getFoodNames(complementaryData, finalArray => {
  //                 callback(null, finalArray);
  //               });
  //             }
  //           ],
  //           function(err, result) {
  //             res.json({ status: true, data: result });
  //           }
  //         );
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

  async getAllDataFromComplementaryMaster(req, res) {
    try {
      if (!req.query.RestaurantId)
        res.json(commonMsgs.NullMsg);
      else {
          const pool = await poolPromise;
          let result = await pool
                          .request()
                          .input("RestaurantId", req.query.RestaurantId)
                          .execute("getAllDataFromComplementaryMaster")
          if (result.recordset[0].mainData!=null){
            res.json({status: true, data:JSON.parse(result.recordset[0].mainData)})
  
          }
          else{
            res.json({status: true, data:[]})
          }
        }
    } catch (error) {
      errorHandle.handleError(error, errorRes => {
        res.send(errorRes);
      });
    }
  }

  // async getAllDataFromComplementaryMaster(req, res) {
  //   try {
  //     if (!req.query.RestaurantId)
  //       res.json(commonMsgs.NullMsg);
  //     else {
  //       let resId=req.query.RestaurantId;
  //       const pool = await poolPromise;
  //       let result = await pool.query(
  //         `SELECT * FROM ComplementaryMaster WHERE RestaurantId=${req.query.RestaurantId}`
  //       );
  //       if (result.recordset.length > 0) {
  //         res.json({ status: true, data: result.recordset});
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

  async getAllData(req, res) {
    try {
      if (!req.query.RestaurantId)
        res.json(commonMsgs.NullMsg);
      else {
          const pool = await poolPromise;
          let result = await pool
                          .request()
                          .input("RestaurantId", req.query.RestaurantId)
                          .execute("getAllComplementaryData")
          if (result.recordset[0].mainData!=null){
            res.json({status: true, data:JSON.parse(result.recordset[0].mainData)})
  
          }
          else{
            res.json({status: true, data:[]})
          }
        }
    } catch (error) {
      errorHandle.handleError(error, errorRes => {
        res.send(errorRes);
      });
    }
  }

  // async getAllData(req, res) {
  //   try {
  //     if (!req.query.RestaurantId)
  //       res.json(commonMsgs.NullMsg);
  //     else {
  //       let resId=req.query.RestaurantId;
  //       const pool = await poolPromise;
  //       let result = await pool.query(
  //         `SELECT ComplementaryMaster.RestaurantId, ComplementaryMaster.FoodTimingId, ComplementaryMaster.FoodId, ComplementaryMaster.CreatedBy, ComplementaryMaster.ActiveStatus, ComplementaryMaster.UniqueId AS ComplementaryId, FoodTimingMaster.FoodTimingName from ComplementaryMaster INNER JOIN FoodTimingMaster ON 
  //         ComplementaryMaster.RestaurantId=FoodTimingMaster.RestaurantId AND 
  //         ComplementaryMaster.FoodTimingId=FoodTimingMaster.FoodTimingId WHERE ComplementaryMaster.RestaurantId= '${resId}'`
  //       );

  //       if (result.recordset.length > 0) {
  //         async.waterfall(
  //           [
  //             function(callback) {
  //               getFoodNames(result.recordset,finalArray => {
  //                 callback(null, finalArray);
  //               });
  //             }
  //           ],
  //           function(err, result) {
  //             res.json({ status: true, data: result});
  //           }
  //         );
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

  async addData(req, res) {
    try {
      if (
        !(
          req.body.RestaurantId &&
          req.body.FoodTimingId &&
          req.body.FoodId &&
          req.body.CreatedBy
        )
      )
      res.json(commonMsgs.NullMsg);
      if(req.body.FoodId.length===0){
        res.json(commonMsgs.NullMsg);
      }
      else {
        if(!req.body.FoodTimingId.length===0){
          return res.json(commonMsgs.NullMsg);
        }
        for (let key in req.body) {
          if (req.body[key]) {
            if (req.body[key] === "FoodId") {
              req.body[key].join(",");
            }
            if (req.body[key] === "FoodTimingId") {
              req.body[key].join(",");
            }
          }
        }
        const pool = await poolPromise;
        let result = await pool
                          .request()
                          .input("RestaurantId", req.body.RestaurantId)
                          .input("FoodTimingId", req.body.FoodTimingId)
                          .input("FoodId",req.body.FoodId)
                          .input("CreatedBy",req.body.CreatedBy)
                          .execute("addComplementaryData")
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
  //         req.body.FoodTimingId &&
  //         req.body.FoodId &&
  //         req.body.CreatedBy
  //       )
  //     )
  //     res.json(commonMsgs.NullMsg);
  //     if(req.body.FoodId.length===0){
  //       res.json(commonMsgs.NullMsg);
  //     }
  //     else {
  //       if(!req.body.FoodTimingId.length>0){
  //         return res.json(commonMsgs.NullMsg);
  //       }
  //       let ColNameQuery = "ActiveStatus",
  //         ColValueQuery = "'A'";
  //       for (let key in req.body) {
  //         if (req.body[key]) {
  //           if (req.body[key] === "FoodId") {
  //             req.body[key].join(",");
  //           }
  //           if (req.body[key] === "FoodTimingId") {
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
  //       //   `INSERT INTO ComplementaryMaster(${ColNameQuery}) VALUES(${ColValueQuery})`
  //           `BEGIN
  //                 IF NOT EXISTS (SELECT * FROM ComplementaryMaster
  //                    WHERE FoodTimingId = '${req.body.FoodTimingId}'AND RestaurantId='${req.body.RestaurantId}')
  //                 BEGIN
  //                   INSERT INTO ComplementaryMaster (${ColNameQuery})
  //                   VALUES (${ColValueQuery})
  //                 END
  //               END`
  //       );
  //       if (result.rowsAffected.length == 0) {
  //         res.json({
  //           status: false,
  //           message: "FoodTiming Id already exists! Please Update the data."
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
      const { FoodTimingId,FoodId } = req.body;
      if (FoodId.length ===0) return res.json(commonMsgs.NullMsg);
      else {
        for (let key in req.body) {
          if (req.body[key]) {
            if (req.body[key] === "FoodId") {
              req.body[key].join(",");
            }
            if (req.body[key] === "FoodTimingId") {
              req.body[key].join(",");
            }
          }
        }
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .input("UniqueId", req.body.UniqueId)
                        .input("RestaurantId",req.body.RestaurantId)
                        .input("FoodTimingId",req.body.FoodTimingId)
                        .input("FoodId",req.body.FoodId)
                        .execute("updateComplementaryData")
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
  //     const { FoodTimingId,FoodId } = req.body;
  //     if (FoodId.length ===0) return res.json(commonMsgs.NullMsg);
  //     let queryValue = null;
  //     for (const [key, value] of Object.entries(req.body)) {
  //       if (key != "FoodTimingId"){
  //       if (req.body[key] === "FoodId") {
  //           req.body[key].join(",");
  //         }  
  //       queryValue == null
  //           ? (queryValue = `${key}='${value}'`)
  //           : (queryValue += `,${key}='${value}'`);
  //       }
  //     }
  //     const pool = await poolPromise;
  //     await pool.query(
  //       `BEGIN 
  //         IF EXISTS (SELECT * From ComplementaryMaster 
  //         WHERE FoodTimingId=${req.body.FoodTimingId} AND RestaurantId=${req.body.RestaurantId})
  //       BEGIN
  //       UPDATE ComplementaryMaster SET ${queryValue} WHERE FoodTimingId = ${FoodTimingId}
  //       END
  //     END`
        
  //     // `UPDATE ComplementaryMaster SET ${queryValue} WHERE FoodTimingId = ${FoodTimingId}`
  //     );
  //     res.json(commonMsgs.updateMsg);
  //   } catch (error) {
  //     errorHandle.handleError(error, errorRes => {
  //       res.send(errorRes);
  //     });
  //   }
  // }

  async deleteData(req, res) {
    try {
      if (!(req.query.ActiveStatus && req.query.ComplementaryId || req.query.FoodTimingId))
        res.json(commonMsgs.NullMsg); 
      else {
          const pool = await poolPromise;
          let result = await pool
                          .request()
                          .input("ActiveStatus", req.query.ActiveStatus)
                          .input("ComplementaryId", req.query.ComplementaryId)
                          .input("FoodTimingId",req.query.FoodTimingId)
                          .execute("deleteComplementaryData")
          if (result.recordset[0][""][1] == 1) {
            res.json(commonMsgs.deleteMsg);
          }
          else {
            res.json({status: false, message:result.recordset[0][""][0]})
          }
          }  
    } catch (error) {
      errorHandle.handleError(error, (errorRes) => {
        res.send(errorRes);
      });
    }
  }

  // async deleteData(req, res) {
  //   if(req.query.hasOwnProperty("ComplementaryId")){
  //     const { ActiveStatus,ComplementaryId } = req.query;
  //     try {
  //       if (!ActiveStatus || !ComplementaryId) return res.json(commonMsgs.NullMsg);
  //       const pool = await poolPromise;
  //       await pool.query(
  //         `UPDATE ComplementaryMaster SET ActiveStatus = '${ActiveStatus}' WHERE UniqueId = '${ComplementaryId}'`
  //       );
  //       res.json(commonMsgs.deleteMsg);
  //     } catch (error) {
  //       errorHandle.handleError(error, errorRes => {
  //         res.send(errorRes);
  //       });
  //     }
  //   }
  //   else{
  //     const { ActiveStatus, FoodTimingId } = req.query;
  //     try {
  //       if (!FoodTimingId || !ActiveStatus) return res.json(commonMsgs.NullMsg);
  //       const pool = await poolPromise;
  //       await pool.query(
  //         `UPDATE ComplementaryMaster SET ActiveStatus = '${ActiveStatus}' WHERE FoodTimingId = '${FoodTimingId}'`
  //       );
  //       res.json(commonMsgs.deleteMsg);
  //     } catch (error) {
  //       errorHandle.handleError(error, errorRes => {
  //         res.send(errorRes);
  //       });
  //     }
  //   }
  // }

  async deleteComplementaryData(req, res) {
    try{
      if(!(req.query.hasOwnProperty("ComplementaryId")&& req.query.hasOwnProperty("RestaurantId")))
      res.send({status:false, message:'Please provide all details'})
      else {
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .input("ComplementaryId", req.query.ComplementaryId)
                        .input("RestaurantId", req.query.RestaurantId)
                        .execute("deleteComplementaryDataFromTable")
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

  // async deleteComplementaryData(req, res) {
  //   if(req.query.hasOwnProperty("ComplementaryId")&& req.query.hasOwnProperty("RestaurantId")){
  //     const {ComplementaryId } = req.query;
  //     try {
  //       if (!ComplementaryId) return res.json(commonMsgs.NullMsg);
  //       const pool = await poolPromise;
  //       await pool.query(
  //         `DELETE FROM ComplementaryMaster WHERE UniqueId = '${ComplementaryId}' AND RestaurantId=${req.query.RestaurantId}`
  //       );
  //       res.json(commonMsgs.deleteMsg);
  //     } catch (error) {
  //       errorHandle.handleError(error, errorRes => {
  //         res.send(errorRes);
  //       });
  //     }
  //   }
  //   else{
  //     res.send({status:false, message:'Please provide all details'})
  //   }
  // }
}

async function getComplementaryData(timingData, restaurantId, callback) {
  const pool = await poolPromise;
  let result = await pool.query(
    `SELECT ComplementaryMaster.RestaurantId, ComplementaryMaster.FoodTimingId, ComplementaryMaster.FoodId, ComplementaryMaster.CreatedBy, ComplementaryMaster.ActiveStatus, ComplementaryMaster.UniqueId AS ComplementaryId, FoodTimingMaster.FoodTimingName from ComplementaryMaster INNER JOIN FoodTimingMaster ON ComplementaryMaster.FoodTimingId=FoodTimingMaster.FoodTimingId WHERE ComplementaryMaster.RestaurantId= ${restaurantId} AND ComplementaryMaster.FoodTimingId=${timingData.FoodTimingId}`
  );
  if (result.recordset.length > 0) {
    callback(result.recordset);
  } else {
    callback([]);
  }
} 

async function getFoodNames(arr, callback) {
  let demoVar = "";
  let count = 0;
  for (let i = 0; i < arr.length; i++) {
    demoVar = arr[i].FoodId;
    const pool = await poolPromise;
    let result = await pool.query(
      `select FoodMaster.FoodName,FoodMaster.FoodId, FoodMaster.ImageLink from FoodMaster where FoodId IN (${demoVar})`
    );
    arr[i]["Food"] = result.recordset;
    count++;
  }
  if (count == arr.length) callback(arr);
}

const ComplementaryMaster = new ComplementaryMasterController();

module.exports = ComplementaryMaster;
