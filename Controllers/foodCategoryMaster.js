const errorHandle = require("../services/errorHandler");
const commonMsgs = require("../CommonMsg.json");
const { poolPromise, sql } = require("../db");
const async = require("async");

class FoodCategoryMasterController {
  async getData(req, res) {
    try {
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .input("FoodCategoryId", req.query.FoodCategoryId)
                        .execute("getFoodDataByCategory")
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
  //     if (!req.query.FoodCategoryId) res.json(commonMsgs.NullMsg);
  //     else {
  //       const pool = await poolPromise;
  //       let result = await pool.query(
  //         `select * from FoodMaster where FoodCategoryId= ${req.query.FoodCategoryId} AND ActiveStatus='A'`
  //       );
  //       res.json({ status: true, data: result.recordset });
  //     }
  //   } catch (error) {
  //     errorHandle.handleError(error, errorRes => {
  //       res.send(errorRes);
  //     });
  //   }
  // }
  async getDataByCategoryTypeId(req, res) {
    try {
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .input("RestaurantId", req.query.RestaurantId)
                        .execute("getDataByCategoryTypeId")
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
  // async getDataByCategoryTypeId(req, res) {
  //   try {
  //     if (!req.query.RestaurantId) res.json(commonMsgs.NullMsg);
  //     else {
  //       const pool = await poolPromise;
  //       let result = await pool.query(
  //         `SELECT DISTINCT cm.ConfigName AS CategoryTypeName,cm.ConfigId AS CategoryTypeId
  //         FROM ConfigurationMaster AS cm
  //         INNER JOIN ConfigurationType AS ct
  //         ON ct.TypeId=cm.TypeId
  //         WHERE cm.TypeId=2078`
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
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .input("RestaurantId", req.query.RestaurantId)
                        .input("CategoryTypeId",req.query.CategoryTypeId ? req.query.CategoryTypeId : null)
                        .execute("getFoodCategoryDataByResId")
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
  // async getDataByResId(req, res) {
  //   try {
  //     if (!req.query.RestaurantId) res.json(commonMsgs.NullMsg);
  //     else {
  //       async.waterfall(
  //         [
  //           function(callback) {
  //             getFoodCategoryDetails(req.query.RestaurantId, req.query.CategoryTypeId,foodCategory => {
  //               callback(null, foodCategory);
  //             });
  //           },
  //         ],
  //         function(err, result) {
  //           if (err) {
  //             return res.json({ status: false, data: [] });
  //           }
  //           res.json({ status: true, data: result });
  //         }
  //       );
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
          req.body.FoodCategoryName &&
          req.body.CreatedBy
        )
      )
        res.json(commonMsgs.NullMsg);
      else {
          const pool = await poolPromise;
          let result = await pool
                          .request()
                          .input("RestaurantId", req.body.RestaurantId)
                          .input("FoodCategoryName", req.body.FoodCategoryName)
                          .input("CategoryTypeId",req.body.CategoryTypeId)
                          .input("CreatedBy",req.body.CreatedBy)
                          .execute("addFoodCategoryData")
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
  //         // req.body.CategoryTypeId &&
  //         req.body.FoodCategoryName &&
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
  //       let result = await pool.query(
  //         `BEGIN
  //               IF NOT EXISTS (SELECT * FROM FoodCategoryMaster 
  //                  WHERE RestaurantId='${req.body.RestaurantId}' AND FoodCategoryName = '${req.body.FoodCategoryName}')
  //               BEGIN
  //                 INSERT INTO FoodCategoryMaster (${ColNameQuery})
  //                 VALUES (${ColValueQuery})
  //               END
  //             END`
  //       );
  //       if (result.rowsAffected.length == 0) {
  //         res.json({
  //           status: false,
  //           message: "Food category name already exists!"
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

  async updateFoodCategoryData(req, res) {
    try {
      const { FoodCategoryId, RestaurantId, UpdatedBy, CategoryTypeId } = req.body;
      if (!FoodCategoryId || !RestaurantId || !UpdatedBy || !CategoryTypeId)
        return res.json(commonMsgs.NullMsg);
      else {
          const pool = await poolPromise;
          let result = await pool
                          .request()
                          .input("FoodCategoryId", req.body.FoodCategoryId)
                          .input("RestaurantId",req.body.RestaurantId)
                          .input("FoodCategoryName",req.body.FoodCategoryName)
                          .input("CategoryTypeId",req.body.CategoryTypeId)
                          .input("UpdatedBy",req.body.UpdatedBy)
                          .execute("updateFoodCategoryData")
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

  // async updateFoodCategoryData(req, res) {
  //   try {
  //     const { FoodCategoryId, RestaurantId, UpdatedBy, CategoryTypeId } = req.body;
  //     if (!FoodCategoryId || !RestaurantId || !UpdatedBy || !CategoryTypeId)
  //       return res.json(commonMsgs.NullMsg);
  //     let queryValue = null;
  //     for (const [key, value] of Object.entries(req.body)) {
  //       if (key != "FoodCategoryId")
  //         queryValue == null
  //           ? (queryValue = `${key}='${value}'`)
  //           : (queryValue += `,${key}='${value}'`);
  //     }
  //     const pool = await poolPromise;
  //     let result = await pool.query(
  //       `IF NOT EXISTS(SELECT * FROM FoodCategoryMaster WHERE FoodCategoryId != ${FoodCategoryId} AND RestaurantId = ${RestaurantId} AND FoodCategoryName = '${req.body.FoodCategoryName}' AND CategoryTypeId=${req.body.CategoryTypeId}) UPDATE FoodCategoryMaster SET ${queryValue}, UpdatedDate = GETDATE() WHERE FoodCategoryId = ${FoodCategoryId} AND RestaurantId = ${RestaurantId}`
  //     );
  //     if (result.rowsAffected.length == 0) throw "FoodCategoryName Already Exists!"
  //     res.json(commonMsgs.updateMsg);
  //   } catch (error) {
  //     errorHandle.handleError(error, errorRes => {
  //       res.send(errorRes);
  //     });
  //   }
  // }

  async deleteData(req, res) {
    const { ActiveStatus, FoodCategoryId } = req.query;
    try {
      if (!FoodCategoryId || !ActiveStatus) return res.json(commonMsgs.NullMsg);
      else {
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .input("ActiveStatus", req.query.ActiveStatus)
                        .input("FoodCategoryId", req.query.FoodCategoryId)
                        .execute("deleteFoodCategoryData")
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
  //   const { ActiveStatus, FoodCategoryId } = req.query;
  //   try {
  //     if (!FoodCategoryId || !ActiveStatus) return res.json(commonMsgs.NullMsg);
  //     const pool = await poolPromise;
  //     await pool.query(
  //       `UPDATE FoodCategoryMaster SET ActiveStatus = '${ActiveStatus}' WHERE FoodCategoryId = '${FoodCategoryId}'; UPDATE FoodMaster SET ActiveStatus = '${ActiveStatus}' WHERE FoodCategoryId = '${FoodCategoryId}'`
  //     );
  //     res.json(commonMsgs.deleteMsg);
  //   } catch (error) {
  //     errorHandle.handleError(error, errorRes => {
  //       res.send(errorRes);
  //     });
  //   }
  // }
}

async function getFoodCategoryDetails(RestaurantId,CategoryTypeId, callback) {
  const pool = await poolPromise;
  // console.log( ` get category data select * from FoodCategoryMaster where RestaurantId= ${RestaurantId} ${CategoryTypeId ? 'AND CategoryTypeId = '+CategoryTypeId : ''}`)
  let result = await pool.query(
   `select *,
    (SELECT TOP 1 cm.ConfigName FROM ConfigurationMaster as cm WHERE cm.ConfigId = fcm.CategoryTypeId) as ConfigTypeName,
    (CASE WHEN 'Y' IN (SELECT fqm.StockAvailable From FoodQuantityMaster AS fqm WHERE fqm.FoodCategoryId=fcm.FoodCategoryId)
			THEN 'Y'
			ELSE
				'N'
			END) AS StockAvailable
    from FoodCategoryMaster as fcm 
    where fcm.RestaurantId= ${RestaurantId} ${CategoryTypeId ? 'AND fcm.CategoryTypeId = '+CategoryTypeId : ''}`
    // `select *,(SELECT TOP 1 cm.ConfigName FROM ConfigurationMaster as cm WHERE cm.ConfigId = fcm.CategoryTypeId) as ConfigTypeName from FoodCategoryMaster as fcm where fcm.RestaurantId= ${RestaurantId} ${CategoryTypeId ? 'AND fcm.CategoryTypeId = '+CategoryTypeId : ''}`
  );
  callback(result.recordset);
}



const foodCategoryMaster = new FoodCategoryMasterController();

module.exports = foodCategoryMaster;
