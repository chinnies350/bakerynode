const { sql, poolPromise } = require("../db");
const errorHandle = require("../services/errorHandler");
const utility = require("../utility");

class StockInMasterController {
  async getData(req, res) {
    try {
      if (!req.query.hasOwnProperty("RestaurantId"))
        throw "Please provide RestaurantId!";
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .input("RestaurantId", req.query.RestaurantId)
                        .execute("getStockInMasterData")
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
  //     if (!req.query.hasOwnProperty("RestaurantId"))
  //       throw "Please provide RestaurantId!";
  //     const pool = await poolPromise;

  //     const result = await pool.query(
  //       `SELECT StockInMaster.StockId, StockInMaster.RestaurantId,  StockInMaster.FoodId,(select FoodName from FoodMaster where StockInMaster.FoodId=FoodId) as FoodName,
  //       StockInMaster.FoodQuantityId,
  //       Concat(FoodQuantityMaster.FoodQuantity,' ',(select ConfigurationMaster.ConfigName from ConfigurationMaster where ConfigurationMaster.ConfigId=FoodQuantityMaster.FoodQuantityTypeId)) AS FoodQuantityName,
  //       ReceivedQty,IssuedQty,BalanceQty,  Rate, TotalAmt, StockInMaster.CreatedBy, 
  //       StockInMaster.CreatedDate, StockInMaster.UpdatedBy, StockInMaster.UpdatedDate,StockInMaster.MfgDate,StockInMaster.ExpDate,StockInMaster.Barcode
  //       FROM StockInMaster,FoodQuantityMaster 
  //       WHERE FoodQuantityMaster.UniqueId=StockInMaster.FoodQuantityId
  //       AND StockInMaster.RestaurantId=${req.query.RestaurantId}`
  //     );
  //     res.json({ status: true, data: result.recordset });
  //   } catch (error) {
  //     errorHandle.handleError(error, errorRes => {
  //       res.send(errorRes);
  //     });
  //   }
  // }

  async getQuantity(req, res) {
    try {
      if (!req.query.hasOwnProperty("SoftDrinkId"))
        throw "Please provide SoftDrinkId!";
      const pool = await poolPromise;

      const result = await pool.query(
        `select distinct StockInMaster.SoftDrinkQuantityId,ConfigurationMaster.ConfigName from StockInMaster 
        inner join ConfigurationMaster on ConfigurationMaster.ConfigId=StockInMaster.SoftDrinkQuantityId
        where SoftDrinkId=${req.query.SoftDrinkId}
        group by SoftDrinkQuantityId,ConfigurationMaster.ConfigName`
      );
      res.json({status: true, data: result.recordset});
    } catch (error) {
      errorHandle.handleError(error, errorRes => {
        res.send(errorRes);
      });
    }
  }
  async getActualRate(req, res) {
    try {
      if (
        !(
          req.query.RestaurantId &&
          req.query.SoftDrinkId &&
          req.query.SoftDrinkQuantityId
        )
      )
        throw "Please fill all the details";
      const pool = await poolPromise;
      const result = await pool.query(
        `SELECT * from StockInMaster WHERE RestaurantId=${req.query.RestaurantId} AND SoftDrinkId=${req.query.SoftDrinkId} AND SoftDrinkQuantityId=${req.query.SoftDrinkQuantityId} ORDER BY StockId DESC`
      );
      res.json({ status: true, data: result.recordset });
    } catch (error) {
      errorHandle.handleError(error, errorRes => {
        res.send(errorRes);
      });
    }
  }

  async getStockInMasterDataByResId(req, res) {
    try {
      if (!req.query.RestaurantId) throw "Please give the Restaurant Id";
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .input("RestaurantId", req.query.RestaurantId)
                        .execute("getStockInMasterDataByResId")
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

  // async getStockInMasterDataByResId(req, res) {
  //   try {
  //     if (!req.query.RestaurantId) throw "Please give the Restaurant Id";
  //     // console.log("hihi")
  //     const pool = await poolPromise;
  //     const result = await pool.query(
  //       `SELECT StockInMaster.StockId, 
  //       StockInMaster.Date,
  //       StockInMaster.RestaurantId, 
  //       StockInMaster.FoodId,
  //       (select FoodName from FoodMaster where StockInMaster.FoodId=FoodId) as FoodName, 
  //       (select FoodCategoryId from FoodMaster where StockInMaster.FoodId=FoodId) as FoodCategoryId,
  //       (select FoodCategoryName from FoodCategoryMaster where FoodCategoryMaster.FoodCategoryId  IN (select FoodCategoryId from FoodMaster where StockInMaster.FoodId=FoodId)) as FoodCategoryName,
  //       (select CategoryTypeId from FoodCategoryMaster where FoodCategoryMaster.FoodCategoryId  IN (select FoodCategoryId from FoodMaster where StockInMaster.FoodId=FoodId)) as CategoryTypeId,
  //       (select ConfigName from ConfigurationMaster  where ConfigurationMaster.ConfigId IN (select CategoryTypeId from FoodCategoryMaster where FoodCategoryMaster.FoodCategoryId  IN (select FoodCategoryId from FoodMaster where StockInMaster.FoodId=FoodId)))AS CategoryTypeName,
  //       StockInMaster.FoodQuantityId,Concat(FoodQuantityMaster.FoodQuantity,' ',(select ConfigurationMaster.ConfigName from ConfigurationMaster where ConfigurationMaster.ConfigId=FoodQuantityMaster.FoodQuantityTypeId)) AS FoodQuantityName,
  //            ReceivedQty,
  //        IssuedQty, 
  //        BalanceQty, 
  //        Rate, 
  //        TotalAmt, 
  //        StockInMaster.CreatedBy, 
  //        StockInMaster.CreatedDate,
  //        StockInMaster.UpdatedBy, 
  //        StockInMaster.UpdatedDate,StockInMaster.MfgDate,StockInMaster.ExpDate,StockInMaster.Barcode
  //        FROM StockInMaster,FoodQuantityMaster 
  //           WHERE FoodQuantityMaster.UniqueId=StockInMaster.FoodQuantityId 
  //            AND StockInMaster.RestaurantId= ${req.query.RestaurantId}`
  //     );
  //     res.json({ status: true, data: result.recordset });
  //   } catch (error) {
  //     errorHandle.handleError(error, errorRes => {
  //       res.send(errorRes);
  //     });
  //   }
  // }

  async addData(req, res) {
    try {
      if (!(
              req.body.RestaurantId &&
              req.body.FoodId &&
              req.body.FoodQuantityId &&
              req.body.ReceivedQty &&
              req.body.Rate &&
              req.body.TotalAmt &&
              req.body.CreatedBy &&
              req.body.Date
          )) throw "Please fill all the details!";
      else {
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .input("RestaurantId", req.body.RestaurantId)
                        .input("FoodId", req.body.FoodId)
                        .input("FoodQuantityId", req.body.FoodQuantityId)
                        .input("Date", req.body.Date)
                        .input("Rate", req.body.Rate)
                        .input("ReceivedQty", req.body.ReceivedQty)
                        .input("IssuedQty", req.body.IssuedQty)
                        .input("BalanceQty", req.body.BalanceQty)
                        .input("TotalAmt", req.body.TotalAmt)
                        .input("CreatedBy", req.body.CreatedBy)
                        .input("MfgDate", req.body.MfgDate)
                        .input("ExpDate", req.body.ExpDate)
                        .input("Barcode", req.body.Barcode)
                        .input("BarcodeValue",req.body.BarcodeValue)
                        .input("LowStock",req.body.LowStock)
                        .execute("addStockinMasterData")
        if (result.recordset[0][""][1] == 1) {
          res.json({status: true, message:result.recordset[0][""][0]})
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

  // async addData(req, res) {
  //   try {
  //     if (
  //       req.body.RestaurantId &&
  //       req.body.FoodId &&
  //       req.body.FoodQuantityId &&
  //       req.body.ReceivedQty &&
  //       req.body.Rate &&
  //       req.body.TotalAmt &&
  //       req.body.CreatedBy &&
  //       req.body.Date
  //     ) {
  //       const pool = await poolPromise;
  //         await pool
  //           .request()
  //           .input("RestaurantId", req.body.RestaurantId)
  //           .input("FoodId", req.body.FoodId)
  //           .input("FoodQuantityId", req.body.FoodQuantityId)
  //           .input("ReceivedQty", req.body.ReceivedQty)
  //           .input("IssuedQty", req.body.IssuedQty)
  //           .input("BalanceQty", req.body.BalanceQty)
  //           .input("Rate", req.body.Rate)
  //           .input("TotalAmt", req.body.TotalAmt)
  //           // .input("BalanceQtyMl", req.body.BalanceQtyMl)
  //           .input("CreatedBy", req.body.CreatedBy)
  //           .input("Date", req.body.Date)
  //           .input("MfgDate", req.body.MfgDate)
  //           .input("ExpDate", req.body.ExpDate)
  //           .input("Barcode", req.body.Barcode)
  //           .query(
  //             `INSERT INTO StockInMaster (RestaurantId, FoodId, FoodQuantityId, ReceivedQty,IssuedQty,BalanceQty, Rate, TotalAmt, CreatedBy,Date, MfgDate, ExpDate, Barcode) VALUES (@RestaurantId, @FoodId, @FoodQuantityId, @ReceivedQty,@IssuedQty,@BalanceQty, @Rate, @TotalAmt, @CreatedBy,@Date, @MfgDate, @ExpDate, @Barcode)`
  //           );
  //         res.json({ status: true, message: "StockIn added successfully." });
  //     } else throw "Please fill all the details!";
  //   } catch (error) {
  //     errorHandle.handleError(error, errorRes => {
  //       res.send(errorRes);
  //     });
  //   }
  // }

  async updateData(req, res) {
    try {
      if (!(req.body.StockId && req.body.UpdatedBy)) {
        const pool = await poolPromise;
        let objArr = utility.removeEmptyObjects(req.body);
        let queryValue = null;
        for (const [key, value] of Object.entries(objArr)) {
          if (key != "StockId")
            queryValue == null
              ? (queryValue = `${key}=@${key}`)
              : (queryValue += `,${key}=@${key}`);
        }
        await pool
          .request()
          .input("RestaurantId", req.body.RestaurantId)
          .input("FoodQuantityId", req.body.FoodQuantityId)
          .input("FoodId", req.body.FoodId)
          .input("ReceivedQty", req.body.ReceivedQty)
          .input("IssuedQty", req.body.IssuedQty)
          .input("BalanceQty", req.body.BalanceQty)
          .input("Rate", req.body.Rate)
          .input("TotalAmt", req.body.TotalAmt)
          .input("UpdatedBy", req.body.UpdatedBy)
          .input("MfgDate", req.body.MfgDate)
          .input("ExpDate", req.body.ExpDate)
          .input("Barcode", req.body.Barcode)
          .execute("updateStockInMasterData")
        if (result.recordset[0][""][1] == 1) {
        res.json({status: true, message:result.recordset[0][""][0]});
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

  // async updateData(req, res) {
  //   try {
  //     if (req.body.StockId && req.body.UpdatedBy) {
  //       const pool = await poolPromise;
  //       let objArr = utility.removeEmptyObjects(req.body);
  //       let queryValue = null;
  //       for (const [key, value] of Object.entries(objArr)) {
  //         if (key != "StockId")
  //           queryValue == null
  //             ? (queryValue = `${key}=@${key}`)
  //             : (queryValue += `,${key}=@${key}`);
  //       }
  //       console.log("queryValue",queryValue)
  //       await pool
  //         .request()
  //         .input("RestaurantId", req.body.RestaurantId)
  //         .input("FoodQuantityId", req.body.FoodQuantityId)
  //         .input("FoodId", req.body.FoodId)
  //         .input("ReceivedQty", req.body.ReceivedQty)
  //         .input("IssuedQty", req.body.IssuedQty)
  //         .input("BalanceQty", req.body.BalanceQty)
  //         .input("Rate", req.body.Rate)
  //         .input("TotalAmt", req.body.TotalAmt)
  //         .input("UpdatedBy", req.body.UpdatedBy)
  //         .input("MfgDate", req.body.MfgDate)
  //         .input("ExpDate", req.body.ExpDate)
  //         .input("Barcode", req.body.Barcode)
  //         .query(
  //           `UPDATE StockInMaster SET ${queryValue} WHERE StockId = ${req.body.StockId}`
  //         );
  //       res.json({ status: true, message: "StockIn updated successfully." });
  //     } else throw "Please fill all the details!";
  //   } catch (error) {
  //     errorHandle.handleError(error, errorRes => {
  //       res.send(errorRes);
  //     });
  //   }
  // }

  // async deleteData(req, res) {
  //   try {
  //     if (req.query.StockId && req.query.ActiveStatus) {
  //       const pool = await poolPromise;
  //       await pool
  //         .request()
  //         .input("StockId", req.query.StockId)
  //         .input("ActiveStatus", req.query.ActiveStatus)
  //         .query(
  //           "UPDATE StockInMaster SET ActiveStatus = @ActiveStatus  WHERE StockId = @StockId"
  //         );
  //       res.json({ status: true, message: "Deleted successfully." });
  //     } else throw "Please fill all the details!";
  //   } catch (error) {
  //     errorHandle.handleError(error, (errorRes) => {
  //       res.send(errorRes);
  //     });
  //   }
  // }
}

const stockInMaster = new StockInMasterController();

module.exports = stockInMaster;




// const { sql, poolPromise } = require("../db");
// const errorHandle = require("../services/errorHandler");
// const utility = require("../utility");

// class StockInMasterController {
//   async getData(req, res) {
//     try {
//       if (!req.query.hasOwnProperty("RestaurantId"))
//         throw "Please provide RestaurantId!";
//       const pool = await poolPromise;

//       const result = await pool.query(
//         `SELECT StockInMaster.StockId, StockInMaster.RestaurantId,  StockInMaster.FoodId,(select FoodName from FoodMaster where StockInMaster.FoodId=FoodId) as FoodName,
//         StockInMaster.FoodQuantityId,
//         Concat(FoodQuantityMaster.FoodQuantity,' ',(select ConfigurationMaster.ConfigName from ConfigurationMaster where ConfigurationMaster.ConfigId=FoodQuantityMaster.FoodQuantityTypeId)) AS FoodQuantityName,
//         ReceivedQty,IssuedQty,BalanceQty,  Rate, TotalAmt, StockInMaster.CreatedBy, 
//         StockInMaster.CreatedDate, StockInMaster.UpdatedBy, StockInMaster.UpdatedDate
//         FROM StockInMaster,FoodQuantityMaster 
//         WHERE FoodQuantityMaster.UniqueId=StockInMaster.FoodQuantityId
//         AND StockInMaster.RestaurantId=${req.query.RestaurantId}`
//       );
//       res.json({ status: true, data: result.recordset });
//     } catch (error) {
//       errorHandle.handleError(error, errorRes => {
//         res.send(errorRes);
//       });
//     }
//   }

//   async getQuantity(req, res) {
//     try {
//       if (!req.query.hasOwnProperty("SoftDrinkId"))
//         throw "Please provide SoftDrinkId!";
//       const pool = await poolPromise;

//       const result = await pool.query(
//         `select distinct StockInMaster.SoftDrinkQuantityId,ConfigurationMaster.ConfigName from StockInMaster 
//         inner join ConfigurationMaster on ConfigurationMaster.ConfigId=StockInMaster.SoftDrinkQuantityId
//         where SoftDrinkId=${req.query.SoftDrinkId}
//         group by SoftDrinkQuantityId,ConfigurationMaster.ConfigName`
//       );
//       res.json({status: true, data: result.recordset});
//     } catch (error) {
//       errorHandle.handleError(error, errorRes => {
//         res.send(errorRes);
//       });
//     }
//   }
//   async getActualRate(req, res) {
//     try {
//       if (
//         !(
//           req.query.RestaurantId &&
//           req.query.SoftDrinkId &&
//           req.query.SoftDrinkQuantityId
//         )
//       )
//         throw "Please fill all the details";
//       const pool = await poolPromise;
//       const result = await pool.query(
//         `SELECT * from StockInMaster WHERE RestaurantId=${req.query.RestaurantId} AND SoftDrinkId=${req.query.SoftDrinkId} AND SoftDrinkQuantityId=${req.query.SoftDrinkQuantityId} ORDER BY StockId DESC`
//       );
//       res.json({ status: true, data: result.recordset });
//     } catch (error) {
//       errorHandle.handleError(error, errorRes => {
//         res.send(errorRes);
//       });
//     }
//   }

//   async getStockInMasterDataByResId(req, res) {
//     try {
//       if (!req.query.RestaurantId) throw "Please give the Restaurant Id";
//       // console.log("hihi")
//       const pool = await poolPromise;
//       const result = await pool.query(
//         `SELECT StockInMaster.StockId, 
//                 StockInMaster.Date,
//                 StockInMaster.RestaurantId, 
//                 StockInMaster.FoodId,
//                 (select FoodName from FoodMaster where StockInMaster.FoodId=FoodId) as FoodName, 
//                 StockInMaster.FoodQuantityId,
//                 Concat(FoodQuantityMaster.FoodQuantity,' ',(select ConfigurationMaster.ConfigName from ConfigurationMaster where ConfigurationMaster.ConfigId=FoodQuantityMaster.FoodQuantityTypeId)) AS FoodQuantityName,
//                 ReceivedQty, 
//                 IssuedQty, 
//                 BalanceQty, 
//                 Rate, 
//                 TotalAmt, 
//                 StockInMaster.CreatedBy,
//                 StockInMaster.CreatedDate, 
//                 StockInMaster.UpdatedBy, 
//                 StockInMaster.UpdatedDate 
//         FROM StockInMaster,FoodQuantityMaster 
//         WHERE FoodQuantityMaster.UniqueId=StockInMaster.FoodQuantityId 
//          AND StockInMaster.RestaurantId= ${req.query.RestaurantId}`
//       );
//       res.json({ status: true, data: result.recordset });
//     } catch (error) {
//       errorHandle.handleError(error, errorRes => {
//         res.send(errorRes);
//       });
//     }
//   }

//   async addData(req, res) {
//     try {
//       if (
//         req.body.RestaurantId &&
//         req.body.FoodId &&
//         req.body.FoodQuantityId &&
//         req.body.ReceivedQty &&
//         req.body.Rate &&
//         req.body.TotalAmt &&
//         req.body.CreatedBy &&
//         req.body.Date
//       ) {
//         const pool = await poolPromise;
//           await pool
//             .request()
//             .input("RestaurantId", req.body.RestaurantId)
//             .input("FoodId", req.body.FoodId)
//             .input("FoodQuantityId", req.body.FoodQuantityId)
//             .input("ReceivedQty", req.body.ReceivedQty)
//             .input("IssuedQty", req.body.IssuedQty)
//             .input("BalanceQty", req.body.BalanceQty)
//             .input("Rate", req.body.Rate)
//             .input("TotalAmt", req.body.TotalAmt)
//             // .input("BalanceQtyMl", req.body.BalanceQtyMl)
//             .input("CreatedBy", req.body.CreatedBy)
//             .input("Date", req.body.Date)
//             .query(
//               `INSERT INTO StockInMaster (RestaurantId, FoodId, FoodQuantityId, ReceivedQty,IssuedQty,BalanceQty, Rate, TotalAmt, CreatedBy,Date) VALUES (@RestaurantId, @FoodId, @FoodQuantityId, @ReceivedQty,@IssuedQty,@BalanceQty, @Rate, @TotalAmt, @CreatedBy,@Date)`
//             );
//           res.json({ status: true, message: "StockIn added successfully." });
//       } else throw "Please fill all the details!";
//     } catch (error) {
//       errorHandle.handleError(error, errorRes => {
//         res.send(errorRes);
//       });
//     }
//   }

//   async updateData(req, res) {
//     try {
//       if (req.body.StockId && req.body.UpdatedBy) {
//         const pool = await poolPromise;
//         let objArr = utility.removeEmptyObjects(req.body);
//         let queryValue = null;
//         for (const [key, value] of Object.entries(objArr)) {
//           if (key != "StockId")
//             queryValue == null
//               ? (queryValue = `${key}=@${key}`)
//               : (queryValue += `,${key}=@${key}`);
//         }
//         await pool
//           .request()
//           .input("RestaurantId", req.body.RestaurantId)
//           .input("FoodQuantityId", req.body.FoodQuantityId)
//           .input("FoodId", req.body.FoodId)
//           .input("ReceivedQty", req.body.ReceivedQty)
//           .input("IssuedQty", req.body.IssuedQty)
//           .input("BalanceQty", req.body.BalanceQty)
//           .input("Rate", req.body.Rate)
//           .input("TotalAmt", req.body.TotalAmt)
//           .input("UpdatedBy", req.body.UpdatedBy)
//           .query(
//             `UPDATE StockInMaster SET ${queryValue} WHERE StockId = ${req.body.StockId}`
//           );
//         res.json({ status: true, message: "StockIn updated successfully." });
//       } else throw "Please fill all the details!";
//     } catch (error) {
//       errorHandle.handleError(error, errorRes => {
//         res.send(errorRes);
//       });
//     }
//   }

//   // async deleteData(req, res) {
//   //   try {
//   //     if (req.query.StockId && req.query.ActiveStatus) {
//   //       const pool = await poolPromise;
//   //       await pool
//   //         .request()
//   //         .input("StockId", req.query.StockId)
//   //         .input("ActiveStatus", req.query.ActiveStatus)
//   //         .query(
//   //           "UPDATE StockInMaster SET ActiveStatus = @ActiveStatus  WHERE StockId = @StockId"
//   //         );
//   //       res.json({ status: true, message: "Deleted successfully." });
//   //     } else throw "Please fill all the details!";
//   //   } catch (error) {
//   //     errorHandle.handleError(error, (errorRes) => {
//   //       res.send(errorRes);
//   //     });
//   //   }
//   // }
// }

// const stockInMaster = new StockInMasterController();

// module.exports = stockInMaster;
