const errorHandle = require("../services/errorHandler");
const commonMsgs = require("../CommonMsg.json");
const utiityFile = require("../utility");
const { poolPromise, sql } = require("../db");
var API_Services = require("../services/API_services");

class RestaurantMasterController {
  
  async getData(req, res) {
    try {
      if (!req.query.RestaurantId && !req.query.StoreId) res.json(commonMsgs.NullMsg);
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .input("RestaurantId", req.query.RestaurantId)
                        .input("StoreId", req.query.StoreId)
                        .execute("getData")
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
  //         BranchCode,
  //         RestaurantName,
  //         GSTIN,
  //         FSSAI,
  //         Description,
  //         HotelLocnId,
  //         Address1,
  //         Address2,
  //         Zipcode,
  //         City,
  //         District,
  //         State,
  //         Latitude,
  //         Longitude,
  //         RestaurantManager,
  //         convert(char(5), OrderFrom, 108) as OrderFrom,
  //         convert(char(5), OrderTo, 108) as OrderTo,
  //         WorkingDays,
  //         ActiveStatus,
  //         MailId,
  //         CreatedBy,
  //         CreatedDate,
  //         UpdatedBy,
  //         UpdatedDate,
  //         PhoneNumber,
  //         PhoneNumber2,
  //         LogoUrl,
  //         CONCAT(PhoneNumber,',',PhoneNumber2) as AllPhone
  //         FROM RestaurantMaster`
  //       );
  //       res.json({ status: true, data: result.recordset });
  //     } else {
  //       let result = await pool.query(
  //         `select *,CASE WHEN PhoneNumber IS NOT NULL AND PhoneNumber2 IS NOT NULL THEN CONCAT(PhoneNumber,',',PhoneNumber2) 
  //         WHEN  PhoneNumber IS NOT NULL AND PhoneNumber2 IS NULL THEN PhoneNumber END  AS 'AllPhone' from RestaurantMaster where RestaurantId= ${req.query.RestaurantId}`
  //       );
  //       res.json({ status: true, data: result.recordset });
  //     }
  //   } catch (error) {
  //     errorHandle.handleError(error, errorRes => {
  //       res.send(errorRes);
  //     });
  //   }
  // }

  async getAllRestaurant(req, res) {
    try {
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .execute("getData")
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

  // async getAllRestaurant(req, res){
  //   const pool = await poolPromise;
  //   let result = await pool.query(
  //     `SELECT * FROM RestaurantMaster`
  //   )
  //   if(result.recordset.length>0){
  //     res.json({ status: true, data: result.recordset });
  //   }else{
  //     res.json({ status: true, data: [] });
  //   }
  // }

  async addData(req, res) {
    try {
      if (
        !(
          // req.body.RestaurantId &&
          req.body.BranchCode &&
          req.body.RestaurantName &&
          req.body.GSTIN &&
          req.body.HotelLocnId &&
          req.body.Address1 &&
          req.body.Zipcode &&
          req.body.City &&
          req.body.District &&
          req.body.State &&
          req.body.Latitude &&
          req.body.Longitude &&
          req.body.Description &&
          req.body.RestaurantManager &&
          req.body.OrderFrom &&
          req.body.OrderTo &&
          req.body.WorkingDays &&
          req.body.CreatedBy
        )
      )
        res.json(commonMsgs.NullMsg);
      else {
          const pool = await poolPromise;
          let result = await pool
                          .request()
                          .input("StoreId", req.body.StoreId)
                          .input("BranchCode", req.body.BranchCode)
                          .input("RestaurantName", req.body.RestaurantName)
                          .input("Description",req.body.Description)
                          .input("HotelLocnId",req.body.HotelLocnId)
                          .input("Address1",req.body.Address1)
                          .input("Address2",req.body.Address2)
                          .input("Zipcode",req.body.Zipcode)
                          .input("City",req.body.City)
                          .input("District",req.body.District)
                          .input("State",req.body.State)
                          .input("Latitude",req.body.Latitude)
                          .input("Longitude",req.body.Longitude)
                          .input("RestaurantManager",req.body.RestaurantManager)
                          .input("OrderFrom",req.body.OrderFrom)
                          .input("OrderTo",req.body.OrderTo)
                          .input("WorkingDays",req.body.WorkingDays)
                          .input("MailId",req.body.MailId)
                          .input("CreatedBy",req.body.CreatedBy)
                          .input("PhoneNumber",req.body.PhoneNumber)
                          .input("GSTIN",req.body.GSTIN)
                          .input("PhoneNumber2",req.body.PhoneNumber2)
                          .input("LogoUrl",req.body.LogoUrl)
                          .execute("addRestaurant")
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
  //         req.body.RestaurantId &&
  //         req.body.BranchCode &&
  //         req.body.RestaurantName &&
  //         req.body.GSTIN &&
  //         req.body.HotelLocnId &&
  //         req.body.Address1 &&
  //         req.body.Zipcode &&
  //         req.body.City &&
  //         req.body.District &&
  //         req.body.State &&
  //         req.body.Latitude &&
  //         req.body.Longitude &&
  //         req.body.Description &&
  //         req.body.RestaurantManager &&
  //         req.body.OrderFrom &&
  //         req.body.OrderTo &&
  //         req.body.WorkingDays &&
  //         req.body.CreatedBy
  //       )
  //     )
  //       res.json(commonMsgs.NullMsg);
  //     else {
  //       let ColNameQuery = "ActiveStatus",
  //         ColValueQuery = "'A'";
  //       for (let key in req.body) {
  //         if (req.body[key]) {
  //           ColNameQuery += `${ColNameQuery != `` ? `,` : ``}${key}`;
  //           ColValueQuery += `${ColValueQuery != `` ? `,` : ``}'${
  //             req.body[key]
  //           }'`;
  //         }
  //       }
  //       const pool = await poolPromise;
  //       let result = await pool.query(
  //         `INSERT INTO RestaurantMaster(${ColNameQuery}) VALUES(${ColValueQuery})`
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
      const { RestaurantId, UpdatedBy } = req.body;
      if (!RestaurantId || !UpdatedBy) return res.json(commonMsgs.NullMsg);
      else {
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .input("BranchCode", req.body.BranchCode)
                        .input("RestaurantName", req.body.RestaurantName)
                        .input("Description",req.body.Description)
                        .input("HotelLocnId",req.body.HotelLocnId)
                        .input("Address1",req.body.Address1)
                        .input("Address2",req.body.Address2)
                        .input("Zipcode",req.body.Zipcode)
                        .input("City",req.body.City)
                        .input("District",req.body.District)
                        .input("State",req.body.State)
                        .input("Latitude",req.body.Latitude)
                        .input("Longitude",req.body.Longitude)
                        .input("RestaurantManager",req.body.RestaurantManager)
                        .input("OrderFrom",req.body.OrderFrom)
                        .input("OrderTo",req.body.OrderTo)
                        .input("WorkingDays",req.body.WorkingDays)
                        .input("MailId",req.body.MailId)
                        .input("UpdatedBy",req.body.UpdatedBy)
                        .input("PhoneNumber",req.body.PhoneNumber)
                        .input("GSTIN",req.body.GSTIN)
                        .input("PhoneNumber2",req.body.PhoneNumber2)
                        .input("LogoUrl",req.body.LogoUrl)
                        .input("RestaurantId",req.body.RestaurantId)
                        .execute("updateRestaurant")
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
  //     const { RestaurantId, UpdatedBy } = req.body;
  //     if (!RestaurantId || !UpdatedBy) return res.json(commonMsgs.NullMsg);
  //     let queryValue = null;
  //     for (const [key, value] of Object.entries(req.body)) {
  //       if (key != "RestaurantId")
  //         queryValue == null
  //           ? (queryValue = `${key}='${value}'`)
  //           : (queryValue += `,${key}='${value}'`);
  //     }
  //     const pool = await poolPromise;
  //     await pool.query(
  //       `UPDATE RestaurantMaster SET ${queryValue}, UpdatedDate = GETDATE()  WHERE RestaurantId = ${RestaurantId} `
  //     );
  //     res.json(commonMsgs.updateMsg);
  //   } catch (error) {
  //     errorHandle.handleError(error, errorRes => {
  //       res.send(errorRes);
  //     });
  //   }
  // }

  async deleteData(req, res) {
    const { ActiveStatus, RestaurantId } = req.query;
    try {
      if (!RestaurantId || !ActiveStatus) return res.json(commonMsgs.NullMsg);
      else {
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .input("ActiveStatus", req.query.ActiveStatus)
                        .input("RestaurantId", req.query.RestaurantId)
                        .execute("deleteRestaurant")
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
  //   const { ActiveStatus, RestaurantId } = req.query;
  //   try {
  //     if (!RestaurantId || !ActiveStatus) return res.json(commonMsgs.NullMsg);
  //     const pool = await poolPromise;
  //     await pool.query(
  //       `UPDATE RestaurantMaster SET ActiveStatus = '${ActiveStatus}'  WHERE RestaurantId = '${RestaurantId}'`
  //     );
  //     res.json(commonMsgs.deleteMsg);
  //   } catch (error) {
  //     errorHandle.handleError(error, errorRes => {
  //       res.send(errorRes);
  //     });
  //   }
  // }
}

const restaurantMaster = new RestaurantMasterController();

module.exports = restaurantMaster;
