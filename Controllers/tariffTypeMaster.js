const errorHandle = require("../services/errorHandler");
const commonMsgs = require("../CommonMsg.json");
const utiityFile = require("../utility");
const { poolPromise, sql } = require("../db");
var API_Services = require("../services/API_services");

class TariffTypeMasterController {
  async getAllData(req, res) {
    try {
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .execute("getAllTariffTypeData")
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
  //     const { recordset } = await pool.query(
  //       `SELECT RestaurantId,TariffTypeId,TariffTypeName,convert(varchar,TariffType.SeasonStart,121) AS SeasonStart,convert(varchar,TariffType.SeasonEnd,121) SeasonEnd,ActiveStatus,CreatedBy,CreatedDate,UpdatedBy,UpdatedDate FROM TariffType`
  //     );
  //     res.json({ status: true, data: recordset });
  //   } catch (error) {
  //     errorHandle.handleError(error, (errorRes) => {
  //       res.send(errorRes);
  //     });
  //   }
  // }

  async addData(req, res) {
    try {
      const pool = await poolPromise;
      let result = await pool
                        .request()
                        .input("RestaurantId", req.body.RestaurantId)
                        .input("TariffTypeName", req.body.TariffTypeName)
                        .input("SeasonStart",req.body.SeasonStart)
                        .input("SeasonEnd",req.body.SeasonEnd)
                        .input("CreatedBy",req.body.CreatedBy)
                        .execute("addTariffTypeData")
        if (result.recordset[0][""][1] == 1) {
          res.json(commonMsgs.AddMsg);
        }
        else {
          res.json({status: false, message:result.recordset[0][""][0]})
        }
    } catch (error) {
      errorHandle.handleError(error, (errorRes) => {
        res.send(errorRes);
      });
    }
  }
  // async addData(req, res) {
  //   try {
  //     let ColNameQuery = "",
  //       ColValueQuery = "";
  //     const { RestaurantId, CreatedBy } = req.body;
  //     if (!RestaurantId || !CreatedBy) return res.json(commonMsgs.NullMsg);
  //     for (let key in req.body) {
  //       if (req.body[key]) {
  //         ColNameQuery += `${ColNameQuery != `` ? `,` : ``}${key}`;
  //         ColValueQuery += `${ColValueQuery != `` ? `,` : ``}'${
  //           req.body[key]
  //         }'`;
  //       }
  //     }
  //     const pool = await poolPromise;
  //     await pool.query(
  //       `INSERT INTO TariffType(${ColNameQuery}) VALUES(${ColValueQuery})`
  //     );
  //     res.json(commonMsgs.AddMsg);
  //   } catch (error) {
  //     errorHandle.handleError(error, (errorRes) => {
  //       res.send(errorRes);
  //     });
  //   }
  // }

  async updateData(req, res) {
    try {
      const { RestaurantId, TariffTypeId } = req.body;
      if (!RestaurantId || !TariffTypeId) return res.json(commonMsgs.NullMsg);
      else {
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .input("TariffTypeId", req.body.TariffTypeId)
                        .input("RestaurantId", req.body.RestaurantId)
                        .input("TariffTypeName",req.body.TariffTypeName)
                        .input("SeasonStart",req.body.SeasonStart)
                        .input("SeasonEnd",req.body.SeasonEnd)
                        .input("UpdatedBy",req.body.UpdatedBy)
                        .execute("updateTariffTypeData")
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
  //     const { RestaurantId, TariffTypeId } = req.body;
  //     if (!RestaurantId || !TariffTypeId) return res.json(commonMsgs.NullMsg);
  //     let queryValue = null;
  //     for (const [key, value] of Object.entries(req.body)) {
  //       if (key != "RestaurantId" && key != "TariffTypeId")
  //         queryValue == null
  //           ? (queryValue = `${key}='${value}'`)
  //           : (queryValue += `,${key}='${value}'`);
  //     }
  //     const pool = await poolPromise;
  //     await pool.query(
  //       `UPDATE TariffType SET ${queryValue}, UpdatedDate = GETDATE()  WHERE RestaurantId = ${RestaurantId} AND TariffTypeId =${req.body.TariffTypeId}`
  //     );
  //     res.json(commonMsgs.updateMsg);
  //   } catch (error) {
  //     errorHandle.handleError(error, (errorRes) => {
  //       res.send(errorRes);
  //     });
  //   }
  // }

  async deleteData(req, res) {
    const { RestaurantId, ActiveStatus, TariffTypeId } = req.query;
    try {
      if (!RestaurantId || !ActiveStatus || !TariffTypeId)
        return res.json(commonMsgs.NullMsg);
      else {
          const pool = await poolPromise;
          let result = await pool
                          .request()
                          .input("RestaurantId", req.query.RestaurantId)
                          .input("ActiveStatus", req.query.ActiveStatus)
                          .input("TariffTypeId", req.query.TariffTypeId)
                          .execute("deleteTariffTypeData")
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
  //   const { RestaurantId, ActiveStatus, TariffTypeId } = req.query;
  //   try {
  //     if (!RestaurantId || !ActiveStatus || !TariffTypeId)
  //       return res.json(commonMsgs.NullMsg);
  //     const pool = await poolPromise;
  //     await pool.query(
  //       `UPDATE TariffType SET ActiveStatus = '${ActiveStatus}'  WHERE RestaurantId = '${RestaurantId}'AND TariffTypeId ='${TariffTypeId}'`
  //     );
  //     res.json(commonMsgs.deleteMsg);
  //   } catch (error) {
  //     errorHandle.handleError(error, (errorRes) => {
  //       res.send(errorRes);
  //     });
  //   }
  // }
}

const tariffTypeMaster = new TariffTypeMasterController();

module.exports = tariffTypeMaster;
