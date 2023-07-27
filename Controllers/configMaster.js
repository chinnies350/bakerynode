const errorHandle = require("../services/errorHandler");
const commonMsgs = require("../CommonMsg.json");
const utiityFile=require("../utility");
const { poolPromise, sql } = require("../db");
var API_Services = require("../services/API_services");

class ConfigMasterController {
  async getData(req, res) {
    try {
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .execute("getSingleData")
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
    //     const result = await pool.query(
    //       `SELECT ConfigurationMaster.TypeId, ConfigurationMaster.ConfigId, ConfigurationMaster.ConfigName, ConfigurationMaster.ActiveStatus, ConfigurationMaster.Createdby, ConfigurationMaster.CreatedDate, ConfigurationMaster.Updatedby, ConfigurationMaster.UpdatedDate, ConfigurationType.TypeName from ConfigurationMaster, ConfigurationType WHERE ConfigurationMaster.TypeId = ConfigurationType.TypeId`
    //     );
    //     res.json({ status: true, data: result.recordset });
    //   } catch (error) {
    //     errorHandle.handleError(error, (errorRes) => {
    //       res.send(errorRes);
    //     });
    //   }
    // }
    async getSingleData(req, res) {
      try {
          const pool = await poolPromise;
          let result = await pool
                          .request()
                          .input("TypeId", req.query.TypeId)
                          .execute("getSingleData")
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
    // async getSingleData(req, res) {
    //   try {
    //     if (!req.query.hasOwnProperty("TypeId"))
    //       throw "Please provide a TypeId!.";
    //     const pool = await poolPromise;
    //     const result = await pool
    //       .request()
    //       .input("TypeId", req.query.TypeId)
    //       .query(
    //         `SELECT ConfigurationMaster.TypeId, ConfigurationType.TypeName, ConfigurationMaster.ConfigId, ConfigurationMaster.ConfigName, ConfigurationMaster.ActiveStatus, ConfigurationMaster.Createdby, ConfigurationMaster.CreatedDate, ConfigurationMaster.Updatedby, ConfigurationMaster.UpdatedDate from ConfigurationMaster,ConfigurationType WHERE ConfigurationMaster.TypeId=@TypeId AND ConfigurationType.TypeId = @TypeId`
    //       );
    //     res.json({ status: true, data: result.recordset });
    //   } catch (error) {
    //     errorHandle.handleError(error, (errorRes) => {
    //       res.send(errorRes);
    //     });
    //   }
    // }

    async addData(req, res) {
      try {
        if (!(req.body.TypeId && req.body.ConfigName && req.body.CreatedBy)) 
        return res.json(commonMsgs.NullMsg); 
        else {
          const pool = await poolPromise;
          let result = await pool
                          .request()
                          .input("TypeId", req.body.TypeId)
                          .input("ConfigName", req.body.ConfigName)
                          .input("CreatedBy",req.body.CreatedBy)
                          .execute("addConfigMasterData")
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
    //     if (req.body.TypeId && req.body.ConfigName && req.body.CreatedBy) {
    //       const pool = await poolPromise;
    //       let result=await pool
    //         .request()
    //         .input("TypeId", req.body.TypeId)
    //         .input("ConfigName", req.body.ConfigName)
    //         .input("CreatedBy", req.body.CreatedBy)
    //         .query(
    //           // " INSERT INTO ConfigurationMaster (TypeId,  ConfigName,CreatedBy) VALUES (@TypeId, @ConfigName, @CreatedBy)"
               
    //           `BEGIN
    //             IF NOT EXISTS (SELECT * FROM ConfigurationMaster 
    //               WHERE ConfigName = '${req.body.ConfigName}' AND TypeId=@TypeId)
    //             BEGIN
    //             INSERT INTO ConfigurationMaster (TypeId,  ConfigName,CreatedBy) VALUES (@TypeId, @ConfigName, @CreatedBy)
    //             END
    //           END`              
    //         );

    //         if(result.rowsAffected.length==0){
    //           res.json({status:false, message:'Config Name already exists!'});
    //         }else{
    //           res.json(commonMsgs.AddMsg);
    //         }
    //     } else res.json(commonMsgs.NullMsg);
    //   } catch (error) {
    //     errorHandle.handleError(error, (errorRes) => {
    //       res.send(errorRes);
    //     });
    //   }
    // }

    async updateData(req, res) {
      try {
        if (req.body.TypeId && req.body.ConfigId) 
        return res.json(commonMsgs.NullMsg);
        else {
          const pool = await poolPromise;
          let result = await pool
                          .request()
                          .input("TypeId", req.body.TypeId)
                          .input("ConfigId",req.body.ConfigId)
                          .input("ConfigName",req.body.ConfigName)
                          .input("UpdatedBy",req.body.UpdatedBy)
                          .execute("updateConfigMasterData")
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
    //     if (req.body.TypeId && req.body.ConfigId) {
    //       const pool = await poolPromise;
    //       let objArr = utiityFile.removeEmptyObjects(req.body);
    //       let queryValue = null;
    //       for (const [key, value] of Object.entries(objArr)) {
    //         if (key != "TypeId" && key != "ConfigId")
    //           queryValue == null
    //             ? (queryValue = `${key}=@${key}`)
    //             : (queryValue += `,${key}=@${key}`);
    //       }
    //       let result = await pool
    //         .request()
    //         .input("TypeId", req.body.TypeId)
    //         .input("ConfigId", req.body.ConfigId)
    //         .input("ConfigName", req.body.ConfigName)
    //         .input("ActiveStatus", req.body.ActiveStatus)
    //         .input("UpdatedBy", req.body.UpdatedBy)
    //         .query(
    //           `IF NOT EXISTS(SELECT * FROM ConfigurationMaster WHERE TypeId = @TypeId AND ConfigId != @ConfigId AND ConfigName=@ConfigName) UPDATE ConfigurationMaster SET ${queryValue} WHERE TypeId = @TypeId AND ConfigId = @ConfigId`
    //         );
    //       if (result.rowsAffected == 0) throw "Configuration Master Already Exists!";
    //       res.json(commonMsgs.updateMsg);
    //     } else res.json(commonMsgs.NullMsg);
    //   } catch (error) {
    //     errorHandle.handleError(error, (errorRes) => {
    //       res.send(errorRes);
    //     });
    //   }
    // }

    async deleteData(req, res) {
      try {
        if (!(req.query.TypeId && req.query.ConfigId && req.query.ActiveStatus))
          res.json(commonMsgs.NullMsg); 
        else {
            const pool = await poolPromise;
            let result = await pool
                            .request()
                            .input("ActiveStatus", req.query.ActiveStatus)
                            .input("TypeId", req.query.TypeId)
                            .input("ConfigId",req.query.ConfigId)
                            .execute("deleteConfigMasterData")
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
    //     if (req.query.TypeId && req.query.ConfigId && req.query.ActiveStatus) {
    //       const pool = await poolPromise;
    //       await pool
    //         .request()
    //         .input("TypeId", req.query.TypeId)
    //         .input("ConfigId", req.query.ConfigId)
    //         .input("ActiveStatus", req.query.ActiveStatus)
    //         .query(
    //           "UPDATE ConfigurationMaster SET ActiveStatus = @ActiveStatus  WHERE TypeId = @TypeId AND ConfigId = @ConfigId"
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

  const configMasterController=new ConfigMasterController();

  module.exports=configMasterController;