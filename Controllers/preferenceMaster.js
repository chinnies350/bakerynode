const errorHandle = require("../services/errorHandler");
const commonMsgs = require("../CommonMsg.json");
const { poolPromise, sql } = require("../db");

class PreferenceMasterController {
  async getData(req, res) {
    try {
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .input("PreferenceId", req.query.PreferenceId)
                        .execute("getPreferenceMasterById")
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
  //     if (!req.query.PreferenceId) res.json(commonMsgs.NullMsg);
  //     else {
  //       const pool = await poolPromise;
  //       let result = await pool.query(
  //         `SELECT * FROM PreferenceMaster WHERE PreferenceId= ${req.query.PreferenceId}`
  //       );
  //       res.json({ status: true, data: result.recordset });
  //     }
  //   } catch (error) {
  //     errorHandle.handleError(error, errorRes => {
  //       res.send(errorRes);
  //     });
  //   }
  // }
  async getDataByRestaurantId(req, res) {
    try {
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .input("RestaurantId", req.query.RestaurantId)
                        .execute("getDataByRestaurantId")
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
  // async getDataByRestaurantId(req, res) {
  //   try {
  //     if (!req.query.RestaurantId) res.json(commonMsgs.NullMsg);
  //     else {
  //       const pool = await poolPromise;
  //       let result = await pool.query(
  //         `SELECT * FROM PreferenceMaster WHERE RestaurantId= ${req.query.RestaurantId}`
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
        !(req.body.RestaurantId && req.body.ChairOption && req.body.RoomLink && req.body.BarLink && req.body.CreatedBy)
      )
        res.json(commonMsgs.NullMsg);
        else {
          const pool = await poolPromise;
          let result = await pool
                          .request()
                          .input("RestaurantId", req.body.RestaurantId)
                          .input("ChairOption", req.body.ChairOption)
                          .input("RoomLink",req.body.RoomLink)
                          .input("BarLink",req.body.BarLink)
                          .input("CreatedBy",req.body.CreatedBy)
                          .execute("addPreferenceMaster")
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
  //       !(req.body.RestaurantId && req.body.ChairOption && req.body.RoomLink && req.body.BarLink && req.body.CreatedBy)
  //     )
  //       res.json(commonMsgs.NullMsg);
  //     else {
  //       const pool = await poolPromise;
  //       let result = await pool.query(

  //         `
  //           IF NOT EXISTS(SELECT * FROM PreferenceMaster WHERE ChairOption IS NOT NULL AND RoomLink IS NOT NULL AND BarLink IS NOT NULL AND RestaurantId=${req.body.RestaurantId})
  //           INSERT INTO PreferenceMaster (RestaurantId,ChairOption,RoomLink,BarLink,CreatedBy,CreatedDate)
  //               VALUES (${req.body.RestaurantId},'${req.body.ChairOption}','${req.body.RoomLink}','${req.body.BarLink}',${req.body.CreatedBy},GETDATE())
  //           ELSE
  //               UPDATE PreferenceMaster SET ChairOption='${req.body.ChairOption}',RoomLink='${req.body.RoomLink}',BarLink='${req.body.BarLink}' WHERE RestaurantId=${req.body.RestaurantId}
  //               `
  //       );
  //       res.json(commonMsgs.AddMsg);
        
  //     }
  //   } catch (error) {
  //     errorHandle.handleError(error, errorRes => {
  //       res.send(errorRes);
  //     });
  //   }
  // }

  async updateData(req, res) {
    try {
      const { PreferenceId, RestaurantId, UpdatedBy } = req.body;
      if (!PreferenceId || !RestaurantId || !UpdatedBy)
        return res.json(commonMsgs.NullMsg);
      else {
          const pool = await poolPromise;
          let result = await pool
                          .request()
                          .input("RestaurantId", req.body.RestaurantId)
                          .input("ChairOption", req.body.ChairOption)
                          .input("RoomLink",req.body.RoomLink)
                          .input("BarLink",req.body.BarLink)
                          .input("UpdatedBy",req.body.UpdatedBy)
                          .input("PreferenceId",req.body.PreferenceId)
                          .execute("updatePreferenceMasterData")
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
  
  // async updateData(req, res) {
  //   try {
  //     const { PreferenceId, RestaurantId, UpdatedBy } = req.body;
  //     if (!PreferenceId || !RestaurantId || !UpdatedBy)
  //       return res.json(commonMsgs.NullMsg);
  //     let queryValue = null;
  //     for (const [key, value] of Object.entries(req.body)) {
  //       if (key != "PreferenceId")
  //         queryValue == null
  //           ? (queryValue = `${key}='${value}'`)
  //           : (queryValue += `,${key}='${value}'`);
  //     }
  //     const pool = await poolPromise;
  //     let updateResult=await pool.query(
  //       `
  //       UPDATE PreferenceMaster SET ${queryValue}, UpdatedDate = GETDATE() WHERE PreferenceId = ${PreferenceId} AND RestaurantId = ${RestaurantId}
  //      `

  //       // `UPDATE PreferenceMaster SET ${queryValue}, UpdatedDate = GETDATE() WHERE PreferenceId = ${PreferenceId} AND RestaurantId = ${RestaurantId}`
  //     );

      
  //       res.json(commonMsgs.updateMsg);
      
  //   } catch (error) {
  //     errorHandle.handleError(error, errorRes => {
  //       res.send(errorRes);
  //     });
  //   }
  // }

}

const PreferenceMaster = new PreferenceMasterController();

module.exports = PreferenceMaster;
