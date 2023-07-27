const { sql, poolPromise } = require("../db");
const errorHandle = require("../services/errorHandler");
const utility = require("../utility");
const async = require("async");

class ShiftWiseStockInMaster {
  async addData(req, res) {
    try {
      if (
        req.body.RestaurantId &&
        req.body.ShiftId &&
        req.body.CustomerId &&
        req.body.CreatedBy &&
        req.body.Date
      ) {
        const pool = await poolPromise;
        let ShiftResultCheck = await pool.query(
          `SELECT * FROM ShiftWiseStockMaster WHERE RestaurantId=${req.body.RestaurantId} AND ShiftId=${req.body.ShiftId} AND CustomerId=${req.body.CustomerId} AND Cast(CreatedDate AS Date)='${req.body.Date}'`
        );
        if (ShiftResultCheck.recordset.length == 0) {
          let result = await pool.query(
            `SELECT RestaurantId, DinningId, OrderId, OrderHeaderSl, OrderDate, CustomerId, GuestName, GuestMobile, GuestMailId, PaymentType, BillAmount, TaxAmount, NetAmount, BookingStatus, CreatedBy, CustomerGSTNo, BookingType, PaymentStatus, TableStatus, HotelOrderId, HotelRoomNo, BookedChairs, OrderFrom FROM OrderHeader WHERE RestaurantId = ${req.body.RestaurantId} AND CustomerId = ${req.body.CustomerId} AND CreatedBy = ${req.body.CreatedBy} AND CAST(OrderDate as DATE) = '${req.body.Date}' AND OrderFrom = 'R'`
          );
          if (result.recordset.length > 0) {
            async.waterfall(
              [
                function(callback) {
                  getOrderDetails(req.body, function(err, OrderDetailsObj) {
                    if (err) {
                      callback(err, null);
                    } else {
                      callback(null, OrderDetailsObj);
                    }
                  });
                },
                function(OrderDetailsObj, callback) {
                  insertDataToShiftWiseStock(
                    req.body,
                    OrderDetailsObj,
                    (err, queries) => {
                      if (err) {
                        callback(err, null);
                      }
                      callback(null, OrderDetailsObj);
                    }
                  );
                }
              ],
              function(err, result) {
                if (err) {
                  throw err;
                }
                res.send({ status: true, message: "Data Added Successfully" });
              }
            );
          } else {
            throw "No Data Found";
          }
        } else throw "Shift Stock already added";
      } else throw "Please fill all the details!";
    } catch (error) {
      errorHandle.handleError(error, errorRes => {
        res.send(errorRes);
      });
    }
  }

  async getShiftWiseData(req, res) {
    try {
      if (
        req.query.RestaurantId &&
        req.query.ShiftId&&
        req.query.CustomerId &&
        req.query.CreatedBy &&
        req.query.Date
      ) {
        const pool = await poolPromise;
        pool.query(
          `SELECT SUM(BillAmount) AS TotalBillAmount, SUM(TaxAmount) AS TotalTaxAmount, SUM(NetAmount) AS TotalNetAmount FROM OrderHeader WHERE RestaurantId=${req.query.RestaurantId} AND CustomerId=${req.query.CustomerId} AND CreatedBy=${req.query.CreatedBy} AND CAST(OrderDate as DATE) = '${req.query.Date}' GROUP BY CustomerId`,
          function(err, amountRes) {
            if (err) {
              throw err;
            }
            pool.query(
              `SELECT * FROM ShiftWiseStockMaster WHERE RestaurantId = ${req.query.RestaurantId} AND ShiftId = ${req.query.ShiftId} AND CustomerId = ${req.query.CustomerId} AND CreatedBy = ${req.query.CreatedBy} AND CAST(CreatedDate AS DATE) = '${req.query.Date}'`,
              function(err, result) {
                if (err) {
                  throw err;
                } else {
                  if (result.recordset.length > 0) {
                    splitDetails(result.recordset, (error, response) => {
                      if (error) {
                        return res.json({ status: false, error: error });
                      }
                      if (amountRes.recordset.length > 0) {
                        response["HandOverTo"] = result.recordset[0].HandOverTo;
                        response["Status"] = result.recordset[0].Status;
                        response["TotalBillAmount"] =
                          amountRes.recordset[0].TotalBillAmount;
                        response["TotalTaxAmount"] =
                          amountRes.recordset[0].TotalTaxAmount;
                        response["TotalNetAmount"] =
                          amountRes.recordset[0].TotalNetAmount;
                        res.json({ status: true, data: response });
                      } else {
                        response["HandOverTo"] = result.recordset[0].HandOverTo;
                        response["Status"] = result.recordset[0].Status;
                        response["TotalBillAmount"] = 0;
                        response["TotalTaxAmount"] = 0;
                        response["TotalNetAmount"] = 0;
                        res.json({ status: true, data: response });
                      }
                    });
                  } else {
                    res.json({ status: true, data: [] });
                  }
                }
              }
            );
          }
        );
      } else throw "Please fill all the details!";
    } catch (error) {
      errorHandle.handleError(error, errorRes => {
        res.send(errorRes);
      });
    }
  }

  async getAcceptancePendingData(req, res) {
    try {
      if (!(req.query.RestaurantId && req.query.HandOverTo))
        throw "Please provide all the details!";
      else {
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .input("RestaurantId",req.query.RestaurantId)
                        .input("HandOverTo",req.query.HandOverTo)
                        .execute("getAcceptancePendingData")
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

  // async getAcceptancePendingData(req, res) {
  //   try {
  //     if (!(req.query.RestaurantId && req.query.HandOverTo))
  //       throw "Please provide all the details!";
  //     else {
  //       const pool = await poolPromise;
  //       let result = await pool.query(
  //         `SELECT * FROM ShiftWiseStockMaster WHERE RestaurantId = ${req.query.RestaurantId} AND HandOverTo=${req.query.HandOverTo} AND Status='P'`
  //       );
  //       res.json({ status: true, data: result.recordset });
  //     }
  //   } catch (error) {
  //     errorHandle.handleError(error, errorRes => {
  //       res.send(errorRes);
  //     });
  //   }
  // }

  async updateShiftWiseStockInMaster(req, res) {
    try {
      if (
        req.body.RestaurantId &&
        // req.body.ShiftId &&
        req.body.CustomerId &&
        req.body.CreatedBy &&
        req.body.Date &&
        req.body.HandOverTo &&
        req.body.UpdatedBy
      ) {
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .input("RestaurantId", req.body.RestaurantId)
                        .input("CustomerId", req.body.CustomerId)
                        .input("HandOverTo",req.body.HandOverTo)
                        .input("CreatedBy",req.body.CreatedBy)
                        .input("Date",req.body.Date)
                        .input("UpdatedBy",req.body.UpdatedBy)
                        .execute("updateShiftWiseStockInMaster")
        if (result.recordset[0][""][1] == 1) {
          res.json({status: false, message:result.recordset[0][""][0]});
        }
        else {
          res.json({status: false, message:result.recordset[0][""][0]})
        }
      } else throw "Please fill all the details!";
    } catch (error) {
      errorHandle.handleError(error, errorRes => {
        res.send(errorRes);
      });
    }
  }

  // async updateShiftWiseStockInMaster(req, res) {
  //   try {
  //     if (
  //       req.body.RestaurantId &&
  //       req.body.ShiftId &&
  //       req.body.CustomerId &&
  //       req.body.CreatedBy &&
  //       req.body.Date &&
  //       req.body.HandOverTo &&
  //       req.body.UpdatedBy
  //     ) {
  //       const pool = await poolPromise;
  //       pool.query(
  //         `UPDATE ShiftWiseStockMaster SET HandOverTo = '${req.body.HandOverTo}' WHERE RestaurantId = ${req.body.RestaurantId} AND CustomerId = ${req.body.CustomerId} AND CreatedBy = ${req.body.CreatedBy} AND CAST(CreatedDate as DATE) = '${req.body.Date}'`,
  //         function(err, result) {
  //           if (err) {
  //             throw err;
  //           } else {
  //             res.json({ status: true, message: "Data Updated Successfully" });
  //           }
  //         }
  //       );
  //     } else throw "Please fill all the details!";
  //   } catch (error) {
  //     errorHandle.handleError(error, errorRes => {
  //       res.send(errorRes);
  //     });
  //   }
  // }

  async updateShiftWiseStatusChange(req, res) {
    try {
      if (
        req.body.RestaurantId &&
        req.body.ShiftId &&
        req.body.Date &&
        req.body.UpdatedBy
      ) {
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .input("RestaurantId", req.body.RestaurantId)
                        .input("ShiftId",req.body.ShiftId)
                        .input("CustomerId", req.body.CustomerId)
                        .input("HandOverTo",req.body.HandOverTo)
                        .input("Date",req.body.Date)
                        .input("UpdatedBy",req.body.UpdatedBy)
                        .execute("updateShiftWiseStatusChange")
        if (result.recordset[0][""][1] == 1) {
          res.json({status: false, message:result.recordset[0][""][0]});
        }
        else {
          res.json({status: false, message:result.recordset[0][""][0]})
        }
      } else throw "Please fill all the details!";
    } catch (error) {
      errorHandle.handleError(error, errorRes => {
        res.send(errorRes);
      });
    }
  }

  // async updateShiftWiseStatusChange(req, res) {
  //   try {
  //     if (
  //       req.body.RestaurantId &&
  //       req.body.ShiftId &&
  //       req.body.Date &&
  //       req.body.UpdatedBy
  //     ) {
  //       const pool = await poolPromise;
  //       await pool
  //         .request()
  //         .input("RestaurantId", req.body.RestaurantId)
  //         .input("ShiftId", req.body.ShiftId)
  //         .input("CustomerId", req.body.CustomerId)
  //         .input("Date", req.body.Date)
  //         .input("HandOverTo", req.body.HandOverTo)
  //         .input("UpdatedBy", req.body.UpdatedBy)
  //         .query(
  //           `UPDATE ShiftWiseStockMaster SET Status='A' WHERE RestaurantId=${req.body.RestaurantId} AND ShiftId=${req.body.ShiftId} AND CAST(CreatedDate as DATE) = '${req.body.Date}'`
  //         );
  //       res.json({
  //         status: true,
  //         message: "ShiftWise Stock updated successfully."
  //       });
  //     } else throw "Please fill all the details!";
  //   } catch (error) {
  //     errorHandle.handleError(error, errorRes => {
  //       res.send(errorRes);
  //     });
  //   }
  // }
}

async function getOrderDetails(reqData, callback) {
  const pool = await poolPromise;
  async.parallel(
    [
      function(callback) {
        pool.query(
          `SELECT MAX(OrderDetails.RestaurantId) AS RestaurantId, OrderDetails.FoodId, OrderDetails.FoodVarietyId, SUM(OrderDetails.OrderQuantity) AS Quantity, SUM(NetTariff) AS Amount FROM OrderDetails,FoodQuantityMaster WHERE OrderDetails.RestaurantId=${reqData.RestaurantId} AND OrderDetails.CustomerId=${reqData.CustomerId} AND OrderDetails.CreatedBy=${reqData.CreatedBy} AND CAST(OrderDetails.OrderDate as DATE) = '${reqData.Date}' AND FoodQuantityMaster.FoodId = OrderDetails.FoodId AND OrderDetails.BuffetId IS NULL AND OrderDetails.ComplementaryId IS NULL AND OrderDetails.FoodId IS NOT NULL GROUP BY OrderDetails.FoodId, OrderDetails.FoodVarietyId`,
          function(err, result) {
            if (err) {
              return callback(err);
            }
            return callback(null, { FoodDetails: result.recordset });
          }
        );
      },
      function(callback) {
        pool.query(
          `SELECT MAX(OrderDetails.RestaurantId) AS RestaurantId, OrderDetails.SoftDrinkId, OrderDetails.SoftDrinkQuantityId, SUM(OrderDetails.OrderQuantity) AS Quantity, SUM(NetTariff) AS Amount FROM OrderDetails WHERE OrderDetails.RestaurantId=${reqData.RestaurantId} AND OrderDetails.CustomerId=${reqData.CustomerId} AND OrderDetails.CreatedBy=${reqData.CreatedBy} AND CAST(OrderDetails.OrderDate as DATE) = '${reqData.Date}' AND OrderDetails.FoodId IS NULL GROUP BY OrderDetails.SoftDrinkId, OrderDetails.SoftDrinkQuantityId`,
          function(err, result) {
            if (err) {
              return callback(err);
            }
            return callback(null, { SoftDrinkDetails: result.recordset });
          }
        );
      },
      function(callback) {
        pool.query(
          `SELECT MAX(RestaurantId) AS RestaurantId, BuffetId, MAX(OrderQuantity) AS Quantity FROM OrderDetails WHERE RestaurantId=${reqData.RestaurantId} AND CustomerId=${reqData.CustomerId} AND CreatedBy=${reqData.CreatedBy} AND CAST(OrderDate as DATE) = '${reqData.Date}' AND BuffetId IS NOT NULL GROUP BY BuffetId`,
          function(err, result) {
            if (err) {
              return callback(err);
            }
            if (result.recordset.length > 0) {
              getBuffetAmount(result.recordset, BuffetDetailsArr => {
                return callback(null, { BuffetDetails: BuffetDetailsArr });
              });
            } else {
              return callback(null, { BuffetDetails: result.recordset });
            }
          }
        );
      },
      function(callback) {
        pool.query(
          `SELECT MAX(RestaurantId) AS RestaurantId, ComplementaryId, MAX(OrderQuantity) AS Quantity, Amount = 0 FROM OrderDetails WHERE RestaurantId=${reqData.RestaurantId} AND CustomerId=${reqData.CustomerId} AND CreatedBy=${reqData.CreatedBy} AND CAST(OrderDate as DATE) = '${reqData.Date}' AND ComplementaryId IS NOT NULL GROUP BY ComplementaryId`,
          function(err, result) {
            if (err) {
              return callback(err);
            }
            return callback(null, { ComplementaryDetails: result.recordset });
          }
        );
      }
    ],
    function(error, callbackResults) {
      if (error) {
        callback(error, null);
      } else {
        callback(null, callbackResults);
      }
    }
  );
}

async function getBuffetAmount(BuffetDetailsArr, callback) {
  const pool = await poolPromise;
  async.map(
    BuffetDetailsArr,
    (value, cb) => {
      pool.query(
        `SELECT Tariff FROM BuffetMaster WHERE BuffetMaster.BuffetId = ${value.BuffetId}`,
        function(err, result) {
          if (err) {
            return cb(err);
          }
          value["Amount"] =
            Number(value.Quantity) * Number(result.recordset[0].Tariff);
          cb(null, null);
        }
      );
    },
    function(err, result) {
      callback(BuffetDetailsArr);
    }
  );
}

async function insertDataToShiftWiseStock(reqData, OrderDetailsObj, callback) {
  var insertQueries = [];
  async.map(
    OrderDetailsObj,
    (value, cb) => {
      if (value.hasOwnProperty("FoodDetails") && value.FoodDetails.length > 0) {
        var insertQuery = getInsertQueryArr(reqData, value.FoodDetails);
        insertQueries.push(insertQuery);
        cb(null, insertQueries);
      } else if (
        value.hasOwnProperty("SoftDrinkDetails") &&
        value.SoftDrinkDetails.length > 0
      ) {
        var insertQuery = getInsertQueryArr(reqData, value.SoftDrinkDetails);
        insertQueries.push(insertQuery);
        cb(null, insertQueries);
      } else if (
        value.hasOwnProperty("BuffetDetails") &&
        value.BuffetDetails.length > 0
      ) {
        var insertQuery = getInsertQueryArr(reqData, value.BuffetDetails);
        insertQueries.push(insertQuery);
        cb(null, insertQueries);
      } else if (
        value.hasOwnProperty("ComplementaryDetails") &&
        value.ComplementaryDetails.length > 0
      ) {
        var insertQuery = getInsertQueryArr(
          reqData,
          value.ComplementaryDetails
        );
        insertQueries.push(insertQuery);
        cb(null, insertQueries);
      } else {
        cb(null, insertQueries);
      }
    },
    function(err, result) {
      if (err) {
        return callback(err, null);
      }
      insertDataToTable(insertQueries, (error, response) => {
        if (error) {
          return callback(error, null);
        } else {
          callback(null, null);
        }
      });
    }
  );
}

async function insertDataToTable(insertQueries, callback) {
  const pool = await poolPromise;
  async.map(
    insertQueries,
    (query, cb) => {
      pool.query(query, function(err, result) {
        if (err) {
          cb(err, null);
        } else {
          cb(null, null);
        }
      });
    },
    function(err, result) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, null);
      }
    }
  );
}

function getInsertQueryArr(reqData, DetailsArr) {
  var insertQuery = [];
  var columnName = "";
  var columnValue = "";
  for (let i = 0; i < DetailsArr.length; i++) {
    const { ColNameQuery, ColValueQuery } = getInsertQueryModified(
      DetailsArr[i]
    );
    columnName = ColNameQuery;
    columnValue +=
      "(" +
      ColValueQuery +
      ", " +
      `'${reqData.ShiftId}'` +
      ", " +
      `'${reqData.CustomerId}'` +
      ", " +
      `'${reqData.CreatedBy}'` +
      "),";
  }
  columnName += ",ShiftId, CustomerId, CreatedBy";
  if (columnValue.charAt(columnValue.length - 1) === ",") {
    columnValue = columnValue.substring(0, columnValue.length - 1);
  }
  var insertQuery = `INSERT INTO ShiftWiseStockMaster(${columnName}) VALUES${columnValue}`;
  return insertQuery;
}

function getInsertQueryModified(req) {
  let ColNameQuery = "",
    ColValueQuery = "";
  if (!req) return;
  for (let key in req) {
    if (
      ![
        "FoodName",
        "FoodVarietyName",
        "SoftDrinkName",
        "SoftDrinkQuantityName",
        "BuffetName",
        "ComplementaryName",
        "Tariff",
        "OrderId",
        "ReceivedQty"
      ].includes(key)
    ) {
      if (req[key]) {
        ColNameQuery += `${ColNameQuery != `` ? `,` : ``}${key}`;
        ColValueQuery += `${ColValueQuery != `` ? `,` : ``} '${req[key]}'`;
      } else if (
        (key == "FoodVarietyId" ||
          key == "WaiterId" ||
          key == "Tariff" ||
          key == "Amount" ||
          key == "BuffetId" ||
          key == "ComplementaryId") &&
        req[key] == ""
      ) {
        ColNameQuery += `${ColNameQuery != `` ? `,` : ``}${key}`;
        ColValueQuery += `${ColValueQuery != `` ? `,` : ``} NULL`;
      }
    }
  }
  return { ColNameQuery, ColValueQuery };
}

async function splitDetails(StockDetails, callback) {
  const pool = await poolPromise;
  var data = {
    FoodDetails: [],
    SoftDrinkDetails: [],
    BuffetDetails: [],
    ComplementaryDetails: []
  };
  async.map(
    StockDetails,
    (value, cb) => {
      if (value.hasOwnProperty("FoodId") && value.FoodId != null) {
        pool.query(
          `SELECT FoodMaster.FoodName FROM FoodMaster WHERE FoodMaster.FoodId = ${value.FoodId}`,
          function(err, result) {
            if (err) {
              cb(err, null);
            } else {
              if (result.recordset.length > 0) {
                data.FoodDetails.push({
                  ShiftwiseStockId: value.ShiftwiseStockId,
                  RestaurantId: value.RestaurantId,
                  ShiftId: value.ShiftId,
                  CustomerId: value.CustomerId,
                  CreatedBy: value.CreatedBy,
                  FoodId: value.FoodId,
                  FoodName: result.recordset[0].FoodName,
                  FoodVarietyId: value.FoodVarietyId,
                  Amount: value.Amount,
                  Quantity: value.Quantity
                });
                cb(null, null);
              } else {
                cb(null, null);
              }
            }
          }
        );
      } else if (
        value.hasOwnProperty("SoftDrinkId") &&
        value.SoftDrinkId != null
      ) {
        pool.query(
          `SELECT SoftDrinkMaster.SoftDrinkName, ConfigurationMaster.ConfigName AS SoftDrinkQuantityName, SoftDrinkQuantityMaster.Tariff, StockInMaster.ReceivedQty,StockInMaster.IssuedQty, StockInMaster.BalanceQty FROM SoftDrinkMaster,ConfigurationMaster, StockInMaster,SoftDrinkQuantityMaster WHERE SoftDrinkMaster.SoftDrinkId = ${value.SoftDrinkId} AND ConfigurationMaster.ConfigId = ${value.SoftDrinkQuantityId} AND StockInMaster.SoftDrinkId = ${value.SoftDrinkId} AND StockInMaster.SoftDrinkQuantityId = ${value.SoftDrinkQuantityId} AND SoftDrinkQuantityMaster.SoftDrinkId = ${value.SoftDrinkId} AND SoftDrinkQuantityMaster.SoftDrinkQuantityId = ${value.SoftDrinkQuantityId}`,
          function(err, result) {
            if (err) {
              cb(err, null);
            } else {
              if (result.recordset.length > 0) {
                data.SoftDrinkDetails.push({
                  ShiftwiseStockId: value.ShiftwiseStockId,
                  RestaurantId: value.RestaurantId,
                  ShiftId: value.ShiftId,
                  CustomerId: value.CustomerId,
                  CreatedBy: value.CreatedBy,
                  SoftDrinkId: value.SoftDrinkId,
                  SoftDrinkName: result.recordset[0].SoftDrinkName,
                  SoftDrinkQuantityId: value.SoftDrinkQuantityId,
                  SoftDrinkQuantityName:
                    result.recordset[0].SoftDrinkQuantityName,
                  IssuedQty: value.Quantity,
                  BalanceQty: result.recordset[0].BalanceQty,
                  Amount: value.Amount
                });
                cb(null, null);
              } else {
                cb(null, null);
              }
            }
          }
        );
      } else if (value.hasOwnProperty("BuffetId") && value.BuffetId != null) {
        pool.query(
          `SELECT BuffetName FROM BuffetMaster WHERE BuffetId = ${value.BuffetId}`,
          function(err, result) {
            if (err) {
              cb(err, null);
            } else {
              if (result.recordset.length > 0) {
                data.BuffetDetails.push({
                  ShiftwiseStockId: value.ShiftwiseStockId,
                  RestaurantId: value.RestaurantId,
                  ShiftId: value.ShiftId,
                  CustomerId: value.CustomerId,
                  CreatedBy: value.CreatedBy,
                  BuffetId: value.BuffetId,
                  BuffetName: result.recordset[0].BuffetName,
                  Amount: value.Amount,
                  Quantity: value.Quantity
                });
                cb(null, null);
              } else {
                cb(null, null);
              }
            }
          }
        );
      } else if (
        value.hasOwnProperty("ComplementaryId") &&
        value.ComplementaryId != null
      ) {
        pool.query(
          `SELECT ComplementaryMaster.FoodTimingId FROM ComplementaryMaster WHERE ComplementaryMaster.UniqueId = ${value.ComplementaryId}`,
          function(err, result) {
            if (err) {
              cb(err, null);
            } else {
              pool.query(
                `SELECT FoodTimingMaster.FoodTimingName AS ComplementaryName FROM FoodTimingMaster WHERE FoodTimingMaster.FoodTimingId = ${result.recordset[0].FoodTimingId}`,
                function(err, result) {
                  if (err) {
                    cb(err, null);
                  } else {
                    if (result.recordset.length > 0) {
                      data.ComplementaryDetails.push({
                        ShiftwiseStockId: value.ShiftwiseStockId,
                        RestaurantId: value.RestaurantId,
                        ShiftId: value.ShiftId,
                        CustomerId: value.CustomerId,
                        CreatedBy: value.CreatedBy,
                        ComplementaryId: value.ComplementaryId,
                        ComplementaryName:
                          result.recordset[0].ComplementaryName,
                        Amount: value.Amount,
                        Quantity: value.Quantity
                      });
                      cb(null, null);
                    } else {
                      cb(null, null);
                    }
                  }
                }
              );
            }
          }
        );
      } else {
        cb(null, null);
      }
    },
    function(err, result) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, data);
      }
    }
  );
}

const shiftWiseStockInMaster = new ShiftWiseStockInMaster();

module.exports = shiftWiseStockInMaster;
