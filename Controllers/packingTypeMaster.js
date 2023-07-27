const errorHandle = require("../services/errorHandler");
const commonMsgs = require("../CommonMsg.json");
const { poolPromise, sql } = require("../db");


class PackingTypeController {
  async getData(req, res) {
    try {
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .input("uniqueId", req.query.uniqueId)
                        .input("branchId", req.query.branchId)
                        .execute("getPackingTypeMaster")
        if (result.recordset[0].mainData!=null){
          res.json({status: true, data:JSON.parse(result.recordset[0].mainData)})

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
      let {BranchId,
        PackingType,
        Price,
        CGST,
        SGST,
        CreatedBy
        } = await req.body										
      const pool = await poolPromise;
      const result = await pool.request()
                          .input("BranchId",BranchId)
                          .input("PackingType",PackingType)
                          .input("Price",Price)
                          .input("CGST",CGST)
                          .input("SGST",SGST)
                          .input("CreatedBy",CreatedBy)
                          .execute("postPackingTypeMaster")
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
      let {BranchId,
        PackingType,
        Price,
        CGST,
        SGST,
        UpdatedBy,
        UniqueId
        } = await req.body										
      const pool = await poolPromise;
      const result = await pool.request()
                          .input("BranchId",BranchId)
                          .input("PackingType",PackingType)
                          .input("Price",Price)
                          .input("CGST",CGST)
                          .input("SGST",SGST)
                          .input("UpdatedBy",UpdatedBy)
                          .input("UniqueId",UniqueId)
                          .execute("putPackingTypeMaster")
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

  async deleteData(req, res) {
    try {
      if (
        !(
            req.query.UniqueId && 
            req.query.ActiveStatus
           )
      )
        res.json(commonMsgs.NullMsg);
      else {
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .input("UniqueId", req.query.UniqueId)
                        .input("ActiveStatus", req.query.ActiveStatus)
                        .execute("deletePackingTypeMaster")
        if (result.recordset[0][""][1] == 1) {
          res.json({
            "status": true,
            "message": "Data Deleted Successfully"
            
        },);
        }
        else {
          res.status({status: false, message:result.recordset[0][""][0]})
        }
        }
    } 
    catch (error) {
      errorHandle.handleError(error, errorRes => {
        res.send(errorRes);
      });
    }
  }
}

const PackingType = new PackingTypeController();

module.exports = PackingType;
