const errorHandle = require("../services/errorHandler");
const commonMsgs = require("../CommonMsg.json");
const utiityFile = require("../utility");
const { poolPromise, sql } = require("../db");
var API_Services = require("../services/API_services");

class DropDownApiController {
  async getAllRestaurants(req, res) {
    try {
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .execute("getAllRestaurants")
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
  // async getAllRestaurants(req, res) {
  //   try {
  //     const pool = await poolPromise;
  //     const result = await pool.query(
  //       `SELECT * FROM RestaurantMaster WHERE ActiveStatus = 'A'`
  //     );
  //     res.json({ status: true, data: result.recordset });
  //   } catch (error) {
  //     errorHandle.handleError(error, errorRes => {
  //       res.send(errorRes);
  //     });
  //   }
  // }
  async getAllRestaurantType(req, res) {
    try {
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .execute("getAllRestaurantType")
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
  // async getAllRestaurantType(req, res) {
  //   try {
  //     const pool = await poolPromise;
  //     const result = await pool.query(
  //       `SELECT ConfigId,ConfigName as RestaurantType FROM ConfigurationMaster WHERE TypeId= 23`
  //     );
  //     res.json({ status: true, data: result.recordset });
  //   } catch (error) {
  //     errorHandle.handleError(error, errorRes => {
  //       res.send(errorRes);
  //     });
  //   }
  // }
  async getQuantityType(req, res) {
    try {
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .execute("getQuantityType")
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
  // async getQuantityType(req, res) {
  //   try {
  //     const pool = await poolPromise;
  //     const result = await pool.query(
  //       `SELECT ConfigId,ConfigName as RestaurantType FROM ConfigurationMaster WHERE TypeId= 2079`
  //     );
  //     res.json({ status: true, data: result.recordset });
  //   } catch (error) {
  //     errorHandle.handleError(error, errorRes => {
  //       res.send(errorRes);
  //     });
  //   }
  // }
  async getAllTourData(req, res) {
    try {
      const pool = await poolPromise;
      const result = await pool.query(
        `SELECT TourPackageId,Description FROM TourPackageDetails`
      );
      res.json({ status: true, data: result.recordset });
    } catch (error) {
      errorHandle.handleError(error, errorRes => {
        res.send(errorRes);
      });
    }
  }
  async getAllTourPackageData(req, res) {
    try {
      const pool = await poolPromise;
      const result = await pool.query(
        `SELECT TourTypeId,TourTypeName FROM TourTypeMstr`
      );
      res.json({ status: true, data: result.recordset });
    } catch (error) {
      errorHandle.handleError(error, errorRes => {
        res.send(errorRes);
      });
    }
  }
  async getAllTariffNameData(req, res) {
    try {
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .execute("getAllTariffNameData")
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
  // async getAllTariffNameData(req, res) {
  //   try {
  //     const pool = await poolPromise;
  //     const result = await pool.query(
  //       `SELECT TariffTypeId,TariffTypeName FROM TariffType `
  //     );
  //     res.json({ status: true, data: result.recordset });
  //   } catch (error) {
  //     errorHandle.handleError(error, errorRes => {
  //       res.send(errorRes);
  //     });
  //   }
  // }
  async getAllVehicleTypeData(req, res) {
    try {
      const pool = await poolPromise;
      const result = await pool.query(
        `select ConfigId,ConfigName from ConfigurationMaster WHERE TypeId=28 `
      );
      res.json({ status: true, data: result.recordset });
    } catch (error) {
      errorHandle.handleError(error, errorRes => {
        res.send(errorRes);
      });
    }
  }
  async getAllConfigMstData(req, res) {
    try {
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .execute("getAllConfigMstData")
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
  // async getAllConfigMstData(req, res) {
  //   try {
  //     const pool = await poolPromise;
  //     const result = await pool.query(
  //       `select ConfigId,ConfigName from ConfigurationMaster  `
  //     );
  //     res.json({ status: true, data: result.recordset });
  //   } catch (error) {
  //     errorHandle.handleError(error, errorRes => {
  //       res.send(errorRes);
  //     });
  //   }
  // }
  async getAllOfferNameData(req, res) {
    try {
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .execute("getAllOfferNameData")
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
  // async getAllOfferNameData(req, res) {
  //   try {
  //     const pool = await poolPromise;
  //     const result = await pool.query(
  //       `select ConfigId,ConfigName from ConfigurationMaster WHERE TypeId=56`
  //     );
  //     res.json({ status: true, data: result.recordset });
  //   } catch (error) {
  //     errorHandle.handleError(error, errorRes => {
  //       res.send(errorRes);
  //     });
  //   }
  // }
  async getAllVendorNameData(req, res) {
    try {
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .execute("getAllVendorNameData")
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
  // async getAllVendorNameData(req, res) {
  //   try {
  //     const pool = await poolPromise;
  //     const result = await pool.query(
  //       `select Name,VendorId from VendorMaster `
  //     );
  //     res.json({ status: true, data: result.recordset });
  //   } catch (error) {
  //     errorHandle.handleError(error, errorRes => {
  //       res.send(errorRes);
  //     });
  //   }
  // }

  async getAllConfigTypeData(req, res) {
    try {
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .execute("getAllConfigTypeData")
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
  // async getAllConfigTypeData(req, res) {
  //   try {
  //     const pool = await poolPromise;
  //     const result = await pool.query(
  //       `select TypeId,TypeName from ConfigurationType where ActiveStatus='A'  `
  //     );
  //     res.json({ status: true, data: result.recordset });
  //   } catch (error) {
  //     errorHandle.handleError(error, errorRes => {
  //       res.send(errorRes);
  //     });
  //   }
  // }
  async getCities(req, res) {
    try {
      const pool = await poolPromise;
      if (req.query.TourTypeId != null) {
        const result = await pool.query(
          `SELECT City FROM TourPackageDetails WHERE ActiveStatus = 'A' AND TourTypeId = ${req.query.TourTypeId}`
        );
        let uniqSet = new Set();
        result.recordset.map(async value => {
          uniqSet.add(value.City);
        });
        Promise.all(uniqSet).then(valueRes => {
          res.json({ status: true, data: valueRes });
        });
      } else {
        throw commonMsgs.NullMsg;
      }
    } catch (error) {
      errorHandle.handleError(error, errorRes => {
        res.send(errorRes);
      });
    }
  }
  async getItem(req, res) {
    try {
      if (req.query.hasOwnProperty("HotelId")) {
        const pool = await poolPromise;
        const result = await pool
          .request()
          .query(
            `SELECT ItemId, ItemDescription FROM ItemMaster WHERE ActiveStatus = 'A' AND HotelId=${req.query.HotelId}`
          );
        res.json({ status: true, data: result.recordset });
      } else {
        throw "Please provide the HotelId.";
      }
    } catch (error) {
      errorHandle.handleError(error, errorRes => {
        res.send(errorRes);
      });
    }
  }
  async getRestaurantName(req, res) {
    try {
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .execute("getAllRestaurantName")
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
  // async getRestaurantName(req, res) {
  //   try {
  //     const pool = await poolPromise;
  //     const result = await pool
  //       .request()
  //       .query(
  //         `SELECT RestaurantId, RestaurantName FROM RestaurantMaster WHERE ActiveStatus = 'A'`
  //       );
  //     res.json({ status: true, data: result.recordset });
  //   } catch (error) {
  //     errorHandle.handleError(error, errorRes => {
  //       res.send(errorRes);
  //     });
  //   }
  // }
  async getFoodName(req, res) {
    try {
      if (req.query.hasOwnProperty("RestaurantId")) {
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .input("RestaurantId", req.query.RestaurantId)
                        .execute("getFoodName")
        if (result.recordset[0].mainData!=null){
          res.json({status: true, data:JSON.parse(result.recordset[0].mainData)})

        }
        else{
          res.json({status: true, data:[]})
        }
      }else {
          throw "Please provide the RestaurantId.";
        }
     
    } 
    catch (error) {
      errorHandle.handleError(error, errorRes => {
        res.send(errorRes);
      });
    }
  }
  // async getFoodName(req, res) {
  //   try {
  //     if (req.query.hasOwnProperty("RestaurantId")) {
  //       const pool = await poolPromise;
  //       const result = await pool
  //         .request()
  //         .query(
  //           `SELECT FoodId, FoodName FROM FoodMaster WHERE ActiveStatus = 'A' AND RestaurantId=${req.query.RestaurantId}`
  //         );
  //       res.json({ status: true, data: result.recordset });
  //     } else {
  //       throw "Please provide the RestaurantId.";
  //     }
  //   } catch (error) {
  //     errorHandle.handleError(error, errorRes => {
  //       res.send(errorRes);
  //     });
  //   }
  // }
  async getCommonConfigData(req, res) {
    try {
      if (req.query.hasOwnProperty("Type")) {
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .input("Type", req.query.Type)
                        .execute("getCommonConfigData")
        if (result.recordset[0].mainData!=null){
          res.json({status: true, data:JSON.parse(result.recordset[0].mainData)})

        }
        else{
          res.json({status: true, data:[]})
        }
      } else {
        throw "Please provide the Config Type.";
      }
    } catch (error) {
      errorHandle.handleError(error, errorRes => {
        res.send(errorRes);
      });
    }
  }
  // async getCommonConfigData(req, res) {
  //   try {
  //     if (req.query.hasOwnProperty("Type")) {
  //       const pool = await poolPromise;
  //       const result = await pool
  //         .request()
  //         .query(
  //           `SELECT TypeId FROM ConfigurationType WHERE TypeName='${req.query.Type}'`
  //         );
  //       if (result.recordset.length > 0) {
  //         pool.query(
  //           `SELECT ConfigId, ConfigName FROM ConfigurationMaster WHERE TypeId=${result.recordset[0].TypeId}`,
  //           function(err, result) {
  //             if (err) {
  //               throw err;
  //             } else {
  //               res.json({ status: true, data: result.recordset });
  //             }
  //           }
  //         );
  //       } else {
  //         res.json({ status: true, data: result.recordset });
  //       }
  //     } else {
  //       throw "Please provide the Config Type.";
  //     }
  //   } catch (error) {
  //     errorHandle.handleError(error, errorRes => {
  //       res.send(errorRes);
  //     });
  //   }
  // }
}

const dropDownApi = new DropDownApiController();

module.exports = dropDownApi;
