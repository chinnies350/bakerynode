const errorHandle = require("../services/errorHandler");
const commonMsgs = require("../CommonMsg.json");
const { poolPromise, sql } = require("../db");
const async = require("async");

class StatisticsController {
  async getCountAndRevenueForDates(req, res) {
    try {
      if (!(req.query.RestaurantId && req.query.FromDate && req.query.ToDate
          ))throw "Please Enter all Details";
      const pool = await poolPromise;
      let result = await pool
          .request()
          .input("RestaurantId",req.query.RestaurantId)
          .input("FromDate",req.query.FromDate)
          .input("ToDate",req.query.ToDate)
          .execute("getCountAndRevenueForDates")
      if (result.recordset[0].mainData != null) {
          res.json({ status: true, data: JSON.parse(result.recordset[0].mainData) })

      } else {
          res.json({ status: true, data: [] })
      }

  } catch (error) {
      errorHandle.handleError(error, errorRes => {
          res.send(errorRes);
      });
  }
}
  // async getCountAndRevenueForDates(req, res){
  //   try{  
  //     if(req.query.RestaurantId && req.query.FromDate && req.query.ToDate){
  //       const pool = await poolPromise;
  //       const result = await pool
  //                     .request()
  //                     .input("RestaurantId", req.body.RestaurantId)
  //                     .input("FromDate", sql.Date(),req.body.FromDate)
  //                     .input("ToDate", sql.Date(),req.body.ToDate)
  //                     .query(`
  //                         BEGIN TRANSACTION;
  //                         SELECT
  //                           (SELECT COUNT(DISTINCT OrderId) FROM OrderDetails WHERE OrderDetails.BookingStatus != 'C'
  //                               AND CAST(OrderDate AS DATE) >= @FromDate AND CAST(OrderDate AS DATE) <= @ToDate
  //                               AND OrderDetails.RestaurantId=@RestaurantId) AS TotalOrderCount,
                            
  //                           (SELECT COUNT(DISTINCT OrderId) FROM OrderDetails WHERE BookingType='Buffet'
  //                               AND OrderDetails.BookingStatus != 'C'
  //                               AND CAST(OrderDate AS DATE) >= @FromDate AND CAST(OrderDate AS DATE) <= @ToDate
  //                               AND OrderDetails.RestaurantId=@RestaurantId) AS BuffetOrderCount,
                              
  //                           (SELECT COUNT(DISTINCT OrderId) FROM OrderDetails WHERE BookingType='Dine In' AND OrderDetails.BookingStatus != 'C'
  //                               AND CAST(OrderDate AS DATE) >= @FromDate AND CAST(OrderDate AS DATE) <= @ToDate
  //                               AND OrderDetails.RestaurantId=@RestaurantId) AS DineOrderCount,
                                
  //                           (SELECT COUNT(DISTINCT OrderId) FROM OrderDetails WHERE BookingType='Take Away' AND OrderDetails.BookingStatus != 'C'
  //                               AND CAST(OrderDate AS DATE) >= @FromDate AND CAST(OrderDate AS DATE) <= @ToDate
  //                               AND OrderDetails.RestaurantId=@RestaurantId) AS TakeAwayOrderCount,
                                
  //                           (SELECT COUNT(DISTINCT OrderId) FROM OrderDetails WHERE SoftDrinkId IS NOT NULL AND OrderDetails.BookingStatus != 'C'
  //                               AND CAST(OrderDate AS DATE) >= @FromDate AND CAST(OrderDate AS DATE) <= @ToDate
  //                               AND OrderDetails.RestaurantId=@RestaurantId) AS SoftDrinkOrderCount,
                                
  //                           (SELECT COUNT(DISTINCT OrderId) FROM OrderDetails WHERE ComplementaryId IS NOT NULL AND OrderDetails.BookingStatus != 'C'
  //                               AND CAST(OrderDate AS DATE) >= @FromDate AND CAST(OrderDate AS DATE) <= @ToDate
  //                               AND OrderDetails.RestaurantId=@RestaurantId) AS ComplementaryOrderCount,
                                
  //                           (SELECT SUM(NetTariff) FROM OrderDetails WHERE OrderDetails.BookingStatus != 'C'
  //                               AND CAST(OrderDate AS DATE) >= @FromDate AND CAST(OrderDate AS DATE) <= @ToDate
  //                               AND OrderDetails.RestaurantId=@RestaurantId) AS TotalRevenue,
                                
  //                           (SELECT SUM(OrderQuantity*SoftDrinkQuantityMaster.Tariff)
  //                             FROM OrderDetails
  //                             INNER JOIN SoftDrinkQuantityMaster
  //                             ON SoftDrinkQuantityMaster.SoftDrinkId = OrderDetails.SoftDrinkId
  //                             WHERE OrderDetails.SoftDrinkId = SoftDrinkQuantityMaster.SoftDrinkId
  //                             AND OrderDetails.SoftDrinkQuantityId = SoftDrinkQuantityMaster.SoftDrinkQuantityId AND OrderDetails.BookingStatus != 'C'
  //                               AND CAST(OrderDate AS DATE) >= @FromDate AND CAST(OrderDate AS DATE) <= @ToDate
  //                               AND OrderDetails.RestaurantId=@RestaurantId) AS TotalSoftDrinkRevenue,
                                
  //                           (SELECT SUM(Tariff) FROM OrderDetails WHERE BookingType='Buffet' AND OrderDetails.BookingStatus != 'C'
  //                               AND CAST(OrderDate AS DATE) >= @FromDate AND CAST(OrderDate AS DATE) <= @ToDate
  //                               AND OrderDetails.RestaurantId=@RestaurantId) AS BuffetOrderRevenue,
                            
  //                           (SELECT SUM(Tariff) FROM OrderDetails WHERE BookingType='Dine In' AND OrderDetails.BookingStatus != 'C'
  //                               AND CAST(OrderDate AS DATE) >= @FromDate AND CAST(OrderDate AS DATE) <= @ToDate
  //                               AND OrderDetails.RestaurantId=@RestaurantId) AS DineOrderRevenue,
		
  //                           (SELECT SUM(Tariff) FROM OrderDetails WHERE ComplementaryId IS NOT NULL AND OrderDetails.BookingStatus != 'C'
  //                               AND CAST(OrderDate AS DATE) >= @FromDate AND CAST(OrderDate AS DATE) <= @ToDate
  //                               AND OrderDetails.RestaurantId=@RestaurantId) AS ComplementaryOrderRevenue
  //                       COMMIT;
  //       `);
        
  //       if (result.recordset.length > 0) {
  //         res.json({ status: true, data: result.recordset });
  //       }
  //     }
  //     else{
  //       res.json({ status: false, data: "Please Enter all Details"});
  //     }
  //   }
  //   catch (error) {
  //     errorHandle.handleError(error, (errorRes) => {
  //       res.send(errorRes);
  //     });
  //   }
  // }

  async getOrderTypes(req, res) {
    try {
      if (!(req.query.RestaurantId || req.query.FromDate && req.query.ToDate
          ))throw "Please Enter all Details";
      const pool = await poolPromise;
      let result = await pool
          .request()
          .input("RestaurantId",req.query.RestaurantId)
          .input("FromDate",req.query.FromDate)
          .input("ToDate",req.query.ToDate)
          .execute("getOrderTypes")
      if (result.recordset[0].mainData != null) {
          res.json({ status: true, data: JSON.parse(result.recordset[0].mainData) })

      } else {
          res.json({ status: true, data: [] })
      }

  } catch (error) {
      errorHandle.handleError(error, errorRes => {
          res.send(errorRes);
      });
  }
}


  
  // async getOrderTypes(req, res) {
  //   try {
  //     if (req.query.hasOwnProperty("RestaurantId")) {
  //       const pool = await poolPromise;
  //       let result = await pool.query(
  //         `(SELECT
  //               COUNT(FoodId) as FoodOrders, SUM(Tariff) as Amount FROM OrderDetails WHERE FoodId IS NOT NULL AND BuffetId IS NULL AND ComplementaryId IS NULL AND OrderDetails.RestaurantId=${req.query.RestaurantId} AND CAST(OrderDate as DATE) >= '${req.query.FromDate}' AND CAST(OrderDate as DATE)<='${req.query.ToDate}')
  //            (SELECT
  //               COUNT(BuffetId) as BuffetOrders, SUM(Tariff) as Amount FROM OrderDetails WHERE BuffetId IS NOT NULL AND OrderDetails.RestaurantId=${req.query.RestaurantId} AND CAST(OrderDate as DATE) >= '${req.query.FromDate}' AND CAST(OrderDate as DATE)<='${req.query.ToDate}')
  //           (SELECT
  //               COUNT(SoftDrinkId) as SoftDrinksOrders, SUM(Tariff) as Amount FROM OrderDetails WHERE SoftDrinkId IS NOT NULL AND OrderDetails.RestaurantId=${req.query.RestaurantId} AND CAST(OrderDate as DATE) >= '${req.query.FromDate}' AND CAST(OrderDate as DATE)<='${req.query.ToDate}')
  //           (SELECT
  //               COUNT(ComplementaryId) as ComplementaryOrders, SUM(Tariff) as Amount FROM OrderDetails WHERE ComplementaryId IS NOT NULL AND OrderDetails.RestaurantId=${req.query.RestaurantId} AND CAST(OrderDate as DATE) >= '${req.query.FromDate}' AND CAST(OrderDate as DATE)<='${req.query.ToDate}')`
  //       );
  //       getIndividualOrderTypePayment(req);
  //       let tempArr = [];
  //       for (let i = 0; i < result.recordsets.length; i++) {
  //         tempArr.push(result.recordsets[i][0]);
  //       }
  //       let resultOfPaymentStatus = await pool.query(
  //         `SELECT SUM(BillAmount) AS BillAmount, SUM(NetAmount) AS NetAmount, COUNT(OrderId) AS TotalOrders, COUNT(PaymentType) AS CountOfPaymentType, PaymentType 
  //         FROM OrderHeader WHERE RestaurantId=${req.query.RestaurantId} AND PaymentStatus='S' AND CAST(OrderDate as DATE) >= '${req.query.FromDate}' AND CAST(OrderDate as DATE)<='${req.query.ToDate}' GROUP BY(PaymentType)`
  //       );
  //       if (resultOfPaymentStatus.recordset.length > 0) {
  //         getPaymentMode(resultOfPaymentStatus.recordset, (error, response) => {
  //           if (error) {
  //             return res.json({ status: false, error: error });
  //           }
  //           let finalResponse = {};
  //           finalResponse["OrderDetails"] = tempArr;
  //           finalResponse["PaymentType"] = response;
  //           res.json({ status: true, data: finalResponse });
  //         });
  //       } else {
  //         res.json({ status: true, data: [] });
  //       }

  //       // const finalArr = result.recordsets.flat().reduce((result, current) => {
  //       //   return Object.assign(result, current);
  //       // }, {});

  //       // res.json({ status: true, data: [finalArr] });
  //     } else {
  //       const pool = await poolPromise;
  //       let result = await pool.query(
  //         `(SELECT
  //           COUNT(FoodId) as FoodOrders, SUM(Tariff) as Amount FROM OrderDetails WHERE FoodId IS NOT NULL AND BuffetId IS NULL AND ComplementaryId IS NULL AND CAST(OrderDate as DATE) >= '${req.query.FromDate}' AND CAST(OrderDate as DATE)<='${req.query.ToDate}')
  //        (SELECT
  //           COUNT(BuffetId) as BuffetOrders, SUM(Tariff) as Amount FROM OrderDetails WHERE BuffetId IS NOT NULL AND CAST(OrderDate as DATE) >= '${req.query.FromDate}' AND CAST(OrderDate as DATE)<='${req.query.ToDate}')
  //       (SELECT
  //           COUNT(SoftDrinkId) as SoftDrinksOrders, SUM(Tariff) as Amount FROM OrderDetails WHERE SoftDrinkId IS NOT NULL AND CAST(OrderDate as DATE) >= '${req.query.FromDate}' AND CAST(OrderDate as DATE)<='${req.query.ToDate}')
  //       (SELECT
  //           COUNT(ComplementaryId) as ComplementaryOrders, SUM(Tariff) as Amount FROM OrderDetails WHERE ComplementaryId IS NOT NULL AND CAST(OrderDate as DATE) >= '${req.query.FromDate}' AND CAST(OrderDate as DATE)<='${req.query.ToDate}')`
  //       );
  //       let tempArr = [];
  //       for (let i = 0; i < result.recordsets.length; i++) {
  //         tempArr.push(result.recordsets[i][0]);
  //       }

  //       let resultOfPaymentStatus = await pool.query(
  //         `SELECT SUM(BillAmount) AS BillAmount, SUM(NetAmount) AS NetAmount, COUNT(OrderId) AS TotalOrders, COUNT(PaymentType) AS CountOfPaymentType, PaymentType 
  //             FROM OrderHeader WHERE CAST(OrderDate as DATE) >= '${req.query.FromDate}' AND CAST(OrderDate as DATE)<='${req.query.ToDate}' GROUP BY(PaymentType)`
  //       );

  //       if (resultOfPaymentStatus.recordset.length > 0) {
  //         getPaymentMode(resultOfPaymentStatus.recordset, (error, response) => {
  //           if (error) {
  //             return res.json({ status: false, error: error });
  //           }
  //           let finalResponse = {};
  //           finalResponse["OrderDetails"] = tempArr;
  //           finalResponse["PaymentType"] = response;
  //           res.json({ status: true, data: finalResponse });
  //         });
  //       } else {
  //         res.json({ status: true, data: [] });
  //       }
  //       // const finalArr = result.recordsets.flat().reduce((result, current) => {
  //       //   return Object.assign(result, current);
  //       // }, {});

  //       // res.json({ status: true, data: [finalArr] });
  //     }
  //   } catch (err) {
  //     errorHandle.handleError(err, (errorRes) => {
  //       res.send(errorRes);
  //     });
  //   }
  // }

  async getIndividualOrderCount(req, res) {
    try {
      if (req.query.hasOwnProperty("OrderType")) {
      const pool = await poolPromise;
      let result = await pool
            .request()
            .input("RestaurantId",req.query.RestaurantId)
            .input("FromDate",req.query.FromDate)
            .input("ToDate",req.query.ToDate)
            .input("OrderType",req.query.OrderType)
            .execute("getIndividualOrderCount")
      if (result.recordset[0].mainData != null) {
          res.json({ status: true, data: JSON.parse(result.recordset[0].mainData) })

      }else {
          res.json({ status: true, data: []  })
      }
    }
    else{
      res.json({ status: false, message: "Please provide order type" });
    }
  } catch (err) {
    errorHandle.handleError(err, (errorRes) => {
      res.send(errorRes);
    });
  }
}

  // async getIndividualOrderCount(req, res) {
  //   try {
  //     if (req.query.hasOwnProperty("RestaurantId")) {
  //       const pool = await poolPromise;
  //       let result;
  //       if (req.query.hasOwnProperty("OrderType")) {
  //         if (req.query.OrderType === "FoodOrders") {
  //           result = await pool.query(
  //             `SELECT BookingType, COUNT(BookingType) as BookingCount, SUM(NetTariff) as Revenue FROM OrderDetails WHERE FoodId IS NOT NULL AND BuffetId IS NULL AND ComplementaryId IS NULL AND OrderDetails.RestaurantId=${req.query.RestaurantId} AND CAST(OrderDate as DATE) >= '${req.query.FromDate}' AND CAST(OrderDate as DATE)<='${req.query.ToDate}' GROUP BY BookingType`
  //           );
  //         } else if (req.query.OrderType === "BuffetOrders") {
  //           result = await pool.query(
  //             `SELECT BookingType, COUNT(BookingType) as BookingCount, SUM(NetTariff) as Revenue FROM OrderDetails WHERE BuffetId IS NOT NULL AND OrderDetails.RestaurantId=${req.query.RestaurantId} AND CAST(OrderDate as DATE) >= '${req.query.FromDate}' AND CAST(OrderDate as DATE)<='${req.query.ToDate}' GROUP BY BookingType`
  //           );
  //         } else if (req.query.OrderType === "SoftDrinksOrders") {
  //           result = await pool.query(
  //             `SELECT BookingType, COUNT(BookingType) as BookingCount, SUM(NetTariff) as Revenue FROM OrderDetails WHERE SoftDrinkId IS NOT NULL AND OrderDetails.RestaurantId=${req.query.RestaurantId} AND CAST(OrderDate as DATE) >= '${req.query.FromDate}' AND CAST(OrderDate as DATE)<='${req.query.ToDate}' GROUP BY BookingType`
  //           );
  //         } else if (req.query.OrderType === "ComplementaryOrders") {
  //           result = await pool.query(
  //             `SELECT BookingType, COUNT(BookingType) as BookingCount, SUM(NetTariff) as Revenue FROM OrderDetails WHERE ComplementaryId IS NOT NULL AND OrderDetails.RestaurantId=${req.query.RestaurantId} AND CAST(OrderDate as DATE) >= '${req.query.FromDate}' AND CAST(OrderDate as DATE)<='${req.query.ToDate}' GROUP BY BookingType`
  //           );
  //         }

  //         else if (req.query.OrderType === "All") {
  //           result = await pool.query(
  //             `SELECT BookingType, COUNT(BookingType) as BookingCount, SUM(NetTariff) as Revenue FROM OrderDetails WHERE FoodId IS NOT NULL AND BuffetId IS NULL AND ComplementaryId IS NULL AND CAST(OrderDate as DATE) >= '${req.query.FromDate}' AND CAST(OrderDate as DATE)<='${req.query.ToDate}' and RestaurantId=${req.query.RestaurantId} GROUP BY BookingType
            
  //             SELECT BookingType, COUNT(BookingType) as BookingCount, SUM(NetTariff) as Revenue FROM OrderDetails WHERE BuffetId IS NOT NULL AND CAST(OrderDate as DATE) >= '${req.query.FromDate}' AND CAST(OrderDate as DATE)<='${req.query.ToDate}' and RestaurantId=${req.query.RestaurantId} GROUP BY BookingType
  
  //             SELECT BookingType, COUNT(BookingType) as BookingCount, SUM(NetTariff) as Revenue FROM OrderDetails WHERE SoftDrinkId IS NOT NULL AND CAST(OrderDate as DATE) >= '${req.query.FromDate}' AND CAST(OrderDate as DATE)<='${req.query.ToDate}' and RestaurantId=${req.query.RestaurantId} GROUP BY BookingType
              
  //             SELECT BookingType, COUNT(BookingType) as BookingCount, SUM(NetTariff) as Revenue FROM OrderDetails WHERE ComplementaryId IS NOT NULL AND CAST(OrderDate as DATE) >= '${req.query.FromDate}' AND CAST(OrderDate as DATE)<='${req.query.ToDate}' and RestaurantId=${req.query.RestaurantId} GROUP BY BookingType
  //            `
  //           );
  //         }
  //         // if (result.recordset.length > 0) {
  //           return res.json({ status: true, data: result.recordset });
           
  //         // }
  //       } else {
  //         res.json({ status: false, message: "Please provide order type" });
  //       }
  //     } else {
  //       const pool = await poolPromise;
  //       let result;
  //       if (req.query.hasOwnProperty("OrderType")) {
  //         if (req.query.OrderType === "FoodOrders") {
  //           result = await pool.query(
  //             `SELECT BookingType, COUNT(BookingType) as BookingCount, SUM(NetTariff) as Revenue FROM OrderDetails WHERE FoodId IS NOT NULL AND BuffetId IS NULL AND ComplementaryId IS NULL AND CAST(OrderDate as DATE) >= '${req.query.FromDate}' AND CAST(OrderDate as DATE)<='${req.query.ToDate}' GROUP BY BookingType`
  //           );
  //         } else if (req.query.OrderType === "BuffetOrders") {
  //           result = await pool.query(
  //             `SELECT BookingType, COUNT(BookingType) as BookingCount, SUM(NetTariff) as Revenue FROM OrderDetails WHERE BuffetId IS NOT NULL AND CAST(OrderDate as DATE) >= '${req.query.FromDate}' AND CAST(OrderDate as DATE)<='${req.query.ToDate}' GROUP BY BookingType`
  //           );
  //         } else if (req.query.OrderType === "SoftDrinksOrders") {
  //           result = await pool.query(
  //             `SELECT BookingType, COUNT(BookingType) as BookingCount, SUM(NetTariff) as Revenue FROM OrderDetails WHERE SoftDrinkId IS NOT NULL AND CAST(OrderDate as DATE) >= '${req.query.FromDate}' AND CAST(OrderDate as DATE)<='${req.query.ToDate}' GROUP BY BookingType`
  //           );
  //         } else if (req.query.OrderType === "ComplementaryOrders") {
  //           result = await pool.query(
  //             `SELECT BookingType, COUNT(BookingType) as BookingCount, SUM(NetTariff) as Revenue FROM OrderDetails WHERE ComplementaryId IS NOT NULL AND CAST(OrderDate as DATE) >= '${req.query.FromDate}' AND CAST(OrderDate as DATE)<='${req.query.ToDate}' GROUP BY BookingType`
  //           );
  //         }
          
  //         // if (result.recordset.length > 0) {
  //           return res.json({ status: true, data: result.recordset });
  //         // }
  //       } else {
  //         result = await pool.query(
  //           `
  //           SELECT BookingType, COUNT(BookingType) as BookingCount, SUM(NetTariff) as Revenue FROM OrderDetails WHERE FoodId IS NOT NULL AND BuffetId IS NULL AND ComplementaryId IS NULL AND CAST(OrderDate as DATE) >= '${req.query.FromDate}' AND CAST(OrderDate as DATE)<='${req.query.ToDate}' GROUP BY BookingType
            
  //           SELECT BookingType, COUNT(BookingType) as BookingCount, SUM(NetTariff) as Revenue FROM OrderDetails WHERE BuffetId IS NOT NULL AND CAST(OrderDate as DATE) >= '${req.query.FromDate}' AND CAST(OrderDate as DATE)<='${req.query.ToDate}' GROUP BY BookingType

  //           SELECT BookingType, COUNT(BookingType) as BookingCount, SUM(NetTariff) as Revenue FROM OrderDetails WHERE SoftDrinkId IS NOT NULL AND CAST(OrderDate as DATE) >= '${req.query.FromDate}' AND CAST(OrderDate as DATE)<='${req.query.ToDate}' GROUP BY BookingType
            
  //           SELECT BookingType, COUNT(BookingType) as BookingCount, SUM(NetTariff) as Revenue FROM OrderDetails WHERE ComplementaryId IS NOT NULL AND CAST(OrderDate as DATE) >= '${req.query.FromDate}' AND CAST(OrderDate as DATE)<='${req.query.ToDate}' GROUP BY BookingType
  //           `
  //         )
  //         // console.log("Result,,,,", result.recordsets);
  //         res.json({ status: false, message: "Please provide order type" });
  //       }
  //     }
  //   } catch (err) {
  //     errorHandle.handleError(err, (errorRes) => {
  //       res.send(errorRes);
  //     });
  //   }
  // }

  async getIndividualOrderTypes(req, res) {
    try {
      if (!(req.query.RestaurantId || req.query.FromDate && req.query.ToDate
          ))throw "Please Enter all Details";
      const pool = await poolPromise;
      let result = await pool
          .request()
          .input("RestaurantId",req.query.RestaurantId)
          .input("FromDate",req.query.FromDate)
          .input("ToDate",req.query.ToDate)
          .execute("getIndividualOrderTypes")
      if (result.recordset[0].mainData != null) {
          res.json({ status: true, data: JSON.parse(result.recordset[0].mainData) })

      } else {
          res.json({ status: false, data: [] })
      }

  } catch (error) {
      errorHandle.handleError(error, errorRes => {
          res.send(errorRes);
      });
  }
}

  // async getIndividualOrderTypes(req, res) {
  //   if (req.query.hasOwnProperty("RestaurantId")) {
  //     // const pool = await poolPromise;
  //     // let result = await pool.query(
  //     // `(SELECT MAX(OrderDetails.FoodId) AS FoodId, COUNT(OrderDetails.OrderQuantity) AS OrderQuantity, MAX(FoodMaster.FoodName)
  //     // AS FoodName, MAX(FoodMaster.FoodCategoryId) AS FoodCategoryId FROM OrderDetails, FoodMaster WHERE
  //     // OrderDetails.FoodId=FoodMaster.FoodId AND OrderDetails.FoodId IS
  //     // NOT NULL AND OrderDetails.RestaurantId=${req.query.RestaurantId} AND CAST(OrderDetails.OrderDate as DATE) >= '${req.query.FromDate}' AND
  //     // CAST(OrderDetails.OrderDate as DATE)<='${req.query.ToDate}'
  //     // GROUP BY OrderDetails.FoodId)`

  //     //  (SELECT
  //     //     COUNT(BuffetId) as BuffetOrders FROM OrderDetails WHERE BuffetId IS NOT NULL AND OrderDetails.RestaurantId=${req.query.RestaurantId} AND CAST(OrderDate as DATE) >= '${req.query.FromDate}' AND CAST(OrderDate as DATE)<='${req.query.ToDate}')
  //     // (SELECT
  //     //     COUNT(SoftDrinkId) as SoftDrinksOrders FROM OrderDetails WHERE SoftDrinkId IS NOT NULL AND OrderDetails.RestaurantId=${req.query.RestaurantId} AND CAST(OrderDate as DATE) >= '${req.query.FromDate}' AND CAST(OrderDate as DATE)<='${req.query.ToDate}')
  //     // (SELECT
  //     //     COUNT(ComplementaryId) as ComplementaryOrders FROM OrderDetails WHERE ComplementaryId IS NOT NULL AND OrderDetails.RestaurantId=${req.query.RestaurantId} AND CAST(OrderDate as DATE) >= '${req.query.FromDate}' AND CAST(OrderDate as DATE)<='${req.query.ToDate}')
  //     // );

  //     async.parallel(
  //       [
  //         (callback) => {
  //           getFoodNames(req, (foodItemsResult) => {
  //             callback(null, { FoodOrders: foodItemsResult });
  //           });
  //         },
  //         (callback) => {
  //           getBuffetNames(req, (BuffetResult) => {
  //             // console.log("Get Biffet...", BuffetResult);
  //             callback(null, { BuffetOrders: BuffetResult });
  //           });
  //         },
  //         (callback) => {
  //           getSoftDrinksName(req, (softDrinkResult) => {
  //             // console.log("SoftDrink...", softDrinkResult);
  //             callback(null, { SoftDrinksOrders: softDrinkResult });
  //           });
  //         },
  //         (callback) => {
  //           getComplementaryData(req, (complementaryResult) => {
  //             // console.log("Complemnetary", complementaryResult);
  //             callback(null, { ComplemenatryOrders: complementaryResult });
  //           });
  //         },
  //       ],
  //       (err, resultArr) => {
  //         if (err) {
  //           res.json({ status: false, data: [] });
  //           return;
  //         }
  //         // let resultAr
  //         const finalArr = resultArr.flat().reduce((result, current) => {
  //           return Object.assign(result, current);
  //         }, {});

  //         // console.log("ResultArr....", finalArr);
  //         res.json({ status: true, data: finalArr });
  //       }
  //     );
  //     // console.log("Result1.......", result.recordset)

  //     // getCategoryName(result.recordset, () => {});
  //   } else {
  //     const pool = await poolPromise;
  //     let result = await pool.query(
  //       `SELECT OrderHeader.OrderHeaderSl, OrderHeader.OrderId, OrderHeader.NetAmount, OrderHeader.TaxAmount, OrderHeader.PaymentType, OrderHeader.CustomerId,  OrderHeader.BillAmount, OrderHeader.OrderDate, OrderHeader.RestaurantId, OrderHeader.TableId, OrderHeader.BookingType, OrderHeader.BookingStatus, OrderHeader.PaymentStatus FROM OrderHeader WHERE CAST(OrderDate as DATE) >= '${req.query.FromDate}' AND CAST(OrderDate as DATE)<='${req.query.ToDate}' AND BookingStatus IN ('O', 'P', 'S', 'C')`
  //     );

  //     res.json({ status: true, data: result.recordset });
  //   }
  // }
  // catch(error) {
  //   errorHandle.handleError(error, (errorRes) => {
  //     res.send(errorRes);
  //   });
  // }
}

async function getIndividualOrderTypePayment(req){
  const pool = await poolPromise;
  let paymentCount=await pool.query(
    `SELECT OrderHeaderSl FROM OrderDetails WHERE FoodId IS NOT NULL AND BuffetId IS NULL AND ComplementaryId IS NULL AND OrderDetails.RestaurantId=${req.query.RestaurantId} AND CAST(OrderDate as DATE) >= '${req.query.FromDate}' AND CAST(OrderDate as DATE)<='${req.query.ToDate}'`
  )

  // console.log("Payment............", paymentCount);
}

async function getPaymentMode(orderDetails, callback) {
  const pool = await poolPromise;
  async.map(orderDetails, (value, cb) => {
      pool.query(
        `SELECT ConfigName FROM ConfigurationMaster WHERE ConfigId=${value.PaymentType}`,
        (err, response) => {
          if (err) {
            cb(err, null);
          } else {
            if (response.rowsAffected.length > 0) {
              value["PaymentMethod"] =
                response.recordset.length > 0
                  ? response.recordset[0].ConfigName
                  : null;
              cb(null, value);
            } else {
              callback([]);
              return;
            }
          }
        }
      );
    },
    (err, result) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, result);
      }
    }
  );
}

async function getComplementaryData(req, callback) {
  const pool = await poolPromise;
  pool.query(
    `SELECT COUNT(OrderDetails.SoftDrinkId) AS SoftDrinkCount, MAX(OrderDetails.SoftDrinkId) AS SoftDrinkId, 
    MAX(SoftDrinkMaster.SoftDrinkName) 
    AS SoftDrinkName FROM OrderDetails, SoftDrinkMaster WHERE 
    OrderDetails.SoftDrinkId=SoftDrinkMaster.SoftDrinkId AND OrderDetails.RestaurantId=${req.query.RestaurantId} AND 
    CAST(OrderDetails.OrderDate as DATE) >= '${req.query.FromDate}' AND 
    CAST(OrderDetails.OrderDate as DATE)<='${req.query.ToDate}' GROUP BY OrderDetails.SoftDrinkId `,
    (err, result) => {
      if (err) {
        callback(err);
        return;
      }
      if (result.recordset.length > 0) {
        callback(result.recordset);
      } else {
        callback([]);
      }
    }
  );
}

async function getSoftDrinksName(req, callback) {
  const pool = await poolPromise;
  pool.query(
    `SELECT COUNT(OrderDetails.SoftDrinkId) AS SoftDrinkCount, MAX(OrderDetails.SoftDrinkId) AS SoftDrinkId, 
    MAX(SoftDrinkMaster.SoftDrinkName) 
    AS SoftDrinkName FROM OrderDetails, SoftDrinkMaster WHERE 
    OrderDetails.SoftDrinkId=SoftDrinkMaster.SoftDrinkId AND OrderDetails.RestaurantId=${req.query.RestaurantId} AND 
    CAST(OrderDetails.OrderDate as DATE) >= '${req.query.FromDate}' AND 
    CAST(OrderDetails.OrderDate as DATE)<='${req.query.ToDate}' GROUP BY OrderDetails.SoftDrinkId `,
    (err, result) => {
      if (err) {
        callback(err);
        return;
      }
      if (result.recordset.length > 0) {
        callback(result.recordset);
      } else {
        callback([]);
      }
    }
  );
}

async function getBuffetNames(req, callback) {
  const pool = await poolPromise;
  pool.query(
    `SELECT COUNT(OrderDetails.BuffetId) AS BuffetCount, MAX(OrderDetails.BuffetId) AS BuffetId, MAX(BuffetMaster.BuffetName) 
  AS BuffetName FROM OrderDetails, BuffetMaster WHERE 
  OrderDetails.BuffetId=BuffetMaster.BuffetId AND OrderDetails.FoodId IS 
  NOT NULL AND OrderDetails.RestaurantId=${req.query.RestaurantId} AND CAST(OrderDetails.OrderDate as DATE) >= '${req.query.FromDate}' AND 
  CAST(OrderDetails.OrderDate as DATE)<='${req.query.ToDate}' GROUP BY OrderDetails.BuffetId`,
    (err, result) => {
      if (err) {
        callback(err);
        return;
      }
      if (result.recordset.length > 0) {
        callback(result.recordset);
      } else {
        callback([]);
      }
    }
  );
}

function getFoodNames(req, callback) {
  async.waterfall(
    [
      (callback) => {
        getFoodData(req, (result) => {
          callback(null, result);
        });
      },
      (result, callback) => {
        getCategoryName(result, (catResult) => {
          callback(null, catResult);
        });
      },
      // (callback)=>{
      //   getFoodCount(req, (countResult)=>{

      //   })
      // }
    ],
    (err, finalResult) => {
      if (err) {
        callback([]);
      } else {
        callback(finalResult);
      }
    }
  );
}

async function getFoodData(req, callback) {
  const pool = await poolPromise;
  pool.query(
    `(SELECT MAX(OrderDetails.FoodId) AS FoodId, COUNT(OrderDetails.OrderQuantity) AS OrderQuantity, MAX(FoodMaster.FoodName) 
        AS FoodName, MAX(FoodMaster.FoodCategoryId) AS FoodCategoryId FROM OrderDetails, FoodMaster WHERE 
        OrderDetails.FoodId=FoodMaster.FoodId AND OrderDetails.FoodId IS 
        NOT NULL AND OrderDetails.RestaurantId=${req.query.RestaurantId} AND CAST(OrderDetails.OrderDate as DATE) >= '${req.query.FromDate}' AND 
        CAST(OrderDetails.OrderDate as DATE)<='${req.query.ToDate}' 
        GROUP BY OrderDetails.FoodId)`,
    (err, result) => {
      if (err) {
        callback(err);
        return;
      }
      if (result.recordset.length > 0) {
        callback(result.recordset);
      } else {
        callback([]);
      }
    }
  );
}

async function getFoodCount(req, callback) {
  const pool = await poolPromise;
  pool.query(
    `SELECT MAX(OrderDetails.FoodId) AS FoodId, COUNT(OrderDetails.OrderQuantity) AS OrderQuantity, MAX(FoodMaster.FoodName) 
        AS FoodName, MAX(FoodMaster.FoodCategoryId) AS FoodCategoryId FROM OrderDetails, FoodMaster WHERE 
        OrderDetails.FoodId=FoodMaster.FoodId AND OrderDetails.FoodId IS 
        NOT NULL AND OrderDetails.RestaurantId=${req.query.RestaurantId} AND CAST(OrderDetails.OrderDate as DATE) >= '${req.query.FromDate}' AND 
        CAST(OrderDetails.OrderDate as DATE)<='${req.query.ToDate}' 
        GROUP BY OrderDetails.FoodId`,
    (err, result) => {
      if (err) {
        callback(err);
        return;
      }
      if (result.recordset.length > 0) {
        callback(result.recordset);
      } else {
        callback([]);
      }
    }
  );
}

async function getCategoryName(foodDetails, callback) {
  const pool = await poolPromise;
  async.map(
    foodDetails,
    (val, cb) => {
      try {
        pool.query(
          `SELECT FoodCategoryName FROM FoodCategoryMaster WHERE FoodCategoryId=${val.FoodCategoryId}`,
          (err, result) => {
            if (err) {
              return cb(err, null);
            }
            if (result.recordset.length > 0) {
              val["FoodCategoryName"] = result.recordset[0].FoodCategoryName;
              cb(null, null);
            } else {
              val["FoodCategoryName"] = null;
              cb(null, null);
            }
          }
        );
      } catch (err) {
        cb(err, null);
      }
    },
    (error, result) => {
      // console.log("Food+++++", foodDetails);
      callback(foodDetails);
    }
  );
}

const StatsMaster = new StatisticsController();

module.exports = StatsMaster;
