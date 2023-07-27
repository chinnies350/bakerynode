const errorHandle = require("../services/errorHandler");
const commonMsgs = require("../CommonMsg.json");
const utiityFile=require("../utility");
const { poolPromise, sql } = require("../db");
var API_Services = require("../services/API_services");

class OfferMasterController {
  async getAllData(req, res) {
    try {
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .execute("getAllDataOffer")
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
    //     const result = await pool.query(
    //       `SELECT OfferId, OfferCategory, OfferName, OfferType, AmountType, Offer, MinBIllAmount, convert(varchar,EffectiveFrom,121) AS EffectiveFrom, convert(varchar,EffectiveTill,121) AS EffectiveTill, ActiveStatus, CreatedBy, CreatedDate, UpdatedBy, UpdatedDate from OfferMaster`
    //     );
    //     res.json({ status: true, data: result.recordset });
    //   } catch (error) {
    //     errorHandle.handleError(error, (errorRes) => {
    //       res.send(errorRes);
    //     });
    //   }
    // }

    async getOfferData(req, res) {
      try {
          const pool = await poolPromise;
          let result = await pool
                          .request()
                          .input("OfferId", req.query.OfferId)
                          .execute("getOfferData")
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

    // async getOfferData(req, res) {
    //   try {
    //     const pool = await poolPromise;
    //     const result = await pool.query(
    //       `SELECT * from OfferMaster where ActiveStatus='A' and cast(getdate() as date) between EffectiveFrom and EffectiveTill`
    //     );
    //     res.json({ status: true, data: result.recordset });
    //   } catch (error) {
    //     errorHandle.handleError(error, (errorRes) => {
    //       res.send(errorRes);
    //     });
    //   }
    // }

    async addData(req, res) {
      try {
        const { OfferCategory, OfferName, CreatedBy } = req.body;
        if (!OfferCategory || !OfferName || !CreatedBy)
          return res.json(commonMsgs.NullMsg);
        else {
            const pool = await poolPromise;
            let result = await pool
                            .request()
                            .input("OfferType", req.body.OfferType)
                            .input("OfferCategory", req.body.OfferCategory)
                            .input("OfferName",req.body.OfferName)
                            .input("AmountType",req.body.AmountType)
                            .input("Offer",req.body.Offer)
                            .input("MinBIllAmount",req.body.MinBIllAmount)
                            .input("EffectiveFrom",req.body.EffectiveFrom)
                            .input("EffectiveTill",req.body.EffectiveTill)
                            .input("CreatedBy",req.body.CreatedBy)
                            .execute("addOfferMaster")
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
    //     const { OfferCategory, OfferName, CreatedBy } = req.body;
    //     if (!OfferCategory || !OfferName || !CreatedBy)
    //       return res.json(commonMsgs.NullMsg);
    //     const { ColValueQuery, ColNameQuery } = await utiityFile.getAddQuery(req.body);
    //     const pool = await poolPromise;
    //     let result=await pool.query(
    //       // `INSERT INTO OfferMaster(${ColNameQuery}) VALUES(${ColValueQuery})`

    //       `BEGIN
    //       IF NOT EXISTS (SELECT * FROM OfferMaster 
    //          WHERE OfferName = '${req.body.OfferName}')
    //       BEGIN
    //         INSERT INTO OfferMaster (${ColNameQuery})
    //         VALUES (${ColValueQuery})
    //       END
    //     END`
    //     );

    //     if(result.rowsAffected.length==0){
    //       res.json({status:false, message:'Offer name already exists!'});
    //     }else{
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
        const { OfferId, UpdatedBy } = req.body;
        if (!OfferId || !UpdatedBy) return res.json(commonMsgs.NullMsg);
        else {
          const pool = await poolPromise;
          let result = await pool
                          .request()
                          .input("OfferType", req.body.OfferType)
                          .input("OfferCategory", req.body.OfferCategory)
                          .input("OfferName",req.body.OfferName)
                          .input("AmountType",req.body.AmountType)
                          .input("Offer",req.body.Offer)
                          .input("MinBIllAmount",req.body.MinBIllAmount)
                          .input("EffectiveFrom",req.body.EffectiveFrom)
                          .input("EffectiveTill",req.body.EffectiveTill)
                          .input("UpdatedBy",req.body.UpdatedBy)
                          .input("OfferId",req.body.OfferId)
                          .execute("updateOfferMasterData")
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
    //     const { OfferId, UpdatedBy } = req.body;
    //     if (!OfferId || !UpdatedBy) return res.json(commonMsgs.NullMsg);
    //     const keyArr = ["OfferId"];
    //     const  {queryValue}  = await utiityFile.getUpdateQuery(req.body, keyArr);
    //     const pool = await poolPromise;
    //     const result = await pool.query(
    //       `UPDATE OfferMaster SET ${queryValue}, UpdatedDate = GETDATE()  WHERE OfferId = ${OfferId}`
    //     );
    //     if (result.rowsAffected[0] == 0) return res.json(commonMsgs.DataNotFoundMsg);
    //     res.json(commonMsgs.updateMsg);
    //   } catch (error) {
    //     errorHandle.handleError(error, (errorRes) => {
    //       res.send(errorRes);
    //     });
    //   }
    // }

    async deleteData(req, res) {
      const { OfferId, ActiveStatus } = req.query;
      try {
        if (!OfferId || !ActiveStatus) return res.json(commonMsgs.NullMsg);
        else {
          const pool = await poolPromise;
          let result = await pool
                          .request()
                          .input("ActiveStatus", req.query.ActiveStatus)
                          .input("OfferId", req.query.OfferId)
                          .execute("deleteOfferMasterData")
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
    //   const { OfferId, ActiveStatus } = req.query;
    //   try {
    //     if (!OfferId || !ActiveStatus) return res.json(commonMsgs.NullMsg);
    //     const pool = await poolPromise;
    //     await pool.query(
    //       `UPDATE OfferMaster SET ActiveStatus = '${ActiveStatus}'  WHERE OfferId = '${OfferId}'`
    //     );
    //     res.json(commonMsgs.deleteMsg);
    //   } catch (error) {
    //     errorHandle.handleError(error, (errorRes) => {
    //       res.send(errorRes);
    //     });
    //   }
    // }
  }

  const offerMaster=new OfferMasterController();

  module.exports=offerMaster;