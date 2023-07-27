const errorHandle = require("../services/errorHandler");
const commonMsgs = require("../CommonMsg.json");
const { poolPromise, sql } = require("../db");

class DashBoardMasterController {
  async getRestaurantAndAmountByDate(req, res) {
    try {
      if (req.query.OrderDate != null && req.query.RestaurantId) {
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .input("RestaurantId", req.query.RestaurantId)
                        .input("Date",req.query.OrderDate)
                        .execute("getRestaurantAndAmountByDate")
        if (result.recordset[0].mainData!=null){
          res.json({status: true, data:JSON.parse(result.recordset[0].mainData)})

        }
        else{
          res.json({status: true, data:[]})
        }
      } else throw "Please provide a date!";
    } catch (error) {
      errorHandle.handleError(error, errorRes => {
        res.send(errorRes);
      });
    }
  }
  // async getRestaurantAndAmountByDate(req, res) {
  //   try {
  //     if (req.query.OrderDate != null && req.query.RestaurantId) {
  //       const pool = await poolPromise;
  //       const result = await pool
  //         .request()
  //         .input("Date", req.query.OrderDate)
  //         .input("RestaurantId", req.query.RestaurantId)
  //         .query(
  //           `SELECT SUM(NetAmount) as TotalAmount, SUM(CancelRefund) as TotalCancelRefund, COUNT(*) as TotalOrders FROM OrderHeader WHERE CAST(OrderHeader.OrderDate as DATE) = @Date AND RestaurantId = @RestaurantId AND OrderHeader.PaymentStatus = 'S'`
  //         );
  //       res.json({ status: true, data: result.recordset[0] });
  //     } else throw "Please provide a date!";
  //   } catch (error) {
  //     errorHandle.handleError(error, errorRes => {
  //       res.send(errorRes);
  //     });
  //   }
  // }
}

const DashBoardMaster = new DashBoardMasterController();

module.exports = DashBoardMaster;
