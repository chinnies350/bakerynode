const { sql, poolPromise } = require("../db");
const errorHandle = require("../services/errorHandler");
const utility = require("../utility");
const async = require("async");

class SoftDrinkMaster {
  async getData(req, res) {
    try {
      if (!req.query.RestaurantId) throw "Please provide RestaurantId!";
      const pool = await poolPromise;
      const result = await pool.query(
        `select SoftDrinkMaster.RestaurantId, SoftDrinkMaster.SoftDrinkId,  SoftDrinkMaster.SoftDrinkName, SoftDrinkMaster.Description, SoftDrinkMaster.ImageLink,SoftDrinkMaster.ActiveStatus, SoftDrinkMaster.CreatedBy,SoftDrinkMaster.CreatedDate,SoftDrinkMaster.UpdatedBy, SoftDrinkMaster.UpdatedDate From SoftDrinkMaster WHERE SoftDrinkMaster.RestaurantId =${req.query.RestaurantId}`
      );
      res.json({ status: true, data: result.recordset });
    } catch (error) {
      errorHandle.handleError(error, errorRes => {
        res.send(errorRes);
      });
    }
  }

  async getSoftDrinkData(req, res) {
    try {
      if (!req.query.hasOwnProperty("RestaurantId"))
        throw "Please Provide Restaurant Id!";
      const pool = await poolPromise;
      const result = await pool
        .request()
        .input("RestaurantId", req.query.RestaurantId)
        .query(`SELECT SoftDrinkMaster.RestaurantId, 
        SoftDrinkMaster.SoftDrinkId, SoftDrinkMaster.SoftDrinkName, SoftDrinkMaster.Description, SoftDrinkMaster.ImageLink, SoftDrinkMaster.ActiveStatus FROM SoftDrinkMaster WHERE SoftDrinkMaster.RestaurantId = @RestaurantId`);
      if (result.recordset.length > 0) {
        let data = [],
          asyncArr = [];
        result.recordset.map((value1, index1) => {
          asyncArr.push(next => {
            pool.query(
              `SELECT SoftDrinkQuantityMaster.SoftDrinkQuantityId, ConfigurationMaster.ConfigName as SoftDrinkQuantityName, SoftDrinkQuantityMaster.Tariff,
             ActualRate, Margin, SoftDrinkQuantityMaster.SoftDrinkId, SoftDrinkMaster.SoftDrinkName FROM SoftDrinkQuantityMaster, ConfigurationMaster, SoftDrinkMaster WHERE SoftDrinkQuantityMaster.RestaurantId = ${req.query.RestaurantId} AND   ConfigurationMaster.ConfigId=SoftDrinkQuantityMaster.SoftDrinkQuantityId AND SoftDrinkMaster.SoftDrinkId=SoftDrinkQuantityMaster.SoftDrinkId AND SoftDrinkQuantityMaster.SoftDrinkId=${value1.SoftDrinkId}`,
              (error, TariffResult) => {
                if (error) {
                  errorHandle.handleError(error, errorRes => {
                    next(errorRes, null);
                  });
                } else {
                  let asyncArr = [],
                    resArray = [];
                  TariffResult.recordset.map((value, index) => {
                    asyncArr.push(next1 => {
                      pool.query(
                        `SELECT ConfigName FROM ConfigurationMaster INNER JOIN ConfigurationType ON (ConfigurationType.TypeName='Soft Drink Quantity Type') AND ConfigurationMaster.TypeId = ConfigurationType.TypeId AND ConfigId= ${value.SoftDrinkQuantityId}`,
                        (err, result1) => {
                          if (result1.recordset.length > 0) {
                            let Quantityvalue = result1.recordset[0].ConfigName.match(
                              /[\d\.]+|\D+/g
                            );
                            Quantityvalue = Quantityvalue.includes("ML")
                              ? Quantityvalue[0]
                              : Quantityvalue.includes(" ML")
                              ? Quantityvalue[0]
                              : Quantityvalue[0] * 1000;
                            pool.query(
                              ` SELECT sum(BalanceQty) as BalanceQty,sum(IssuedQty) as IssuedQty FROM StockInMaster WHERE RestaurantId=${req.query.RestaurantId}  AND SoftDrinkId=${value.SoftDrinkId} AND SoftDrinkQuantityId = ${value.SoftDrinkQuantityId}`,
                              (err, result) => {
                                if (
                                  result.recordset.length > 0 &&
                                  result.recordset[0].BalanceQty != null
                                ) {
                                  resArray.push({
                                    ...value,
                                    Quantity: result.recordset[0].BalanceQty
                                  });
                                }
                                next1(null, null);
                              }
                            );
                          } else next1(null, null);
                        }
                      );
                    });
                  });
                  async.parallel(asyncArr, (err, result) => {
                    if (err) {
                      next(err, null);
                    } else {
                      pool
                        .request()
                        .input("Date", req.query.Date)
                        .query(
                          `select TaxId, ServiceName, TaxDescription, TaxPercentage, RefNumber FROM TaxMaster WHERE ActiveStatus = 'A' AND ServiceName = 'Restaurant'`,
                          (error, TaxResult) => {
                            if (error) next(error.message, null);
                            else {
                              if (resArray.length > 0)
                                data.push({
                                  ...value1,
                                  TariffDetails: resArray,
                                  TaxResult: TaxResult.recordset
                                });
                              next(null, null);
                            }
                          }
                        );
                    }
                  });
                }
              }
            );
          });
        });
        async.parallel(asyncArr, (err, result) => {
          if (err) {
            errorHandle.handleError(err, errorRes => {
              res.send(errorRes);
            });
          } else res.json({ status: true, data });
        });
      } else {
        res.json({ status: true, message: "No data Found!" });
      }
    } catch (error) {
      errorHandle.handleError(error, errorRes => {
        res.send(errorRes);
      });
    }
  }

  async addData(req, res) {
    try {
      if (
        req.body.RestaurantId &&
        req.body.SoftDrinkName &&
        req.body.Description &&
        req.body.ImageLink &&
        req.body.CreatedBy
      ) {
        const pool = await poolPromise;
        let result = await pool
          .request()
          .input("RestaurantId", req.body.RestaurantId)
          .input("Description", req.body.Description)
          .input("SoftDrinkName", req.body.SoftDrinkName)
          .input("ImageLink", req.body.ImageLink)
          .input("CreatedBy", req.body.CreatedBy)
          .query(
            "IF NOT EXISTS(SELECT * FROM SoftDrinkMaster WHERE RestaurantId=@RestaurantId AND SoftDrinkName=@SoftDrinkName) INSERT INTO SoftDrinkMaster (RestaurantId,Description,SoftDrinkName,ImageLink,CreatedBy) VALUES (@RestaurantId, @Description,@SoftDrinkName,@ImageLink,@CreatedBy)"
          );
        if (result.rowsAffected == 0) {
          return res.json({
            status: false,
            message: "Soft Drink Name already exists!"
          });
        } 
        else{
          return res.json({
            status: true,
            message: "Data added successfully."
          });
        }
      } else {
        return res.json({
          status: false,
          message: "Please fill all the details!"
        });
      } 
    } catch (error) {
      errorHandle.handleError(error, errorRes => {
        res.send(errorRes);
      });
    }
  }

  async updateData(req, res) {
    try {
      if (req.body.RestaurantId && req.body.SoftDrinkId && req.body.UpdatedBy) {
        const pool = await poolPromise;
        let objArr = utility.removeEmptyObjects(req.body);
        let queryValue = null;
        for (const [key, value] of Object.entries(objArr)) {
          if (key != "SoftDrinkId" && key != "RestaurantId")
            queryValue == null
              ? (queryValue = `${key}=@${key}`)
              : (queryValue += `,${key}=@${key}`);
        }
        let updateResult = await pool
          .request()
          .input("SoftDrinkId", req.body.SoftDrinkId)
          .input("RestaurantId", req.body.RestaurantId)
          .input("Description", req.body.Description)
          .input("SoftDrinkName", req.body.SoftDrinkName)
          .input("ImageLink", req.body.ImageLink)
          .input("ActiveStatus", req.body.ActiveStatus)
          .input("UpdatedBy", req.body.UpdatedBy)
          .query(
               `BEGIN 
                  IF NOT EXISTS (SELECT * FROM SoftDrinkMaster WHERE SoftDrinkName=@SoftDrinkName AND RestaurantId=@RestaurantId AND SoftDrinkId!=@SoftDrinkId)
                  BEGIN
                    UPDATE SoftDrinkMaster SET ${queryValue}, UpdatedDate=GETDATE() WHERE SoftDrinkId=@SoftDrinkId
                  END
                END`  
            // `UPDATE SoftDrinkMaster SET ${queryValue} WHERE SoftDrinkId = @SoftDrinkId AND RestaurantId=@RestaurantId`
          );

          if(updateResult.rowsAffected.length>0){
            return res.json({
              status: true,
              message: "Data Updated successfully."
            });
          }
          else{
            return res.json({
              status: false,
              message: "Soft Drink Name already exists"
            });
          }
      } else throw "Please fill all the details!";
    } catch (error) {
      errorHandle.handleError(error, errorRes => {
        res.send(errorRes);
      });
    }
  }

  async deleteData(req, res) {
    try {
      if (
        req.query.RestaurantId &&
        req.query.SoftDrinkId &&
        req.query.ActiveStatus
      ) {
        const pool = await poolPromise;
        let objArr = utility.removeEmptyObjects(req.query);
        let queryValue = null;
        for (const [key, value] of Object.entries(objArr)) {
          if (key != "SoftDrinkId" && key != "RestaurantId")
            queryValue == null
              ? (queryValue = `${key}=@${key}`)
              : (queryValue += `,${key}=@${key}`);
        }
        await pool
          .request()
          .input("SoftDrinkId", req.query.SoftDrinkId)
          .input("RestaurantId", req.query.RestaurantId)
          .input("ActiveStatus", req.query.ActiveStatus)
          .input("UpdatedBy", req.query.UpdatedBy)
          .query(
            `UPDATE SoftDrinkMaster SET ${queryValue} WHERE SoftDrinkId = @SoftDrinkId AND RestaurantId=@RestaurantId`
          );
        res.json({
          status: true,
          message: "Data Deleted successfully."
        });
      } else throw "Please fill all the details!";
    } catch (error) {
      errorHandle.handleError(error, errorRes => {
        res.send(errorRes);
      });
    }
  }
}

const softDrinkMaster = new SoftDrinkMaster();

module.exports = softDrinkMaster;
