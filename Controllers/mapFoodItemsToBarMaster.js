const errorHandle = require("../services/errorHandler");
const commonMsgs = require("../CommonMsg.json");
const { poolPromise } = require("../db");
const async = require("async");

class MapFoodItemsToBarMaster {
  async getAllFoodItems(req, res) {
    try {
      if (req.query.BarId || req.query.RestaurantId) {
      const pool = await poolPromise;
      let result = await pool
                      .request()
                      .input("RestaurantId", req.query.RestaurantId)
                      .input("BarId",req.query.BarId)
                      .execute("getAllFoodItemstoBar")
      if (result.recordset[0].mainData!=null){
        res.json({status: true, data:JSON.parse(result.recordset[0].mainData)})

      }
      else{
        res.json({status: true, data:[]})
      }
      } else {
        res.json(commonMsgs.NullMsg);
      }
    } catch (error) {
      errorHandle.handleError(error, errorRes => {
        res.send(errorRes);
      });
    }
  }
  // async getAllFoodItems(req, res) {
  //   try {
  //     if (req.query.BarId || req.query.RestaurantId) {
  //       const pool = await poolPromise;
  //       var columnName = "",
  //         coulmnValue = "";
  //       if (req.query.hasOwnProperty("BarId")) {
  //         columnName = "BarId";
  //         coulmnValue = req.query.BarId;
  //       } else {
  //         columnName = "RestaurantId";
  //         coulmnValue = req.query.RestaurantId;
  //       }
  //       let result = await pool.query(
  //         `SELECT RestaurantId, BarId, FoodItems, ActiveStatus, CreatedDate  FROM MapFoodItemsToBar WHERE ${columnName} = ${coulmnValue}`
  //       );

  //       if (result.recordset.length > 0) {
  //         async.waterfall(
  //           [
  //             function(callback) {
  //               getListOfFoodName(result.recordset, resultArray => {
  //                 if (resultArray.status) callback(null, resultArray.arrObj);
  //                 else callback(resultArray.message, null);
  //               });
  //             },
  //             function(resultArray, callback) {
  //               getTariffForFoodItems(resultArray, response => {
                  
  //                 callback(null, response);
  //               });
  //             },
  //             function(newResultArray, callback) {
  //               getTaxResult(req.query.Date, taxResult => {
  //                 callback(null, newResultArray, taxResult);
  //               });
  //             },
  //             function(newResultArray, taxResult, callback) {
  //               addTaxResult(newResultArray, taxResult, finalResult => {
  //                 callback(null, finalResult);
  //               });
  //             }
  //           ],
  //           function(err, result) {
  //             // console.log(err)
  //             if (err) {
  //               return res.json({ status: false, data: [] });
  //             }
  //             res.json({ status: true, data: result });
  //           }
  //         );
  //       } else {
  //         res.json({ status: true, data: [] });
  //       }
  //     } else {
  //       res.json(commonMsgs.NullMsg);
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
          req.body.BarId &&
          req.body.FoodItems!='' &&
          req.body.CreatedBy
        )
      )
        res.json(commonMsgs.NullMsg);
      else {
        for (let key in req.body) {
                  if (req.body[key]) {
                    if (req.body[key] === "FoodItems") {
                      req.body[key].join(",");
                    }
                  }
                }
          const pool = await poolPromise;
          let result = await pool
                          .request()
                          .input("RestaurantId", req.body.RestaurantId)
                          .input("BarId", req.body.BarId)
                          .input("FoodItems",req.body.FoodItems)
                          .input("CreatedBy",req.body.CreatedBy)
                          .execute("addFoodItemsData")
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
  //         req.body.BarId &&
  //         req.body.FoodItems!='' &&
  //         req.body.CreatedBy
  //       )
  //     )
  //       res.json(commonMsgs.NullMsg);
  //     else {
  //       let ColNameQuery = "",
  //         ColValueQuery = "";
  //       for (let key in req.body) {
  //         if (req.body[key]) {
  //           if (req.body[key] === "FoodItems") {
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
  //           IF NOT EXISTS (SELECT * from MapFoodItemsToBar where BarId=${req.body.BarId} and RestaurantId=${req.body.RestaurantId} )
  //             BEGIN
  //             INSERT INTO MapFoodItemsToBar (${ColNameQuery}) VALUES(${ColValueQuery})
  //             END
  //         END
  //         `
  //       );

  //       if (result.rowsAffected.length == 0) {
  //         res.json(commonMsgs.DuplicateRecordMsg);
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
      const { BarId, UpdatedBy,FoodItems } = req.body;
      if (!BarId || !UpdatedBy || !FoodItems) return res.json(commonMsgs.NullMsg);
      else {
        for (let key in req.body) {
          if (req.body[key]) {
            if (req.body[key] === "FoodItems") {
              req.body[key].join(",");
            }
          }
        }
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .input("UniqueId", req.body.UniqueId)
                        .input("RestaurantId", req.body.RestaurantId)
                        .input("BarId",req.body.BarId)
                        .input("FoodItems",req.body.FoodItems)
                        .input("UpdatedBy",req.body.UpdatedBy)
                        .execute("updateFoodItems")
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
  //     const { BarId, UpdatedBy,FoodItems } = req.body;
  //     if (!BarId || !UpdatedBy || FoodItems!='[]') return res.json(commonMsgs.NullMsg);
  //     let queryValue = null;
  //     for (const [key, value] of Object.entries(req.body)) {
  //       if (key != "BarId")
  //         queryValue == null
  //           ? (queryValue = `${key}='${value}'`)
  //           : (queryValue += `,${key}='${value}'`);
  //     }
  //     const pool = await poolPromise;
  //     await pool.query(
  //       `UPDATE MapFoodItemsToBar SET ${queryValue} WHERE BarId = ${BarId}`
  //     );
  //     res.json(commonMsgs.updateMsg);
  //   } catch (error) {
  //     errorHandle.handleError(error, errorRes => {
  //       res.send(errorRes);
  //     });
  //   }
  // }

  async deleteData(req, res) {
    const { ActiveStatus, BarId, RestaurantId } = req.query;
    try {
      if (!BarId || !ActiveStatus || !RestaurantId)
        return res.json(commonMsgs.NullMsg);
        else {
          const pool = await poolPromise;
          let result = await pool
                          .request()
                          .input("ActiveStatus", req.query.ActiveStatus)
                          .input("BarId", req.query.BarId)
                          .input("RestaurantId",req.query.RestaurantId)
                          .input("UniqueId",req.query.UniqueId)
                          .execute("deleteFoodItems")
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
  //   const { ActiveStatus, BarId, RestaurantId } = req.query;
  //   try {
  //     if (!BarId || !ActiveStatus || !RestaurantId)
  //       return res.json(commonMsgs.NullMsg);
  //     const pool = await poolPromise;
  //     await pool.query(
  //       `UPDATE MapFoodItemsToBar SET ActiveStatus = '${ActiveStatus}'  WHERE BarId = '${BarId}' AND RestaurantId= ${RestaurantId}`
  //     );
  //     res.json(commonMsgs.deleteMsg);
  //   } catch (error) {
  //     errorHandle.handleError(error, errorRes => {
  //       res.send(errorRes);
  //     });
  //   }
  // }
}

async function getTaxResult(date, callback) {
  const pool = await poolPromise;
  let taxResult = await pool.query(
    `select TaxId, ServiceName, TaxDescription, TaxPercentage, RefNumber FROM TaxMaster WHERE '${date}' BETWEEN EffectiveFrom AND EffectiveTill AND ActiveStatus = 'A' AND ServiceName = 'Restaurant'`
  );
  callback(taxResult.recordset);
}

function addTaxResult(data, taxData, callback) {
  data.forEach(element => {
    element["TaxResult"] = taxData;
  });
  callback(data);
}

async function getListOfFoodName(arrObj, callback) {
  try {
    // console.log("Res+++", arrObj);
    let count = 0;
    for (let i = 0; i < arrObj.length; i++) {
      let demoVar = "";
      demoVar = arrObj[i].FoodItems;
      const pool = await poolPromise;
      let result = await pool.query(
        `SELECT FoodMaster.FoodName, FoodMaster.FoodId, FoodMaster.ImageLink FROM FoodMaster WHERE FoodMaster.FoodId IN (${demoVar})`
      );
  
      count++;
      arrObj[i]["FoodDetails"] = result.recordset;
      if (count === arrObj.length) {
        callback({ status: true, arrObj });
      }
    }
  } catch (error) {
    // console.log(error)
    callback({ status: false, message: error });
  }
}

async function getTariffForFoodItems(arrObj, callback) {
  let count = 0;
  var FoodDetails = arrObj[0].FoodDetails;
  for (let i = 0; i < FoodDetails.length; i++) {
    const pool = await poolPromise;
    let result = await pool.query(
      `SELECT FoodQuantityMaster.Tariff FROM FoodQuantityMaster WHERE FoodQuantityMaster.FoodId = ${FoodDetails[i].FoodId}`
    );
    count++;
    if (result.recordset.length > 0) {
      FoodDetails[i]["Tariff"] = result.recordset[0].Tariff;
    }
    if (count === FoodDetails.length) {
      callback(arrObj);
    }
  }
}

const mapFoodItemsToBar = new MapFoodItemsToBarMaster();

module.exports = mapFoodItemsToBar;
