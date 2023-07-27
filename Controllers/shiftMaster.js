const errorHandle = require("../services/errorHandler");
const commonMsgs = require("../CommonMsg.json");
const { poolPromise, sql } = require("../db");

class ShiftMasterController {
  async getAllData(req, res) {
    try {
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .input("BranchId",req.query.BranchId)
                        .execute("getAllShiftMasterData")
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
  //       `SELECT ShiftId, ShiftName, substring(convert(char(8),StartTime,114), 1, 5) as StartTime,substring(convert(char(8),EndTime,114), 1, 5) as EndTime,substring(convert(char(8),BreakStartTime,114), 1, 5) as BreakStartTime,substring(convert(char(8),BreakEndTime,114), 1, 5) as  BreakEndTime,GracePeriod,ActiveStatus, CreatedBy,CONVERT(VARCHAR(10),CreatedDate,103) as CreatedDate,UpdatedBy,CONVERT(VARCHAR(10),UpdatedDate,103) as UpdatedDate FROM ShiftMaster`
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
      const { CreatedBy } = req.body;
      if (!CreatedBy) return res.json(commonMsgs.NullMsg);
      else {
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .input("BranchId",req.body.BranchId)
                        .input("ShiftName", req.body.ShiftName)
                        .input("StartTime", req.body.StartTime)
                        .input("EndTime",req.body.EndTime)
                        .input("BreakStartTime",req.body.BreakStartTime)
                        .input("BreakEndTime",req.body.BreakEndTime)
                        .input("GracePeriod",req.body.GracePeriod)
                        .input("CreatedBy",req.body.CreatedBy)
                        .execute("addShiftMaster")
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
  //     let ColNameQuery = "",
  //       ColValueQuery = "";
  //     const { CreatedBy } = req.body;
  //     if (!CreatedBy) return res.json(commonMsgs.NullMsg);
  //     for (let key in req.body) {
  //       if (req.body[key]) {
  //         ColNameQuery += `${ColNameQuery != `` ? `,` : ``}${key}`;
  //         ColValueQuery += `${ColValueQuery != `` ? `,` : ``}'${
  //           req.body[key]
  //         }'`;
  //       }
  //     }
  //     const pool = await poolPromise;
  //     let result = await pool.query(
  //       // `INSERT INTO ShiftMaster(${ColNameQuery}) VALUES(${ColValueQuery})`

  //       `BEGIN
  //       IF NOT EXISTS (SELECT * FROM ShiftMaster 
  //          WHERE ShiftName = '${req.body.ShiftName}')
  //       BEGIN
  //         INSERT INTO ShiftMaster (${ColNameQuery})
  //         VALUES (${ColValueQuery})
  //       END
  //     END`
  //     );
  //     if (result.rowsAffected.length == 0) {
  //       res.json({ status: false, message: "Shift Name already exists!" });
  //     } else {
  //       res.json(commonMsgs.AddMsg);
  //     }
  //   } catch (error) {
  //     errorHandle.handleError(error, (errorRes) => {
  //       res.send(errorRes);
  //     });
  //   }
  // }

  async updateData(req, res) {
    try {
      const { ShiftId } = req.body;
      if (!ShiftId) return res.json(commonMsgs.NullMsg);
      else {
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .input("ShiftName", req.body.ShiftName)
                        .input("StartTime", req.body.StartTime)
                        .input("EndTime",req.body.EndTime)
                        .input("BreakStartTime",req.body.BreakStartTime)
                        .input("BreakEndTime",req.body.BreakEndTime)
                        .input("GracePeriod",req.body.GracePeriod)
                        .input("UpdatedBy",req.body.UpdatedBy)
                        .input("ShiftId",req.body.ShiftId)
                        .input("BranchId",req.body.BranchId)
                        .execute("updateShiftMasterData")
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
  //     const { ShiftId } = req.body;
  //     if (!ShiftId) return res.json(commonMsgs.NullMsg);
  //     let queryValue = null;
  //     for (const [key, value] of Object.entries(req.body)) {
  //       if (key != "ShiftId")
  //         queryValue == null
  //           ? (queryValue = `${key}='${value}'`)
  //           : (queryValue += `,${key}='${value}'`);
  //     }
  //     const pool = await poolPromise;
  //     let updateShiftResult=await pool.query(
  //       `BEGIN 
  //         IF NOT EXISTS (SELECT * FROM ShiftMaster WHERE ShiftId='${req.body.ShiftId}' AND ShiftName!='${req.body.ShiftName}')
  //         BEGIN
  //           UPDATE ShiftMaster SET ${queryValue}, UpdatedDate=GETDATE() WHERE ShiftId=${ShiftId}
  //         END
  //       END`


  //       // `UPDATE ShiftMaster SET ${queryValue}, UpdatedDate = GETDATE()  WHERE ShiftId = ${ShiftId}`
  //     );

  //     // console.log("updateShiftResult+", updateShiftResult);
  //     if(updateShiftResult.rowsAffected.length>0){
  //       return res.json(commonMsgs.updateMsg);
  //     }
  //     res.json(commonMsgs.DataNotFoundMsg)
  //   } catch (error) {
  //     errorHandle.handleError(error, (errorRes) => {
  //       res.send(errorRes);
  //     });
  //   }
  // }

  async deleteData(req, res) {
    const { ShiftId, ActiveStatus } = req.query;
    try {
      if (!ShiftId || !ActiveStatus) return res.json(commonMsgs.NullMsg);
      else {
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .input("ActiveStatus", req.query.ActiveStatus)
                        .input("ShiftId", req.query.ShiftId)
                        .execute("deleteShiftMasterData")
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
  //   const { ShiftId, ActiveStatus } = req.query;
  //   try {
  //     if (!ShiftId || !ActiveStatus) return res.json(commonMsgs.NullMsg);
  //     const pool = await poolPromise;
  //     await pool.query(
  //       `UPDATE ShiftMaster SET ActiveStatus = '${ActiveStatus}'  WHERE ShiftId = '${ShiftId}'`
  //     );
  //     res.json(commonMsgs.deleteMsg);
  //   } catch (error) {
  //     errorHandle.handleError(error, (errorRes) => {
  //       res.send(errorRes);
  //     });
  //   }
  // }
}

const ShiftMaster = new ShiftMasterController();

module.exports = ShiftMaster;
