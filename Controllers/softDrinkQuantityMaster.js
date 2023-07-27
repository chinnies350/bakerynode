const { sql, poolPromise } = require("../db");
const utility = require("../utility");
const errorHandle = require("../services/errorHandler");
const commonMsgs = require("../CommonMsg.json");

class SoftDrinkQuantityMaster {
  async getSoftDrinkQuantityDataByResId(req, res) {
    try {
      const pool = await poolPromise;
      let result = await pool.query(
        `select SoftDrinkQuantityMaster.UniqueId, SoftDrinkQuantityMaster.RestaurantId, SoftDrinkQuantityMaster.SoftDrinkId, SoftDrinkMaster.SoftDrinkName, SoftDrinkQuantityMaster.SoftDrinkQuantityId, ConfigurationMaster.ConfigName AS SoftDrinkQuantityName, SoftDrinkQuantityMaster.ActualRate, SoftDrinkQuantityMaster.Margin, SoftDrinkQuantityMaster.Tariff FROM SoftDrinkQuantityMaster, SoftDrinkMaster, ConfigurationMaster WHERE SoftDrinkQuantityMaster.SoftDrinkId = SoftDrinkMaster.SoftDrinkId AND SoftDrinkQuantityMaster.SoftDrinkQuantityId = ConfigurationMaster.ConfigId AND SoftDrinkQuantityMaster.RestaurantId = ${req.query.RestaurantId} ORDER BY SoftDrinkId ASC`
      );
      if (result.recordset.length > 0) {
        res.json({ status: true, data: result.recordset });
      } else {
        res.json({ status: true, data: [] });
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
        !(
          req.body.RestaurantId &&
          req.body.SoftDrinkId &&
          req.body.SoftDrinkQuantityId &&
          req.body.ActualRate &&
          req.body.Tariff &&
          req.body.CreatedBy
        )
      )
        res.json(commonMsgs.NullMsg);
      else {
        checkDataExist(req.body, async response => {
          if (response.length > 0) {
            res.json(commonMsgs.DuplicateRecordMsg);
          } else {
            var queryStr = "ActiveStatus",
              queryValues = "'A'";
            for (var key in req.body) {
              if (queryStr != "") {
                queryStr += ", ";
                queryValues += ", ";
              }
              queryStr += key;
              queryValues += req.body[key];
            }
            const pool = await poolPromise;
            let result = await pool.query(
              `INSERT INTO SoftDrinkQuantityMaster(${queryStr}) VALUES(${queryValues})`
            );
            res.json(commonMsgs.AddMsg);
          }
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
      if (
        req.body.RestaurantId &&
        req.body.UniqueId &&
        req.body.SoftDrinkId &&
        req.body.SoftDrinkQuantityId &&
        req.body.UpdatedBy
      ) {
        const pool = await poolPromise;
        let objArr = utility.removeEmptyObjects(req.body);
        let queryValue = null;
        for (const [key, value] of Object.entries(objArr)) {
          if (
            key != "UniqueId" &&
            key != "SoftDrinkId" &&
            key != "RestaurantId"
          )
            queryValue == null
              ? (queryValue = `${key}=@${key}`)
              : (queryValue += `,${key}=@${key}`);
        }
        await pool
          .request()
          .input("RestaurantId", req.body.RestaurantId)
          .input("UniqueId", req.body.UniqueId)
          .input("SoftDrinkId", req.body.SoftDrinkId)
          .input("SoftDrinkQuantityId", req.body.SoftDrinkQuantityId)
          .input("UpdatedBy", req.body.UpdatedBy)
          .input("ActualRate", req.body.ActualRate)
          .input("Margin", req.body.Margin)
          .input("Tariff", req.body.Tariff)
          .query(
            `UPDATE SoftDrinkQuantityMaster SET ${queryValue} WHERE UniqueId = @UniqueId AND SoftDrinkId = @SoftDrinkId AND RestaurantId=@RestaurantId`
          );
        res.json({
          status: true,
          message: "Data Updated successfully."
        });
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
        !req.query.hasOwnProperty("SoftDrinkId") ||
        !req.query.hasOwnProperty("ActiveStatus") ||
        !req.query.hasOwnProperty("SoftDrinkQuantityId")
      )
        return res.json(commonMsgs.NullMsg);
      const pool = await poolPromise;
      await pool.query(
        `UPDATE SoftDrinkQuantityMaster SET ActiveStatus = '${req.query.ActiveStatus}' WHERE SoftDrinkId = '${req.query.SoftDrinkId}' AND SoftDrinkQuantityId = ${req.query.SoftDrinkQuantityId}`
      );
      res.json(commonMsgs.deleteMsg);
      return;
    } catch (error) {
      errorHandle.handleError(error, errorRes => {
        res.send(errorRes);
      });
    }
  }

  // async deleteData(req, res) {
  //   try {
  //     if (req.query.StockId && req.query.ActiveStatus) {
  //       const pool = await poolPromise;
  //       await pool
  //         .request()
  //         .input("StockId", req.query.StockId)
  //         .input("ActiveStatus", req.query.ActiveStatus)
  //         .query(
  //           "UPDATE StockInMaster SET ActiveStatus = @ActiveStatus  WHERE StockId = @StockId"
  //         );
  //       res.json({ status: true, message: "Deleted successfully." });
  //     } else throw "Please fill all the details!";
  //   } catch (error) {
  //     errorHandle.handleError(error, (errorRes) => {
  //       res.send(errorRes);
  //     });
  //   }
  // }
}

async function checkDataExist(input, callback) {
  const pool = await poolPromise;
  let result = await pool
    .request()
    .query(
      `SELECT SoftDrinkQuantityMaster.RestaurantId, SoftDrinkQuantityMaster.SoftDrinkId, SoftDrinkQuantityMaster.SoftDrinkQuantityId FROM SoftDrinkQuantityMaster WHERE RestaurantId=${input.RestaurantId} AND SoftDrinkId = ${input.SoftDrinkId} AND SoftDrinkQuantityId = ${input.SoftDrinkQuantityId}`
    );
  callback(result.recordset);
}

const softDrinkQuantityMaster = new SoftDrinkQuantityMaster();

module.exports = softDrinkQuantityMaster;
