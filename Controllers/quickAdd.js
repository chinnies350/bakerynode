const errorHandle = require("../services/errorHandler");
const commonMsgs = require("../CommonMsg.json");
const { poolPromise, sql } = require("../db");

class QuickAddController {

  async getData(req, res) {
    try {
      if (!req.query.FoodId) res.json(commonMsgs.NullMsg);
      else {
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .input("FoodId", req.query.FoodId)
                        .execute("getQuickAddData")
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
  //         `SELECT fqm.UniqueId,
  //         fqm.FoodId,
  //         fqm.FoodQuantity,
  //         fqm.FoodQuantityTypeId,
  //         fqm.Tariff,
  //         fm.FoodName,
  //         fm.FoodCategoryId,
  //         fm.FoodToken,
  //         fm.GST,
  //         fm.Cess,
  //         fm.Rack,
  //         fcm.FoodCategoryName,
  //         fcm.CategoryTypeId,
  //         cm.ConfigName AS CategoryTypeName,
  //         sm.ReceivedQty,
  //         sm.TotalAmt,
  //         sm.StockId,
  //         sm.ExpDate,
  //         sm.MfgDate,
  //         sm.BarcodeValue,
  //         sm.LowStock,
  //         (SELECT ConfigName FROM ConfigurationMaster WHERE ConfigurationMaster.ConfigId=fqm.FoodQuantityTypeId) AS FoodQuantityTypeName,
  //         CONCAT(fqm.FoodQuantity,' ',(select ConfigurationMaster.ConfigName from ConfigurationMaster where ConfigurationMaster.ConfigId=fqm.FoodQuantityTypeId)) AS FoodQuantityName
  //     FROM FoodQuantityMaster AS fqm
  //     INNER JOIN FoodMaster AS fm
  //     ON fm.FoodId=fqm.FoodId
  //     INNER JOIN FoodCategoryMaster AS fcm 
  //     ON fcm.FoodCategoryId=fm.FoodCategoryId
  //     INNER JOIN ConfigurationMaster AS cm
  //     ON cm.ConfigId=fcm.CategoryTypeId
  //     LEFT JOIN StockInMaster AS sm
  //     ON sm.FoodQuantityId=fqm.UniqueId
  //     WHERE fqm.FoodId=${req.query.FoodId} AND fqm.ActiveStatus='A'`
  //       );
  //       res.json({ status: true, data: result.recordset });
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
        !(req.body.RestaurantId && 
            req.body.FoodCategoryId && 
            req.body.FoodName && 
            req.body.FoodQuantity && 
            req.body.FoodQuantityTypeId && 
            req.body.CreatedBy)
      )
        res.json(commonMsgs.NullMsg);
      else {
        const pool = await poolPromise;
        console.log("getting dhana val",req.body)
        let result = await pool
                        .request()
                        .input("RestaurantId", req.body.RestaurantId)
                        .input("FoodCategoryId", req.body.FoodCategoryId)
                        .input("FoodName", req.body.FoodName)
                        .input("ImageLink", req.body.ImageLink)
                        .input("FoodToken", req.body.FoodToken)
                        .input("GST", req.body.GST)
                        .input("Cess", req.body.Cess)
                        .input("Rack", req.body.Rack)
                        .input("FoodQuantity", req.body.FoodQuantity)
                        .input("FoodQuantityTypeId", req.body.FoodQuantityTypeId)
                        .input("ReceivedQty", req.body.ReceivedQty ? req.body.ReceivedQty : 0)
                        .input("TotalAmt", req.body.TotalAmt ? req.body.TotalAmt : 0)
                        .input("Rate", req.body.Rate)
                        .input("MfgDate", req.body.MfgDate)
                        .input("ExpDate", req.body.ExpDate)
                        .input("LowStock", req.body.LowStock)
                        .input("Barcode", req.body.Barcode)
                        .input("CreatedBy", req.body.CreatedBy)
                        .execute("postQuickAdd")
        if (result.recordset[0][""][1] == 1) {
          res.json({
            "status": true,
            "message": "Data Added Successfully",
            "quickAddFoodId": result.recordset[0][""][2]
        },);
        }
        else {
          res.status({status: false, message:result.recordset[0][""][0]})
        }
        }
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
        !(req.body.RestaurantId && 
            req.body.FoodId &&
            req.body.UpdatedBy)
      )
        res.json(commonMsgs.NullMsg);
      else {
        const pool = await poolPromise;
        console.log("getting dhana update val",req.body)
        let result = await pool
                        .request()
                        .input("RestaurantId", req.body.RestaurantId)
                        .input("ImageLink", req.body.ImageLink)
                        .input("FoodToken", req.body.FoodToken)
                        .input("GST", req.body.GST)
                        .input("Cess", req.body.Cess)
                        .input("Rack", req.body.Rack)
                        .input("FoodQuantity", req.body.FoodQuantity)
                        .input("FoodQuantityTypeId", req.body.FoodQuantityTypeId)
                        .input("ReceivedQty", req.body.ReceivedQty ? req.body.ReceivedQty : 0)
                        .input("TotalAmt", req.body.TotalAmt ? req.body.TotalAmt : 0)
                        .input("Rate", req.body.Rate)
                        .input("MfgDate", req.body.MfgDate)
                        .input("ExpDate", req.body.ExpDate)
                        .input("LowStock", req.body.LowStock)
                        .input("Barcode", req.body.Barcode)
                        .input("UpdatedBy", req.body.UpdatedBy)
                        .input("UniqueId", req.body.UniqueId)
                        .input("StockId", req.body.StockId)
                        .input("FoodId", req.body.FoodId)
                        .execute("putQuickAdd")
        if (result.recordset[0][""][1] == 1) {
          res.json({
            "status": true,
            "message": "Data Updated Successfully",
            "quickAddFoodId": result.recordset[0][""][2]
            
        },);
        }
        else {
          res.status({status: false, message:result.recordset[0][""][0]})
        }
        }
    } 
    catch (error) {
      errorHandle.handleError(error, errorRes => {
        res.send(errorRes);
      });
    }
  }


  async deleteData(req, res) {
    try {
      if (
        !(
            req.query.FoodId
           )
      )
        res.json(commonMsgs.NullMsg);
      else {
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .input("FoodId", req.query.FoodId)
                        .input("UniqueId", req.query.UniqueId)
                        .input("StockId", req.query.StockId)
                        .execute("deleteQuickAdd")
        if (result.recordset[0][""][1] == 1) {
          res.json({
            "status": true,
            "message": "Data Deleted Successfully",
            "quickAddFoodId": result.recordset[0][""][2]
            
        },);
        }
        else {
          res.status({status: false, message:result.recordset[0][""][0]})
        }
        }
    } 
    catch (error) {
      errorHandle.handleError(error, errorRes => {
        res.send(errorRes);
      });
    }
  }
}




const QuickAdd = new QuickAddController();

module.exports = QuickAdd;

