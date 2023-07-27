const errorHandle = require("../services/errorHandler");
const commonMsgs = require("../CommonMsg.json");
const utiityFile = require("../utility");
const { poolPromise, sql } = require("../db");
var API_Services = require("../services/API_services");

class ItemPurHdr_DtlController {
  async getData(req, res) {
    try {
      if (!req.query.hasOwnProperty("RestaurantId"))
        throw "Please provide a RestaurantId!.";
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .input("RestaurantId", req.query.RestaurantId)
                        .execute("getAllItemPurHdrDtlData")
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
  //       throw "Please provide a RestaurantId!.";
  //     const pool = await poolPromise;
  //     const result = await pool.query(
  //       `SELECT ItemPurHdr.PurchaseId,convert(varchar,ItemPurHdr.PurchaseDate,121) as PurchaseDate,
  //       ItemPurHdr.RestaurantId, ItemPurHdr.VendorId,VendorMaster.Name as VendorName, ItemPurHdr.VendorRef,
  //        ItemPurHdr.ActiveStatus, ItemPurHdr.CreatedBy, ItemPurHdr.CreatedDate, ItemPurHdr.UpdatedBy,
  //         ItemPurHdr.UpdatedDate, ItemPurDtl.ItemId, ItemPurDtl.ReceivedQty, ItemPurDtl.AcceptedQty,
  //         ItemPurDtl.RejectedQty, ItemPurDtl.RejectionReason, ItemPurDtl.PurchaseRate, ConfigName as ItemName 
  //                FROM ItemPurHdr,ItemPurDtl,VendorMaster,ConfigurationType,ConfigurationMaster
  //                WHERE ItemPurHdr.PurchaseId = ItemPurDtl.PurchaseId  
  //             AND ItemPurHdr.RestaurantId=${req.query.RestaurantId}
  //             AND VendorMaster.VendorId=ItemPurHdr.VendorId 
  //             AND VendorMaster.ActiveStatus='A' 
  //             AND ConfigurationType.TypeName='ItemType' 
  //             AND ConfigurationMaster.ActiveStatus='A' 
  //             AND ConfigurationMaster.TypeId=ConfigurationType.TypeId 
  //             AND ConfigurationMaster.ConfigId=ItemPurDtl.ItemId AND ConfigurationType.ActiveStatus='A'`
  //     );
  //     res.json({ status: true, data: result.recordset });
  //   } catch (error) {
  //     errorHandle.handleError(error, (errorRes) => {
  //       res.send(errorRes);
  //     });
  //   }
  // }

  async addData(req, res) {
    try {
      if (
        req.body.PurchaseDate &&
        req.body.RestaurantId &&
        req.body.VendorId &&
        req.body.ActiveStatus &&
        req.body.CreatedBy &&
        req.body.ItemId
      ) {
        const pool = await poolPromise;
        if (String(req.body.ItemId).includes("~")) {
                  let arrSplit = req.body.ItemId.split("~");
                  for (let i in arrSplit) {
                    queryArr.push(
                      await arrQuery1(
                        req.body,
                        i,
                        ItemPurHdr_DtlFields,
                        ItemPurHdr_DtlValues,
                        obj
                      )
                    );
                  }
                }                  
        let result =await pool
                    .request()
                    .input("PurchaseDate", req.body.PurchaseDate)
                    .input("RestaurantId", req.body.RestaurantId)
                    .input("VendorId", req.body.VendorId)
                    .input("VendorRef", req.body.VendorRef)
                    .input("ActiveStatus", req.body.ActiveStatus)
                    .input("CreatedBy", req.body.CreatedBy)
                    .input("ItemId", req.body.ItemId)
                    .input("ReceivedQty", req.body.ReceivedQty)
                    .input("AcceptedQty", req.body.AcceptedQty)
                    .input("RejectedQty", req.body.RejectedQty)
                    .input("RejectionReason", req.body.RejectionReason)
                    .input("PurchaseRate",req.body.PurchaseRate)
                    .execute("addItemPurHdrDtlData")
        if (result.recordset[0][""][1] == 1) {
          res.json(commonMsgs.AddMsg);
        }
        else {
          res.json({status: false, message:result.recordset[0][""][0]})
        }
      } else
        res.send({ status: false, message: "Please fill all the details!" });
    } catch (error) {
      errorHandle.handleError(error, (errorRes) => {
        res.send(errorRes);
      });
    }
  }

  // async addData(req, res) {
  //   try {
  //     if (
  //       req.body.PurchaseDate &&
  //       req.body.RestaurantId &&
  //       req.body.VendorId &&
  //       req.body.ActiveStatus &&
  //       req.body.CreatedBy &&
  //       req.body.ItemId
  //     ) {
  //       let queryArr = [],
  //         ItemPurHdr_DtlFields = `INSERT INTO ItemPurDtl (PurchaseId, ReceivedQty,AcceptedQty, RejectedQty,RejectionReason,PurchaseRate`,
  //         ItemPurHdr_DtlValues = `VALUES (@PurchaseId, @ReceivedQty,@AcceptedQty,@RejectedQty,@RejectionReason,@PurchaseRate`,
  //         obj = {
  //           field: "",
  //           values: "",
  //           index: null,
  //         };

  //       const pool = await poolPromise;

  //       if (String(req.body.ItemId).includes("~")) {
  //         let arrSplit = req.body.ItemId.split("~");
  //         for (let i in arrSplit) {
  //           queryArr.push(
  //             await arrQuery1(
  //               req.body,
  //               i,
  //               ItemPurHdr_DtlFields,
  //               ItemPurHdr_DtlValues,
  //               obj
  //             )
  //           );
  //         }
  //       } else {
  //         let field = `${ItemPurHdr_DtlFields},ItemId)`;
  //         let values = `${ItemPurHdr_DtlValues},@ItemId)`;
  //         obj.field = field;
  //         obj.values = values;
  //         queryArr.push(obj);
  //       }
  //       ItemPurHdr_DtlFields = "";
  //       for (let k = 0; k < queryArr.length; k++) {
  //         ItemPurHdr_DtlFields +=
  //           queryArr[k].field + " " + queryArr[k].values + ";";
  //       }
  //       //add item purchase header values
  //       await pool
  //         .request()
  //         .input("PurchaseDate", req.body.PurchaseDate)
  //         .input("RestaurantId", req.body.RestaurantId)
  //         .input("VendorId", req.body.VendorId)
  //         .input("VendorRef", req.body.VendorRef)
  //         .input("ActiveStatus", req.body.ActiveStatus)
  //         .input("CreatedBy", req.body.CreatedBy)
  //         .query(
  //           ` INSERT INTO ItemPurHdr (PurchaseDate, RestaurantId, VendorId, VendorRef, ActiveStatus, CreatedBy) VALUES (@PurchaseDate, @RestaurantId,@VendorId, @VendorRef, @ActiveStatus, @CreatedBy)`
  //         );
  //       // getting maximum value of purchase id
  //       let lengthData = (
  //         await pool.query(
  //           "SELECT MAX (PurchaseId) as PurchaseId FROM ItemPurHdr"
  //         )
  //       ).recordset[0].PurchaseId;
  //       // add item purchase details values
  //       await pool
  //         .request()
  //         .input("PurchaseId", lengthData)
  //         .input("ItemId", req.body.ItemId)
  //         .input("ReceivedQty", req.body.ReceivedQty)
  //         .input("AcceptedQty", req.body.AcceptedQty)
  //         .input("RejectedQty", req.body.RejectedQty)
  //         .input("RejectionReason", req.body.RejectionReason)
  //         .input("PurchaseRate", req.body.PurchaseRate)
  //         .query(`${ItemPurHdr_DtlFields} `);
  //       res.json({ status: true, message: "Data added successfully." });
  //     } else
  //       res.send({ status: false, message: "Please fill all the details!" });
  //   } catch (error) {
  //     errorHandle.handleError(error, (errorRes) => {
  //       res.send(errorRes);
  //     });
  //   }
  // }

  async updateData(req, res) {
    try {
      if (!(req.body.PurchaseId))
      throw "Please fill all the details!";
      else {
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .input("PurchaseId", req.body.PurchaseId)
                        .input("PurchaseDate", req.body.PurchaseDate)
                        .input("RestaurantId",req.body.RestaurantId)
                        .input("VendorId",req.body.VendorId)
                        .input("VendorRef",req.body.VendorRef)
                        .input("UpdatedBy",req.body.UpdatedBy)
                        .input("ItemId",req.body.ItemId)
                        .input("ReceivedQty",req.body.ReceivedQty)
                        .input("AcceptedQty",req.body.AcceptedQty)
                        .input("RejectedQty",req.body.RejectedQty)
                        .input("RejectionReason",req.body.RejectionReason)
                        .input("PurchaseRate",req.body.PurchaseRate)
                        .execute("updateItemPurHdrDtlData")
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
  //     if (req.body.PurchaseId) {
  //       const pool = await poolPromise;
  //       let objArr = utiityFile.removeEmptyObjects(req.body);
  //       let queryValue = null;
  //       let queryValue1 = null;
  //       let arr1 = [
  //         "PurchaseDate",
  //         "RestaurantId",
  //         "VendorId",
  //         "VendorRef",
  //         "ActiveStatus",
  //         "UpdatedBy",
  //       ];
  //       for (const [key, value] of Object.entries(objArr)) {
  //         if (key != "PurchaseId") {
  //           if (arr1.includes(key))
  //             queryValue == null
  //               ? (queryValue = `${key}=@${key}`)
  //               : (queryValue += `,${key}=@${key}`);
  //           else
  //             queryValue1 == null
  //               ? (queryValue1 = `${key}=@${key}`)
  //               : (queryValue1 += `,${key}=@${key}`);
  //         }
  //       }
  //       await pool
  //         .request()
  //         .input("PurchaseId", req.body.PurchaseId)
  //         .input("PurchaseDate", req.body.PurchaseDate)
  //         .input("RestaurantId", req.body.RestaurantId)
  //         .input("VendorId", req.body.VendorId)
  //         .input("VendorRef", req.body.VendorRef)
  //         .input("ActiveStatus", req.body.ActiveStatus)
  //         .input("UpdatedBy", req.body.UpdatedBy)
  //         .input("ItemId", req.body.ItemId)
  //         .input("ReceivedQty", req.body.ReceivedQty)
  //         .input("AcceptedQty", req.body.AcceptedQty)
  //         .input("RejectedQty", req.body.RejectedQty)
  //         .input("RejectionReason", req.body.RejectionReason)
  //         .input("PurchaseRate", req.body.PurchaseRate)
  //         .query(
  //           `BEGIN TRANSACTION UPDATE ItemPurDtl SET ${queryValue1} WHERE PurchaseId = @PurchaseId UPDATE ItemPurHdr SET ${queryValue} WHERE PurchaseId = @PurchaseId COMMIT`
  //         );
  //       res.json({ status: true, message: "Data updated successfully." });
  //     } else throw "Please fill all the details!";
  //   } catch (error) {
  //     errorHandle.handleError(error, (errorRes) => {
  //       res.send(errorRes);
  //     });
  //   }
  // }

  async deleteData(req, res) {
    try {
      if (!(req.query.PurchaseId && req.query.ActiveStatus))
        throw "Please fill all the details!";
      else {
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .input("ActiveStatus", req.query.ActiveStatus)
                        .input("PurchaseId", req.query.PurchaseId)
                        .execute("deleteItemPurHdrDtlData")
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
  //     if (req.query.PurchaseId && req.query.ActiveStatus) {
  //       const pool = await poolPromise;
  //       await pool
  //         .request()
  //         .input("PurchaseId", req.query.PurchaseId)
  //         .input("ActiveStatus", req.query.ActiveStatus)
  //         .query(
  //           "UPDATE ItemPurHdr SET ActiveStatus = @ActiveStatus  WHERE PurchaseId = @PurchaseId"
  //         );
  //       res.json({ status: true, message: "Deleted successfully." });
  //     } else {
  //       throw "Please fill all the details!";
  //     }
  //   } catch (error) {
  //     errorHandle.handleError(error, (errorRes) => {
  //       res.send(errorRes);
  //     });
  //   }
  // }
}

const itemPurHdr = new ItemPurHdr_DtlController();

module.exports = itemPurHdr;
