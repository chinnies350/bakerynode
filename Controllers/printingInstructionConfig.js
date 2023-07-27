const errorHandle = require("../services/errorHandler");
const commonMsgs = require("../CommonMsg.json");
const { poolPromise, sql } = require("../db");


class PrintingInstructionConfigController {
  async getData(req, res) {
    try {
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .input("uniqueId", req.query.uniqueId)
                        .input("storeId", req.query.storeId)
                        .input("branchId", req.query.branchId)
                        .input("instructionType", req.query.instructionType)
                        .input("activeStatus", req.query.activeStatus)
                        .input("type", req.query.type)
                        .execute("getPrintingInstructionsConfig")
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

  async addData(req, res) {
    try{
      let {storeId,
        branchId,
        // instructionType,
        instructions,
        createdBy
        } = await req.body										
      const pool = await poolPromise;
      const result = await pool.request()
                          .input("storeId",storeId)
                          .input("branchId",branchId)
                          .input("instructionType","R")
                          .input("instructions",instructions)
                          .input("createdBy",createdBy)
                          .execute("postPrintingInstructionsConfig")
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


  async addBranchData(req, res) {
    try {
      if (
        !(req.body.branchId && req.body.PrintingInstructionsDetailsJson && req.body.createdBy)
      )
        res.json(commonMsgs.NullMsg);
      else {
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .input("storeId", req.body.storeId)
                        .input("branchId", req.body.branchId)
                        .input("instructionType","R")
                        .input("PrintingInstructionsDetailsJson",JSON.stringify(req.body.PrintingInstructionsDetailsJson))
                        .input("createdBy", req.body.createdBy)
                        .execute("postBranchPrintingInstructionsConfig")
        if (result.recordset[0][""][1] == 1) {
          res.json(commonMsgs.AddMsg);
        }
        else {
          res.status({status: false, message:result.recordset[0][""][0]})
        }
        }
        
    //   }
    } 
    catch (error) {
      errorHandle.handleError(error, errorRes => {
        res.send(errorRes);
      });
    }
  }
  async updateData(req, res) {
    try{
      let {storeId,
        branchId,
        // instructionType,
        instructions,
        updatedBy,
        uniqueId
        } = await req.body										
      const pool = await poolPromise;
      const result = await pool.request()
                          .input("storeId",storeId)
                          .input("branchId",branchId)
                          .input("instructionType","R")
                          .input("instructions",instructions)
                          .input("updatedBy",updatedBy)
                          .input("uniqueId",uniqueId)
                          .execute("putPrintingInstructionsConfig")
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
            req.query.uniqueId && 
            req.query.activeStatus
           )
      )
        res.json(commonMsgs.NullMsg);
      else {
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .input("uniqueId", req.query.uniqueId)
                        .input("activeStatus", req.query.activeStatus)
                        .execute("deletePrintingInstructionsConfig")
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

const PrintingInstructionConfig = new PrintingInstructionConfigController();

module.exports = PrintingInstructionConfig;
