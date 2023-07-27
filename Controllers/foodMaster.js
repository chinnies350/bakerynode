const errorHandle = require("../services/errorHandler");
const commonMsgs = require("../CommonMsg.json");
const { poolPromise, sql } = require("../db");
const async = require("async");

class FoodMasterController {
  async getData(req, res) {
    try {
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .input("FoodId", req.query.FoodId)
                        .input("Type" , req.query.Type)
                        .execute("getFood")
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
  //     if (!req.query.FoodId) res.json(commonMsgs.NullMsg);
  //     else {
  //       const pool = await poolPromise;
  //       let result = await pool.query(
  //         `select * from FoodMaster where FoodId= ${req.query.FoodId} AND ActiveStatus='A'`
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
          .input("type",req.query.type)
          .input("ActiveStatus",req.query.ActiveStatus)
          .execute("getFoodDataByResId")
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


  // async getDataByResId(req, res) {
  //   try {
  //     if (!req.query.RestaurantId) res.json(commonMsgs.NullMsg);
  //     else {
  //       const pool = await poolPromise;
  //       let result = await pool
  //         .request()
  //         .input("RestaurantId", req.query.RestaurantId)
          
  //         .query(
  //           `SELECT FoodMaster.RestaurantId, FoodMaster.FoodCategoryId, FoodCategoryMaster.FoodCategoryName, FoodMaster.FoodId, FoodMaster.Description, FoodMaster.FoodName,FoodMaster.FoodTimingId, FoodMaster.ImageLink, FoodMaster.ActiveStatus, FoodMaster.CreatedBy, FoodMaster.CreatedDate, FoodMaster.UpdatedBy, FoodMaster.UpdatedDate,FoodMaster.FoodToken FROM FoodMaster INNER JOIN FoodCategoryMaster ON FoodMaster.FoodCategoryId = FoodCategoryMaster.FoodCategoryId where FoodMaster.RestaurantId = @RestaurantId`
  //         );
  //       res.json({ status: true, data: result.recordset });
  //     }
  //   } catch (error) {
  //     errorHandle.handleError(error, errorRes => {
  //       res.send(errorRes);
  //     });
  //   }
  // }

  async getAllFoodData(req, res) {
    try {
        const pool = await poolPromise;
        let result = await pool
            .request()
            .input("RestaurantId", req.query.RestaurantId)
            .execute("getAllFoodData")
        if (result.recordset[0].mainData != null) {
            res.json({ status: true, data: JSON.parse(result.recordset[0].mainData) })

        } else {
            res.json({ status: true, data: [] })
        }

    } catch (error) {
        errorHandle.handleError(error, errorRes => {
            res.send(errorRes);
        });
    }
  }

  async getAllFoodSingleData(req, res) {
    try {
      if (!req.query.RestaurantId) res.json(commonMsgs.NullMsg);
      else {
        const pool = await poolPromise;
        let result = await pool
          .request()
          .input("RestaurantId", req.query.RestaurantId)
          .execute("AllFoodSingleData")
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

  // async getAllFoodSingleData(req, res) {
  //   try {
  //     if (!req.query.RestaurantId) res.json(commonMsgs.NullMsg);
  //     else {
  //       const pool = await poolPromise;
  //       let result = await pool
  //         .request()
  //         .input("RestaurantId", req.query.RestaurantId)
  //         .query(
  //           `SELECT DISTINCT
  //           FoodMaster.FoodCategoryId, 
  //           FoodCategoryMaster.FoodCategoryName ,(SELECT  A.FoodName, 
  //           A.FoodId, 
  //           A.ImageLink, 
  //           A.FoodCategoryId, 
  //           FoodCategoryMaster.FoodCategoryName ,
  //           (CASE WHEN A.FoodId IN(SELECT FoodId From AllItems WHERE AllItems.FoodId=A.FoodId AND AllItems.FoodCategoryId=A.FoodCategoryId)
  //             THEN 'Y'
  //             ELSE
  //               'N'
  //             END) AS Status
  //           FROM FoodMaster  AS A
  //           INNER JOIN FoodCategoryMaster 
  //           ON A.FoodCategoryId = FoodCategoryMaster.FoodCategoryId 
  //           WHERE A.RestaurantId = @RestaurantId AND A.ActiveStatus = 'A' AND A.FoodCategoryId=FoodMaster.FoodCategoryId
  //           FOR JSON PATH)  AS FoodItems
  //           FROM FoodMaster 
  //           INNER JOIN FoodCategoryMaster 
  //           ON FoodMaster.FoodCategoryId = FoodCategoryMaster.FoodCategoryId 
  //           WHERE FoodMaster.RestaurantId = @RestaurantId AND FoodMaster.ActiveStatus = 'A'`
  //         );
  //         if (result.recordset.length > 0 ) {
  //             let sendingData = [... result.recordset]
  //             for( let eachData of sendingData) {
  //               if (eachData.FoodItems != null) {
  //                 eachData.FoodItems = JSON.parse(eachData.FoodItems)
  //               }
  //               else {
  //                 eachData.FoodItems = []
  //               }
  //             }
  //             res.json({ status: true, data: sendingData })
  
  //           }
  //         else {
  //           res.json({ status: true, data: [] })
  //         }
  //     }
  //   } catch (error) {
  //     errorHandle.handleError(error, errorRes => {
  //       res.send(errorRes);
  //     });
  //   }
  // }

  async getAllFoodDataByFoodCategoryId(req, res) {
    try {
      if (!req.query.RestaurantId && !req.query.FoodCategoryId) res.json(commonMsgs.NullMsg);
      else {
        const pool = await poolPromise;
        let result = await pool
          .request()
          .input("RestaurantId", req.query.RestaurantId)
          .input("FoodCategoryId",req.query.FoodCategoryId)
          .execute("getAllFoodDataByFoodCategoryId")
        if (result.recordset[0].mainData!=null){
          res.json({status: true, response:JSON.parse(result.recordset[0].mainData)})

        }
        else{
          // res.json({status: true, message: "No data Found!"})
          res.json({status: true, data: []})
        }

      }
    } catch (error) {
      errorHandle.handleError(error, errorRes => {
        res.send(errorRes);
      });
    }
  }

  // async getAllFoodDataByFoodCategoryId(req, res) {
  //   try {
  //     if (!req.query.RestaurantId && !req.query.FoodCategoryId)
  //       res.json(commonMsgs.NullMsg);
  //     const pool = await poolPromise;
  //     const result = await pool
  //       .request()
  //       .input("RestaurantId", req.query.RestaurantId)
  //       .input("FoodCategoryId", req.query.FoodCategoryId)
  //       .query(
  //         `SELECT FoodMaster.RestaurantId, 
  //           FoodMaster.FoodCategoryId, 
  //           FoodCategoryMaster.FoodCategoryName, 
  //           FoodMaster.FoodId, 
  //           FoodMaster.FoodName, 
  //           FoodMaster.FoodTimingId, 
  //           FoodMaster.Description, 
  //           FoodMaster.ImageLink, 
  //           FoodMaster.ActiveStatus, 
  //           FoodMaster.CreatedBy, 
  //           FoodMaster.CreatedDate,
  //           FoodMaster.GST,
  //           FoodMaster.Cess,
  //           FoodMaster.Rack,
  //           FoodMaster.FoodToken
            
  //           FROM FoodMaster,FoodCategoryMaster 
  //           WHERE FoodMaster.FoodCategoryId = FoodCategoryMaster.FoodCategoryId 
  //           AND FoodMaster.RestaurantId = @RestaurantId 
  //           AND FoodMaster.FoodCategoryId=@FoodCategoryId`
  //       );
  //     let response = await pool.query(
  //       `SELECT FoodMaster.RestaurantId, 
  //       FoodMaster.FoodCategoryId, 
  //       FoodCategoryMaster.FoodCategoryName, 
  //       FoodMaster.FoodId, 
  //       FoodMaster.FoodName, 
  //       FoodMaster.FoodTimingId, 
  //       FoodMaster.Description, 
  //       FoodMaster.ImageLink, 
  //       FoodMaster.ActiveStatus, 
  //       FoodMaster.CreatedBy, 
  //       FoodMaster.CreatedDate,
  //       FoodMaster.GST,
  //       FoodMaster.Cess,
  //       FoodMaster.Rack,
  //       FoodMaster.FoodToken,
  //       FoodQuantityMaster.StockAvailable
  //       FROM FoodMaster,FoodQuantityMaster, FoodCategoryMaster 
  //       WHERE FoodMaster.FoodCategoryId = FoodCategoryMaster.FoodCategoryId 
  //       AND FoodMaster.RestaurantId = ${req.query.RestaurantId} 
  //       AND FoodQuantityMaster.RestaurantId = ${req.query.RestaurantId} 
  //       AND FoodMaster.FoodCategoryId=${req.query.FoodCategoryId} 
  //       AND FoodMaster.FoodId=FoodQuantityMaster.FoodId`
  //     );
  //     var finalData = [...result.recordset, ...response.recordset];
  //     if (finalData.length > 0) {
  //       filterFoodItems(finalData, response => {
  //         res.json({ status: true, response });
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

  async getOthersFoodNameByFoodCategoryId(req, res) {
    try {
      if (!req.query.RestaurantId && !req.query.FoodCategoryId)
        res.json(commonMsgs.NullMsg);
      else {
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .input("FoodCategoryId", req.query.FoodCategoryId)
                        .input("RestaurantId", req.query.RestaurantId)
                        .execute("getFood")
        if (result.recordset[0].mainData!=null){
          res.json({status: true, data:JSON.parse(result.recordset[0].mainData)})

        }
        else{
          // res.json({status: true, message: "No data Found!"})
          res.json({status: true, data: []})
        }
        }
    } 
    catch (error) {
      errorHandle.handleError(error, errorRes => {
        res.send(errorRes);
      });
    }
  }

  // async getOthersFoodNameByFoodCategoryId(req, res) {
  //   try {
  //     if (!req.query.RestaurantId && !req.query.FoodCategoryId)
  //     res.json(commonMsgs.NullMsg);
  //     const pool = await poolPromise;
  //     const result = await pool.query(`select FoodId,FoodName from FoodMaster where FoodCategoryId=${req.query.FoodCategoryId} AND RestaurantId=${req.query.RestaurantId}`)
  //     if(result.recordset.length>0){
  //       res.json({ status: true, data: result.recordset });
  //     }
  //     else {
  //       res.json({ status: true, message: "No data Found!" });
  //     }
  //   }
  //   catch (error) {
  //     errorHandle.handleError(error, errorRes => {
  //       res.send(errorRes);
  //     });
  //   }
  // }

  async getFoodQuantityByFoodId(req, res) {
    try {
      if (!req.query.FoodId)
        res.json(commonMsgs.NullMsg);
      else {
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .input("FoodId", req.query.FoodId)
                        .execute("getFoodQuantityByFoodId")
        if (result.recordset[0].mainData!=null){
          res.json({status: true, data:JSON.parse(result.recordset[0].mainData)})

        }
        else{
          // res.json({status: true, message: "No data Found!"})
          res.json({status: true, data: []})
        }
        }
    } 
    catch (error) {
      errorHandle.handleError(error, errorRes => {
        res.send(errorRes);
      });
    }
  }
  

  // async getFoodQuantityByFoodId(req, res){
  //   try {
  //     if (!req.query.FoodId)
  //       res.json(commonMsgs.NullMsg);
  //     const pool = await poolPromise;
  //     let response = await pool.query(
  //       `select UniqueId,Concat(FoodQuantityMaster.FoodQuantity,' ',(select ConfigurationMaster.ConfigName from ConfigurationMaster where ConfigurationMaster.ConfigId=FoodQuantityMaster.FoodQuantityTypeId)) AS FoodQuantityName 
  //       from FoodQuantityMaster where FoodId=${req.query.FoodId} AND StockAvailable ='Y'
  //       `
  //     );
  //     if(response.recordset.length>0){
  //       res.json({ status: true, data: response.recordset });
  //     }

      

  //      else {
  //       res.json({ status: true, message: "No data Found!" });
  //     }
  //   } catch (error) {
  //     errorHandle.handleError(error, errorRes => {
  //       res.send(errorRes);
  //     });
  //   }
  // }
  async getFoodDataByFoodCategoryId(req, res) {
    try {
        const pool = await poolPromise;
        let result = await pool
            .request()
            .input("RestaurantId", req.query.RestaurantId)
            .input("Type", req.query.Type ? req.query.Type : null)
            .input("FoodCategoryId", req.query.FoodCategoryId)
            .input("time", req.query.time)
            .input("Date", req.query.Date)
            .execute("getFoodDataByFoodCategoryId")
        if (result.recordset[0].mainData != null) {
            res.json({ status: true, data: JSON.parse(result.recordset[0].mainData) })

        } else {
            // res.json({ status: true, data: "No data Found!" })
            res.json({ status: true, data: [] })
        }

    } catch (error) {
        errorHandle.handleError(error, errorRes => {
            res.send(errorRes);
        });
    }
  }


  // async getFoodDataByFoodCategoryId(req, res) {
  //   try {
  //     if (!req.query.RestaurantId && !req.query.FoodCategoryId)
  //       res.json(commonMsgs.NullMsg);
  //       if(req.query.hasOwnProperty("Type")){
  //         const pool = await poolPromise;
  //         const result = await pool
  //           .request()
  //           .input("RestaurantId", req.query.RestaurantId)
  //           .input("FoodCategoryId", req.query.FoodCategoryId)
  //           .query(
  //             `SELECT FoodMaster.RestaurantId, 
  //             FoodMaster.FoodCategoryId, 
  //             (SELECT TOP 1 FoodCategoryName 
  //                 FROM FoodCategoryMaster
  //                 INNER JOIN FoodMaster
  //                 ON FoodMaster.FoodCategoryId = FoodCategoryMaster.FoodCategoryId 
  //                 WHERE FoodMaster.FoodCategoryId=FoodCategoryMaster.FoodCategoryId) AS FoodCategoryName, 
  //             FoodMaster.FoodId, 
  //             FoodMaster.FoodName, 
  //             FoodMaster.FoodTimingId, 
  //             CONCAT((SELECT TOP 1 FoodQuantity 
  //               FROM FoodQuantityMaster 
  //               WHERE FoodQuantityMaster.RestaurantId = @RestaurantId 
  //               AND FoodQuantityMaster.ActiveStatus='A' 
  //               AND FoodMaster.FoodId=FoodQuantityMaster.FoodId
  //               ORDER BY FoodQuantityMaster.UniqueId DESC),' ',(SELECT TOP 1 ConfigName
  //                 FROM FoodQuantityMaster 
  //                 INNER JOIN ConfigurationMaster AS cm
  //                 ON cm.ConfigId=FoodQuantityMaster.FoodQuantityTypeId
  //                 WHERE FoodQuantityMaster.RestaurantId = @RestaurantId 
  //                 AND FoodQuantityMaster.ActiveStatus='A' 
  //                 AND FoodMaster.FoodId=FoodQuantityMaster.FoodId
  //                 ORDER BY FoodQuantityMaster.UniqueId DESC)) AS FoodQuantityName,
  //             (SELECT TOP 1 UniqueId 
  //               FROM FoodQuantityMaster 
  //               WHERE FoodQuantityMaster.RestaurantId = @RestaurantId 
  //               AND FoodQuantityMaster.ActiveStatus='A' 
  //               AND FoodMaster.FoodId=FoodQuantityMaster.FoodId
  //               ORDER BY FoodQuantityMaster.UniqueId DESC) AS FoodQuantityId,
  //             FoodMaster.Description, 
  //             (SELECT TOP 1 Tariff 
  //                 FROM FoodQuantityMaster 
  //                 WHERE FoodQuantityMaster.RestaurantId = @RestaurantId 
  //                 AND FoodQuantityMaster.ActiveStatus='A' 
  //                 AND FoodMaster.FoodId=FoodQuantityMaster.FoodId
  //                 ORDER BY FoodQuantityMaster.UniqueId DESC) AS Tariff,
  //             FoodMaster.ImageLink, 
  //             FoodMaster.ActiveStatus, 
  //             FoodMaster.CreatedBy, 
  //             FoodMaster.CreatedDate, 
  //             FoodMaster.UpdatedBy, 
  //             FoodMaster.UpdatedDate 
  //             FROM FoodMaster
  //             INNER JOIN FoodQuantityMaster
  //             ON FoodQuantityMaster.FoodId=FoodMaster.FoodId AND FoodQuantityMaster.ActiveStatus='A'
  //             WHERE FoodMaster.RestaurantId = @RestaurantId 
  //             AND FoodMaster.FoodId IN (SELECT AllItems.FoodId 
  //                       FROM AllItems 
  //                       INNER JOIN FoodMaster 
  //                       ON FoodMaster.FoodId=AllItems.FoodId AND FoodMaster.FoodCategoryId=AllItems.FoodCategoryId
  //                       WHERE AllItems.RestaurantId = @RestaurantId)
  //             GROUP BY FoodMaster.FoodId,
  //             FoodMaster.RestaurantId, 
  //             FoodMaster.FoodCategoryId,
  //             FoodMaster.FoodName, 
  //             FoodMaster.FoodTimingId, 
  //             FoodMaster.Description,
  //             FoodMaster.ImageLink, 
  //             FoodMaster.ActiveStatus, 
  //             FoodMaster.CreatedBy, 
  //             FoodMaster.CreatedDate, 
  //             FoodMaster.UpdatedBy, 
  //             FoodMaster.UpdatedDate
  //             ORDER BY FoodMaster.FoodId DESC`
  //           );
  //         // let response = await pool.query(
  //         //   `SELECT FoodMaster.RestaurantId, FoodMaster.FoodCategoryId, FoodCategoryMaster.FoodCategoryName, FoodMaster.FoodId, FoodMaster.FoodName, FoodMaster.FoodTimingId, FoodMaster.Description, FoodQuantityMaster.Tariff, FoodMaster.ImageLink, FoodMaster.ActiveStatus, FoodMaster.CreatedBy, FoodMaster.CreatedDate, FoodMaster.UpdatedBy, FoodMaster.UpdatedDate FROM FoodMaster,FoodQuantityMaster,FoodCategoryMaster WHERE FoodMaster.FoodCategoryId = FoodCategoryMaster.FoodCategoryId AND FoodMaster.RestaurantId = ${req.query.RestaurantId} AND FoodQuantityMaster.RestaurantId = ${req.query.RestaurantId} AND FoodMaster.FoodCategoryId=${req.query.FoodCategoryId} AND FoodMaster.FoodId=FoodQuantityMaster.FoodId AND FoodQuantityMaster.FoodQuantityId IS NULL and FoodQuantityMaster.ActiveStatus='A' order by FoodMaster.FoodId ASC`
  //         // );
    
  //         let timingResult = await pool
  //           .request()
  //           .input("RestaurantId", req.query.RestaurantId)
  //           .query(
  //             `SELECT FoodTimingId FROM FoodTimingMaster WHERE '${req.query.time}' BETWEEN substring(convert(char(8),StartTime,114), 1, 5) AND substring(convert(char(8),EndTime,114), 1, 5)`
  //           );
    
  //         var finalData = [...result.recordset];
  //         if (finalData.length > 0) {
  //           let data = [],
  //             asyncArr = [];
  //           const pool = await poolPromise;
  //           finalData.map((value, index) => {
  //             asyncArr.push(next => {
  //               pool
  //                 .request()
  //                 .input("Date", req.query.Date)
  //                 .query(
  //                   `select TaxId, ServiceName, TaxDescription, TaxPercentage, RefNumber FROM TaxMaster WHERE ActiveStatus = 'A' AND ServiceName = 'Restaurant'`,
  //                   (error, TaxResult) => {
  //                     if (error) next(null, null);
  //                     data.push({ ...value, TaxResult: TaxResult.recordset });
  //                     next(null, null);
  //                   }
  //                 );
  //             });
  //           });
  //           async.parallel(asyncArr, (err, result) => {
  //             if (err) {
  //               errorHandle.handleError(err, errorRes => {
  //                 res.send(errorRes);
  //               });
  //             } else {
  //               let finalResult = matchFoodTimingId(data, timingResult.recordset);
  //               res.json({ status: true, data: finalResult });
  //             }
  //           });
  //         } else {
  //           res.json({ status: true, message: "No data Found!" });
  //         }
  //       }
  //       else{
          
  //         const pool = await poolPromise;
  //         const result = await pool
  //           .request()
  //           .input("RestaurantId", req.query.RestaurantId)
  //           .input("FoodCategoryId", req.query.FoodCategoryId)
  //           .query(
  //             `SELECT FoodMaster.RestaurantId, 
  //             FoodMaster.FoodCategoryId, 
  //             (SELECT TOP 1 FoodCategoryName 
  //                 FROM FoodCategoryMaster
  //                 INNER JOIN FoodMaster
  //                 ON FoodMaster.FoodCategoryId = FoodCategoryMaster.FoodCategoryId 
  //                 WHERE FoodMaster.FoodCategoryId=@FoodCategoryId) AS FoodCategoryName, 
  //             FoodMaster.FoodId, 
  //             FoodMaster.FoodName, 
  //             FoodMaster.FoodTimingId, 
  //             CONCAT((SELECT TOP 1 FoodQuantity 
  //               FROM FoodQuantityMaster 
  //               WHERE FoodQuantityMaster.RestaurantId = @RestaurantId 
  //               AND FoodQuantityMaster.ActiveStatus='A' 
  //               AND FoodMaster.FoodId=FoodQuantityMaster.FoodId
  //               ORDER BY FoodQuantityMaster.UniqueId DESC),' ',(SELECT TOP 1 ConfigName
  //                 FROM FoodQuantityMaster 
  //                 INNER JOIN ConfigurationMaster AS cm
  //                 ON cm.ConfigId=FoodQuantityMaster.FoodQuantityTypeId
  //                 WHERE FoodQuantityMaster.RestaurantId = @RestaurantId 
  //                 AND FoodQuantityMaster.ActiveStatus='A' 
  //                 AND FoodMaster.FoodId=FoodQuantityMaster.FoodId
  //                 ORDER BY FoodQuantityMaster.UniqueId DESC)) AS FoodQuantityName,
  //             (SELECT TOP 1 UniqueId 
  //               FROM FoodQuantityMaster 
  //               WHERE FoodQuantityMaster.RestaurantId = @RestaurantId 
  //               AND FoodQuantityMaster.ActiveStatus='A' 
  //               AND FoodMaster.FoodId=FoodQuantityMaster.FoodId
  //               ORDER BY FoodQuantityMaster.UniqueId DESC) AS UniqueId,
                
             
  //             FoodMaster.Description, 
  //             (SELECT TOP 1 Tariff 
  //                 FROM FoodQuantityMaster 
  //                 WHERE FoodQuantityMaster.RestaurantId = @RestaurantId 
  //                 AND FoodQuantityMaster.ActiveStatus='A' 
  //                 AND FoodMaster.FoodId=FoodQuantityMaster.FoodId
  //                 ORDER BY FoodQuantityMaster.UniqueId DESC) AS Tariff,
  //             FoodMaster.ImageLink, 
  //             FoodMaster.ActiveStatus, 
  //             FoodMaster.CreatedBy, 
  //             FoodMaster.CreatedDate, 
  //             FoodMaster.UpdatedBy, 
  //             FoodMaster.UpdatedDate 
  //             FROM FoodMaster
  //             INNER JOIN FoodQuantityMaster
  //             ON FoodQuantityMaster.FoodId=FoodMaster.FoodId AND FoodQuantityMaster.ActiveStatus='A'
  //             WHERE FoodMaster.RestaurantId = @RestaurantId AND FoodMaster.FoodCategoryId=@FoodCategoryId 
  //             GROUP BY FoodMaster.FoodId,
  //             FoodMaster.RestaurantId, 
  //             FoodMaster.FoodCategoryId,
  //             FoodMaster.FoodName, 
  //             FoodMaster.FoodTimingId, 
  //             FoodMaster.Description,
  //             FoodMaster.ImageLink, 
  //             FoodMaster.ActiveStatus, 
  //             FoodMaster.CreatedBy, 
  //             FoodMaster.CreatedDate, 
  //             FoodMaster.UpdatedBy, 
  //             FoodMaster.UpdatedDate
  //             ORDER BY FoodMaster.FoodId DESC`
  //           );
  //         // let response = await pool.query(
  //         //   `SELECT FoodMaster.RestaurantId, FoodMaster.FoodCategoryId, FoodCategoryMaster.FoodCategoryName, FoodMaster.FoodId, FoodMaster.FoodName, FoodMaster.FoodTimingId, FoodMaster.Description, FoodQuantityMaster.Tariff, FoodMaster.ImageLink, FoodMaster.ActiveStatus, FoodMaster.CreatedBy, FoodMaster.CreatedDate, FoodMaster.UpdatedBy, FoodMaster.UpdatedDate FROM FoodMaster,FoodQuantityMaster,FoodCategoryMaster WHERE FoodMaster.FoodCategoryId = FoodCategoryMaster.FoodCategoryId AND FoodMaster.RestaurantId = ${req.query.RestaurantId} AND FoodQuantityMaster.RestaurantId = ${req.query.RestaurantId} AND FoodMaster.FoodCategoryId=${req.query.FoodCategoryId} AND FoodMaster.FoodId=FoodQuantityMaster.FoodId AND FoodQuantityMaster.FoodQuantityId IS NULL and FoodQuantityMaster.ActiveStatus='A' order by FoodMaster.FoodId ASC`
  //         // );
    
  //         let timingResult = await pool
  //           .request()
  //           .input("RestaurantId", req.query.RestaurantId)
  //           .query(
  //             `SELECT FoodTimingId FROM FoodTimingMaster WHERE '${req.query.time}' BETWEEN substring(convert(char(8),StartTime,114), 1, 5) AND substring(convert(char(8),EndTime,114), 1, 5)`
  //           );
    
  //         var finalData = [...result.recordset];
  //         if (finalData.length > 0) {
  //           let data = [],
  //             asyncArr = [];
  //           const pool = await poolPromise;
  //           finalData.map((value, index) => {
  //             asyncArr.push(next => {
  //               pool
  //                 .request()
  //                 .input("Date", req.query.Date)
  //                 .query(
  //                   `select TaxId, ServiceName, TaxDescription, TaxPercentage, RefNumber FROM TaxMaster WHERE ActiveStatus = 'A' AND ServiceName = 'Restaurant'`,
  //                   (error, TaxResult) => {
  //                     if (error) next(null, null);
  //                     data.push({ ...value, TaxResult: TaxResult.recordset });
  //                     next(null, null);
  //                   }
  //                 );
  //             });
  //           });
  //           async.parallel(asyncArr, (err, result) => {
  //             if (err) {
  //               errorHandle.handleError(err, errorRes => {
  //                 res.send(errorRes);
  //               });
  //             } else {
  //               let finalResult = matchFoodTimingId(data, timingResult.recordset);
  //               res.json({ status: true, data: finalResult });
  //             }
  //           });
  //         } else {
  //           res.json({ status: true, message: "No data Found!" });
  //         }
  //       }
      
  //   } catch (error) {
  //     errorHandle.handleError(error, errorRes => {
  //       res.send(errorRes);
  //     });
  //   }
  // }

  // async getFoodDataByFoodCategoryId(req, res) {
  //   try {
  //     if (!req.query.RestaurantId && !req.query.FoodCategoryId)
  //       res.json(commonMsgs.NullMsg);
  //     const pool = await poolPromise;
  //     const result = await pool
  //       .request()
  //       .input("RestaurantId", req.query.RestaurantId)
  //       .input("FoodCategoryId", req.query.FoodCategoryId)
  //       .query(
  //         `SELECT FoodMaster.RestaurantId, 
  //         FoodMaster.FoodCategoryId, 
  //         Concat(FoodQuantityMaster.FoodQuantity,' ',
  //         (select ConfigurationMaster.ConfigName from ConfigurationMaster where ConfigurationMaster.ConfigId=FoodQuantityMaster.FoodQuantityTypeId)) AS FoodQuantityName ,
  //         FoodCategoryMaster.FoodCategoryName, 
  //         FoodMaster.FoodId, 
  //         FoodMaster.FoodName, 
  //         FoodMaster.FoodTimingId, 
  //         ConfigurationMaster.ConfigId AS FoodQuantityId,
  //         FoodQuantityMaster.UniqueId ,
  //         ConfigurationMaster.ConfigName AS FoodQuantityName, 
  //         FoodMaster.Description, 
  //         FoodQuantityMaster.Tariff, 
  //         FoodMaster.ImageLink, 
  //         FoodMaster.ActiveStatus, 
  //         FoodMaster.CreatedBy, 
  //         FoodMaster.CreatedDate, 
  //         FoodMaster.UpdatedBy, 
  //         FoodMaster.UpdatedDate 
  //         FROM FoodMaster,FoodQuantityMaster,FoodCategoryMaster,ConfigurationMaster 
  //         WHERE FoodMaster.FoodCategoryId = FoodCategoryMaster.FoodCategoryId 
  //         AND FoodMaster.RestaurantId = @RestaurantId 
  //         AND FoodQuantityMaster.RestaurantId = @RestaurantId 
  //         AND FoodMaster.FoodCategoryId=@FoodCategoryId 
  //         AND FoodMaster.FoodId=FoodQuantityMaster.FoodId 
  //         AND FoodQuantityMaster.FoodQuantityId = ConfigurationMaster.ConfigId order by FoodMaster.FoodId ASC`
  //       );
  //     let response = await pool.query(
  //       `SELECT FoodMaster.RestaurantId, 
  //         FoodMaster.FoodCategoryId, 
  //         FoodCategoryMaster.FoodCategoryName, 
  //         FoodMaster.FoodId, 
  //         FoodMaster.FoodName, 
  //         FoodMaster.FoodTimingId, 
  //         FoodMaster.Description, 
  //         Concat(FoodQuantityMaster.FoodQuantity,' ',(select ConfigurationMaster.ConfigName from ConfigurationMaster where ConfigurationMaster.ConfigId=FoodQuantityMaster.FoodQuantityTypeId)) AS FoodQuantityName ,
  //         FoodQuantityMaster.UniqueId,
  //         FoodQuantityMaster.Tariff, 
  //         FoodMaster.ImageLink, 
  //         FoodMaster.ActiveStatus, 
  //         FoodMaster.CreatedBy, 
  //         FoodMaster.CreatedDate, 
  //         FoodMaster.UpdatedBy, 
  //         FoodMaster.UpdatedDate 
  //         FROM FoodMaster,FoodQuantityMaster,FoodCategoryMaster 
  //         WHERE FoodMaster.FoodCategoryId = FoodCategoryMaster.FoodCategoryId 
  //         AND FoodMaster.RestaurantId = ${req.query.RestaurantId} 
  //         AND FoodQuantityMaster.RestaurantId = ${req.query.RestaurantId} 
  //         AND FoodMaster.FoodCategoryId=${req.query.FoodCategoryId} 
  //         AND FoodMaster.FoodId=FoodQuantityMaster.FoodId 
  //         AND FoodQuantityMaster.FoodQuantityId IS NULL  order by FoodMaster.FoodId ASC`
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
  async getFoodDataByFoodName(req, res) {
    try {
        if (!req.query.RestaurantId)
            res.json(commonMsgs.NullMsg);
        else {
            const pool = await poolPromise;
            let result = await pool
                .request()
                .input("RestaurantId", req.query.RestaurantId)
                .input("FoodName", req.query.FoodName)
                .input("time", req.query.time)
                .input("FoodId", req.query.FoodId)
                .input("FoodQuantityId", req.query.FoodQuantityId)
                .execute("getFoodDataByFoodName")
            if (result.recordset[0].mainData != null) {
                res.json({ status: true, data: JSON.parse(result.recordset[0].mainData) })

            } else {
                // res.json({ status: true, message: "No data Found!" })
                res.json({status: true, data: []})
            }
        }
    } catch (error) {
        errorHandle.handleError(error, errorRes => {
            res.send(errorRes);
        });
    }
}

  // async getFoodDataByFoodName(req, res) {
  //   try {
  //     if (!req.query.RestaurantId && !req.query.FoodName)
  //       res.json(commonMsgs.NullMsg);
  //     const pool = await poolPromise;
  //     const result = await pool
  //       .request()
  //       .input("RestaurantId", req.query.RestaurantId)
  //       .input("FoodName", req.query.FoodName)
  //       .query(`SELECT FoodMaster.RestaurantId, 
  //       FoodMaster.FoodCategoryId, 
  //       (SELECT TOP 1 FoodCategoryName 
  //           FROM FoodCategoryMaster
  //           INNER JOIN FoodMaster
  //           ON FoodMaster.FoodCategoryId = FoodCategoryMaster.FoodCategoryId 
  //           WHERE FoodMaster.FoodCategoryId=FoodCategoryMaster.FoodCategoryId) AS FoodCategoryName, 
  //       FoodMaster.FoodId, 
  //       FoodMaster.FoodName, 
  //       FoodMaster.FoodTimingId, 
  //       CONCAT((SELECT TOP 1 FoodQuantity 
  //         FROM FoodQuantityMaster 
  //         WHERE FoodQuantityMaster.RestaurantId = @RestaurantId 
  //         AND FoodQuantityMaster.ActiveStatus='A' 
  //         AND FoodMaster.FoodId=FoodQuantityMaster.FoodId
  //         ORDER BY FoodQuantityMaster.UniqueId DESC),' ',(SELECT TOP 1 ConfigName
  //           FROM FoodQuantityMaster 
  //           INNER JOIN ConfigurationMaster AS cm
  //           ON cm.ConfigId=FoodQuantityMaster.FoodQuantityTypeId
  //           WHERE FoodQuantityMaster.RestaurantId = @RestaurantId 
  //           AND FoodQuantityMaster.ActiveStatus='A' 
  //           AND FoodMaster.FoodId=FoodQuantityMaster.FoodId
  //           ORDER BY FoodQuantityMaster.UniqueId DESC)) AS FoodQuantityName,
  //       (SELECT TOP 1 UniqueId 
  //         FROM FoodQuantityMaster 
  //         WHERE FoodQuantityMaster.RestaurantId = @RestaurantId 
  //         AND FoodQuantityMaster.ActiveStatus='A' 
  //         AND FoodMaster.FoodId=FoodQuantityMaster.FoodId
  //         ORDER BY FoodQuantityMaster.UniqueId DESC) AS UniqueId,
          
       
  //       FoodMaster.Description, 
  //       (SELECT TOP 1 Tariff 
  //           FROM FoodQuantityMaster 
  //           WHERE FoodQuantityMaster.RestaurantId = @RestaurantId 
  //           AND FoodQuantityMaster.ActiveStatus='A' 
  //           AND FoodMaster.FoodId=FoodQuantityMaster.FoodId
  //           ORDER BY FoodQuantityMaster.UniqueId DESC) AS Tariff,
  //       FoodMaster.ImageLink, 
  //       FoodMaster.ActiveStatus, 
  //       FoodMaster.CreatedBy, 
  //       FoodMaster.CreatedDate, 
  //       FoodMaster.UpdatedBy, 
  //       FoodMaster.UpdatedDate 
  //       FROM FoodMaster
  //       INNER JOIN FoodQuantityMaster
  //       ON FoodQuantityMaster.FoodId=FoodMaster.FoodId AND FoodQuantityMaster.ActiveStatus='A'
  //       WHERE FoodMaster.RestaurantId = @RestaurantId 
  //       AND FoodMaster.FoodName like '%${req.query.FoodName}%' 
  //       GROUP BY FoodMaster.FoodId,
  //       FoodMaster.RestaurantId, 
  //       FoodMaster.FoodCategoryId,
  //       FoodMaster.FoodName, 
  //       FoodMaster.FoodTimingId, 
  //       FoodMaster.Description,
  //       FoodMaster.ImageLink, 
  //       FoodMaster.ActiveStatus, 
  //       FoodMaster.CreatedBy, 
  //       FoodMaster.CreatedDate, 
  //       FoodMaster.UpdatedBy, 
  //       FoodMaster.UpdatedDate
  //       ORDER BY FoodMaster.FoodId DESC`)
  //       // .query(`SELECT FoodMaster.RestaurantId, 
  //       //   FoodMaster.FoodCategoryId, 
  //       //   FoodCategoryMaster.FoodCategoryName,
  //       //    FoodMaster.FoodId, 
  //       //    FoodMaster.FoodName, 
  //       //    FoodMaster.FoodTimingId, 
  //       //    Concat(FoodQuantityMaster.FoodQuantity,' ',(select ConfigurationMaster.ConfigName from ConfigurationMaster where ConfigurationMaster.ConfigId=FoodQuantityMaster.FoodQuantityTypeId)) AS FoodQuantityName,
  //       //    FoodQuantityMaster.UniqueId AS UniqueId, 
  //       //     FoodMaster.Description, 
  //       //     FoodQuantityMaster.Tariff, 
  //       //     FoodMaster.ImageLink, 
  //       //     FoodMaster.ActiveStatus, 
  //       //     FoodMaster.CreatedBy, 
  //       //     FoodMaster.CreatedDate, 
  //       //     FoodMaster.UpdatedBy, 
  //       //     FoodMaster.UpdatedDate 
  //       //     FROM FoodMaster,FoodQuantityMaster,FoodCategoryMaster 
  //       //     WHERE FoodMaster.FoodCategoryId = FoodCategoryMaster.FoodCategoryId 
  //       //     AND FoodMaster.RestaurantId = @RestaurantId 
  //       //     AND FoodQuantityMaster.RestaurantId = @RestaurantId
  //       //     AND FoodMaster.FoodName like '%${req.query.FoodName}%' 
  //       //     AND FoodMaster.FoodId=FoodQuantityMaster.FoodId`)
  //       // .query(
  //       //   `SELECT FoodMaster.RestaurantId, 
  //       //   FoodMaster.FoodCategoryId, 
  //       //   FoodCategoryMaster.FoodCategoryName, 
  //       //   FoodMaster.FoodId, 
  //       //   FoodMaster.FoodName, 
  //       //   FoodMaster.FoodTimingId, 
  //       //   ConfigurationMaster.ConfigId AS FoodQuantityId,
  //       //    ConfigurationMaster.ConfigName AS FoodQuantityName, 
  //       //    FoodMaster.Description, 
  //       //    FoodQuantityMaster.Tariff, 
  //       //    FoodMaster.ImageLink, 
  //       //    FoodMaster.ActiveStatus, 
  //       //    FoodMaster.CreatedBy, 
  //       //    FoodMaster.CreatedDate, 
  //       //    FoodMaster.UpdatedBy, 
  //       //    FoodMaster.UpdatedDate 
  //       //    FROM FoodMaster,FoodQuantityMaster,FoodCategoryMaster,ConfigurationMaster 
  //       //    WHERE FoodMaster.FoodCategoryId = FoodCategoryMaster.FoodCategoryId 
  //       //    AND FoodMaster.RestaurantId = @RestaurantId 
  //       //    AND FoodQuantityMaster.RestaurantId = @RestaurantId 
  //       //    AND FoodMaster.FoodName like '%${req.query.FoodName}%' 
  //       //    AND FoodMaster.FoodId=FoodQuantityMaster.FoodId 
  //       //   `
  //       // );
  //     let response = await pool.query(
  //       `SELECT FoodMaster.RestaurantId, FoodMaster.FoodCategoryId, FoodCategoryMaster.FoodCategoryName, FoodMaster.FoodId, FoodMaster.FoodName, FoodMaster.FoodTimingId, FoodMaster.Description, FoodQuantityMaster.Tariff, FoodMaster.ImageLink, FoodMaster.ActiveStatus, FoodMaster.CreatedBy, FoodMaster.CreatedDate, FoodMaster.UpdatedBy, FoodMaster.UpdatedDate FROM FoodMaster,FoodQuantityMaster,FoodCategoryMaster WHERE FoodMaster.FoodCategoryId = FoodCategoryMaster.FoodCategoryId AND FoodMaster.RestaurantId = ${req.query.RestaurantId} AND FoodQuantityMaster.RestaurantId = ${req.query.RestaurantId} AND FoodMaster.FoodId=FoodQuantityMaster.FoodId AND FoodMaster.FoodName like '%${req.query.FoodName}%'`
  //     );

  //     let timingResult = await pool
  //       .request()
  //       .input("RestaurantId", req.query.RestaurantId)
  //       .query(
  //         `SELECT FoodTimingId FROM FoodTimingMaster WHERE '${req.query.time}' BETWEEN substring(convert(char(8),StartTime,114), 1, 5) AND substring(convert(char(8),EndTime,114), 1, 5)`
  //       );

  //     // var finalData = [...result.recordset, ...response.recordset];
  //     var finalData = [...result.recordset];
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

  async addData(req, res) {
    try {
      if (
        !(
          req.body.RestaurantId &&
          req.body.FoodCategoryId &&
          req.body.FoodName &&
          req.body.CreatedBy
        )
      )
        res.json(commonMsgs.NullMsg);
        else {
          for (let key in req.body) {
                    if (req.body[key]) {
                      if (req.body[key] == "FoodTimingId") {
                        req.body[key].join(",");
                      }
                    }
                  }
          const pool = await poolPromise;
          let result = await pool
                          .request()
                          .input("RestaurantId", req.body.RestaurantId)
                          .input("FoodName", req.body.FoodName)
                          .input("Description",req.body.Description)
                          .input("FoodCategoryId",req.body.FoodCategoryId)
                          .input("ImageLink",req.body.ImageLink)
                          .input("CreatedBy",req.body.CreatedBy)
                          .input("FoodTimingId",req.body.FoodTimingId)
                          .input("FoodToken",req.body.FoodToken)
                          .input("GST",req.body.GST)
                          .input("Cess",req.body.Cess)
                          .input("Rack",req.body.Rack)
                          .execute("addFoodData")
          if (result.recordset[0][""][1] == 1) {
            res.json({status: true, message:result.recordset[0][""][0],data:JSON.parse(result.recordset[0][""][2])});
          }
          else {
            res.json({status: true, message:result.recordset[0][""][0],data:JSON.parse(result.recordset[0][""][2])})
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
  //         req.body.FoodCategoryId &&
  //         req.body.FoodName &&
  //         req.body.CreatedBy
  //       )
  //     )
  //       res.json(commonMsgs.NullMsg);
  //     else {
  //       let ColNameQuery = "ActiveStatus",
  //         ColValueQuery = "'A'";
  //       for (let key in req.body) {
  //         if (req.body[key]) {
  //           if (req.body[key] == "FoodTimingId") {
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
  //           IF NOT EXISTS (SELECT * FROM FoodMaster 
  //              WHERE RestaurantId='${req.body.RestaurantId}' AND FoodName = '${req.body.FoodName}')
  //             BEGIN
  //               INSERT INTO FoodMaster (${ColNameQuery})
  //               VALUES (${ColValueQuery})
  //             END
  //         END`
  //       );

  //       let result2= await pool.query(`
  //         select FoodId,FoodName from FoodMaster where FoodName='${req.body.FoodName}' and FoodCategoryId='${req.body.FoodCategoryId}' and RestaurantId='${req.body.RestaurantId}'
  //         `)
  //       if (result.rowsAffected.length == 0) {
  //           if(result2.recordset.length>0){
  //             res.json({ status: true, message: "Food name already exists!",data:result2.recordset});
  //           }
  //           else{
  //           res.json({ status: false, message: "Food name already exists!",data:result2.recordset});
  //           }
        
  //       } else {
          
  //           res.json({ status: true, message: "Data Added Successfully",data:result2.recordset });
         
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
      const { FoodId, UpdatedBy, RestaurantId } = req.body;
      if (!FoodId || !UpdatedBy || !RestaurantId) return res.json(commonMsgs.NullMsg);
      else {
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .input("FoodId", req.body.FoodId)
                        .input("RestaurantId",req.body.RestaurantId)
                        .input("FoodName",req.body.FoodName)
                        .input("Description",req.body.Description)
                        .input("FoodCategoryId",req.body.FoodCategoryId)
                        .input("ImageLink",req.body.ImageLink)
                        .input("UpdatedBy",req.body.UpdatedBy)
                        .input("FoodTimingId",req.body.FoodTimingId)
                        .input("FoodToken",req.body.FoodToken)
                        .execute("updateFoodData")
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
  //     const { FoodId, UpdatedBy, RestaurantId } = req.body;
  //     if (!FoodId || !UpdatedBy || !RestaurantId) return res.json(commonMsgs.NullMsg);
  //     let queryValue = null;
  //     for (const [key, value] of Object.entries(req.body)) {
  //       if (key != "FoodId")
  //         queryValue == null
  //           ? (queryValue = `${key}='${value}'`)
  //           : (queryValue += `,${key}='${value}'`);
  //     }
  //     const pool = await poolPromise;
  //     let updateResult = await pool
  //     .request()
  //     .input("Description", req.body.Description)
  //     .input("FoodName", req.body.FoodName)
  //     .input("RestaurantId", req.body.RestaurantId)
  //     .input("FoodCategoryId", req.body.FoodCategoryId)
  //     .input("FoodId", req.body.FoodId)
  //     .input("FoodTimingId", req.body.FoodTimingId)
  //     .input("UpdatedBy", req.body.UpdatedBy)
  //     .input("ImageLink",req.body.ImageLink)
  //     .input("FoodToken",req.body.FoodToken)
  //     .query(
  //         `BEGIN
  //           IF NOT EXISTS (SELECT * FROM FoodMaster 
  //             WHERE FoodId !='${req.body.FoodId}' AND FoodName= '${req.body.FoodName}' and FoodCategoryId='${req.body.FoodCategoryId}' AND RestaurantId='${req.body.RestaurantId}')
  //           BEGIN
  //             UPDATE FoodMaster SET ImageLink=@ImageLink,Description = @Description,FoodName = @FoodName,RestaurantId=@RestaurantId,FoodCategoryId=@FoodCategoryId,FoodTimingId=@FoodTimingId,UpdatedBy=@UpdatedBy,UpdatedDate = GETDATE(),FoodToken=@FoodToken  WHERE FoodId = ${FoodId}
  //           END
  //         END`

  //       // `UPDATE FoodMaster SET ${queryValue}, UpdatedDate = GETDATE()  WHERE FoodId = ${FoodId}`
  //     );

  //     if (updateResult.rowsAffected.length == 0) {
  //       res.json({ status: false, message: "Food name already exists!" });
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
    const { ActiveStatus, FoodId } = req.query;
    try {
      if (!FoodId || !ActiveStatus) return res.json(commonMsgs.NullMsg);
      else {
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .input("ActiveStatus", req.query.ActiveStatus)
                        .input("FoodId", req.query.FoodId)
                        .execute("deleteFoodData")
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
  //   const { ActiveStatus, FoodId } = req.query;
  //   try {
  //     if (!FoodId || !ActiveStatus) return res.json(commonMsgs.NullMsg);
  //     const pool = await poolPromise;
  //     await pool.query(
  //       `UPDATE FoodMaster SET ActiveStatus = '${ActiveStatus}' WHERE FoodId = '${FoodId}'`
  //     );
  //     res.json(commonMsgs.deleteMsg);
  //   } catch (error) {
  //     errorHandle.handleError(error, errorRes => {
  //       res.send(errorRes);
  //     });
  //   }
  // }
}

function matchFoodTimingId(finalresultData, timingData) {
  // let newArray = [];
  // let timeId = timingData[0].FoodTimingId.toString();
  // for (let i = 0; i < finalresultData.length; i++) {
  //   let timingArr = finalresultData[i].FoodTimingId.split(",");
  //   timingArr = timingArr.filter(e => {
  //     return e != "";
  //   });
  //   if (timingArr.includes(timeId)) {
  //     newArray.push(finalresultData[i]);
  //   }
  // }
  return finalresultData;
}

function filterFoodItems(foodItemArr, callback) {
  const key = "FoodId";
  const arrayUniqueByKey = [
    ...new Map(foodItemArr.map(item => [item[key], item])).values()
  ];
  callback(arrayUniqueByKey);
}

const foodMaster = new FoodMasterController();

module.exports = foodMaster;



// const errorHandle = require("../services/errorHandler");
// const commonMsgs = require("../CommonMsg.json");
// const { poolPromise, sql } = require("../db");
// const async = require("async");

// class FoodMasterController {
//   async getData(req, res) {
//     try {
//       if (!req.query.FoodId) res.json(commonMsgs.NullMsg);
//       else {
//         const pool = await poolPromise;
//         let result = await pool.query(
//           `select * from FoodMaster where FoodId= ${req.query.FoodId} AND ActiveStatus='A'`
//         );
//         res.json({ status: true, data: result.recordset });
//       }
//     } catch (error) {
//       errorHandle.handleError(error, errorRes => {
//         res.send(errorRes);
//       });
//     }
//   }

//   async getDataByResId(req, res) {
//     try {
//       if (!req.query.RestaurantId) res.json(commonMsgs.NullMsg);
//       else {
//         const pool = await poolPromise;
//         let result = await pool
//           .request()
//           .input("RestaurantId", req.query.RestaurantId)
//           .query(
//             `SELECT FoodMaster.RestaurantId, FoodMaster.FoodCategoryId, FoodCategoryMaster.FoodCategoryName, FoodMaster.FoodId, FoodMaster.Description, FoodMaster.FoodName,FoodMaster.FoodTimingId, FoodMaster.ImageLink, FoodMaster.ActiveStatus, FoodMaster.CreatedBy, FoodMaster.CreatedDate, FoodMaster.UpdatedBy, FoodMaster.UpdatedDate FROM FoodMaster INNER JOIN FoodCategoryMaster ON FoodMaster.FoodCategoryId = FoodCategoryMaster.FoodCategoryId where FoodMaster.RestaurantId = @RestaurantId`
//           );
//         res.json({ status: true, data: result.recordset });
//       }
//     } catch (error) {
//       errorHandle.handleError(error, errorRes => {
//         res.send(errorRes);
//       });
//     }
//   }

//   async getAllFoodData(req, res) {
//     try {
//       if (!req.query.RestaurantId) res.json(commonMsgs.NullMsg);
//       else {
//         const pool = await poolPromise;
//         let result = await pool
//           .request()
//           .input("RestaurantId", req.query.RestaurantId)
//           .query(
//             `SELECT FoodMaster.FoodName, FoodMaster.FoodId, FoodMaster.ImageLink, FoodMaster.FoodCategoryId, FoodCategoryMaster.FoodCategoryName FROM FoodMaster INNER JOIN FoodCategoryMaster ON FoodMaster.FoodCategoryId = FoodCategoryMaster.FoodCategoryId WHERE FoodMaster.RestaurantId = @RestaurantId AND FoodMaster.ActiveStatus = 'A'`
//           );
//         res.json({ status: true, data: result.recordset });
//       }
//     } catch (error) {
//       errorHandle.handleError(error, errorRes => {
//         res.send(errorRes);
//       });
//     }
//   }

//   async getAllFoodDataByFoodCategoryId(req, res) {
//     try {
//       if (!req.query.RestaurantId && !req.query.FoodCategoryId)
//         res.json(commonMsgs.NullMsg);
//       const pool = await poolPromise;
//       const result = await pool
//         .request()
//         .input("RestaurantId", req.query.RestaurantId)
//         .input("FoodCategoryId", req.query.FoodCategoryId)
//         .query(
//           `SELECT FoodMaster.RestaurantId, FoodMaster.FoodCategoryId, FoodCategoryMaster.FoodCategoryName, FoodMaster.FoodId, FoodMaster.FoodName, FoodMaster.FoodTimingId, FoodMaster.Description, FoodMaster.ImageLink, FoodMaster.ActiveStatus, FoodMaster.CreatedBy, FoodMaster.CreatedDate  FROM FoodMaster,FoodCategoryMaster WHERE FoodMaster.FoodCategoryId = FoodCategoryMaster.FoodCategoryId AND FoodMaster.RestaurantId = @RestaurantId AND FoodMaster.FoodCategoryId=@FoodCategoryId`
//         );
//       let response = await pool.query(
//         `SELECT FoodMaster.RestaurantId, FoodMaster.FoodCategoryId, FoodCategoryMaster.FoodCategoryName, FoodMaster.FoodId, FoodMaster.FoodName, FoodMaster.FoodTimingId, FoodMaster.Description, FoodMaster.ImageLink, FoodMaster.ActiveStatus, FoodMaster.CreatedBy, FoodMaster.CreatedDate FROM FoodMaster,FoodQuantityMaster, FoodCategoryMaster WHERE FoodMaster.FoodCategoryId = FoodCategoryMaster.FoodCategoryId AND FoodMaster.RestaurantId = ${req.query.RestaurantId} AND FoodQuantityMaster.RestaurantId = ${req.query.RestaurantId} AND FoodMaster.FoodCategoryId=${req.query.FoodCategoryId} AND FoodMaster.FoodId=FoodQuantityMaster.FoodId`
//       );
//       var finalData = [...result.recordset, ...response.recordset];
//       if (finalData.length > 0) {
//         filterFoodItems(finalData, response => {
//           res.json({ status: true, response });
//         });
//       } else {
//         res.json({ status: true, message: "No data Found!" });
//       }
//     } catch (error) {
//       errorHandle.handleError(error, errorRes => {
//         res.send(errorRes);
//       });
//     }
//   }

//   async getFoodDataByFoodCategoryId(req, res) {
//     try {
//       if (!req.query.RestaurantId && !req.query.FoodCategoryId)
//         res.json(commonMsgs.NullMsg);
//       const pool = await poolPromise;
//       const result = await pool
//         .request()
//         .input("RestaurantId", req.query.RestaurantId)
//         .input("FoodCategoryId", req.query.FoodCategoryId)
//         .query(
//           `SELECT FoodMaster.RestaurantId, FoodMaster.FoodCategoryId, FoodCategoryMaster.FoodCategoryName, FoodMaster.FoodId, FoodMaster.FoodName, FoodMaster.FoodTimingId, ConfigurationMaster.ConfigId AS FoodQuantityId, ConfigurationMaster.ConfigName AS FoodQuantityName, FoodMaster.Description, FoodQuantityMaster.Tariff, FoodMaster.ImageLink, FoodMaster.ActiveStatus, FoodMaster.CreatedBy, FoodMaster.CreatedDate, FoodMaster.UpdatedBy, FoodMaster.UpdatedDate FROM FoodMaster,FoodQuantityMaster,FoodCategoryMaster,ConfigurationMaster WHERE FoodMaster.FoodCategoryId = FoodCategoryMaster.FoodCategoryId AND FoodMaster.RestaurantId = @RestaurantId AND FoodQuantityMaster.RestaurantId = @RestaurantId AND FoodMaster.FoodCategoryId=@FoodCategoryId AND FoodMaster.FoodId=FoodQuantityMaster.FoodId AND FoodQuantityMaster.FoodQuantityId = ConfigurationMaster.ConfigId`
//         );
//       let response = await pool.query(
//         `SELECT FoodMaster.RestaurantId, FoodMaster.FoodCategoryId, FoodCategoryMaster.FoodCategoryName, FoodMaster.FoodId, FoodMaster.FoodName, FoodMaster.FoodTimingId, FoodMaster.Description, FoodQuantityMaster.Tariff, FoodMaster.ImageLink, FoodMaster.ActiveStatus, FoodMaster.CreatedBy, FoodMaster.CreatedDate, FoodMaster.UpdatedBy, FoodMaster.UpdatedDate FROM FoodMaster,FoodQuantityMaster,FoodCategoryMaster WHERE FoodMaster.FoodCategoryId = FoodCategoryMaster.FoodCategoryId AND FoodMaster.RestaurantId = ${req.query.RestaurantId} AND FoodQuantityMaster.RestaurantId = ${req.query.RestaurantId} AND FoodMaster.FoodCategoryId=${req.query.FoodCategoryId} AND FoodMaster.FoodId=FoodQuantityMaster.FoodId AND FoodQuantityMaster.FoodQuantityId IS NULL`
//       );

//       let timingResult = await pool
//         .request()
//         .input("RestaurantId", req.query.RestaurantId)
//         .query(
//           `SELECT FoodTimingId FROM FoodTimingMaster WHERE '${req.query.time}' BETWEEN substring(convert(char(8),StartTime,114), 1, 5) AND substring(convert(char(8),EndTime,114), 1, 5)`
//         );

//       var finalData = [...result.recordset, ...response.recordset];
//       if (finalData.length > 0) {
//         let data = [],
//           asyncArr = [];
//         const pool = await poolPromise;
//         finalData.map((value, index) => {
//           asyncArr.push(next => {
//             pool
//               .request()
//               .input("Date", req.query.Date)
//               .query(
//                 `select TaxId, ServiceName, TaxDescription, TaxPercentage, RefNumber FROM TaxMaster WHERE ActiveStatus = 'A' AND ServiceName = 'Restaurant'`,
//                 (error, TaxResult) => {
//                   if (error) next(null, null);
//                   data.push({ ...value, TaxResult: TaxResult.recordset });
//                   next(null, null);
//                 }
//               );
//           });
//         });
//         async.parallel(asyncArr, (err, result) => {
//           if (err) {
//             errorHandle.handleError(err, errorRes => {
//               res.send(errorRes);
//             });
//           } else {
//             let finalResult = matchFoodTimingId(data, timingResult.recordset);
//             res.json({ status: true, data: finalResult });
//           }
//         });
//       } else {
//         res.json({ status: true, message: "No data Found!" });
//       }
//     } catch (error) {
//       errorHandle.handleError(error, errorRes => {
//         res.send(errorRes);
//       });
//     }
//   }


//   async getFoodDataByFoodName(req, res) {
//     try {
//       if (!req.query.RestaurantId && !req.query.FoodName)
//         res.json(commonMsgs.NullMsg);
//       const pool = await poolPromise;
//       const result = await pool
//         .request()
//         .input("RestaurantId", req.query.RestaurantId)
//         .input("FoodName", req.query.FoodName)
//         .query(
//           `SELECT FoodMaster.RestaurantId, FoodMaster.FoodCategoryId, FoodCategoryMaster.FoodCategoryName, FoodMaster.FoodId, FoodMaster.FoodName, FoodMaster.FoodTimingId, ConfigurationMaster.ConfigId AS FoodQuantityId, ConfigurationMaster.ConfigName AS FoodQuantityName, FoodMaster.Description, FoodQuantityMaster.Tariff, FoodMaster.ImageLink, FoodMaster.ActiveStatus, FoodMaster.CreatedBy, FoodMaster.CreatedDate, FoodMaster.UpdatedBy, FoodMaster.UpdatedDate FROM FoodMaster,FoodQuantityMaster,FoodCategoryMaster,ConfigurationMaster WHERE FoodMaster.FoodCategoryId = FoodCategoryMaster.FoodCategoryId AND FoodMaster.RestaurantId = @RestaurantId AND FoodQuantityMaster.RestaurantId = @RestaurantId AND FoodMaster.FoodName like '%${req.query.FoodName}%' AND FoodMaster.FoodId=FoodQuantityMaster.FoodId AND FoodQuantityMaster.FoodQuantityId = ConfigurationMaster.ConfigId`
//         );
//       let response = await pool.query(
//         `SELECT FoodMaster.RestaurantId, FoodMaster.FoodCategoryId, FoodCategoryMaster.FoodCategoryName, FoodMaster.FoodId, FoodMaster.FoodName, FoodMaster.FoodTimingId, FoodMaster.Description, FoodQuantityMaster.Tariff, FoodMaster.ImageLink, FoodMaster.ActiveStatus, FoodMaster.CreatedBy, FoodMaster.CreatedDate, FoodMaster.UpdatedBy, FoodMaster.UpdatedDate FROM FoodMaster,FoodQuantityMaster,FoodCategoryMaster WHERE FoodMaster.FoodCategoryId = FoodCategoryMaster.FoodCategoryId AND FoodMaster.RestaurantId = ${req.query.RestaurantId} AND FoodQuantityMaster.RestaurantId = ${req.query.RestaurantId} AND FoodMaster.FoodId=FoodQuantityMaster.FoodId AND FoodMaster.FoodName like '%${req.query.FoodName}%'`
//       );

//       let timingResult = await pool
//         .request()
//         .input("RestaurantId", req.query.RestaurantId)
//         .query(
//           `SELECT FoodTimingId FROM FoodTimingMaster WHERE '${req.query.time}' BETWEEN substring(convert(char(8),StartTime,114), 1, 5) AND substring(convert(char(8),EndTime,114), 1, 5)`
//         );

//       // var finalData = [...result.recordset, ...response.recordset];
//       var finalData = [...result.recordset];
//       if (finalData.length > 0) {
//         let data = [],
//           asyncArr = [];
//         const pool = await poolPromise;
//         finalData.map((value, index) => {
//           asyncArr.push(next => {
//             pool
//               .request()
//               .input("Date", req.query.Date)
//               .query(
//                 `select TaxId, ServiceName, TaxDescription, TaxPercentage, RefNumber FROM TaxMaster WHERE ActiveStatus = 'A' AND ServiceName = 'Restaurant'`,
//                 (error, TaxResult) => {
//                   if (error) next(null, null);
//                   data.push({ ...value, TaxResult: TaxResult.recordset });
//                   next(null, null);
//                 }
//               );
//           });
//         });
//         async.parallel(asyncArr, (err, result) => {
//           if (err) {
//             errorHandle.handleError(err, errorRes => {
//               res.send(errorRes);
//             });
//           } else {
//             let finalResult = matchFoodTimingId(data, timingResult.recordset);
//             res.json({ status: true, data: finalResult });
//           }
//         });
//       } else {
//         res.json({ status: true, message: "No data Found!" });
//       }
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
//           req.body.FoodCategoryId &&
//           req.body.FoodName &&
//           req.body.ImageLink &&
//           req.body.CreatedBy
//         )
//       )
//         res.json(commonMsgs.NullMsg);
//       else {
//         let ColNameQuery = "ActiveStatus",
//           ColValueQuery = "'A'";
//         for (let key in req.body) {
//           if (req.body[key]) {
//             if (req.body[key] == "FoodTimingId") {
//               req.body[key].join(",");
//             }
//             ColNameQuery += `${ColNameQuery != `` ? `,` : ``}${key}`;
//             ColValueQuery += `${ColValueQuery != `` ? `,` : ``}'${
//               req.body[key]
//             }'`;
//           }
//         }
//         const pool = await poolPromise;
//         let result = await pool.query(
//           // `INSERT INTO FoodMaster(${ColNameQuery}) VALUES(${ColValueQuery})`
//           `BEGIN
//             IF NOT EXISTS (SELECT * FROM FoodMaster 
//                WHERE RestaurantId='${req.body.RestaurantId}' AND FoodName = '${req.body.FoodName}')
//             BEGIN
//               INSERT INTO FoodMaster (${ColNameQuery})
//               VALUES (${ColValueQuery})
//             END
//           END`
//         );
//         if (result.rowsAffected.length == 0) {
//           res.json({ status: false, message: "Food name already exists!" });
//         } else {
//           res.json(commonMsgs.AddMsg);
//         }
//       }
//     } catch (error) {
//       errorHandle.handleError(error, errorRes => {
//         res.send(errorRes);
//       });
//     }
//   }

//   async updateData(req, res) {
//     try {
//       const { FoodId, UpdatedBy, RestaurantId } = req.body;
//       if (!FoodId || !UpdatedBy || !RestaurantId) return res.json(commonMsgs.NullMsg);
//       let queryValue = null;
//       for (const [key, value] of Object.entries(req.body)) {
//         if (key != "FoodId")
//           queryValue == null
//             ? (queryValue = `${key}='${value}'`)
//             : (queryValue += `,${key}='${value}'`);
//       }
//       const pool = await poolPromise;
//       let updateResult = await pool
//       .request()
//       .input("Description", req.body.Description)
//       .input("FoodName", req.body.FoodName)
//       .input("RestaurantId", req.body.RestaurantId)
//       .input("FoodCategoryId", req.body.FoodCategoryId)
//       .input("FoodId", req.body.FoodId)
//       .input("FoodTimingId", req.body.FoodTimingId)
//       .input("UpdatedBy", req.body.UpdatedBy)
//       .input("ImageLink",req.body.ImageLink)
//       .query(
//           `BEGIN
//             IF NOT EXISTS (SELECT * FROM FoodMaster 
//               WHERE FoodId !='${req.body.FoodId}' AND FoodName= '${req.body.FoodName}' and FoodCategoryId='${req.body.FoodCategoryId}' AND RestaurantId='${req.body.RestaurantId}')
//             BEGIN
//               UPDATE FoodMaster SET ImageLink=@ImageLink,Description = @Description,FoodName = @FoodName,RestaurantId=@RestaurantId,FoodCategoryId=@FoodCategoryId,FoodTimingId=@FoodTimingId,UpdatedBy=@UpdatedBy,UpdatedDate = GETDATE()  WHERE FoodId = ${FoodId}
//             END
//           END`

//         // `UPDATE FoodMaster SET ${queryValue}, UpdatedDate = GETDATE()  WHERE FoodId = ${FoodId}`
//       );

//       if (updateResult.rowsAffected.length == 0) {
//         res.json({ status: false, message: "Food name already exists!" });
//       } else {
//         res.json(commonMsgs.updateMsg);
//       }
//     } catch (error) {
//       errorHandle.handleError(error, errorRes => {
//         res.send(errorRes);
//       });
//     }
//   }

//   async deleteData(req, res) {
//     const { ActiveStatus, FoodId } = req.query;
//     try {
//       if (!FoodId || !ActiveStatus) return res.json(commonMsgs.NullMsg);
//       const pool = await poolPromise;
//       await pool.query(
//         `UPDATE FoodMaster SET ActiveStatus = '${ActiveStatus}' WHERE FoodId = '${FoodId}'`
//       );
//       res.json(commonMsgs.deleteMsg);
//     } catch (error) {
//       errorHandle.handleError(error, errorRes => {
//         res.send(errorRes);
//       });
//     }
//   }
// }

// function matchFoodTimingId(finalresultData, timingData) {
//   // let newArray = [];
//   // let timeId = timingData[0].FoodTimingId.toString();
//   // for (let i = 0; i < finalresultData.length; i++) {
//   //   let timingArr = finalresultData[i].FoodTimingId.split(",");
//   //   timingArr = timingArr.filter(e => {
//   //     return e != "";
//   //   });
//   //   if (timingArr.includes(timeId)) {
//   //     newArray.push(finalresultData[i]);
//   //   }
//   // }
//   return finalresultData;
// }

// function filterFoodItems(foodItemArr, callback) {
//   const key = "FoodId";
//   const arrayUniqueByKey = [
//     ...new Map(foodItemArr.map(item => [item[key], item])).values()
//   ];
//   callback(arrayUniqueByKey);
// }

// const foodMaster = new FoodMasterController();

// module.exports = foodMaster;
