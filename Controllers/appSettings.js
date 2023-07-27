const errorHandle = require("../services/errorHandler");
const commonMsgs = require("../CommonMsg.json");
const { poolPromise, sql } = require("../db");


class AppSettingsController {
  async getData(req, res) {
    try {
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .input("uniqueId", req.query.uniqueId)
                        .input("branchId", req.query.branchId)
                        .input("activeStatus", req.query.activeStatus)
                        .input("appVersion", req.query.appVersion)
                        .input("appType", req.query.appType)
                        .execute("getAppSettings")
        if (result.recordset[0].mainData!=null){
          res.json({status: true, data:JSON.parse(result.recordset[0].mainData), appStatus:true})

        }
        else{
          res.json({status: true, data:[], appStatus:false})
        }
     
    }
    catch (error) {
      errorHandle.handleError(error, errorRes => {
        res.send(errorRes);
      });
    }
  }

  async addData(req, res) {
    try{
      let {branchId,
        privacyPolicy,
        termsAndConditions,
        appVersion,
        appType,
        // activeStatus,
        createdBy
        } = await req.body										
      const pool = await poolPromise;
      const result = await pool.request()
                          .input("branchId",branchId)
                          .input("privacyPolicy",privacyPolicy)
                          .input("termsAndConditions",termsAndConditions)
                          .input("appVersion",appVersion)
                          .input("appType",appType)
                          .input("activeStatus","A")
                          .input("createdBy",createdBy)
                          .execute("postAppSettings")
      if (result.recordset[0][""][1] == 1) {
        res.json({status:true,message:"Data Added Successfully"})
      }
      else {
        res.json({status: false, message:result.recordset[0][""][0]})
      }
    } catch (error) {
      errorHandle.handleError(error, (errorRes) => {
        res.send(errorRes);
      })
    }
  }

  async updateData(req, res) {
    try{
      let {branchId,
        privacyPolicy,
        termsAndConditions,
        appVersion,
        appType,
        updatedBy,
        uniqueId
        } = await req.body										
      const pool = await poolPromise;
      const result = await pool.request()
                          .input("branchId",branchId)
                          .input("privacyPolicy",privacyPolicy)
                          .input("termsAndConditions",termsAndConditions)
                          .input("appVersion",appVersion)
                          .input("appType",appType)
                          .input("updatedBy",updatedBy)
                          .input("uniqueId",uniqueId)
                          .execute("putAppSettings")
      if (result.recordset[0][""][1] == 1) {
        res.json({status:true,message:"Data Updated Successfully"})
      }
      else {
        res.json({status: false, message:result.recordset[0][""][0]})
      }
    } catch (error) {
      errorHandle.handleError(error, (errorRes) => {
        res.send(errorRes);
      })
    }
  }
    
}

const AppSettings = new AppSettingsController();

module.exports = AppSettings;
