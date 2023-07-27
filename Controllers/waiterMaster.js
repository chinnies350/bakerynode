const errorHandle = require("../services/errorHandler");
const commonMsgs = require("../CommonMsg.json");
const utilityFile = require("../utility");
const { poolPromise, sql } = require("../db");
var API_Services = require("../services/API_services");

class WaiterMasterController {
  async getData(req, res) {
    try {
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .execute("getAllWaiters")
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
  //     const pool = await poolPromise;
  //     if (!req.query.RestaurantId) {
  //       let result = await pool.query(
  //         `SELECT RestaurantId,
  //           FirstName, LastName, Mobile, Email, Aadhar, WaiterType, ZipCode, City, District, State,ShiftId, Address1, Address2, ImageLink FROM WaiterMaster`
  //       );
  //       res.json({ status: true, data: result.recordset });
  //     } else {
  //       let result = await pool.query(
  //         `SELECT RestaurantId, WaiterId, 
  //           FirstName, LastName, Mobile, Email, WaiterMaster.ShiftId, ShiftMaster.ShiftName, Aadhar, WaiterType, ZipCode, City, District, State,WaiterMaster.ActiveStatus,
  //           Address1, Address2, WaiterMaster.CreatedBy, ImageLink FROM WaiterMaster, ShiftMaster WHERE WaiterMaster.ShiftId = ShiftMaster.ShiftId`
  //       );
  //       res.json({ status: true, data: result.recordset });
  //     }
  //   } catch (error) {
  //     errorHandle.handleError(error, errorRes => {
  //       res.send(errorRes);
  //     });
  //   }
  // }

  async getWorkersShift(req, res) {
    try {
      const pool = await poolPromise;
      if (!req.query.time && !req.query.RestaurantId) {
        res.json({ status: false, message: "Please provide all the details" });
        return;
      }
      else {
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .input("RestaurantId", req.query.RestaurantId)
                        .input("time",req.query.time)
                        .execute("getWorkersShift")
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

  // async getWorkersShift(req, res) {
  //   try {
  //     const pool = await poolPromise;
  //     if (!req.query.time && !req.query.RestaurantId) {
  //       res.json({ status: false, message: "Please provide all the details" });
  //       return;
  //     }
  //     let result = await pool.query(
  //       `SELECT ShiftMaster.ShiftId,WaiterId,FirstName,LastName,Mobile,Email,WaiterMaster.ActiveStatus,Aadhar,WaiterType,ZipCode,City,District,State,Address1 FROM ShiftMaster,WaiterMaster WHERE '${req.query.time}' BETWEEN CONVERT(TIME, StartTime) AND CONVERT(TIME, EndTime) AND ShiftMaster.ShiftId=WaiterMaster.ShiftId AND WaiterMaster.ActiveStatus='A' AND RestaurantId = '${req.query.RestaurantId}'`
  //     );
  //     res.json({ status: true, data: result.recordset });
  //   } catch (error) {
  //     errorHandle.handleError(error, errorRes => {
  //       res.send(errorRes);
  //     });
  //   }
  // }

  async addData(req, res) {
    try {
      if (
        !(
          req.body.RestaurantId ||
          req.body.FirstName ||
          req.body.LastName ||
          req.body.Mobile ||
          req.body.Email ||
          req.body.Aadhar ||
          req.body.WaiterType ||
          req.body.ZipCode ||
          req.body.City ||
          req.body.District ||
          req.body.State ||
          req.body.StreetName ||
          req.body.Location ||
          req.body.ImageLink ||
          req.body.CreatedBy
        )
      )
        res.json(commonMsgs.NullMsg);
      else{
          const pool = await poolPromise;
          let result = await pool
                          .request()
                          .input("RestaurantId", req.body.RestaurantId)
                          .input("FirstName", req.body.FirstName)
                          .input("LastName",req.body.LastName)
                          .input("Mobile",req.body.Mobile)
                          .input("Email",req.body.Email)
                          .input("ShiftId",req.body.ShiftId)
                          .input("Aadhar",req.body.Aadhar)
                          .input("WaiterType",req.body.WaiterType)
                          .input("Zipcode",req.body.Zipcode)
                          .input("City",req.body.City)
                          .input("District",req.body.District)
                          .input("State",req.body.State)
                          .input("Address1",req.body.Address1)
                          .input("Address2",req.body.Address2)
                          .input("ImageLink",req.body.ImageLink)
                          .input("CreatedBy",req.body.CreatedBy)
                          .execute("addWaiter")
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
  //       !(
  //         req.body.RestaurantId ||
  //         req.body.FirstName ||
  //         req.body.LastName ||
  //         req.body.Mobile ||
  //         req.body.Email ||
  //         req.body.Aadhar ||
  //         req.body.WaiterType ||
  //         req.body.ZipCode ||
  //         req.body.City ||
  //         req.body.District ||
  //         req.body.State ||
  //         req.body.StreetName ||
  //         req.body.Location ||
  //         req.body.ImageLink ||
  //         req.body.CreatedBy
  //       )
  //     )
  //       res.json(commonMsgs.NullMsg);
  //     else {
  //       const {
  //         ColNameQuery,
  //         ColValueQuery
  //       } = utilityFile.getInsertQueryModified(req.body);
  //       const pool = await poolPromise;

  //       let result = await pool.query(
  //         `INSERT INTO WaiterMaster(${ColNameQuery}) VALUES(${ColValueQuery})`
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
      if (!req.body.WaiterId) return res.json(commonMsgs.NullMsg);
      else {
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .input("RestaurantId", req.body.RestaurantId)
                        .input("WaiterId", req.body.WaiterId)
                        .input("FirstName",req.body.FirstName)
                        .input("LastName",req.body.LastName)
                        .input("Mobile",req.body.Mobile)
                        .input("Email",req.body.Email)
                        .input("ShiftId",req.body.ShiftId)
                        .input("Aadhar",req.body.Aadhar)
                        .input("WaiterType",req.body.WaiterType)
                        .input("Zipcode",req.body.Zipcode)
                        .input("City",req.body.City)
                        .input("District",req.body.District)
                        .input("State",req.body.State)
                        .input("Address1",req.body.Address1)
                        .input("Address2",req.body.Address2)
                        .input("ImageLink",req.body.ImageLink)
                        .input("UpdatedBy",req.body.UpdatedBy)
                        .execute("updateWaiterDetails")
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
  //     if (!req.body.WaiterId) return res.json(commonMsgs.NullMsg);
  //     let waiterId = req.body.WaiterId;
  //     let removeWaiterId = req.body;
  //     delete removeWaiterId.WaiterId;
  //     const { queryValue } = utilityFile.getUpdateQueryModified(req.body);
  //     const pool = await poolPromise;
  //     await pool.query(
  //       `UPDATE WaiterMaster SET ${queryValue} WHERE WaiterId = ${waiterId}`
  //     );
  //     res.json(commonMsgs.updateMsg);
  //   } catch (error) {
  //     errorHandle.handleError(error, errorRes => {
  //       res.send(errorRes);
  //     });
  //   }
  // }

  async deleteData(req, res) {
    const { ActiveStatus, WaiterId } = req.query;
    try {
      if (!WaiterId || !ActiveStatus) return res.json(commonMsgs.NullMsg);
      else {
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .input("ActiveStatus", req.query.ActiveStatus)
                        .input("WaiterId", req.query.WaiterId)
                        .execute("deleteWaiter")
        if (result.recordset[0][""][1] == 1) {
          res.json(commonMsgs.deleteMsg);
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

  // async deleteData(req, res) {
  //   const { ActiveStatus, WaiterId } = req.query;
  //   try {
  //     if (!WaiterId || !ActiveStatus) return res.json(commonMsgs.NullMsg);
  //     const pool = await poolPromise;
  //     await pool.query(
  //       `UPDATE WaiterMaster SET ActiveStatus = '${ActiveStatus}'  WHERE WaiterId = '${WaiterId}'`
  //     );
  //     res.json(commonMsgs.deleteMsg);
  //   } catch (error) {
  //     errorHandle.handleError(error, errorRes => {
  //       res.send(errorRes);
  //     });
  //   }
  // }
}

function findTimeRange(date) {
  if (date >= "08:30:00" && date <= "18:30:00") {
    return { value1: "08:30:00", value2: "18:30:00" };
  } else {
    return { value1: "18:30:00", value2: "08:30:00" };
  }
}

const waiterMaster = new WaiterMasterController();

module.exports = waiterMaster;
