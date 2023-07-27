const errorHandle = require("../services/errorHandler");
const commonMsgs = require("../CommonMsg.json");
const { poolPromise, sql } = require("../db");
const async = require("async");

class FoodQuantityMasterController {
  async getData(req, res) {
    try {
      if (!req.query.FoodId) res.json(commonMsgs.NullMsg);
      else {
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .input("FoodId", req.query.FoodId)
                        .execute("getFoodQuantityData")
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
  //     if (!req.query.FoodId) res.json(commonMsgs.NullMsg);
  //     else {
  //       const pool = await poolPromise;
  //       let result = await pool.query(
  //         `select * from FoodQuantityMaster where FoodId= ${req.query.FoodId} AND ActiveStatus='A'`
  //       );
  //       res.json({ status: true, data: result.recordset });
  //     }
  //   } catch (error) {
  //     errorHandle.handleError(error, errorRes => {
  //       res.send(errorRes);
  //     });
  //   }
  // }

  async getAvailableStock(req, res) {
    try {
      if (!req.query.RestaurantId) res.json(commonMsgs.NullMsg);
      else {
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .input("RestaurantId", req.query.RestaurantId)
                        .execute("getAvailableStock")
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

  // async getAvailableStock(req,res){
  //   try {
  //     if (!req.query.RestaurantId) res.json(commonMsgs.NullMsg);
  //     else {
  //       const pool = await poolPromise;
  //       let result = await pool.query(
  //         `SELECT DISTINCT fcm.CategoryTypeId,(SELECT ConfigName FROM ConfigurationMaster WHERE ConfigId=fcm.CategoryTypeId) AS CategoryTypeName
  //         FROM FoodQuantityMaster AS fqm
  //         INNER JOIN FoodCategoryMaster AS fcm
  //         ON fcm.FoodCategoryId=fqm.FoodCategoryId
  //         WHERE fqm.StockAvailable='Y' AND fqm.ActiveStatus='A' AND fqm.RestaurantId=${req.query.RestaurantId}`
  //       );
  //       res.json({ status: true, data: result.recordset });
  //     }
  //   } catch (error) {
  //     errorHandle.handleError(error, errorRes => {
  //       res.send(errorRes);
  //     });
  //   }
  // }

  async getQuantityDataByFoodId(req, res) {
    try {
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .input("FoodId", req.query.FoodId)
                        .execute("getQuantityDataByFoodId")
        if (result.recordset[0].mainData!=null){
          res.json({status: true, data:JSON.parse(result.recordset[0].mainData)})

        }
        else{
          res.json({status: true, data:"No data Found!"})
        }
     
    } 
    catch (error) {
      errorHandle.handleError(error, errorRes => {
        res.send(errorRes);
      });
    }
  }
  async getAllQuantityDataByFoodId(req, res) {
    try {
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .input("FoodId", req.query.FoodId)
                        .execute("getAllQuantityDataByFoodId")
        if (result.recordset[0].mainData!=null){
          res.json({status: true, data:JSON.parse(result.recordset[0].mainData)})

        }
        else{
          res.json({status: true, data:"No data Found!"})
        }
     
    } 
    catch (error) {
      errorHandle.handleError(error, errorRes => {
        res.send(errorRes);
      });
    }
  }


  // async getQuantityDataByFoodId(req, res) {
  //   try {
  //     if (!req.query.FoodId)
  //       res.json(commonMsgs.NullMsg);
  //     const pool = await poolPromise;
  //     const result = await pool
  //       .request()
  //       // .input("RestaurantId", req.query.RestaurantId)
  //       .input("FoodId", req.query.FoodId)
  //       .query(
  //         `SELECT FoodMaster.RestaurantId, 
  //           FoodMaster.FoodCategoryId, 
  //           FoodCategoryMaster.FoodCategoryName, 
  //           FoodMaster.FoodId, 
  //           FoodMaster.FoodName, 
  //           FoodMaster.FoodTimingId, 
  //           ConfigurationMaster.ConfigId AS FoodQuantityId, 
  //           ConfigurationMaster.ConfigName AS FoodQuantityName, 
  //           FoodMaster.Description,
  //           FoodQuantityMaster.UniqueId, 
  //           FoodQuantityMaster.Tariff, 
  //           FoodQuantityMaster.StockAvailable, 
  //           FoodQuantityMaster.FoodQuantity,
  //           FoodQuantityMaster.ActiveStatus AS FoodQuantityActiveStatus,
  //           FoodQuantityMaster.FoodQuantityTypeId,
  //           (SELECT TOP 1 ConfigName FROM ConfigurationMaster WHERE ConfigId=FoodQuantityMaster.FoodQuantityTypeId) AS FoodQuantityTypeName,
  //           FoodMaster.ImageLink, 
  //           FoodMaster.ActiveStatus, 
  //           FoodMaster.CreatedBy, 
  //           FoodMaster.CreatedDate, 
  //           FoodMaster.UpdatedBy, 
  //           FoodMaster.UpdatedDate 
  //           FROM FoodMaster,FoodQuantityMaster,FoodCategoryMaster,ConfigurationMaster 
  //           WHERE FoodMaster.FoodCategoryId = FoodCategoryMaster.FoodCategoryId 
  //           AND FoodMaster.FoodId=FoodQuantityMaster.FoodId 
  //           AND FoodQuantityMaster.FoodQuantityId = ConfigurationMaster.ConfigId
            
  //           AND FoodMaster.FoodId=${req.query.FoodId}`
  //       );
  //     let response = await pool.query(
  //       `SELECT FoodMaster.RestaurantId, 
  //               FoodMaster.FoodCategoryId, 
  //               FoodCategoryMaster.FoodCategoryName, 
  //               FoodMaster.FoodId, 
  //               FoodMaster.FoodName, 
  //               FoodMaster.FoodTimingId, 
  //               FoodMaster.Description,
  //               FoodQuantityMaster.UniqueId AS UniqueId,  
  //               FoodQuantityMaster.Tariff, 
  //               FoodQuantityMaster.StockAvailable, 
  //               FoodQuantityMaster.FoodQuantity,
  //               FoodQuantityMaster.FoodQuantityTypeId,
  //               Concat(FoodQuantityMaster.FoodQuantity,' ',(select ConfigurationMaster.ConfigName from ConfigurationMaster where ConfigurationMaster.ConfigId=FoodQuantityMaster.FoodQuantityTypeId)) AS FoodQuantityName,
  //               FoodQuantityMaster.ActiveStatus AS FoodQuantityActiveStatus,
  //               (SELECT TOP 1 ConfigName FROM ConfigurationMaster WHERE ConfigId=FoodQuantityMaster.FoodQuantityTypeId) AS FoodQuantityTypeName,
  //               FoodMaster.ImageLink, 
  //               FoodMaster.ActiveStatus, 
  //               FoodMaster.CreatedBy, 
  //               FoodMaster.CreatedDate, 
  //               FoodMaster.UpdatedBy, 
  //               FoodMaster.UpdatedDate 
  //               FROM FoodMaster,FoodQuantityMaster,FoodCategoryMaster 
  //               WHERE FoodMaster.FoodCategoryId = FoodCategoryMaster.FoodCategoryId 
  //               AND FoodMaster.FoodId=${req.query.FoodId}
  //               AND FoodMaster.FoodId=FoodQuantityMaster.FoodId 
  //               AND FoodQuantityMaster.FoodQuantityId IS NULL
  //               `
  //     );

  //     let timingResult = await pool
  //       .request()
  //       .input("RestaurantId", req.query.RestaurantId)
  //       .query(
  //         `SELECT FoodTimingId FROM FoodTimingMaster WHERE '${req.query.time}' BETWEEN substring(convert(char(8),StartTime,114), 1, 5) AND substring(convert(char(8),EndTime,114), 1, 5)`
  //       );

  //     var finalData = [...result.recordset, ...response.recordset];
  //     if (finalData.length > 0) {
  //       let data = [],
  //         asyncArr = [];
  //       const pool = await poolPromise;
  //       finalData.map((value, index) => {
  //         asyncArr.push(next => {
  //           pool
  //             .request()
  //             .input("Date", req.query.Date)
  //             .query(
  //               `select TaxId, ServiceName, TaxDescription, TaxPercentage, RefNumber FROM TaxMaster WHERE ActiveStatus = 'A' AND ServiceName = 'Restaurant'`,
  //               (error, TaxResult) => {
  //                 if (error) next(null, null);
  //                 data.push({ ...value, TaxResult: TaxResult.recordset });
  //                 next(null, null);
  //               }
  //             );
  //         });
  //       });
  //       async.parallel(asyncArr, (err, result) => {
  //         if (err) {
  //           errorHandle.handleError(err, errorRes => {
  //             res.send(errorRes);
  //           });
  //         } else {
  //           let finalResult = matchFoodTimingId(data, timingResult.recordset);
  //           res.json({ status: true, data: finalResult });
  //         }
  //       });
  //     } else {
  //       res.json({ status: true, message: "No data Found!" });
  //     }
  //   } catch (error) {
  //     errorHandle.handleError(error, errorRes => {
  //       res.send(errorRes);
  //     });
  //   }
  // }

  async getAllData(req, res) {
    try {
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .execute("getAllFoodQuantityData")
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
  //       `select FoodQuantityMaster.FoodId, FoodMaster.FoodName, FoodQuantityMaster.FoodQuantityId, ConfigurationMaster.ConfigName As FoodQuantityName, FoodQuantityMaster.ActiveStatus, FoodQuantityMaster.Tariff,FoodQuantityMaster.CreatedBy, FoodQuantityMaster.CreatedDate, FoodQuantityMaster.UpdatedBy, FoodQuantityMaster.UpdatedDate,
  //       FoodQuantityMaster.StockAvailable, 
  //                 FoodQuantityMaster.FoodQuantity,
  //                 FoodQuantityMaster.FoodQuantityTypeId,
  //                 (SELECT TOP 1 ConfigName FROM ConfigurationMaster WHERE ConfigId=FoodQuantityMaster.FoodQuantityTypeId) AS FoodQuantityTypeName 
  //       From FoodQuantityMaster, ConfigurationMaster, FoodMaster WHERE FoodQuantityMaster.FoodQuantityId = ConfigurationMaster.ConfigId AND FoodQuantityMaster.FoodId = FoodMaster.FoodId`
  //     );
  //     let response = await pool.query(
  //       `select FoodQuantityMaster.FoodId, FoodMaster.FoodName, FoodQuantityMaster.FoodQuantityId,  FoodQuantityMaster.ActiveStatus, FoodQuantityMaster.Tariff,FoodQuantityMaster.CreatedBy, FoodQuantityMaster.CreatedDate, FoodQuantityMaster.UpdatedBy, FoodQuantityMaster.UpdatedDate ,
  //       FoodQuantityMaster.StockAvailable, 
  //                 FoodQuantityMaster.FoodQuantity,
  //                 FoodQuantityMaster.FoodQuantityTypeId,
  //                 (SELECT TOP 1 ConfigName FROM ConfigurationMaster WHERE ConfigId=FoodQuantityMaster.FoodQuantityTypeId) AS FoodQuantityTypeName
  //       From FoodQuantityMaster, FoodMaster WHERE FoodQuantityMaster.FoodId = FoodMaster.FoodId AND FoodQuantityMaster.FoodQuantityId IS NULL`
  //     );
  //     res.json({
  //       status: true,
  //       data: [...result.recordset, ...response.recordset]
  //     });
  //   } catch (error) {
  //     errorHandle.handleError(error, errorRes => {
  //       res.send(errorRes);
  //     });
  //   }
  // }

  async getFoodQuantityDataByResId(req, res) {
    try {
      if (!req.query.RestaurantId) res.json(commonMsgs.NullMsg);
      else {
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .input("RestaurantId", req.query.RestaurantId)
                        .input("ActiveStatus", req.query.ActiveStatus)
                        .execute("getFoodQuantityDataByResId")
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

  // async getFoodQuantityDataByResId(req, res) {
  //   try {
  //     if (!req.query.RestaurantId) return res.json(commonMsgs.NullMsg);
  //     else {
  //       const pool = await poolPromise;
  //       let result = await pool.query(
  //         `SELECT FoodQuantityMaster.UniqueId,
  //                 FoodQuantityMaster.FoodCategoryId, 
  //                 FoodCategoryMaster.FoodCategoryName, 
  //                 FoodQuantityMaster.FoodId, 
  //                 FoodMaster.FoodName, 
  //                 FoodQuantityMaster.FoodQuantityId, 
  //                 Concat(FoodQuantityMaster.FoodQuantity,' ',(select ConfigurationMaster.ConfigName from ConfigurationMaster where ConfigurationMaster.ConfigId=FoodQuantityMaster.FoodQuantityTypeId)) AS FoodQuantityName, 
  //                 FoodQuantityMaster.StockAvailable, 
  //                 FoodQuantityMaster.FoodQuantity,
  //                 FoodQuantityMaster.FoodQuantityTypeId,
  //                 (SELECT TOP 1 ConfigName FROM ConfigurationMaster WHERE ConfigId=FoodQuantityMaster.FoodQuantityTypeId) AS FoodQuantityTypeName,
  //                 FoodQuantityMaster.ActiveStatus, 
  //                 FoodQuantityMaster.Tariff,
  //                 FoodQuantityMaster.CreatedBy, 
  //                 FoodQuantityMaster.CreatedDate, 
  //                 FoodQuantityMaster.UpdatedBy, 
  //                 FoodQuantityMaster.UpdatedDate 
  //                 FROM  FoodCategoryMaster,FoodQuantityMaster, ConfigurationMaster, FoodMaster 
  //                 WHERE FoodQuantityMaster.FoodQuantityId = ConfigurationMaster.ConfigId 
  //                 AND FoodQuantityMaster.FoodId = FoodMaster.FoodId 
  //                 AND FoodQuantityMaster.RestaurantId = ${req.query.RestaurantId} 
  //                 AND FoodMaster.RestaurantId = ${req.query.RestaurantId} 
  //                 AND FoodCategoryMaster.FoodCategoryId = FoodQuantityMaster.FoodCategoryId`
  //       );
  //       let response = await pool.query(
  //         `SELECT FoodQuantityMaster.UniqueId,
  //                 FoodCategoryMaster.FoodCategoryId,
  //                 FoodCategoryMaster.FoodCategoryName, 
  //                 FoodQuantityMaster.FoodId, 
  //                 FoodMaster.FoodName, 
  //                 FoodQuantityMaster.FoodQuantityId, 
  //                 FoodQuantityMaster.StockAvailable, 
  //                 FoodQuantityMaster.FoodQuantity,
  //                 FoodQuantityMaster.FoodQuantityTypeId,
  //                 Concat(FoodQuantityMaster.FoodQuantity,' ',(select ConfigurationMaster.ConfigName from ConfigurationMaster where ConfigurationMaster.ConfigId=FoodQuantityMaster.FoodQuantityTypeId)) AS FoodQuantityName,
  //                 (SELECT TOP 1 ConfigName FROM ConfigurationMaster WHERE ConfigId=FoodQuantityMaster.FoodQuantityTypeId) AS FoodQuantityTypeName,
  //                 FoodQuantityMaster.ActiveStatus, 
  //                 FoodQuantityMaster.Tariff,
  //                 FoodQuantityMaster.CreatedBy, 
  //                 FoodQuantityMaster.CreatedDate, 
  //                 FoodQuantityMaster.UpdatedBy, 
  //                 FoodQuantityMaster.UpdatedDate 
  //                 FROM FoodCategoryMaster, FoodQuantityMaster, FoodMaster 
  //                 WHERE FoodQuantityMaster.FoodId = FoodMaster.FoodId 
                  
  //                 AND FoodQuantityMaster.FoodQuantityId IS NULL 
  //                 AND FoodQuantityMaster.RestaurantId = ${req.query.RestaurantId} 
  //                 AND FoodMaster.RestaurantId = ${req.query.RestaurantId} 
  //                 AND FoodCategoryMaster.FoodCategoryId = FoodQuantityMaster.FoodCategoryId`
  //       );
  //       res.json({
  //         status: true,
  //         data: [...result.recordset, ...response.recordset]
  //       });
  //     }
  //   } catch (error) {
  //     errorHandle.handleError(error, errorRes => {
  //       res.send(errorRes);
  //     });
  //   }
  // }

  async getFoodQuantityDataBySingleResId(req, res) {
    try {
      if (!req.query.RestaurantId) res.json(commonMsgs.NullMsg);
      else {
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .input("RestaurantId", req.query.RestaurantId)
                        .execute("getFoodQuantityDataBySingleResId")
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

  // async getFoodQuantityDataBySingleResId(req, res) {
  //   try {
  //     if (!req.query.RestaurantId) return res.json(commonMsgs.NullMsg);
  //     else {
  //       const pool = await poolPromise;
        
  //       let response = await pool.query(
  //         `SELECT  
  //         FoodMaster.FoodId, 
  //         FoodMaster.FoodName
  //         FROM FoodQuantityMaster, FoodMaster 
  //         WHERE FoodQuantityMaster.FoodId = FoodMaster.FoodId 
  //         AND FoodQuantityMaster.FoodQuantityId IS NULL 
  //         AND FoodQuantityMaster.RestaurantId = ${req.query.RestaurantId} 
  //         AND FoodMaster.RestaurantId = ${req.query.RestaurantId}
  //         AND FoodMaster.ActiveStatus='A'
  //         GROUP BY FoodMaster.FoodId, 
  //         FoodMaster.FoodName`
  //       );
  //       res.json({
  //         status: true,
  //         data: [...response.recordset]
  //       });
  //     }
  //   } catch (error) {
  //     errorHandle.handleError(error, errorRes => {
  //       res.send(errorRes);
  //     });
  //   }
  // }

  async getTariffByFoodId(req, res) {
    try {
      if (!req.query.hasOwnProperty("FoodId")) throw "Please provide all the details!.";
      else {
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .input("FoodId", req.query.FoodId)
                        .execute("getTariffByFoodId")
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

  // async getTariffByFoodId(req, res) {
  //   try {
  //     if (!req.query.hasOwnProperty("FoodId"))
  //       throw "Please provide all the details!.";
  //     const pool = await poolPromise;
  //     const result = await pool
  //       .request()
  //       .input("FoodId", req.query.FoodId)
  //       .query(
  //         `SELECT FoodQuantityMaster.FoodId, FoodQuantityMaster.Tariff, ConfigurationMaster.ConfigId AS FoodQuantityId, ConfigurationMaster.ConfigName AS FoodQuantityName, FoodQuantityMaster.ActiveStatus, FoodQuantityMaster.CreatedBy, FoodQuantityMaster.CreatedDate, FoodQuantityMaster.UpdatedBy, FoodQuantityMaster.UpdatedDate ,
  //         FoodQuantityMaster.StockAvailable, 
  //                 FoodQuantityMaster.FoodQuantity,
  //                 FoodQuantityMaster.FoodQuantityTypeId,
  //                 (SELECT TOP 1 ConfigName FROM ConfigurationMaster WHERE ConfigId=FoodQuantityMaster.FoodQuantityTypeId) AS FoodQuantityTypeName
  //         FROM FoodQuantityMaster INNER JOIN FoodMaster ON FoodQuantityMaster.FoodId = FoodMaster.FoodId INNER JOIN ConfigurationMaster ON FoodQuantityMaster.FoodQuantityId = ConfigurationMaster.ConfigId where FoodQuantityMaster.FoodId = @FoodId AND FoodQuantityMaster.ActiveStatus = 'A'`
  //       );
  //     res.json({ status: true, data: result.recordset });
  //   } catch (error) {
  //     errorHandle.handleError(error, errorRes => {
  //       res.send(errorRes);
  //     });
  //   }
  // }

  async addSingleData(req, res) {
    try {
      if (
        !(
          req.body.RestaurantId &&
          req.body.FoodId &&
          req.body.StockAvailable &&
          req.body.CreatedBy &&
          req.body.FoodQuantity &&
          req.body.FoodQuantityTypeId &&
          req.body.Tariff
        )
      )
        res.json(commonMsgs.NullMsg);
      else {
          const pool = await poolPromise;
          let result = await pool
                          .request()
                          .input("FoodId", req.body.FoodId)
                          .input("FoodQuantityId", req.body.FoodQuantityId)
                          .input("CreatedBy",req.body.CreatedBy)
                          .input("Tariff",req.body.Tariff)
                          .input("RestaurantId",req.body.RestaurantId)
                          .input("FoodCategoryId",req.body.FoodCategoryId)
                          .input("StockAvailable",req.body.StockAvailable)
                          .input("FoodQuantity",req.body.FoodQuantity)
                          .input("FoodQuantityTypeId",req.body.FoodQuantityTypeId)
                          .execute("addFoodQuantityData")
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
  // async addSingleData(req,res){
  //   try {
  //     if (
  //       !(
  //         req.body.RestaurantId &&
  //         req.body.FoodId &&
  //         req.body.StockAvailable &&
  //         req.body.CreatedBy &&
  //         req.body.FoodQuantity &&
  //         req.body.FoodQuantityTypeId &&
  //         req.body.Tariff
  //       )
  //     )
  //       res.json(commonMsgs.NullMsg);
  //     else {
  //       const pool = await poolPromise;
  //       let result = await pool.query(
  //         `BEGIN TRAN
  //           IF NOT EXISTS(SELECT * FROM FoodQuantityMaster WHERE FoodId = ${req.body.FoodId} AND RestaurantId = ${req.body.RestaurantId} AND FoodQuantity=${req.body.FoodQuantity} AND FoodQuantityTypeId =${req.body.FoodQuantityTypeId} AND Tariff='${req.body.Tariff}')
  //             BEGIN
  //               INSERT INTO FoodQuantityMaster(FoodId,ActiveStatus,CreatedBy,CreatedDate,Tariff,RestaurantId,FoodCategoryId,StockAvailable,FoodQuantity,FoodQuantityTypeId) 
  //                       VALUES(${req.body.FoodId},'A',${req.body.CreatedBy},GETDATE(),'${req.body.Tariff}',${req.body.RestaurantId},${req.body.FoodCategoryId},'${req.body.StockAvailable}',${req.body.FoodQuantity},${req.body.FoodQuantityTypeId})
  //               IF @@ROWCOUNT > 0
  //                 BEGIN
  //                   COMMIT
  //                 END
  //             END
  //           ELSE
  //             BEGIN
  //               COMMIT
  //             END` 
  //       );
  //       if(result.rowsAffected.length!=0){
  //         res.json(commonMsgs.AddMsg);
  //       }
  //       else{
  //         res.json({ status: false, message: "Data Not Added" });
  //       }
        
        
  //     }
  //   } catch (error) {
  //     errorHandle.handleError(error, errorRes => {
  //       res.send(errorRes);
  //     });
  //   }
  // }

  async updateSingleData(req, res) {
    try {
      const { FoodId, UpdatedBy, RestaurantId, FoodQuantityId,UniqueId } = req.body;
      if (!FoodId || !RestaurantId || !UpdatedBy)
        return res.json(commonMsgs.NullMsg);
        else {
          const pool = await poolPromise;
          let result = await pool
                          .request()
                          .input("UniqueId", req.body.UniqueId)
                          .input("FoodId",req.body.FoodId)
                          .input("FoodQuantityId",req.body.FoodQuantityId)
                          .input("UpdatedBy",req.body.UpdatedBy)
                          .input("Tariff",req.body.Tariff)
                          .input("RestaurantId",req.body.RestaurantId)
                          .input("FoodCategoryId",req.body.FoodCategoryId)
                          .input("StockAvailable",req.body.StockAvailable)
                          .input("FoodQuantity",req.body.FoodQuantity)
                          .input("FoodQuantityTypeId",req.body.FoodQuantityTypeId)
                          .execute("updateFoodQuantityData")
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

  // async updateSingleData(req,res){
  //   try {
  //     if (
  //       !(
  //         req.body.RestaurantId &&
  //         req.body.FoodId &&
  //         req.body.StockAvailable &&
  //         req.body.UpdatedBy &&
  //         req.body.FoodQuantity &&
  //         req.body.FoodQuantityTypeId &&
  //         req.body.Tariff && 
  //         req.body.UniqueId
  //       )
  //     )
  //       res.json(commonMsgs.NullMsg);
  //     else {
  //       const pool = await poolPromise;
  //       let result = await pool.query(
  //         `BEGIN TRAN
  //           IF NOT EXISTS(SELECT * FROM FoodQuantityMaster WHERE FoodId = ${req.body.FoodId} AND RestaurantId = ${req.body.RestaurantId} AND FoodQuantity=${req.body.FoodQuantity} AND FoodQuantityTypeId =${req.body.FoodQuantityTypeId} AND Tariff='${req.body.Tariff}' AND UniqueId!=${req.body.UniqueId})
  //             BEGIN
  //               UPDATE FoodQuantityMaster SET FoodId=${req.body.FoodId},UpdatedBy=${req.body.UpdatedBy},UpdatedDate=GETDATE(),Tariff='${req.body.Tariff}',RestaurantId=${req.body.RestaurantId},StockAvailable='${req.body.StockAvailable}',FoodQuantity=${req.body.FoodQuantity},FoodQuantityTypeId=${req.body.FoodQuantityTypeId} WHERE UniqueId=${req.body.UniqueId}
  //               IF @@ROWCOUNT > 0
  //                 BEGIN
  //                   COMMIT
  //                 END
  //             END
  //           ELSE
  //             BEGIN
  //               COMMIT
  //             END` 
  //       );
  //       if(result.rowsAffected.length!=0){
  //         res.json(commonMsgs.updateMsg);
  //       }
  //       else{
  //         res.json({ status: false, message: "Data Not Updated" });
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
          req.body.FoodId &&
          req.body.StockAvailable &&
          req.body.CreatedBy &&
          req.body.QuantityDetails
        )
      )
        res.json(commonMsgs.NullMsg);
      else {
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .input("RestaurantId", req.body.RestaurantId)
                        .input("FoodId", req.body.FoodId)
                        .input("FoodQuantityId",req.body.FoodQuantityId)
                        .input("FoodCategoryId", req.body.FoodCategoryId)
                        .input("StockAvailable", req.body.StockAvailable)
                        .input("CreatedBy", req.body.CreatedBy)
                        .input("QuantityDetails",JSON.stringify(req.body.QuantityDetails))
                        .execute("addFoodQuantity")
        if (result.recordset[0][""][1] == 1) {
          res.json(commonMsgs.AddMsg);
        }
        else {
          res.status({status: false, message:result.recordset[0][""][0]})
        }             
        
      }
    } catch (error) {
      errorHandle.handleError(error, errorRes => {
        res.send(errorRes);
      });
    }
  }

  async updateData(req, res) {
    try {
      const { FoodId, UpdatedBy, RestaurantId, QuantityDetails,UniqueId } = req.body;
      if (!FoodId || !RestaurantId || !UpdatedBy || !QuantityDetails || !UniqueId)
        return res.json(commonMsgs.NullMsg);
      else {
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .input("RestaurantId", req.body.RestaurantId)
                        .input("FoodId", req.body.FoodId)
                        .input("StockAvailable", req.body.StockAvailable)
                        .input("UpdatedBy", req.body.UpdatedBy)
                        .input("QuantityDetails",JSON.stringify(req.body.QuantityDetails))
                        .execute("updateFoodQuantity")
        if (result.recordset[0][""][1] == 1) {
          res.json(commonMsgs.AddMsg);
        }
        else {
          res.status({status: false, message:result.recordset[0][""][0]})
        }             
        
      }

      
    } catch (error) {
      errorHandle.handleError(error, errorRes => {
        res.send(errorRes);
      });
    }
  }

  async deleteData(req, res) {
    try {
      if (
        !req.query.hasOwnProperty("UniqueId") ||
        !req.query.hasOwnProperty("ActiveStatus")
      )
        return res.json(commonMsgs.NullMsg);
      else {
          const pool = await poolPromise;
          let result = await pool
                          .request()
                          .input("ActiveStatus", req.query.ActiveStatus)
                          .input("UniqueId",req.query.UniqueId)
                          .execute("deleteFoodQuantityData")
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
  //   try {
  //     if (
  //       !req.query.hasOwnProperty("UniqueId") ||
  //       !req.query.hasOwnProperty("ActiveStatus")
  //     )
  //       return res.json(commonMsgs.NullMsg);
  //     else{
  //         const pool = await poolPromise;
  //           await pool.query(
  //             `UPDATE FoodQuantityMaster SET ActiveStatus = '${req.query.ActiveStatus}' WHERE UniqueId = ${req.query.UniqueId}`
  //           );
            
  //           return res.json(commonMsgs.deleteMsg);
  //       }
     
  //   } catch (error) {
  //     errorHandle.handleError(error, errorRes => {
  //       res.send(errorRes);
  //     });
  //   }
  // }
}



function matchFoodTimingId(finalresultData, timingData) {
  return finalresultData;
}

async function checkFoodQuantity(FoodId, callback) {
  const pool = await poolPromise;
  let result = await pool
    .request()
    .query(
      `SELECT FoodQuantityMaster.FoodId, FoodQuantityMaster.FoodQuantityId, FoodQuantityMaster.ActiveStatus FROM FoodQuantityMaster WHERE FoodId = ${FoodId} AND ActiveStatus='A'`
    );
  if (result.recordset.length === 0) {
    let result = await pool
      .request()
      .query(
        `UPDATE FoodMaster SET ActiveStatus = 'D' WHERE FoodId = '${FoodId}'`
      );
  }
  callback(null);
}

const FoodQuantityMaster = new FoodQuantityMasterController();

module.exports = FoodQuantityMaster;















// const errorHandle = require("../services/errorHandler");
// const commonMsgs = require("../CommonMsg.json");
// const { poolPromise, sql } = require("../db");

// class FoodQuantityMasterController {
//   async getData(req, res) {
//     try {
//       if (!req.query.FoodId) res.json(commonMsgs.NullMsg);
//       else {
//         const pool = await poolPromise;
//         let result = await pool.query(
//           `select * from FoodQuantityMaster where FoodId= ${req.query.FoodId} AND ActiveStatus='A'`
//         );
//         res.json({ status: true, data: result.recordset });
//       }
//     } catch (error) {
//       errorHandle.handleError(error, errorRes => {
//         res.send(errorRes);
//       });
//     }
//   }

//   async getAllData(req, res) {
//     try {
//       const pool = await poolPromise;
//       let result = await pool.query(
//         `select FoodQuantityMaster.FoodId, FoodMaster.FoodName, FoodQuantityMaster.FoodQuantityId, ConfigurationMaster.ConfigName As FoodQuantityName, FoodQuantityMaster.ActiveStatus, FoodQuantityMaster.Tariff,FoodQuantityMaster.CreatedBy, FoodQuantityMaster.CreatedDate, FoodQuantityMaster.UpdatedBy, FoodQuantityMaster.UpdatedDate From FoodQuantityMaster, ConfigurationMaster, FoodMaster WHERE FoodQuantityMaster.FoodQuantityId = ConfigurationMaster.ConfigId AND FoodQuantityMaster.FoodId = FoodMaster.FoodId`
//       );
//       let response = await pool.query(
//         `select FoodQuantityMaster.FoodId, FoodMaster.FoodName, FoodQuantityMaster.FoodQuantityId,  FoodQuantityMaster.ActiveStatus, FoodQuantityMaster.Tariff,FoodQuantityMaster.CreatedBy, FoodQuantityMaster.CreatedDate, FoodQuantityMaster.UpdatedBy, FoodQuantityMaster.UpdatedDate From FoodQuantityMaster, FoodMaster WHERE FoodQuantityMaster.FoodId = FoodMaster.FoodId AND FoodQuantityMaster.FoodQuantityId IS NULL`
//       );
//       res.json({
//         status: true,
//         data: [...result.recordset, ...response.recordset]
//       });
//     } catch (error) {
//       errorHandle.handleError(error, errorRes => {
//         res.send(errorRes);
//       });
//     }
//   }

//   async getFoodQuantityDataByResId(req, res) {
//     try {
//       if (!req.query.RestaurantId) return res.json(commonMsgs.NullMsg);
//       else {
//         const pool = await poolPromise;
//         let result = await pool.query(
//           `select FoodQuantityMaster.FoodCategoryId, FoodCategoryMaster.FoodCategoryName, FoodQuantityMaster.FoodId, FoodMaster.FoodName, FoodQuantityMaster.FoodQuantityId, ConfigurationMaster.ConfigName As FoodQuantityName, FoodQuantityMaster.ActiveStatus, FoodQuantityMaster.Tariff,FoodQuantityMaster.CreatedBy, FoodQuantityMaster.CreatedDate, FoodQuantityMaster.UpdatedBy, FoodQuantityMaster.UpdatedDate FROM  FoodCategoryMaster,FoodQuantityMaster, ConfigurationMaster, FoodMaster WHERE FoodQuantityMaster.FoodQuantityId = ConfigurationMaster.ConfigId AND FoodQuantityMaster.FoodId = FoodMaster.FoodId AND FoodQuantityMaster.RestaurantId = ${req.query.RestaurantId} AND FoodMaster.RestaurantId = ${req.query.RestaurantId} AND FoodCategoryMaster.FoodCategoryId = FoodQuantityMaster.FoodCategoryId`
//         );
//         let response = await pool.query(
//           `select FoodCategoryMaster.FoodCategoryId, FoodCategoryMaster.FoodCategoryName, FoodQuantityMaster.FoodId, FoodMaster.FoodName, FoodQuantityMaster.FoodQuantityId,  FoodQuantityMaster.ActiveStatus, FoodQuantityMaster.Tariff,FoodQuantityMaster.CreatedBy, FoodQuantityMaster.CreatedDate, FoodQuantityMaster.UpdatedBy, FoodQuantityMaster.UpdatedDate FROM FoodCategoryMaster, FoodQuantityMaster, FoodMaster WHERE FoodQuantityMaster.FoodId = FoodMaster.FoodId AND FoodQuantityMaster.FoodQuantityId IS NULL AND FoodQuantityMaster.RestaurantId = ${req.query.RestaurantId} AND FoodMaster.RestaurantId = ${req.query.RestaurantId} AND FoodCategoryMaster.FoodCategoryId = FoodQuantityMaster.FoodCategoryId`
//         );
//         res.json({
//           status: true,
//           data: [...result.recordset, ...response.recordset]
//         });
//       }
//     } catch (error) {
//       errorHandle.handleError(error, errorRes => {
//         res.send(errorRes);
//       });
//     }
//   }

//   async getTariffByFoodId(req, res) {
//     try {
//       if (!req.query.hasOwnProperty("FoodId"))
//         throw "Please provide all the details!.";
//       const pool = await poolPromise;
//       const result = await pool
//         .request()
//         .input("FoodId", req.query.FoodId)
//         .query(
//           `SELECT FoodQuantityMaster.FoodId, FoodQuantityMaster.Tariff, ConfigurationMaster.ConfigId AS FoodQuantityId, ConfigurationMaster.ConfigName AS FoodQuantityName, FoodQuantityMaster.ActiveStatus, FoodQuantityMaster.CreatedBy, FoodQuantityMaster.CreatedDate, FoodQuantityMaster.UpdatedBy, FoodQuantityMaster.UpdatedDate FROM FoodQuantityMaster INNER JOIN FoodMaster ON FoodQuantityMaster.FoodId = FoodMaster.FoodId INNER JOIN ConfigurationMaster ON FoodQuantityMaster.FoodQuantityId = ConfigurationMaster.ConfigId where FoodQuantityMaster.FoodId = @FoodId AND FoodQuantityMaster.ActiveStatus = 'A'`
//         );
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
//         !(
//           req.body.RestaurantId &&
//           req.body.FoodId &&
//           req.body.Tariff &&
//           req.body.CreatedBy
//         )
//       )
//         res.json(commonMsgs.NullMsg);
//       else {
//         checkDataExist(req.body, async response => {
//           if (response.length > 0) {
//             res.json(commonMsgs.DuplicateRecordMsg);
//           } else {
//             var queryStr = "ActiveStatus",
//               queryValues = "'A'";
//             for (var key in req.body) {
//               if (queryStr != "") {
//                 queryStr += ", ";
//                 queryValues += ", ";
//               }
//               queryStr += key;
//               queryValues += req.body[key];
//             }
//             const pool = await poolPromise;
//             if (!req.body.hasOwnProperty("FoodQuantityId")) {
//               queryStr += ", FoodQuantityId";
//               queryValues += ", " + `NULL`;
//             }
//             let result = await pool.query(
//               `INSERT INTO FoodQuantityMaster(${queryStr}) VALUES(${queryValues})`
//             );
//             res.json(commonMsgs.AddMsg);
//           }
//         });
//       }
//     } catch (error) {
//       errorHandle.handleError(error, errorRes => {
//         res.send(errorRes);
//       });
//     }
//   }

//   async updateData(req, res) {
//     try {
//       const { FoodId, UpdatedBy, RestaurantId, FoodQuantityId } = req.body;
//       const pool = await poolPromise;
//       if (!FoodId || !RestaurantId || !UpdatedBy)
//         return res.json(commonMsgs.NullMsg);
//       let queryValue = null;
//       for (const [key, value] of Object.entries(req.body)) {
//         // if (key != "FoodQuantityId" || key != "FoodId")
//         if ( key != "FoodId")

//           queryValue == null
//             ? (queryValue = `${key}='${value}'`)
//             : (queryValue += `,${key}='${value}'`);
//       }
      
//   //     `BEGIN
//   //     IF NOT EXISTS (select * from FoodQuantityMaster where FoodId = ${FoodId} AND RestaurantId = ${RestaurantId} and FoodQuantityId =${FoodQuantityId})
//   //       BEGIN
//   //         UPDATE FoodQuantityMaster SET ${queryValue}, UpdatedDate = GETDATE()  WHERE FoodId = ${FoodId} AND RestaurantId = ${RestaurantId}
//   //       END
//   // END`
//       await pool.query(
//         `
//             UPDATE FoodQuantityMaster SET ${queryValue}, UpdatedDate = GETDATE()  WHERE FoodId = ${FoodId} AND RestaurantId = ${RestaurantId} AND FoodQuantityId =${FoodQuantityId}
//           `
//       );
//       res.json(commonMsgs.updateMsg);
//     } catch (error) {
//       errorHandle.handleError(error, errorRes => {
//         res.send(errorRes);
//       });
//     }
//   }

//   async deleteData(req, res) {
//     try {
//       if (
//         !req.query.hasOwnProperty("FoodId") ||
//         !req.query.hasOwnProperty("ActiveStatus")
//       )
//         return res.json(commonMsgs.NullMsg);
//       const pool = await poolPromise;
//       if (req.query.hasOwnProperty("FoodQuantityId")) {
//         await pool.query(
//           `UPDATE FoodQuantityMaster SET ActiveStatus = '${req.query.ActiveStatus}'  WHERE FoodQuantityId = '${req.query.FoodQuantityId}' AND FoodId = '${req.query.FoodId}'`
//         );
//         checkFoodQuantity(req.query.FoodId, async response => {
//           res.json(commonMsgs.deleteMsg);
//         });
//         return;
//       } else {
//         await pool.query(
//           `UPDATE FoodQuantityMaster SET ActiveStatus = '${req.query.ActiveStatus}'  WHERE FoodId = '${req.query.FoodId}';UPDATE FoodMaster SET ActiveStatus = '${req.query.ActiveStatus}'  WHERE FoodId = '${req.query.FoodId}'`
//         );
//         res.json(commonMsgs.deleteMsg);
//         return;
//       }
//     } catch (error) {
//       errorHandle.handleError(error, errorRes => {
//         res.send(errorRes);
//       });
//     }
//   }
// }

// async function checkDataExist(input, callback) {
//   const pool = await poolPromise;
//   if (input.hasOwnProperty("FoodQuantityId")) {
//     let result = await pool
//       .request()
//       .query(
//         `SELECT FoodQuantityMaster.RestaurantId, FoodQuantityMaster.FoodId, FoodQuantityMaster.FoodQuantityId FROM FoodQuantityMaster WHERE RestaurantId=${input.RestaurantId} AND FoodId = ${input.FoodId} AND FoodQuantityId=${input.FoodQuantityId}`
//       );
//     callback(result.recordset);
//     return;
//   } else {
//     let result = await pool
//       .request()
//       .query(
//         `SELECT FoodQuantityMaster.RestaurantId, FoodQuantityMaster.FoodId, FoodQuantityMaster.FoodQuantityId FROM FoodQuantityMaster WHERE RestaurantId=${input.RestaurantId} AND FoodId = ${input.FoodId} AND FoodQuantityId IS NULL`
//       );
//     callback(result.recordset);
//   }
// }

// async function checkFoodQuantity(FoodId, callback) {
//   const pool = await poolPromise;
//   let result = await pool
//     .request()
//     .query(
//       `SELECT FoodQuantityMaster.FoodId, FoodQuantityMaster.FoodQuantityId, FoodQuantityMaster.ActiveStatus FROM FoodQuantityMaster WHERE FoodId = ${FoodId} AND ActiveStatus='A'`
//     );
//   if (result.recordset.length === 0) {
//     let result = await pool
//       .request()
//       .query(
//         `UPDATE FoodMaster SET ActiveStatus = 'D' WHERE FoodId = '${FoodId}'`
//       );
//   }
//   callback(null);
// }

// const FoodQuantityMaster = new FoodQuantityMasterController();

// module.exports = FoodQuantityMaster;
