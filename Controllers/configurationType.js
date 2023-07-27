const errorHandle = require("../services/errorHandler");
const commonMsgs = require("../CommonMsg.json");
const utiityFile=require("../utility");
const { poolPromise, sql } = require("../db");
var API_Services = require("../services/API_services");

class ConfigurationTypeController {
  async getData(req, res) {
    try {
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .execute("ConfigTypeData")
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
    //     const result = await pool.query(`SELECT * from ConfigurationType`);
    //     res.json({ status: true, data: result.recordset });
    //   } catch (error) {
    //     errorHandle.handleError(error, (errorRes) => {
    //       res.send(errorRes);
    //     });
    //   }
    // }

    async addData(req, res) {
      try {
        if (
          !(req.body.TypeName &&
          req.body.Createdby)
        ) return res.json(commonMsgs.NullMsg); 
        else {
          const pool = await poolPromise;
          let result = await pool
                          .request()
                          .input("TypeName", req.body.TypeName)
                          .input("Createdby", req.body.Createdby)
                          .execute("addConfigTypeData")
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
    //       req.body.TypeName &&
    //       req.body.Createdby
    //     ) {
    //       const pool = await poolPromise;
    //       let result = await pool
    //         .request()
    //         .input("TypeName", req.body.TypeName)
    //         .input("Createdby", req.body.Createdby)
    //         .query(
    //           // "INSERT INTO ConfigurationType ( TypeName, Createdby) VALUES ( @TypeName, @Createdby)"
              
    //           `BEGIN
    //             IF NOT EXISTS (SELECT * FROM ConfigurationType 
    //               WHERE TypeName = '${req.body.TypeName}')
    //             BEGIN
    //             INSERT INTO ConfigurationType (TypeName, Createdby) VALUES ('${req.body.TypeName}', '${req.body.Createdby}')
    //             END
    //           END`
    //           );

    //           if(result.rowsAffected.length==0){
    //             res.json({status:false, message:'Type Name already exists!'});
    //           }else{
    //             res.json(commonMsgs.AddMsg);
    //           }
    //       // return commonMsgs.AddMsg;
    //     } else res.json(commonMsgs.NullMsg);
    //   } catch (error) {
    //     errorHandle.handleError(error, (errorRes) => {
    //       res.send(errorRes);
    //     });
    //   }
    // }

    async updateData(req, res) {
      try {
        const { TypeId } = req.body;
        if (!TypeId) return res.json(commonMsgs.NullMsg);
        else {
          const pool = await poolPromise;
          let result = await pool
                          .request()
                          .input("TypeName", req.body.TypeName)
                          .input("UpdatedBy",req.body.UpdatedBy)
                          .input("TypeId",req.body.TypeId)
                          .execute("updateConfigTypeData")
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
    //     const { TypeId } = req.body;
    //     if (!TypeId) return res.json(commonMsgs.NullMsg);
    //     let queryValue = null;
    //     for (const [key, value] of Object.entries(req.body)) {
    //       if (key != "TypeId")
    //         queryValue == null
    //           ? (queryValue = `${key}='${value}'`)
    //           : (queryValue += `,${key}='${value}'`);
    //     }
    //     const pool = await poolPromise;
         
    //       let result =await pool.query(
    //       `IF NOT EXISTS(SELECT * FROM ConfigurationType WHERE TypeId != ${TypeId} AND TypeName = '${req.body.TypeName}') UPDATE ConfigurationType SET ${queryValue}, UpdatedDate = GETDATE()  WHERE TypeId = ${TypeId}`
    //     );

    //     if(result.rowsAffected.length==0){
    //       res.json({status:false, message:'Type Name already exists!'});
    //     }else{
    //       res.json(commonMsgs.updateMsg);
    //     }
    //     // res.json(commonMsgs.updateMsg);
    //   } catch (error) {
    //     errorHandle.handleError(error, (errorRes) => {
    //       res.send(errorRes);
    //     });
    //   }
    // }

    async deleteData(req, res) {
      try {
        if (!(req.query.TypeId && req.query.ActiveStatus))
          res.json(commonMsgs.NullMsg); 
        else {
            const pool = await poolPromise;
            let result = await pool
                            .request()
                            .input("ActiveStatus", req.query.ActiveStatus)
                            .input("TypeId", req.query.TypeId)
                            .execute("deleteConfigTypeData")
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
    //   try {
    //     if (req.query.TypeId && req.query.ActiveStatus) {
    //       const pool = await poolPromise;
    //       await pool
    //         .request()
    //         .input("TypeId", req.query.TypeId)
    //         .input("ActiveStatus", req.query.ActiveStatus)
    //         .query(
    //           "UPDATE ConfigurationType SET ActiveStatus = @ActiveStatus  WHERE TypeId = @TypeId"
    //         );
    //       res.json(commonMsgs.deleteMsg);
    //     } else res.json(commonMsgs.NullMsg);
    //   } catch (error) {
    //     errorHandle.handleError(error, (errorRes) => {
    //       res.send(errorRes);
    //     });
    //   }
    // }
  }

  const configTypeController=new ConfigurationTypeController();

  module.exports=configTypeController;