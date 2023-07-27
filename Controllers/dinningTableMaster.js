const errorHandle = require("../services/errorHandler");
const commonMsgs = require("../CommonMsg.json");
const { poolPromise, sql } = require("../db");
const async = require("async");

class DinningTableMasterController {
  async getAllData(req, res) {
    try {
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .execute("getAllDinningTableData")
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
  // async getAllData(req, res) {
  //   try {
  //     const pool = await poolPromise;
  //     let result = await pool.query(
  //       // `select * from DinningTableMaster`
  //       `select DinningTableMaster.DinningId, DinningMaster.DinningType, DinningTableMaster.TableId,  DinningTableMaster.TableName, DinningTableMaster.ChairCount, DinningTableMaster.ActiveStatus, DinningTableMaster.CreatedBy, DinningTableMaster.CreatedDate, DinningTableMaster.UpdatedBy, DinningTableMaster.UpdatedDate From DinningTableMaster INNER JOIN DinningMaster ON DinningTableMaster.DinningId = DinningMaster.DinningId`
  //     );
  //     res.json({ status: true, data: result.recordset });
  //   } catch (error) {
  //     errorHandle.handleError(error, errorRes => {
  //       res.send(errorRes);
  //     });
  //   }
  // }

  async getDinningTableDataByResId(req, res) {
    try {
      if (!req.query.RestaurantId) return res.json(commonMsgs.NullMsg);
      else {
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .input("RestaurantId", req.query.RestaurantId)
                        .execute("getAllDinningTableData")
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

  // async getDinningTableDataByResId(req, res) {
  //   try {
  //     if (!req.query.RestaurantId) return res.json(commonMsgs.NullMsg);
  //     else {
  //       const pool = await poolPromise;
  //       let result = await pool.query(
  //         // `select * from DinningTableMaster`
  //         `select DinningTableMaster.DinningId, DinningMaster.DinningType, DinningTableMaster.TableId,  DinningTableMaster.TableName, DinningTableMaster.ChairCount, DinningTableMaster.ActiveStatus, DinningTableMaster.CreatedBy, DinningTableMaster.CreatedDate, DinningTableMaster.UpdatedBy, DinningTableMaster.UpdatedDate From DinningTableMaster,DinningMaster WHERE DinningTableMaster.DinningId = DinningMaster.DinningId AND DinningTableMaster.RestaurantId = ${req.query.RestaurantId}`
  //       );
  //       res.json({ status: true, data: result.recordset });
  //     }
  //   } catch (error) {
  //     errorHandle.handleError(error, errorRes => {
  //       res.send(errorRes);
  //     });
  //   }
  // }

  async getData(req, res) {
    try {
      if (!req.query.TableId) return res.json(commonMsgs.NullMsg);
      else {
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .input("TableId", req.query.TableId)
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

  // async getData(req, res) {
  //   try {
  //     if (!req.query.TableId) return res.json(commonMsgs.NullMsg);
  //     else {
  //       const pool = await poolPromise;
  //       let result = await pool.query(
  //         `select * from DinningTableMaster where TableId= ${req.query.TableId} AND ActiveStatus='A'`
  //       );
  //       res.json({ status: true, data: result.recordset });
  //     }
  //   } catch (error) {
  //     errorHandle.handleError(error, errorRes => {
  //       res.send(errorRes);
  //     });
  //   }
  // }

  async getDataByDinningId(req, res) {
    try {
      if (!req.query.DinningId) res.json(commonMsgs.NullMsg);
      else {
        const pool = await poolPromise;
        let result = await pool.query(
          `select * from DinningTableMaster where DinningId= ${req.query.DinningId} AND RestaurantId = ${req.query.RestaurantId}`
        );
        var resultObj = {};
        resultObj[req.query.DinningId] = result.recordset;
        tableAvailabilityCheck(
          resultObj,
          pool,
          req.query.RestaurantId,
          req.query.Date,
          req.query.DinningId,
          async resultRes => {
            var availabilityData = Object.values(resultRes)[0];
            let sortedArray = availabilityData.sort((a, b) => {
              return a.TableId - b.TableId;
            });
            res.json({ Status: true, data: sortedArray });
          }
        );
      }
    } catch (error) {
      errorHandle.handleError(error, errorRes => {
        res.send(errorRes);
      });
    }
  }

  async getTableStatus(req, res) {
    try {
      if (
        !(
          req.query.hasOwnProperty("RestaurantId") &&
          req.query.hasOwnProperty("Date")
        )
      )
        throw "Please fill all the details!.";
      let pool = await poolPromise;
      // list of bar type details get
      let TypeResult = await pool
        .request()
        .query(
          `select DinningId,DinningType from DinningMaster Where RestaurantId=${req.query.RestaurantId} AND ActiveStatus='A'`
        );
      if (TypeResult.recordset.length == 0) throw "No tables Found!";
      // checking  type bar tables based on barId
      typesBasedTables(
        TypeResult.recordset,
        pool,
        req.query.RestaurantId,
        async funRes => {
          let asyncArray = [],
            resultArr = [];
          for await (let tableType of funRes) {
            asyncArray.push(next => {
              tableAvailabilityCheck(
                tableType,
                pool,
                req.query.RestaurantId,
                req.query.Date,
                async resultRes => {
                  resultArr.push(resultRes);
                  next(null);
                }
              );
            });
          }
          async.parallel(asyncArray, (err, res1) => {
            if (err) {
              errorHandle.handleError(error, errorRes => {
                res.send(errorRes);
              });
            } else {
              res.json({
                Status: true,
                Data: {
                  DinningTypes: TypeResult.recordset,
                  TableAvailabilty: resultArr
                }
              });
            }
          });
        }
      );
    } catch (error) {
      errorHandle.handleError(error, errorRes => {
        res.send(errorRes);
      });
    }
  }

  async addData(req, res) {
    try {
      if (
        !(
          req.body.RestaurantId &&
          req.body.DinningId &&
          req.body.TableName &&
          req.body.ChairCount &&
          req.body.CreatedBy
        )
      )
        res.json(commonMsgs.NullMsg);
      else {
          const pool = await poolPromise;
          let result = await pool
                          .request()
                          .input("DinningId", req.body.DinningId)
                          .input("TableName", req.body.TableName)
                          .input("ChairCount",req.body.ChairCount)
                          .input("CreatedBy",req.body.CreatedBy)
                          .input("RestaurantId",req.body.RestaurantId)
                          .execute("addDinningTableData")
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
  //         req.body.DinningId &&
  //         req.body.TableName &&
  //         req.body.ChairCount &&
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
  //       // let result = await pool.query(
  //       //   `INSERT INTO DinningTableMaster(${ColNameQuery}) VALUES(${ColValueQuery})`
  //       // );
  //       let result = await pool.query(`BEGIN
  //       IF NOT EXISTS (SELECT * FROM DinningTableMaster 
  //          WHERE DinningId = '${req.body.DinningId}' and RestaurantId='${req.body.RestaurantId}' and TableName='${req.body.TableName}')
    
  //         INSERT INTO DinningTableMaster (${ColNameQuery}) VALUES(${ColValueQuery})

  //     END`)
  //       //res.json(commonMsgs.AddMsg);
  //       if (result.rowsAffected.length == 0) {
  //         res.json({ status: false, message: "Table Name already exists!" });
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
      const { TableId, UpdatedBy } = req.body;
      if (!TableId || !UpdatedBy) return res.json(commonMsgs.NullMsg);
      else {
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .input("TableId", req.body.TableId)
                        .input("DinningId",req.body.DinningId)
                        .input("TableName",req.body.TableName)
                        .input("ChairCount",req.body.ChairCount)
                        .input("UpdatedBy",req.body.UpdatedBy)
                        // .input("RestaurantId",req.body.RestaurantId)
                        .execute("updateDinningTableData")
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
  //     const { TableId, UpdatedBy } = req.body;
  //     if (!TableId || !UpdatedBy) return res.json(commonMsgs.NullMsg);
  //     let queryValue = null;
  //     for (const [key, value] of Object.entries(req.body)) {
  //       if (key != "TableId")
  //         queryValue == null
  //           ? (queryValue = `${key}='${value}'`)
  //           : (queryValue += `,${key}='${value}'`);
  //     }
  //     const pool = await poolPromise;
  //     await pool.query(
  //       `IF NOT EXISTS (select * from DinningTableMaster where TableId!=${req.body.TableId} and TableName='${req.bodyTableName}')
  //       UPDATE DinningTableMaster SET ${queryValue}, UpdatedDate = GETDATE()  WHERE TableId = ${TableId}`
  //     );
  //     res.json(commonMsgs.updateMsg);
  //   } catch (error) {
  //     errorHandle.handleError(error, errorRes => {
  //       res.send(errorRes);
  //     });
  //   }
  // }

  async deleteData(req, res) {
    const { ActiveStatus, TableId } = req.query;
    try {
      if (!TableId || !ActiveStatus) return res.json(commonMsgs.NullMsg);
      else {
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .input("ActiveStatus", req.query.ActiveStatus)
                        .input("TableId", req.query.TableId)
                        .execute("deleteDinningTableData")
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
  //   const { ActiveStatus, TableId } = req.query;
  //   try {
  //     if (!TableId || !ActiveStatus) return res.json(commonMsgs.NullMsg);
  //     const pool = await poolPromise;
  //     await pool.query(
  //       `UPDATE DinningTableMaster SET ActiveStatus = '${ActiveStatus}' WHERE TableId = '${TableId}'`
  //     );
  //     res.json(commonMsgs.deleteMsg);
  //   } catch (error) {
  //     errorHandle.handleError(error, errorRes => {
  //       res.send(errorRes);
  //     });
  //   }
  // }
}

function typesBasedTables(tableTypes, pool, RestaurantId, callback) {
  let obj = [];
  tableTypes.map(async (value, index) => {
    let temp = {};
    let result = await pool
      .request()
      .query(
        `select DinningTableMaster.TableId, DinningTableMaster.TableName,ChairCount From DinningTableMaster,DinningMaster Where DinningMaster.RestaurantId=${RestaurantId} AND DinningTableMaster.DinningId=${value.DinningId} AND DinningTableMaster.ActiveStatus='A' AND DinningTableMaster.DinningId=DinningMaster.DinningId`
      );
    temp[value.DinningId] = result.recordset;
    obj.push(temp);
    if (index == tableTypes.length - 1) callback(obj);
  });
}

async function tableAvailabilityCheck(
  tableType,
  pool,
  RestaurantId,
  Date,
  DinningId,
  callback
) {
  var asyncArr = [],
    resultArr = [];
  for await (let [key, value] of Object.entries(
    tableType[Object.keys(tableType)[0]]
  )) {
    append(value, key);
  }
  function append(value, key) {
    asyncArr.push(cb => {
      pool.query(
        `SELECT convert(varchar, OrderDate, 23) as OrderDate, OrderHeaderSl, OrderId, TableId, TableStatus, HotelRoomNo, PaymentStatus, BookedChairs from OrderHeader WHERE CAST(OrderDate as DATE) = '${Date}' AND RestaurantId=${RestaurantId} AND OrderFrom = 'R' AND DinningId=${
          Object.keys(tableType)[0]
        } AND TableStatus IN ('O') ORDER BY TableId ASC`,
        (error, result) => {
          if (error) {
            cb(null, null);
          } else {
            let asyncArr1 = [],
              resultArr1 = {
                // RestaurantId: value.RestaurantId,
                DinningId: value.DinningId,
                TableId: value.TableId,
                TableName: value.TableName,
                ChairCount: value.ChairCount,
                ActiveStatus: value.ActiveStatus,
                Status: "Available",
                OrderDetails: []
              };
            result.recordset.map((value1, index1) => {
              asyncArr1.push(next1 => {
                let TableSplit = value1.TableId.split(",");
                if (TableSplit.includes(value.TableId.toString())) {
                  resultArr1.Status = "Booked";
                  resultArr1["OrderDetails"].push({
                    OrderId: value1.OrderId,
                    OrderHeaderSl: value1.OrderHeaderSl,
                    TableId: value1.TableId,
                    BookedChairs: value1.BookedChairs,
                    PaymentStatus: value1.PaymentStatus,
                    TableStatus: value1.TableStatus,
                    HotelRoomNo: value1.HotelRoomNo
                  });
                }
                next1(null, null);
              });
            });
            async.parallel(asyncArr1, (err, res1) => {
              resultArr.push(resultArr1);
              cb(null, null);
            });
          }
        }
      );
    });
  }
  async.parallel(asyncArr, (erro, result) => {
    callback({ [Object.keys(tableType)[0]]: resultArr });
  });
}

const DinningTableMaster = new DinningTableMasterController();

module.exports = DinningTableMaster;
