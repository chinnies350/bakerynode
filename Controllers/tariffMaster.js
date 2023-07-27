const errorHandle = require("../services/errorHandler");
const commonMsgs = require("../CommonMsg.json");
const utiityFile = require("../utility");
const { poolPromise, sql } = require("../db");
var API_Services = require("../services/API_services");

class TariffMasterController {
  async getAllData(req, res) {
    try {
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .execute("getAllTariffMasterData")
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
  //     // if (!req.query.hasOwnProperty("RestaurantId"))
  //     //   throw "Please Provide RestaurantId!.";
  //     const pool = await poolPromise;
  //     const result = await pool
  //       .request()
  //       // .input("RestaurantId", req.query.RestaurantId)
  //       .query(
  //         `SELECT TariffMaster.RestaurantId, RestaurantMaster.RestaurantName, TariffMaster.TariffTypeId, TariffType.TariffTypeName, TariffMaster.FoodId, FoodMaster.FoodName, TariffMaster.Tariff, ConfigurationMaster.ConfigId AS FoodQuantityId, ConfigurationMaster.ConfigName AS FoodQuantityName, TariffMaster.ActiveStatus, TariffMaster.CreatedBy, TariffMaster.CreatedDate, TariffMaster.UpdatedBy, TariffMaster.UpdatedDate  FROM TariffMaster INNER JOIN RestaurantMaster ON TariffMaster.RestaurantId = RestaurantMaster.RestaurantId INNER JOIN TariffType ON TariffType.TariffTypeId = TariffMaster.TariffTypeId INNER JOIN FoodMaster ON TariffMaster.FoodId = FoodMaster.FoodId INNER JOIN ConfigurationMaster ON TariffMaster.FoodQuantityId = ConfigurationMaster.ConfigId`
  //       );
  //     res.json({ status: true, data: result.recordset });
  //   } catch (error) {
  //     errorHandle.handleError(error, (errorRes) => {
  //       res.send(errorRes);
  //     });
  //   }
  // }

  async getTariffDataByFoodId(req, res) {
    try {
      if (
          !req.query.hasOwnProperty("RestaurantId") &&
          !req.query.hasOwnProperty("FoodId")
         )
          throw "Please provide all the details!.";
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .input("RestaurantId", req.query.RestaurantId)
                        .input("FoodId", req.query.FoodId)
                        .execute("getTariffDataByFoodId")
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

  // async getTariffDataByFoodId(req, res) {
  //   try {
  //     if (
  //       !req.query.hasOwnProperty("RestaurantId") &&
  //       !req.query.hasOwnProperty("FoodId")
  //     )
  //       throw "Please provide all the details!.";
  //     const pool = await poolPromise;
  //     const result = await pool
  //       .request()
  //       .input("RestaurantId", req.query.RestaurantId)
  //       .input("FoodId", req.query.FoodId)
  //       .query(
  //         `SELECT TariffMaster.RestaurantId, TariffMaster.TariffTypeId, TariffMaster.FoodId, TariffMaster.Tariff, ConfigurationMaster.ConfigId AS FoodQuantityId, ConfigurationMaster.ConfigName AS FoodQuantityName, TariffMaster.ActiveStatus, TariffMaster.CreatedBy, TariffMaster.CreatedDate, TariffMaster.UpdatedBy, TariffMaster.UpdatedDate FROM TariffMaster INNER JOIN FoodMaster ON TariffMaster.FoodId = FoodMaster.FoodId INNER JOIN ConfigurationMaster ON TariffMaster.FoodQuantityId = ConfigurationMaster.ConfigId where TariffMaster.RestaurantId = @RestaurantId AND TariffMaster.FoodId = @FoodId AND TariffMaster.ActiveStatus = 'A'`
  //       );
  //     res.json({ status: true, data: result.recordset });
  //   } catch (error) {
  //     errorHandle.handleError(error, (errorRes) => {
  //       res.send(errorRes);
  //     });
  //   }
  // }

  async addData(req, res) {
    try {
      if (!(
        req.body.RestaurantId &&
        req.body.TariffTypeId &&
        req.body.FoodId &&
        req.body.FoodQuantityId &&
        req.body.Tariff &&
        req.body.CreatedBy
      )) res.json(commonMsgs.NullMsg);
      else {
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .input("RestaurantId", req.body.RestaurantId)
                        .input("TariffTypeId", req.body.TariffTypeId)
                        .input("FoodId",req.body.FoodId)
                        .input("FoodQuantityId",req.body.FoodQuantityId)
                        .input("Tariff",req.body.Tariff)
                        .input("CreatedBy",req.body.CreatedBy)
                        .execute("addTariffMasterData")
        if (result.recordset[0][""][1] == 1) {
          res.json(commonMsgs.AddMsg);
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
  //       req.body.TariffTypeId &&
  //       req.body.FoodId &&
  //       req.body.FoodQuantityId &&
  //       req.body.Tariff &&
  //       req.body.CreatedBy
  //     ) {
  //       const pool = await poolPromise;
  //       var queryStr = "",
  //         queryValues = "";
  //       for (var key in req.body) {
  //         if (queryStr != "") {
  //           queryStr += ", ";
  //           queryValues += ", ";
  //         }
  //         queryStr += key;
  //         queryValues += "@" + key;
  //       }
  //       await pool
  //         .request()
  //         .input("RestaurantId", req.body.RestaurantId)
  //         .input("TariffTypeId", req.body.TariffTypeId)
  //         .input("FoodId", req.body.FoodId)
  //         .input("FoodQuantityId", req.body.FoodQuantityId)
  //         .input("Tariff", req.body.Tariff)
  //         .input("CreatedBy", req.body.CreatedBy)
  //         .query(
  //           `INSERT INTO TariffMaster (${queryStr}) VALUES (${queryValues})`
  //         );
  //       res.json({ status: true, message: "Data added successfully." });
  //     } else {
  //       res.send({ status: false, message: "Please fill all the details!" });
  //     }
  //   } catch (error) {
  //     errorHandle.handleError(error, (errorRes) => {
  //       res.send(errorRes);
  //     });
  //   }
  // }

  async updateData(req, res) {
    try {
      if (!(req.body.RestaurantId && req.body.FoodId && req.body.TariffTypeId))
       return res.json({ status: false, message: "Please fill all the details!" }); 
      else {
          const pool = await poolPromise;
          let result = await pool
                          .request()
                          .input("RestaurantId", req.body.RestaurantId)
                          .input("TariffTypeId", req.body.TariffTypeId)
                          .input("FoodId",req.body.FoodId)
                          .input("FoodQuantityId",req.body.FoodQuantityId)
                          .input("Tariff",req.body.Tariff)
                          .input("UpdatedBy",req.body.UpdatedBy)
                          .execute("updateTariffMasterData")
          if (result.recordset[0][""][1] == 1) {
            res.json(commonMsgs.updateMsg);
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

  // async updateData(req, res) {
  //   try {
  //     if (req.body.RestaurantId && req.body.FoodId && req.body.TariffTypeId) {
  //       const pool = await poolPromise;
  //       let objArr = utiityFile.removeEmptyObjects(req.body);
  //       let queryValue = null;
  //       for (const [key, value] of Object.entries(objArr)) {
  //         if (key != "RestaurantId" && key != "FoodId" && key != "TariffTypeId")
  //           queryValue == null
  //             ? (queryValue = `${key}=@${key}`)
  //             : (queryValue += `,${key}=@${key}`);
  //       }
  //       await pool
  //         .request()
  //         .input("RestaurantId", req.body.RestaurantId)
  //         .input("TariffTypeId", req.body.TariffTypeId)
  //         .input("FoodId", req.body.FoodId)
  //         .input("FoodQuantityId", req.body.FoodQuantityId)
  //         .input("Tariff", req.body.Tariff)
  //         .input("ActiveStatus", req.body.ActiveStatus)
  //         .input("UpdatedBy", req.body.UpdatedBy)
  //         .query(
  //           `UPDATE TariffMaster SET ${queryValue} WHERE RestaurantId = @RestaurantId AND TariffTypeId = @TariffTypeId AND FoodId = @FoodId`
  //         );
  //       res.json({ status: true, message: "Data updated successfully." });
  //     } else {
  //       res.send({ status: false, message: "Please fill all the details!" });
  //     }
  //   } catch (error) {
  //     errorHandle.handleError(error, (errorRes) => {
  //       res.send(errorRes);
  //     });
  //   }
  // }

  async deleteData(req, res) {
    try {
      if (!(
        req.body.RestaurantId &&
        req.body.FoodId &&
        req.body.FoodQuantityId &&
        req.body.ActiveStatus &&
        req.body.TariffTypeId
      ))res.send({ status: false, message: "Please fill all the details!" });
       else {
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .input("RestaurantId", req.body.RestaurantId)
                        .input("FoodId", req.body.FoodId)
                        .input("FoodQuantityId",req.body.FoodQuantityId)
                        .input("ActiveStatus",req.body.ActiveStatus)
                        .input("TariffTypeId",req.body.TariffTypeId)
                        .execute("deleteTariffMasterData")
        if (result.recordset[0][""][1] == 1) {
          res.json(commonMsgs.deleteMsg);
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

  // async deleteData(req, res) {
  //   try {
  //     if (
  //       req.body.RestaurantId &&
  //       req.body.FoodId &&
  //       req.body.FoodQuantityId &&
  //       req.body.ActiveStatus &&
  //       req.body.TariffTypeId
  //     ) {
  //       const pool = await poolPromise;
  //       await pool
  //         .request()
  //         .input("RestaurantId", req.body.RestaurantId)
  //         .input("FoodId", req.body.FoodId)  
  //         .input("FoodQuantityId", req.body.FoodQuantityId)
  //         .input("ActiveStatus", req.body.ActiveStatus)
  //         .input("TariffTypeId", req.body.TariffTypeId)
  //         .query(
  //           `UPDATE TariffMaster SET ActiveStatus = @ActiveStatus WHERE FoodId = @FoodId AND RestaurantId = @RestaurantId AND TariffTypeId = @TariffTypeId AND FoodQuantityId = @FoodQuantityId`
  //         );
  //       res.json({ status: true, message: "Deleted successfully." });
  //     } else {
  //       res.send({ status: false, message: "Please fill all the details!" });
  //     }
  //   } catch (error) {
  //     errorHandle.handleError(error, (errorRes) => {
  //       res.send(errorRes);
  //     });
  //   }
  // }
}

const tariffMaster = new TariffMasterController();

module.exports = tariffMaster;
