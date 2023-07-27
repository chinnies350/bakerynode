const errorHandle = require("../services/errorHandler");
const commonMsgs = require("../CommonMsg.json");
const utiityFile=require("../utility");
const { poolPromise, sql } = require("../db");
var API_Services = require("../services/API_services");
const { request } = require("express");

class TaxMasterController {
  async getAllData(req, res) {
    try {
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .execute("getAllTaxData")
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
    //     const { recordset } = await pool.query(`select * from TaxMaster`);
    //     res.json({ status: true, data: recordset });
    //   } catch (error) {
    //     errorHandle.handleError(error, (errorRes) => {
    //       res.send(errorRes);
    //     });
    //   }
    // }

    async getTaxData(req, res) {
      try {
          const pool = await poolPromise;
          let result = await pool
                          .request()
                          .input("Date", req.query.Date)
                          .execute("getTaxData")
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
    
    // async getTaxData(req, res) {
    //   try {
    //     if (!req.query.Date) return res.json(commonMsgs.NullMsg);
    //     const pool = await poolPromise;
    //     const { recordset } = await pool
    //       .request()
    //       .input("Date", req.query.Date)
    //       .query(
    //         `select TaxId, ServiceName, TaxDescription, TaxPercentage, RefNumber FROM TaxMaster WHERE 
    //         ActiveStatus = 'A' AND ServiceName = 'Restaurant'`,
    //         (error, TaxResult) => {
    //           if (error) {
    //             throw error;
    //           } else {
    //             res.json({ status: true, data: TaxResult.recordset });
    //           }
    //         }
    //       );
    //   } catch (error) {
    //     errorHandle.handleError(error, errorRes => {
    //       res.send(errorRes);
    //     });
    //   }
    // }

    async addData(req, res) {
      try {
        const { ServiceName, CreatedBy } = req.body;
        if (!ServiceName || !CreatedBy) return res.json(commonMsgs.NullMsg);
        // const { ColValueQuery, ColNameQuery } = await utiityFile.getAddQuery(req.body);
        else {
          const pool = await poolPromise;
          let result = await pool
                          .request()
                          .input("ServiceName", req.body.ServiceName)
                          .input("TaxDescription", req.body.TaxDescription)
                          .input("TaxPercentage",req.body.TaxPercentage)
                          .input("EffectiveFrom",req.body.EffectiveFrom)
                          .input("RefNumber",req.body.RefNumber)
                          .input("RefDate",req.body.RefDate)
                          .input("RefDocumentLink",req.body.RefDocumentLink)
                          .input("CreatedBy",req.body.CreatedBy)
                          .execute("addTaxMaster")
          if (result.recordset[0][""][1] == 1) {
            res.json({ status: true, message: "Tax Data Added Successfully." });
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
    //     const { ServiceName, CreatedBy } = req.body;
    //     if (!ServiceName || !CreatedBy) return res.json(commonMsgs.NullMsg);
    //     // const { ColValueQuery, ColNameQuery } = await utiityFile.getAddQuery(req.body);
    //     const pool = await poolPromise;
    //     // {"ServiceName":"Restaurant","TaxDescription":"cgst","TaxPercentage":"1","EffectiveFrom":"2021-07-01","EffectiveTill":"2021-08-05","RefNumber":"9897878","RefDate":"2021-06-15","RefDocumentLink":"http://www.prematix.solutions/ttdc-hotel-api/image/7c035f1ab1bd6eb2d3b388e629894a8b.png","ActiveStatus":"A","CreatedBy":"1167","TaxId":3}
       
    //     let result=await pool.query(
    //       `
    //       BEGIN
    //       IF NOT EXISTS(SELECT * FROM TaxMaster WHERE EffectiveFrom='${req.body.EffectiveFrom}' AND TaxDescription='${req.body.TaxDescription}')
    //           BEGIN
    //           IF NOT EXISTS(SELECT * FROM TaxMaster WHERE TaxDescription='${req.body.TaxDescription}' )
    //               BEGIN
    //               INSERT INTO TaxMaster(TaxId, ServiceName, TaxDescription,TaxPercentage,EffectiveFrom,RefNumber,RefDate,RefDocumentLink,ActiveStatus,CreatedBy,UpdatedBy)
    //               VALUES(3, '${req.body.ServiceName}', '${req.body.TaxDescription}',${req.body.TaxPercentage},'${req.body.EffectiveFrom}','${req.body.RefNumber}','${req.body.RefDate}','${req.body.RefDocumentLink}','A',${req.body.CreatedBy},${req.body.CreatedBy})
    //               END
    //             ELSE
    //               BEGIN 
    //               UPDATE TaxMaster  SET EffectiveTill=cast(DATEADD(day,-1,'${req.body.EffectiveFrom}') as Date),ActiveStatus='D' WHERE
    //               TaxDescription='${req.body.TaxDescription}' and EffectiveTill IS NULL
    //               IF @@ROWCOUNT >0
    //               INSERT INTO TaxMaster(TaxId, ServiceName, TaxDescription,TaxPercentage,EffectiveFrom,RefNumber,RefDate,RefDocumentLink,ActiveStatus,CreatedBy,UpdatedBy)
    //                 values(3, '${req.body.ServiceName}', '${req.body.TaxDescription}',${req.body.TaxPercentage},'${req.body.EffectiveFrom}','${req.body.RefNumber}','${req.body.RefDate}','${req.body.RefDocumentLink}','A',${req.body.CreatedBy},${req.body.CreatedBy})
    //               END
    //             END
          
    //       END`
    //     );
        
    //   if (result.rowsAffected[0] > 0) {
    //       res.json({ status: true, message: "Tax Data Added Successfully." })
    //     }
    //   else{

    //     res.json({ status: false, message: "Tax Data Already Exists!" })
    //   }
        
    //   } catch (error) {
    //     errorHandle.handleError(error, (errorRes) => {
    //       res.send(errorRes);
    //     });
    //   }
    // }
    async updateData(req, res) {
      try {
        const { UniqueId } = req.body;
        if (!UniqueId) return res.json(commonMsgs.NullMsg);
        else {
          const pool = await poolPromise;
          let result = await pool
                          .request()
                          .input("UniqueId", req.body.UniqueId)
                          .input("TaxId", req.body.TaxId)
                          .input("ServiceName",req.body.ServiceName)
                          .input("TaxDescription",req.body.TaxDescription)
                          .input("TaxPercentage",req.body.TaxPercentage)
                          .input("EffectiveFrom",req.body.EffectiveFrom)
                          .input("EffectiveTill",req.body.EffectiveTill)
                          .input("RefNumber",req.body.RefNumber)
                          .input("RefDate",req.body.RefDate)
                          .input("RefDocumentLink",req.body.RefDocumentLink)
                          .input("UpdatedBy",req.body.UpdatedBy)
                          .execute("updateTaxMasterData")
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
    //     const { UniqueId } = req.body;
    //     if (!UniqueId) return res.json(commonMsgs.NullMsg);
    //     const keyArr = ["UniqueId"];
    //     const { queryValue } = await utiityFile.getUpdateQuery(req.body, keyArr);
    //     const pool = await poolPromise;
    //     await pool.query(
    //       `UPDATE TaxMaster SET ${queryValue}, UpdatedDate = GETDATE()  WHERE UniqueId = ${UniqueId}`
    //     );
    //     res.json(commonMsgs.updateMsg);
    //   } catch (error) {
    //     errorHandle.handleError(error, (errorRes) => {
    //       res.send(errorRes);
    //     });
    //   }
    // }

    async deleteData(req, res) {
      const { UniqueId, ActiveStatus } = req.query;
      try {
        if (!UniqueId || !ActiveStatus) return res.json(commonMsgs.NullMsg);
        else {
          const pool = await poolPromise;
          let result = await pool
                          .request()
                          .input("ActiveStatus", req.query.ActiveStatus)
                          .input("UniqueId", req.query.UniqueId)
                          .execute("deleteTaxMasterData")
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
    //   const { UniqueId, ActiveStatus } = req.query;
    //   try {
    //     if (!UniqueId || !ActiveStatus) return res.json(commonMsgs.NullMsg);
    //     const pool = await poolPromise;
    //     await pool.query(
    //       `UPDATE TaxMaster SET ActiveStatus = '${ActiveStatus}'  WHERE UniqueId = '${UniqueId}' UPDATE TaxMaster SET ActiveStatus = '${ActiveStatus}' WHERE ActiveStatus = 'A'`
    //     );
    //     res.json(commonMsgs.deleteMsg);
    //   } catch (error) {
    //     errorHandle.handleError(error, (errorRes) => {
    //       res.send(errorRes);
    //     });
    //   }
    // }
  }

  const taxMaster=new TaxMasterController();

  module.exports=taxMaster;