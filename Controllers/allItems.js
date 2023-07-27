const errorHandle = require("../services/errorHandler");
const commonMsgs = require("../CommonMsg.json");
const { poolPromise, sql } = require("../db");
const async = require("async");

class AllItemsController {
  async getAllFoodIdByRestaurantId(req, res) {
    try {
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .input("RestaurantId", req.query.RestaurantId)
                        .execute("getAllFoodIdByRestaurantId")
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

  async getData(req, res) {
    try {
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .input("RestaurantId", req.query.RestaurantId)
                        .execute("getDataAllitems")
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
    //     try {
    //         if (!req.query.RestaurantId) res.json(commonMsgs.NullMsg);
    //         else {
    //           const pool = await poolPromise;
    //           let result = await pool.query(
    //             `SELECT fm.*,fcm.FoodCategoryName,fq.FoodQuantityId,(cm.ConfigName) AS FoodQuantityName,fq.Tariff,(select TaxId, ServiceName, TaxDescription, TaxPercentage, RefNumber FROM TaxMaster WHERE ActiveStatus = 'A' AND ServiceName = 'Restaurant' FOR JSON PATH) AS TaxResult
    //                 FROM FoodMaster AS fm
    //                 INNER JOIN FoodCategoryMaster AS fcm
    //                 ON fcm.FoodCategoryId=fm.FoodCategoryId
    //                 INNER JOIN FoodQuantityMaster AS fq
    //                 ON fq.FoodId=fm.FoodId
    //                 INNER JOIN ConfigurationMaster AS cm
    //                 ON cm.ConfigId=fq.FoodQuantityId
    //                 WHERE fm.RestaurantId=${req.query.RestaurantId} AND fm.FoodId IN (SELECT FoodId FROM AllItems WHERE RestaurantId=${req.query.RestaurantId} AND ActiveStatus='A')`
    //           );
    //           if (result.recordset.length > 0) {
    //             let sendingData = [... result.recordset]
    //             for( let eachData of sendingData) {
    //                 if (eachData.TaxResult != null) {
    //                     eachData.TaxResult = JSON.parse(eachData.TaxResult)
    //                 }
    //                 else {
    //                     eachData.TaxResult = []
    //                 }
    //             }
    //             res.json({ status: true, data: sendingData })
                
    //           } else {
    //             res.json({ status: true, data: [] });
    //           }
    //         }
    //       } catch (error) {
    //         errorHandle.handleError(error, errorRes => {
    //           res.send(errorRes);
    //         });
    //       }
    // } 

    async addData(req, res) {
      try {
        if (
          !(req.body.RestaurantId && req.body.ItemDetails && req.body.CreatedBy)
        )
          res.json(commonMsgs.NullMsg);
        else {
          const pool = await poolPromise;
          let result = await pool
                          .request()
                          .input("RestaurantId", req.body.RestaurantId)
                          .input("CreatedBy", req.body.CreatedBy)
                          .input("ItemDetails",JSON.stringify(req.body.ItemDetails))
                          .execute("addAllItems")
          if (result.recordset[0][""][1] == 1) {
            res.json(commonMsgs.AddMsg);
          }
          else {
            res.status({status: false, message:result.recordset[0][""][0]})
          }
          }
          
      //   }
      } 
      catch (error) {
        errorHandle.handleError(error, errorRes => {
          res.send(errorRes);
        });
      }
    }
  
    async updateData(req, res) {
      try {
        if (
          !(req.body.RestaurantId && req.body.ItemDetails && req.body.UpdatedBy)
        )
          res.json(commonMsgs.NullMsg);
        else {
          const pool = await poolPromise;
          let result = await pool
                          .request()
                          .input("RestaurantId", req.body.RestaurantId)
                          .input("UpdatedBy", req.body.UpdatedBy)
                          .input("ItemDetails",JSON.stringify(req.body.ItemDetails))
                          .execute("updateAllItems")
          
          if (result.recordset[0][""][1] == 1) {
            res.json(commonMsgs.updateMsg);
          }
          else {
            res.status({status: false, message:result.recordset[0][""][0]})
          }             
         
          }
          
      //   }
      } 
      catch (error) {
        errorHandle.handleError(error, errorRes => {
          res.send(errorRes);
        });
      }
    }
    
    
  
  
  // async addData(req, res) {
  //   try {
  //     if (
  //       !(req.body.RestaurantId && req.body.FoodItems  && req.body.CreatedBy)
  //     )
  //       res.json(commonMsgs.NullMsg);
  //     else {
  //       const pool = await poolPromise;
  //       let Result=[];
  //       for (let i of req.body["FoodItems"]){
  //           Result= await pool.query(`BEGIN
  //                                       IF NOT EXISTS(SELECT * FROM AllItems WHERE FoodId=${i} AND RestaurantId=${req.body.RestaurantId} AND ActiveStatus='A')
  //                                           BEGIN
  //                                               INSERT INTO AllItems (RestaurantId,FoodId,ActiveStatus,CreatedBy,CreatedDate) VALUES (${req.body.RestaurantId},${i},'A',${req.body.CreatedBy},GETDATE())
  //                                           END
  //                                       END`);
                                            

  //       }
  //       res.json(commonMsgs.AddMsg);
  //       }
        
  //   //   }
  //   } 
  //   catch (error) {
  //     errorHandle.handleError(error, errorRes => {
  //       res.send(errorRes);
  //     });
  //   }
  // }

  // async updateData(req, res) {
  //   try {
  //     if (
  //       !(req.body.RestaurantId && req.body.FoodItems  && req.body.UpdatedBy)
  //     )
  //       res.json(commonMsgs.NullMsg);
  //     else {
  //       const pool = await poolPromise;
  //       let FoodIds=[];
  //       for (let i of req.body["FoodItems"]){
  //         let obj={}
  //           obj["FoodId"]=i
  //           FoodIds.push(obj)
  //       }
  //       console.log("FoodIds",FoodIds)
  //       let result = await pool
  //                       .request()
  //                       .input("RestaurantId", req.body.RestaurantId)
  //                       .input("UpdatedBy", req.body.UpdatedBy)
  //                       .input("FoodIds",JSON.stringify(FoodIds))
  //                       .execute("updateAllItems")
  //       console.log("result",result)
  //       if (result.recordset[0][""][1] == 1) {
  //         res.json(commonMsgs.updateMsg);
  //       }
  //       else {
  //         res.status({status: false, message:result.recordset[0][""][0]})
  //       }             
       
  //       }
        
  //   //   }
  //   } 
  //   catch (error) {
  //     errorHandle.handleError(error, errorRes => {
  //       res.send(errorRes);
  //     });
  //   }
  // }
  
  

}




const AllItems = new AllItemsController();

module.exports = AllItems;
