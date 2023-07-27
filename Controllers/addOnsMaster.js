const errorHandle = require("../services/errorHandler");
const commonMsgs = require("../CommonMsg.json");
const utiityFile = require("../utility");
const { poolPromise, sql } = require("../db");

class AddOnsMasterController {
  async getData(req, res) {
    try {
      if (!req.query.AddOnsId) res.json(commonMsgs.NullMsg);
      else {
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .input("AddOnsId", req.query.AddOnsId)
                        .execute("getAddOnsData")
        if (result.recordset[0].mainData!=null){
          res.json({status: true, data:JSON.parse(result.recordset[0].mainData)})

        }
        else{
          res.json({status: true, data: []})
        }
        }
    } catch (error) {
      errorHandle.handleError(error, (errorRes) => {
        res.send(errorRes);
      });
    }
  }
  // async getData(req, res) {
  //   try {
  //     if (!req.query.AddOnsId) res.json(commonMsgs.NullMsg);
  //     else {
  //       const pool = await poolPromise;
  //       let result = await pool.query(
  //         `select * from AddOns where AddOnsId= ${req.query.AddOnsId} AND ActiveStatus='A'`
  //       );
  //       res.json({ status: true, data: result.recordset });
  //     }
  //   } catch (error) {
  //     errorHandle.handleError(error, (errorRes) => {
  //       res.send(errorRes);
  //     });
  //   }
  // }
  async getAllAddOnsDataByResId(req, res) {
    try {
      if (!req.query.RestaurantId) res.json(commonMsgs.NullMsg);
      else {
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .input("RestaurantId", req.query.RestaurantId)
                        .execute("getAddOnsData")
        if (result.recordset[0].mainData!=null){
          res.json({status: true, data:JSON.parse(result.recordset[0].mainData)})

        }
        else{
          res.json({status: true, data: []})
        }
        }
    } catch (error) {
      errorHandle.handleError(error, (errorRes) => {
        res.send(errorRes);
      });
    }
  }
  // async getAllAddOnsDataByResId(req, res) {
  //   try {
  //     if (!req.query.RestaurantId) res.json(commonMsgs.NullMsg);
  //     else {
  //       const pool = await poolPromise;
  //       let result = await pool.query(
  //         `select * from AddOns where RestaurantId= ${req.query.RestaurantId}`
  //       );
  //       res.json({ status: true, data: result.recordset });
  //     }
  //   } catch (error) {
  //     errorHandle.handleError(error, (errorRes) => {
  //       res.send(errorRes);
  //     });
  //   }
  // }

  async addData(req, res) {
    try {
      if (
        !(
          req.body.RestaurantId && req.body.AddOnsName &&  req.body.AddOnsType && req.body.CreatedBy &&
          req.body.ImageLink
        )
      )
        res.json(commonMsgs.NullMsg);
      else {
          const pool = await poolPromise;
          let result = await pool
                          .request()
                          .input("AddOnsName", req.body.AddOnsName)
                          .input("CreatedBy", req.body.CreatedBy)
                          .input("ImageLink",req.body.ImageLink)
                          .input("RestaurantId",req.body.RestaurantId)
                          .input("AddOnsType",req.body.AddOnsType)
                          .input("Tariff",req.body.Tariff)
                          .execute("addAddOnsData")
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
  //       !(
  //         req.body.RestaurantId && req.body.AddOnsName &&  req.body.AddOnsType && req.body.CreatedBy &&
  //         req.body.ImageLink
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
  //         // `INSERT INTO AddOns(${ColNameQuery}) VALUES(${ColValueQuery})`

  //         `BEGIN
  //               IF NOT EXISTS (SELECT * FROM AddOns 
  //                  WHERE AddOnsName = '${req.body.AddOnsName}')
  //               BEGIN
  //                 INSERT INTO AddOns (${ColNameQuery})
  //                 VALUES (${ColValueQuery})
  //               END
  //             END`
  //       );
  //       if(result.rowsAffected.length==0){
  //         res.json({status:false, message:'AddOns name already exists!'});
  //       }else{
  //         res.json(commonMsgs.AddMsg);
  //       }
  //     }
  //   } catch (error) {
  //     errorHandle.handleError(error, (errorRes) => {
  //       res.send(errorRes);
  //     });
  //   }
  // }

  async updateData(req, res) {
    try {
      const { AddOnsId, UpdatedBy } = req.body;
      if (!AddOnsId || !UpdatedBy) return res.json(commonMsgs.NullMsg);
      else {
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .input("AddOnsId", req.body.AddOnsId)
                        .input("AddOnsName", req.body.AddOnsName)
                        .input("UpdatedBy",req.body.UpdatedBy)
                        .input("ImageLink",req.body.ImageLink)
                        .input("RestaurantId",req.body.RestaurantId)
                        .input("AddOnsType",req.body.AddOnsType)
                        .input("Tariff",req.body.Tariff)
                        .execute("updateAddOnsData")
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
  //     const { AddOnsId, UpdatedBy } = req.body;
  //     if (!AddOnsId || !UpdatedBy) return res.json(commonMsgs.NullMsg);
  //     let queryValue = null;
  //     for (const [key, value] of Object.entries(req.body)) {
  //       if (key != "AddOnsId")
  //         queryValue == null
  //           ? (queryValue = `${key}='${value}'`)
  //           : (queryValue += `,${key}='${value}'`);
  //     }
  //     const pool = await poolPromise;
  //     let result = await pool.request()
  //     .input("AddOnsType", req.body.AddOnsType)
  //     .input("AddOnsName", req.body.AddOnsName)
  //     .input("ImageLink", req.body.ImageLink)
  //     .input("UpdatedBy", req.body.UpdatedBy)
  //     .input("AddOnsId", req.body.AddOnsId)
  //     .query(
  //       `IF NOT EXISTS(SELECT * FROM AddOns WHERE AddOnsId = @AddOnsId AND AddOnsName = @AddOnsName)UPDATE AddOns SET AddOnsType=@AddOnsType,AddOnsName=@AddOnsName,ImageLink=@ImageLink, UpdatedDate = GETDATE()  WHERE AddOnsId = @AddOnsId`
  //     );
  //     if (result.rowsAffected == 0) throw "Addons Already Exists!"
  //     res.json(commonMsgs.updateMsg);
  //   } catch (error) {
  //     errorHandle.handleError(error, (errorRes) => {
  //       res.send(errorRes);
  //     });
  //   }
  // }

  async deleteData(req, res) {
    const { ActiveStatus, AddOnsId } = req.query;
    try {
      if (!AddOnsId || !ActiveStatus) return res.json(commonMsgs.NullMsg);
      else {
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .input("ActiveStatus", req.query.ActiveStatus)
                        .input("AddOnsId", req.query.AddOnsId)
                        .execute("deleteAddOnsData")
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
  //   const { ActiveStatus, AddOnsId } = req.query;
  //   try {
  //     if (!AddOnsId || !ActiveStatus) return res.json(commonMsgs.NullMsg);
  //     const pool = await poolPromise;
  //     await pool.query(
  //       `UPDATE AddOns SET ActiveStatus = '${ActiveStatus}'  WHERE AddOnsId = '${AddOnsId}'`
  //     );
  //     res.json(commonMsgs.deleteMsg);
  //   } catch (error) {
  //     errorHandle.handleError(error, (errorRes) => {
  //       res.send(errorRes);
  //     });
  //   }
  // }
}

const addOnsMaster = new AddOnsMasterController();

module.exports = addOnsMaster;
