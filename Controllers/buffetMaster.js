const errorHandle = require("../services/errorHandler");
const commonMsgs = require("../CommonMsg.json");
const utiityFile = require("../utility");
const { poolPromise, sql } = require("../db");
const async = require("async");

class BuffetMasterController {
  async getData(req, res) {
    try {
      if (!req.query.BuffetId && !req.query.RestaurantId)
        res.json(commonMsgs.NullMsg);
      else {
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .input("BuffetId", req.query.BuffetId)
                        .input("RestaurantId",req.query.RestaurantId)
                        .input("date",req.query.date)
                        .execute("getBuffetData")
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
  //     if (!req.query.BuffetId && !req.query.RestaurantId)
  //       res.json(commonMsgs.NullMsg);
  //     else {
  //       let date = formatDate(req.query.date);
  //       const pool = await poolPromise;
  //       let result = await pool.query(
  //         `select * from BuffetMaster where BuffetId= ${req.query.BuffetId} AND RestaurantId= ${req.query.RestaurantId} AND ActiveStatus='A' AND '${date}' BETWEEN FromDate AND ToDate`
  //       );
  //       if (result.recordset.length > 0) {
  //         async.waterfall(
  //           [
  //             function(callback) {
  //               getFoodNames(result.recordset, finalArray => {
  //                 callback(null, finalArray);
  //               });
  //             },
  //             function(finalArray, callback) {
  //               let formattedDate = formatDate(req.query.date);
  //               getTaxResult(formattedDate, taxResult => {
  //                 callback(null, finalArray, taxResult);
  //               });
  //             },
  //             function(finalArray, taxResult, callback) {
  //               addTaxResult(finalArray, taxResult, finalResult => {
  //                 callback(null, finalResult);
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

  async getAllBuffetData(req, res) {
    try {
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .input("RestaurantId", req.query.RestaurantId)
                        .execute("getAllBuffetData")
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

  // async getAllBuffetData(req, res) {
  //   try {
  //     if (!req.query.RestaurantId) res.json(commonMsgs.NullMsg);
  //     else {
  //       const pool = await poolPromise;
  //       let result = await pool.query(
  //         `select * from BuffetMaster where RestaurantId= ${req.query.RestaurantId}`
  //       );
  //       if (result.recordset.length > 0) {
  //         async.waterfall(
  //           [
  //             function(callback) {
  //               getListOfFoodName(result.recordset, resultArray => {
  //                 callback(null, resultArray);
  //               });
  //             },
  //             function(resultArray, callback) {
  //               getFoodTimings(resultArray, newResultArray => {
  //                 callback(null, newResultArray);
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

  async getAllBuffetDataByResId(req, res) {
    try {
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .input("RestaurantId", req.query.RestaurantId)
                        .input("date",req.query.date)
                        .execute("getAllBuffetDataByResId")
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

  // async getAllBuffetDataByResId(req, res) {
  //   try {
  //     if (!req.query.RestaurantId) res.json(commonMsgs.NullMsg);
  //     else {
  //       let date = formatDate(req.query.date);
  //       const pool = await poolPromise;
  //       let result = await pool.query(
  //         `SELECT RestaurantId, BuffetId, BuffetName, FoodItems, FromDate, ToDate, BuffetTimings,Tariff,BuffetMaster.ActiveStatus, BuffetMaster.CreatedDate  from BuffetMaster where RestaurantId= ${req.query.RestaurantId} AND ('${date}' BETWEEN FromDate AND ToDate)`
  //       );
  //       if (result.recordset.length > 0) {
  //         async.waterfall(
  //           [
  //             function(callback) {
  //               getListOfFoodName(result.recordset, resultArray => {
  //                 callback(null, resultArray);
  //               });
  //             },
  //             function(resultArray, callback) {
  //               getFoodTimings(resultArray, newResultArray => {
  //                 callback(null, newResultArray);
  //               });
  //             },
  //             function(newResultArray, callback) {
  //               let formattedDate = formatDate(req.query.date);
  //               getTaxResult(formattedDate, taxResult => {
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
  //             if (err) {
  //               return res.json({ status: false, data: [] });
  //             }
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

  async addData(req, res) {
    try {
      if (
        !(
          req.body.RestaurantId &&
          req.body.BuffetName &&
          req.body.FoodItems &&
          req.body.FromDate &&
          req.body.ToDate &&
          req.body.BuffetTimings &&
          req.body.Tariff &&
          req.body.Createdby
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
                          .input("BuffetName", req.body.BuffetName)
                          .input("FoodItems",req.body.FoodItems)
                          .input("FromDate",req.body.FromDate)
                          .input("ToDate",req.body.ToDate)
                          .input("BuffetTimings",req.body.BuffetTimings)
                          .input("Tariff",req.body.Tariff)
                          .input("Createdby",req.body.Createdby)
                          .execute("addBuffetData")
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
  //         req.body.BuffetName &&
  //         req.body.FoodItems &&
  //         req.body.FromDate &&
  //         req.body.ToDate &&
  //         req.body.BuffetTimings &&
  //         req.body.Tariff &&
  //         req.body.Createdby
  //       )
  //     )
  //       res.json(commonMsgs.NullMsg);
  //     else {
  //       let ColNameQuery = "ActiveStatus",
  //         ColValueQuery = "'A'";
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
  //           IF NOT EXISTS (SELECT * FROM BuffetMaster 
  //              WHERE RestaurantId='${req.body.RestaurantId}' AND BuffetName = '${req.body.BuffetName}')
  //           BEGIN
  //             INSERT INTO BuffetMaster (${ColNameQuery})
  //             VALUES (${ColValueQuery})
  //           END
  //         END`

  //         // `INSERT INTO BuffetMaster(${ColNameQuery}) VALUES(${ColValueQuery})`
  //       );

  //       if (result.rowsAffected.length == 0) {
  //         res.json({ status: false, message: "Buffet name already exists!" });
  //       } else {
  //         res.json(commonMsgs.AddMsg);
  //       }
  //       // if (result.rowsAffected.length == 0) {
  //       //   res.json({
  //       //     status: false,
  //       //     message: "Buffet Id name already exists!"
  //       //   });
  //       // } 
  //       // else {
  //       //   res.json(commonMsgs.AddMsg);
  //       // }
  //     }
  //   } catch (error) {
  //     errorHandle.handleError(error, errorRes => {
  //       res.send(errorRes);
  //     });
  //   }
  // }

  async updateData(req, res) {
    try {
      const { BuffetId, UpdatedBy, BuffetName, RestaurantId } = req.body;
      if (!BuffetId || !UpdatedBy || !BuffetName || !RestaurantId) return res.json(commonMsgs.NullMsg);
      else {
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .input("BuffetId", req.body.BuffetId)
                        .input("RestaurantId",req.body.RestaurantId)
                        .input("BuffetName",req.body.BuffetName)
                        .input("FoodItems",req.body.FoodItems)
                        .input("FromDate",req.body.FromDate)
                        .input("ToDate",req.body.ToDate)
                        .input("BuffetTimings",req.body.BuffetTimings)
                        .input("Tariff",req.body.Tariff)
                        .input("Updatedby",req.body.Updatedby)
                        .execute("updateBuffetData")
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
  //     const { BuffetId, UpdatedBy, BuffetName, RestaurantId } = req.body;
  //     if (!BuffetId || !UpdatedBy || !BuffetName || !RestaurantId) return res.json(commonMsgs.NullMsg);
  //     let queryValue = null;
  //     for (const [key, value] of Object.entries(req.body)) {
  //       if (key != "BuffetId")
  //         queryValue == null
  //           ? (queryValue = `${key}='${value}'`)
  //           : (queryValue += `,${key}='${value}'`);
  //     }
  //     const pool = await poolPromise;
  //     let updateResult=await pool.query(
  //       `BEGIN
  //       IF EXISTS (SELECT * FROM BuffetMaster 
  //         WHERE BuffetId = '${req.body.BuffetId}' AND BuffetName = '${req.body.BuffetName}' AND RestaurantId='${req.body.RestaurantId}')
  //       BEGIN
  //         UPDATE BuffetMaster SET ${queryValue} WHERE BuffetId = ${BuffetId}
  //       END
  //     END`
      
  //       // `UPDATE BuffetMaster SET ${queryValue} WHERE BuffetId = ${BuffetId}`
  //     );

  //     if (updateResult.rowsAffected.length == 0) {
  //       res.json({ status: false, message: "Buffet Name already exists!" });
  //     } else {
  //       res.json(commonMsgs.updateMsg);
  //     }
  //     // res.json(commonMsgs.updateMsg);
  //   } catch (error) {
  //     errorHandle.handleError(error, errorRes => {
  //       res.send(errorRes);
  //     });
  //   }
  // }

  async deleteData(req, res) {
    const { ActiveStatus, BuffetId } = req.query;
    try {
      if (!BuffetId || !ActiveStatus) return res.json(commonMsgs.NullMsg);
      else {
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .input("ActiveStatus", req.query.ActiveStatus)
                        .input("BuffetId", req.query.BuffetId)
                        .execute("deleteBuffetData")
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
  //   const { ActiveStatus, BuffetId } = req.query;
  //   try {
  //     if (!BuffetId || !ActiveStatus) return res.json(commonMsgs.NullMsg);
  //     const pool = await poolPromise;
  //     await pool.query(
  //       `UPDATE BuffetMaster SET ActiveStatus = '${ActiveStatus}'  WHERE BuffetId = '${BuffetId}'`
  //     );
  //     res.json(commonMsgs.deleteMsg);
  //   } catch (error) {
  //     errorHandle.handleError(error, errorRes => {
  //       res.send(errorRes);
  //     });
  //   }
  // }
}

function addTaxResult(data, taxData, callback) {
  data.forEach(element => {
    element["TaxResult"] = taxData;
  });
  callback(data);
}

async function getTaxResult(date, callback) {
  const pool = await poolPromise;
  let taxResult = await pool.query(
    `select TaxId, ServiceName, TaxDescription, TaxPercentage, RefNumber FROM TaxMaster WHERE ActiveStatus = 'A' AND ServiceName = 'Restaurant'`
  );
  callback(taxResult.recordset);
}

async function getListOfFoodName(arrObj, callback) {
  let count = 0;
  for (let i = 0; i < arrObj.length; i++) {
    if (arrObj[i].FoodItems.length != 0) {
      let demoVar = "";
      demoVar = arrObj[i].FoodItems;
      const pool = await poolPromise;
      let result = await pool.query(
        `select FoodMaster.FoodName, FoodMaster.FoodId, FoodMaster.ImageLink from FoodMaster where FoodId IN (${demoVar})`
      );
      arrObj[i]["Food"] = result.recordset;
    } else {
      arrObj[i]["Food"] = [];
    }
    count++;
    if (count === arrObj.length) {
      callback(arrObj);
    }
  }
}

async function getFoodTimings(arrObj, callback) {
  let count = 0;
  for (let i = 0; i < arrObj.length; i++) {
    if (arrObj[i].BuffetTimings.length != 0) {
      let demoVar = "";
      demoVar = arrObj[i].BuffetTimings;
      const pool = await poolPromise;
      let result = await pool.query(
        `select FoodTimingMaster.FoodTimingName from FoodTimingMaster where FoodTimingId IN (${demoVar}) AND RestaurantId = ${arrObj[i].RestaurantId}`
      );
      if (result.recordset.length > 0) {
        var newValue = result.recordset.map(e => e.FoodTimingName).join(",");
        arrObj[i]["BuffetTimingsName"] = newValue;
      }
    } else {
      arrObj[i]["BuffetTimingsName"] = "";
    }
    count++;
    if (count === arrObj.length) {
      callback(arrObj);
    }
  }
}

async function getFoodNames(arr, callback) {
  let demoVar = "";
  for (let i = 0; i < arr.length; i++) {
    demoVar = arr[i].FoodItems;
    const pool = await poolPromise;
    let result = await pool.query(
      `select FoodMaster.FoodName,FoodMaster.FoodId, FoodMaster.ImageLink from FoodMaster where FoodId IN (${demoVar})`
    );
    arr[i]["Food"] = result.recordset;
    callback(arr);
  }
}

function formatDate(date) {
  let temp = date.split("-");
  let formattedDate = temp[0] + "-" + temp[2] + "-" + temp[1];
  return formattedDate;
}

const BuffetMaster = new BuffetMasterController();

module.exports = BuffetMaster;
