const errorHandle = require("../services/errorHandler");
const commonMsgs = require("../CommonMsg.json");
const utiityFile=require("../utility");
const { poolPromise, sql } = require("../db");
var API_Services = require("../services/API_services");

class RestaurantFeedBackController {
  async getAllData(req, res) {
    try {
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .execute("getAllRestaurantFeedBackData")
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
    //     const { recordset } = await pool.query(`select * from RestaurantFeedBack`);
    //     res.json({ status: true, data: recordset });
    //   } catch (error) {
    //     errorHandle.handleError(error, (errorRes) => {
    //       res.send(errorRes);
    //     });
    //   }
    // }
    async addData(req, res) {
      try {
        const { RestaurantId, OrderId } = req.body;
        if (!RestaurantId || !OrderId) return res.json(commonMsgs.NullMsg);
        const { ColValueQuery, ColNameQuery } = await getAddQuery(req.body);
        const pool = await poolPromise;
        await pool.query(
          `INSERT INTO RestaurantFeedBack(${ColNameQuery}) VALUES(${ColValueQuery})`
        );
        res.json(commonMsgs.AddMsg);
      } catch (error) {
        errorHandle.handleError(error, (errorRes) => {
          res.send(errorRes);
        });
      }
    }
  }

  const restaurantFeedback=new RestaurantFeedBackController();

  module.exports=restaurantFeedback;