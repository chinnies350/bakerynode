const errorHandle = require("../services/errorHandler");
const commonMsgs = require("../CommonMsg.json");
// const utiityFile=require("../utility");
const { poolPromise, sql } = require("../db");
var API_Services = require("../services/API_services");

class VendorMasterController {
  async getAllData(req, res) {
    try {
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .execute("getAllVendorData")
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
  //     const { recordset } = await pool.query(`SELECT * FROM VendorMaster`);
  //     res.json({ status: true, data: recordset });
  //   } catch (error) {
  //     errorHandle.handleError(error, errorRes => {
  //       res.send(errorRes);
  //     });
  //   }
  // }
  async addData(req, res) {
    try {
      let ColNameQuery = "",
        ColValueQuery = "";
      const { CreatedBy } = req.body;
      if (!CreatedBy) return res.json(commonMsgs.NullMsg);
      for (let key in req.body) {
        if (req.body[key]) {
          ColNameQuery += `${ColNameQuery != `` ? `,` : ``}${key}`;
          ColValueQuery += `${ColValueQuery != `` ? `,` : ``}'${
            req.body[key]
          }'`;
        }
      }
      const pool = await poolPromise;
      let result = await pool.query(
        `BEGIN
            IF NOT EXISTS (SELECT * FROM VendorMaster 
              WHERE Name = '${req.body.Name}')
            BEGIN
              INSERT INTO VendorMaster (${ColNameQuery})
              VALUES (${ColValueQuery})
            END
        END`
      );

      if (result.rowsAffected.length == 0) {
        res.json({ status: false, message: "Vendor name already exists!" });
      } else {
        res.json(commonMsgs.AddMsg);
      }
    } catch (error) {
      errorHandle.handleError(error, errorRes => {
        res.send(errorRes);
      });
    }
  }
  async updateData(req, res) {
    try {
      const { VendorId } = req.body;
      if (!VendorId) return res.json(commonMsgs.NullMsg);
      let queryValue = null;
      for (const [key, value] of Object.entries(req.body)) {
        if (key != "VendorId")
          queryValue == null
            ? (queryValue = `${key}='${value}'`)
            : (queryValue += `,${key}='${value}'`);
      }
      const pool = await poolPromise;
      await pool.query(
        `UPDATE VendorMaster SET ${queryValue}, UpdatedDate = GETDATE() WHERE VendorId = ${VendorId} `
      );
      res.json(commonMsgs.updateMsg);
    } catch (error) {
      errorHandle.handleError(error, errorRes => {
        res.send(errorRes);
      });
    }
  }
  async deleteData(req, res) {
    const { VendorId, ActiveStatus } = req.query;
    try {
      if (!VendorId || !ActiveStatus) return res.json(commonMsgs.NullMsg);
      const pool = await poolPromise;
      await pool.query(
        `UPDATE VendorMaster SET ActiveStatus = '${ActiveStatus}'  WHERE VendorId = '${VendorId}'`
      );
      res.json(commonMsgs.deleteMsg);
    } catch (error) {
      errorHandle.handleError(error, errorRes => {
        res.send(errorRes);
      });
    }
  }
}

const vendorMaster = new VendorMasterController();

module.exports = vendorMaster;
