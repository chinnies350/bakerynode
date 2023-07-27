const errorHandle = require("../services/errorHandler");
const commonMsgs = require("../CommonMsg.json");
const utiityFile = require("../utility");
const { poolPromise, sql } = require("../db");
var API_Services = require("../services/API_services");

class ItemIssHdr_DtlController {
  async getData(req, res) {
    try {
      if (!req.query.hasOwnProperty("RestaurantId"))
        throw "Please provide RestaurantId!.";
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .input("RestaurantId", req.query.RestaurantId)
                        .execute("getAllItemIssHdrDtlData")
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
  //       throw "Please provide RestaurantId!.";
  //     const pool = await poolPromise;
  //     const result = await pool.query(
  //       `SELECT ItemIssHdr.IssueId, convert(varchar,ItemIssHdr.IssueDate,121) as IssueDate, 
  //       ItemIssHdr.RestaurantId, ItemIssHdr.IssueRef, ItemIssHdr.ActiveStatus, ItemIssHdr.CreatedBy,
  //        ItemIssHdr.CreatedDate, ItemIssHdr.UpdatedBy, ItemIssHdr.UpdatedDate, ItemIssDtl.ItemId,
  //         ItemIssDtl.IssuedQty, ItemIssDtl.IssueRate 
  //                  FROM ItemIssHdr, ItemIssDtl ,ConfigurationMaster
  //                  WHERE  ItemIssHdr.IssueId = ItemIssDtl.IssueId 
  //               AND ItemIssDtl.ItemId = ConfigurationMaster.ConfigId 
  //               AND ItemIssHdr.RestaurantId=${req.query.RestaurantId}`
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
      if (req.body.IssueDate != null && req.body.RestaurantId && req.body.IssueRef != null && req.body.ActiveStatus != null && req.body.CreatedBy != null && req.body.ItemId != null)
        {
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
                      .input("IssueDate", req.body.IssueDate)
                      .input("RestaurantId", req.body.RestaurantId)
                      .input("IssueRef", req.body.IssueRef)
                      .input("ActiveStatus", req.body.ActiveStatus)
                      .input("CreatedBy", req.body.CreatedBy)
                      .input("ItemId", req.body.ItemId)
                      .input("IssuedQty", req.body.IssuedQty)
                      .input("IssueRate", req.body.IssueRate)
                      .execute("addItemIssHdrDtlData")
          if (result.recordset[0][""][1] == 1) {
            res.json(commonMsgs.AddMsg);
          }
          else {
            res.json({status: false, message:result.recordset[0][""][0]})
          }
        }else
        res.send({ status: false, message: "Please fill all the details!" });
    } catch (error) {
      errorHandle.handleError(error, (errorRes) => {
        res.send(errorRes);
      });
    }
  }

  // async addData(req, res) {
  //   try {
  //     let queryArr = [],
  //       ItemIssHdr_DtlFields = `INSERT INTO ItemIssDtl (IssueId,IssuedQty,IssueRate`,
  //       ItemIssHdr_DtlValues = `VALUES (@IssueId,@IssuedQty,@IssueRate`,
  //       obj = {
  //         field: "",
  //         values: "",
  //         index: null,
  //       };
  //     const pool = await poolPromise;
  //     if (req.body.ItemId.includes("~")) {
  //       let arrSplit = req.body.ItemId.split("~");
  //       for (let i in arrSplit) {
  //         queryArr.push(
  //           await arrQuery2(req.body, i, ItemIssHdr_DtlFields, ItemIssHdr_DtlValues, obj)
  //         );
  //       }
  //     } else {
  //       let field = `${ItemIssHdr_DtlFields},ItemId)`;
  //       let values = `${ItemIssHdr_DtlValues},@ItemId)`;
  //       obj.field = field;
  //       obj.values = values;
  //       queryArr.push(obj);
  //     }
  //     ItemIssHdr_DtlFields = "";
  //     for (let k = 0; k < queryArr.length; k++) {
  //       ItemIssHdr_DtlFields +=
  //         queryArr[k].field + " " + queryArr[k].values + ";";
  //     }
  //     if (req.body.IssueDate != null && req.body.RestaurantId && req.body.IssueRef != null && req.body.ActiveStatus != null && req.body.CreatedBy != null && req.body.ItemId != null
  //     ) {
  //       const result = await pool
  //         .request()
  //         .input("IssueDate", req.body.IssueDate)
  //         .input("RestaurantId", req.body.RestaurantId)
  //         .input("IssueRef", req.body.IssueRef)
  //         .input("ActiveStatus", req.body.ActiveStatus)
  //         .input("CreatedBy", req.body.CreatedBy)
  //         .query(
  //           `INSERT INTO ItemIssHdr (IssueDate, RestaurantId, IssueRef, ActiveStatus, CreatedBy) VALUES (@IssueDate, @RestaurantId, @IssueRef, @ActiveStatus, @CreatedBy)`
  //         );
  //       let lengthData = await pool.query(
  //         "SELECT MAX (IssueId) as IssueId FROM ItemIssHdr"
  //       );
  //       lengthData = lengthData.recordset[0]["IssueId"];
  //       const result1 = await pool
  //         .request()
  //         .input("IssueId", lengthData)
  //         .input("ItemId", req.body.ItemId)
  //         .input("IssuedQty", req.body.IssuedQty)
  //         .input("IssueRate", req.body.IssueRate)
  //         .query(`${ItemIssHdr_DtlFields} `);
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
      if (!(req.body.IssueId)) throw "Please fill all the details!";
      else {
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .input("IssueId", req.body.IssueId)
                        .input("IssueDate", req.body.IssueDate)
                        .input("RestaurantId",req.body.RestaurantId)
                        .input("IssueRef",req.body.IssueRef)
                        .input("UpdatedBy",req.body.UpdatedBy)
                        .input("ItemId",req.body.ItemId)
                        .input("IssuedQty",req.body.IssuedQty)
                        .input("IssueRate",req.body.IssueRate)
                        .execute("updateItemIssHdrDtlData")
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
  //     if (req.body.IssueId) {
  //       const pool = await poolPromise;
  //       let objArr = utiityFile.removeEmptyObjects(req.body);
  //       let queryValue = null;
  //       let queryValue1 = null;
  //       let arr1 = ["IssueDate", "RestaurantId", "IssueRef", "ActiveStatus", "UpdatedBy"];
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
  //         .input("IssueId", req.body.IssueId)
  //         .input("IssueDate", req.body.IssueDate)
  //         .input("RestaurantId", req.body.RestaurantId)
  //         .input("IssueRef", req.body.IssueRef)
  //         .input("ActiveStatus", req.body.ActiveStatus)
  //         .input("UpdatedBy", req.body.UpdatedBy)
  //         .input("ItemId", req.body.ItemId)
  //         .input("IssuedQty", req.body.IssuedQty)
  //         .input("IssueRate", req.body.IssueRate)
  //         .query(
  //           `BEGIN TRANSACTION UPDATE ItemIssDtl SET ${queryValue1} WHERE IssueId = @IssueId UPDATE ItemIssHdr SET ${queryValue} WHERE IssueId = @IssueId COMMIT`
  //         );
  //       res.json({ status: true, message: "Data updated successfully." });
  //     } else {
  //       throw "Please fill all the details!";
  //     }
  //   } catch (error) {
  //     errorHandle.handleError(error, (errorRes) => {
  //       res.send(errorRes);
  //     });
  //   }
  // }

  async deleteData(req, res) {
    try {
      if (!(req.query.IssueId && req.query.ActiveStatus))
        throw "Please fill all the details!"; 
      else {
          const pool = await poolPromise;
          let result = await pool
                          .request()
                          .input("ActiveStatus", req.query.ActiveStatus)
                          .input("IssueId", req.query.IssueId)
                          .execute("deleteItemIssHdrDtlData")
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
  //     if (req.query.IssueId && req.query.ActiveStatus) {
  //       const pool = await poolPromise;
  //       await pool
  //         .request()
  //         .input("IssueId", req.query.IssueId)
  //         .input("ActiveStatus", req.query.ActiveStatus)
  //         .query(
  //           "UPDATE ItemIssHdr SET ActiveStatus = @ActiveStatus  WHERE IssueId = @IssueId"
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

const itemIssHdr = new ItemIssHdr_DtlController();

module.exports = itemIssHdr;
