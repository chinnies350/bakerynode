const errorHandle = require("../services/errorHandler");
const commonMsgs = require("../CommonMsg.json");
const utiityFile = require("../utility");
const { poolPromise, sql } = require("../db");
var API_Services = require("../services/API_services");

class ItemMasterController {
  async getData(req, res) {
    try {
      if (!req.query.hasOwnProperty("RestaurantId"))
        throw "Please provide a RestaurantId!.";
      const pool = await poolPromise;
      let result = await pool
                      .request()
                      .input("RestaurantId", req.query.RestaurantId)
                      .execute("getAllItemMasterData")
      if (result.recordset[0].mainData!=null){
        res.json({status: true, data:JSON.parse(result.recordset[0].mainData)})

      }
      else{
        // res.json({status: true, message:"No data found!"})
        res.json({status: true, data: []})
      }
    } catch (error) {
      errorHandle.handleError(error, (errorRes) => {
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
  //       `SELECT * from ItemMaster WHERE RestaurantId=${req.query.RestaurantId} `
  //     );
   
  //     if (result.recordset.length > 0) {
  //       const result1 = await pool.query(`select * from ConfigurationMaster`);
  //       utiityFile.namesOfItemMaster(
  //         result.recordset,
  //         result1.recordset,
  //         function (res1) {
  //           res.json({ status: true, data: res1 });
  //         }
  //       );
  //     } else throw "No data found!";
  //   } catch (error) {
  //     errorHandle.handleError(error, (errorRes) => {
  //       res.send(errorRes);
  //     });
  //   }
  // }

  async addData(req, res) {
    try {
      if (
        req.body.ItemDescription &&
        req.body.ItemType &&
        req.body.RestaurantId &&
        req.body.UOM &&
        req.body.ActiveStatus &&
        req.body.CreatedBy
      ) {
        const pool = await poolPromise;
        let result = await pool
          .request()
          .input("ItemDescription", req.body.ItemDescription)
          .input("ItemType", req.body.ItemType)
          .input("RestaurantId", req.body.RestaurantId)
          .input("UOM", req.body.UOM)
          .input("ItemRate", req.body.ItemRate)
          .input("OpeningQty", req.body.OpeningQty)
          .input("ReceivedQty", req.body.ReceivedQty)
          .input("IssuedQty", req.body.IssuedQty)
          .input("BalanceQty", req.body.BalanceQty)
          .input("ActiveStatus", req.body.ActiveStatus)
          .input("CreatedBy", req.body.CreatedBy)
          .execute("addItemMaster")
        if (result.recordset[0][""][1] == 1) {
          res.json(commonMsgs.AddMsg);
        }
        else {
          res.json({status: false, message:result.recordset[0][""][0]})
        }
      } else {
        throw "Please fill all the details!";
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
  //       req.body.ItemDescription &&
  //       req.body.ItemType &&
  //       req.body.RestaurantId &&
  //       req.body.UOM &&
  //       req.body.ActiveStatus &&
  //       req.body.CreatedBy
  //     ) {
  //       const pool = await poolPromise;
  //       await pool
  //         .request()
  //         .input("ItemDescription", req.body.ItemDescription)
  //         .input("ItemType", req.body.ItemType)
  //         .input("RestaurantId", req.body.RestaurantId)
  //         .input("UOM", req.body.UOM)
  //         .input("ItemRate", req.body.ItemRate)
  //         .input("OpeningQty", req.body.OpeningQty)
  //         .input("ReceivedQty", req.body.ReceivedQty)
  //         .input("IssuedQty", req.body.IssuedQty)
  //         .input("BalanceQty", req.body.BalanceQty)
  //         .input("ActiveStatus", req.body.ActiveStatus)
  //         .input("CreatedBy", req.body.CreatedBy)
  //         .query(
  //           "INSERT INTO ItemMaster (ItemDescription, ItemType, RestaurantId, UOM, ItemRate, OpeningQty, ReceivedQty, IssuedQty, BalanceQty,ActiveStatus, CreatedBy) VALUES (@ItemDescription, @ItemType, @RestaurantId, @UOM, @ItemRate, @OpeningQty, @ReceivedQty, @IssuedQty, @BalanceQty, @ActiveStatus, @CreatedBy)"
  //         );
  //       res.json({ status: true, message: "Data added successfully." });
  //     } else {
  //       throw "Please fill all the details!";
  //     }
  //   } catch (error) {
  //     errorHandle.handleError(error, (errorRes) => {
  //       res.send(errorRes);
  //     });
  //   }
  // }

  async updateData(req, res) {
    try {
      if (req.body.ItemId) {
        const pool = await poolPromise;
        let objArr = utiityFile.removeEmptyObjects(req.body);
        let queryValue = null;
        for (const [key, value] of Object.entries(objArr)) {
          if (key != "ItemId")
            queryValue == null
              ? (queryValue = `${key}=@${key}`)
              : (queryValue += `,${key}=@${key}`);
        }
        let result = await pool
          .request()
          .input("ItemId", req.body.ItemId)
          .input("ItemDescription", req.body.ItemDescription)
          .input("ItemType", req.body.ItemType)
          .input("RestaurantId", req.body.RestaurantId)
          .input("UOM", req.body.UOM)
          .input("ItemRate", req.body.ItemRate)
          .input("OpeningQty", req.body.OpeningQty)
          .input("ReceivedQty", req.body.ReceivedQty)
          .input("IssuedQty", req.body.IssuedQty)
          .input("BalanceQty", req.body.BalanceQty)
          .input("UpdatedBy", req.body.UpdatedBy)
          .execute("updateItemMasterData")
          if (result.recordset[0][""][1] == 1) {
            res.json(commonMsgs.updateMsg);
          }
          else {
            res.json({status: false, message:result.recordset[0][""][0]})
          }
      } else throw "Please fill all the details!";
    } catch (error) {
      errorHandle.handleError(error, (errorRes) => {
        res.send(errorRes);
      });
    }
  }

  // async updateData(req, res) {
  //   try {
  //     if (req.body.ItemId) {
  //       const pool = await poolPromise;
  //       let objArr = utiityFile.removeEmptyObjects(req.body);
  //       let queryValue = null;
  //       for (const [key, value] of Object.entries(objArr)) {
  //         if (key != "ItemId")
  //           queryValue == null
  //             ? (queryValue = `${key}=@${key}`)
  //             : (queryValue += `,${key}=@${key}`);
  //       }
  //       let result = await pool
  //         .request()
  //         .input("ItemId", req.body.ItemId)
  //         .input("ItemDescription", req.body.ItemDescription)
  //         .input("ItemType", req.body.ItemType)
  //         .input("RestaurantId", req.body.RestaurantId)
  //         .input("UOM", req.body.UOM)
  //         .input("ItemRate", req.body.ItemRate)
  //         .input("OpeningQty", req.body.OpeningQty)
  //         .input("ReceivedQty", req.body.ReceivedQty)
  //         .input("IssuedQty", req.body.IssuedQty)
  //         .input("BalanceQty", req.body.BalanceQty)
  //         .input("ActiveStatus", req.body.ActiveStatus)
  //         .input("CreatedBy", req.body.CreatedBy)
  //         .input("UpdatedBy", req.body.UpdatedBy)
  //         .query(`UPDATE ItemMaster SET ${queryValue}  WHERE ItemId = @ItemId`);
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
      if (!(req.query.ItemId && req.query.ActiveStatus))
      throw "Please fill all the details!"; 
      else {
          const pool = await poolPromise;
          let result = await pool
                          .request()
                          .input("ActiveStatus", req.query.ActiveStatus)
                          .input("ItemId", req.query.ItemId)
                          .execute("deleteItemMasterData")
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
  //     if (req.query.ItemId && req.query.ActiveStatus) {
  //       const pool = await poolPromise;
  //       await pool
  //         .request()
  //         .input("ItemId", req.query.ItemId)
  //         .input("ActiveStatus", req.query.ActiveStatus)
  //         .query(
  //           "UPDATE ItemMaster SET ActiveStatus = @ActiveStatus  WHERE ItemId = @ItemId"
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

const itemMaster = new ItemMasterController();

module.exports = itemMaster;
