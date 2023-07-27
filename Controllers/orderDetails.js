const errorHandle = require("../services/errorHandler");
const commonMsgs = require("../CommonMsg.json");
const { poolPromise, sql } = require("../db");
const async = require("async");
const ApiService = require("../services/API_services");

class OrderDetails {
  async getAllData(req, res) {
    try {
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .execute("getOrderDetails")
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
  //     const result = await pool.query(
  //       `SELECT RestaurantId, OrderId, OrderSl, FoodId, FoodVarietyId, TableId, Tariff, BookingStatus, Comments, CancelDate, CancelCharges, CancelRefund from OrderDetails`
  //     );
  //     res.json({ status: true, data: result.recordset });
  //   } catch (error) {
  //     errorHandle.handleError(error, errorRes => {
  //       res.send(errorRes);
  //     });
  //   }
  // }
  async getOrderDetailsByOrderId(req, res) {

    try {
      const pool = await poolPromise;
      let result = await pool
          .request()
          .input("OrderHeaderSl", req.query.OrderHeaderSl)
          .execute("getOrderDetailsByOrderId")
      if (result.recordset[0].mainData != null) {
          res.json({ status: true, data: JSON.parse(result.recordset[0].mainData) })

      } else {
          // res.json({ status: true, data: "No data found." })
          res.json({status: true, data: []})
      }

  } catch (error) {
      errorHandle.handleError(error, errorRes => {
          res.send(errorRes);
      });
  }
}

  // async getOrderDetailsByOrderId(req, res) {
  //   try {
  //     const pool = await poolPromise;
  //     const result = await pool.query(

  //        /** Removed the comparison for restaurantId with restaurantId in restaurant master because of the requirement **/

  //       `SELECT OrderHeader.CustomerId, OrderHeader.OrderId, OrderHeader.OrderHeaderSl, OrderHeader.OrderDate, OrderHeader.RestaurantId, OrderHeader.OrderFrom, OrderHeader.TableId, OrderHeader.BookedChairs, OrderHeader.BookingType, OrderHeader.BookingStatus, OrderHeader.PaymentType, OrderHeader.PaymentStatus, OrderHeader.BillAmount, OrderHeader.TaxAmount, OrderHeader.GuestName, OrderHeader.GuestMobile, OrderHeader.CustomerGSTNo, OrderHeader.NetAmount, OrderHeader.HotelOrderId, OrderHeader.HotelRoomNo,OrderHeader.OfferAmount,OrderHeader.OfferId,(cm.ConfigName) as paymentTypeName
  //       FROM OrderHeader inner join ConfigurationMaster as cm on cm.ConfigId=PaymentType WHERE OrderHeader.OrderHeaderSl='${req.query.OrderHeaderSl}'`

  //       // `SELECT OrderHeader.CustomerId, OrderHeader.OrderId, OrderHeader.OrderHeaderSl, OrderHeader.OrderDate, OrderHeader.RestaurantId, RestaurantMaster.RestaurantName, RestaurantMaster.GSTIN, OrderHeader.OrderFrom, OrderHeader.TableId, OrderHeader.BookedChairs, OrderHeader.BookingType, OrderHeader.BookingStatus, OrderHeader.PaymentType, OrderHeader.PaymentStatus, OrderHeader.BillAmount, OrderHeader.TaxAmount, OrderHeader.GuestName, OrderHeader.GuestMobile, OrderHeader.CustomerGSTNo, OrderHeader.NetAmount, OrderHeader.HotelOrderId, OrderHeader.HotelRoomNo
  //       // FROM OrderHeader, RestaurantMaster WHERE OrderHeader.OrderHeaderSl='${req.query.OrderHeaderSl}' AND RestaurantMaster.RestaurantId = OrderHeader.RestaurantId`
  //     );
  //     if (result.recordset.length === 0) {
  //       res.json({ status: true, message: "No data found." });
  //       return;
  //     }
      

  //     let orderHeaderArray = [];
  //     orderHeaderArray.push(...result.recordset);
  //     getAppendingData(
  //       result.recordset[0].RestaurantId,
  //       orderHeaderArray,
  //       result => {
  //         res.json({ status: true, data: result });
  //       }
  //     );
  //   } catch (error) {
  //     errorHandle.handleError(error, errorRes => {
  //       res.send(errorRes);
  //     });
  //   }
  // }

  async updateOrderDetails(req, res) {
    const { RestaurantId, OrderHeaderSl, OrderSl, BookingStatus } = req.body;
    try {
      if (!OrderSl || !BookingStatus) return res.json(commonMsgs.NullMsg);
      let ServedTime = "";
      if (req.body.hasOwnProperty("ServedTime")) {
        ServedTime = `'${req.body.ServedTime}'`;
      } else {
        ServedTime = `NULL`;
      }
      const pool = await poolPromise;
      var result = await pool.query(
        `UPDATE OrderDetails SET BookingStatus = '${BookingStatus}', ServedTime=${ServedTime} WHERE OrderSl='${OrderSl}'`
      );
      if (result.rowsAffected[0] == 0) {
        const resultOfOrderDetails = await pool.request().query(
          `SELECT OrderDetails.OrderId, OrderDetails.FoodId, OrderDetails.OrderQuantity,
          OrderDetails.FoodVarietyId, OrderDetails.TableId, OrderDetails.BookingStatus 
          FROM OrderDetails WHERE OrderDetails.OrderHeaderSl='${OrderHeaderSl}'`
        );
        var orderDetails = resultOfOrderDetails.recordset;
        checkAllBookingStatus(
          [],
          orderDetails,
          OrderHeaderSl,
          BookingStatus,
          () => {
            res.json(commonMsgs.updateMsg);
          }
        );
      } else {
        res.json(commonMsgs.updateMsg);
      }
    } catch (error) {
      errorHandle.handleError(error, errorRes => {
        res.send(errorRes);
      });
    }
  }

  async updateOrderQuantity(req, res) {
    const OrderId = req.body.OrderId;
    const BillAmount = req.body.BillAmount;
    const { FoodId, OrderQuantity, Tariff, FoodVarietyId } = getQuantityDetails(
      req.body.FoodDetails
    );
    try {
      for (let i = 0; i < FoodId.length; i++) {
        if (!FoodId) return res.json(commonMsgs.NullMsg);
        else if (OrderQuantity[i] == 0) {
          const pool = await poolPromise;
          await pool.query(
            `UPDATE OrderDetails SET BookingStatus = 'C', OrderQuantity = '${OrderQuantity[i]}', Tariff='${Tariff[i]}' WHERE OrderId ='${OrderId}' AND FoodId='${FoodId[i]}' AND FoodVarietyId='${FoodVarietyId[i]}'; UPDATE OrderHeader SET BillAmount  = '${BillAmount}' WHERE OrderId ='${OrderId}'`
          );
          const result = await pool.query(
            `SELECT OrderQuantity FROM OrderDetails WHERE OrderId ='${OrderId}'`
          );
          if (!check(result)) {
            `UPDATE OrderHeader SET BookingStatus  = 'C' WHERE OrderId ='${OrderId}'`;
          }
          res.json(commonMsgs.CancelMsg);
        } else {
          const pool = await poolPromise;
          await pool.query(
            `UPDATE OrderDetails SET OrderQuantity = '${OrderQuantity[i]}', Tariff = '${Tariff[i]}' WHERE FoodId = '${FoodId[i]}' AND OrderId = '${OrderId}' AND FoodVarietyId = '${FoodVarietyId[i]}';UPDATE OrderHeader SET BillAmount  = '${BillAmount}' WHERE OrderId ='${OrderId}'`
          );
          res.json(commonMsgs.updateMsg);
        }
      }
    } catch (error) {
      errorHandle.handleError(error, errorRes => {
        res.send(errorRes);
      });
    }
  }

  async cancelOrderDetails(req, res) {
    const {
      RestaurantId,
      OrderHeaderSl,
      OrderSl,
      BillAmount,
      TaxAmount,
      NetAmount
    } = req.body;
    try {
      if (
        !req.body.hasOwnProperty("RestaurantId") ||
        !req.body.hasOwnProperty("OrderHeaderSl") ||
        !req.body.hasOwnProperty("OrderSl") ||
        !req.body.hasOwnProperty("BillAmount") ||
        !req.body.hasOwnProperty("TaxAmount") ||
        !req.body.hasOwnProperty("NetAmount")
      )
        return res.json(commonMsgs.NullMsg);
      const pool = await poolPromise;
      async.waterfall(
        [
          function(cb) {
            getFoodDetails(RestaurantId, OrderHeaderSl, (err, response) => {
              if (err) {
                cb(err, null);
              } else {
                cb(null, response);
              }
            });
          },
          function(OrderData, cb) {
            var FoodDetails = OrderData[0].FoodDetails;
            var singleFoodData =
              FoodDetails[
                FoodDetails.findIndex(x => x.OrderSl === Number(OrderSl))
              ];
            let QueryForOrderHeader =
              OrderData[0].PaymentStatus == "P"
                ? ""
                : `, CancelDate = GETDATE(), CancelCharges = 0, CancelRefund = ${
                    OrderData[0].CancelRefund == null
                      ? singleFoodData.NetTariff
                      : Number(OrderData[0].CancelRefund) +
                        Number(singleFoodData.NetTariff)
                  }`;
            let QueryForOrderDetails =
              OrderData[0].PaymentStatus == "P"
                ? ""
                : `, CancelDate = GETDATE(), CancelCharges = 0, CancelRefund = ${singleFoodData.NetTariff}`;
            pool.query(
              `UPDATE OrderHeader SET BillAmount = '${BillAmount}', TaxAmount = '${TaxAmount}', NetAmount = '${NetAmount}' ${QueryForOrderHeader} WHERE OrderHeaderSl = '${OrderHeaderSl}' AND RestaurantId = ${RestaurantId};UPDATE OrderDetails SET BookingStatus = 'C' ${QueryForOrderDetails} WHERE OrderHeaderSl = '${OrderHeaderSl}' AND OrderSl = '${OrderSl}'`,
              function(err, result) {
                if (err) {
                  cb(err, null);
                } else {
                  cb(null, singleFoodData, OrderData, NetAmount);
                }
              }
            );
          },
          function(singleFoodData, OrderData, NetAmount, cb) {
            checkAllBookingStatus(
              OrderData,
              OrderData[0].FoodDetails,
              OrderHeaderSl,
              "C",
              () => {
                cb(null, [singleFoodData, OrderData, NetAmount]);
              }
            );
          }
        ],
        function(err, results) {
          if (err) {
            errorHandle.handleError(error, errorRes => {
              res.send(errorRes);
            });
          } else {
            var singleFoodData = results[0];
            var OrderData = results[1];
            OrderData[0].PaymentStatus != "P" ?
            res.json({
              status: true,
              TotalAmount: OrderData[0].NetAmount,
              CancellationCharges: 0,
              RefundAmount: singleFoodData.NetTariff,
              BalanceAmount: results[2]
            }):res.json({ status: true,
              message: "Data Updated Successfully",})
          }
        }
      );
    } catch (error) {
      errorHandle.handleError(error, errorRes => {
        res.send(errorRes);
      });
    }
  }

  async getDateSpecificData(req, res) {
    try {
      if (!(
              req.query.hasOwnProperty("orderDate") &&
              req.query.hasOwnProperty("RestaurantId") &&
              req.query.hasOwnProperty("OrderFrom")
          ))throw "Please provide a orderDate.";
      const pool = await poolPromise;
      let result = await pool
          .request()
          .input("orderDate", req.query.orderDate)
          .input("RestaurantId",req.query.RestaurantId)
          .input("OrderFrom",req.query.OrderFrom)
          .input("bookingStatus",req.query.bookingStatus)
          .execute("getDateSpecificData")
      if (result.recordset[0].mainData != null) {
          res.json({ status: true, data: JSON.parse(result.recordset[0].mainData) })

      } else {
          res.json({ status: true, message: "No data found." })
      }

  } catch (error) {
      errorHandle.handleError(error, errorRes => {
          res.send(errorRes);
      });
  }
}

  // async getDateSpecificData(req, res) {
  //   try {
  //     if (
  //       !req.query.hasOwnProperty("orderDate") &&
  //       !req.query.hasOwnProperty("RestaurantId") &&
  //       !req.query.hasOwnProperty("OrderFrom")
  //     )
  //       throw "Please provide a orderDate.";
  //     if (req.query.hasOwnProperty("bookingStatus")) {
  //       const pool = await poolPromise;
  //       const resultOfOrderHeader = await pool.query(
  //         `SELECT OrderHeader.OrderHeaderSl, OrderHeader.OrderId, OrderHeader.OrderDate, OrderHeader.RestaurantId, OrderHeader.TableId, OrderHeader.BookingType, OrderHeader.BookingStatus FROM OrderHeader WHERE CAST(OrderHeader.OrderDate as DATE)='${req.query.orderDate}' AND OrderHeader.BookingStatus='${req.query.bookingStatus}' AND OrderHeader.RestaurantId = ${req.query.RestaurantId} AND OrderFrom ='${req.query.OrderFrom}'`
  //       );
  //       if (resultOfOrderHeader.recordset.length === 0) {
  //         res.json({ status: true, message: "No data found." });
  //         return;
  //       }
  //       let orderHeaderArray = [];
  //       orderHeaderArray.push(...resultOfOrderHeader.recordset);
  //       getAppendingData(req.query.RestaurantId, orderHeaderArray, result => {
  //         res.json({ status: true, data: result });
  //       });
  //     } else {
  //       const pool = await poolPromise;
  //       const resultOfOrderHeader = await pool.query(
  //         `SELECT OrderHeader.OrderId, OrderHeader.OrderDate, OrderHeader.RestaurantId, OrderHeader.TableId, OrderHeader.BookingType, OrderHeader.BookingStatus FROM OrderHeader WHERE CAST(OrderHeader.OrderDate as DATE)='${req.query.orderDate}' AND OrderHeader.RestaurantId = ${req.query.RestaurantId} AND OrderFrom ='${req.query.OrderFrom}'`
  //       );
  //       if (resultOfOrderHeader.recordset.length === 0) {
  //         res.json({ status: true, message: "No data found." });
  //         return;
  //       }
  //       let orderHeaderArray = [];
  //       orderHeaderArray.push(...resultOfOrderHeader.recordset);
  //       getAppendingData(req.query.RestaurantId, orderHeaderArray, result => {
  //         res.json({ status: true, data: result });
  //       });
  //     }
  //   } catch (error) {
  //     errorHandle.handleError(error, errorRes => {
  //       res.send(errorRes);
  //     });
  //   }
  // }

  // async getDateWiseItemSales(req, res) {
  //   try {
  //     if (!(
  //             req.query.RestaurantId &&
  //             req.query.FromDate &&
  //             req.query.ToDate &&
  //             req.query.OrderFrom
  //     ))throw "Please provide all the details!";
  //       else {
  //         const pool = await poolPromise;
  //         let result = await pool
  //                         .request()
  //                         .input("RestaurantId", req.query.RestaurantId)
  //                         .input("FromDate", req.query.FromDate)
  //                         .input("ToDate",req.query.ToDate)
  //                         .input("OrderFrom",req.query.OrderFrom)
  //                         .execute("getDateWiseItemSales1")
  //         if (result.recordset[0].mainData!=null){
  //           var b = JSON.stringify(result.recordset[0].mainData);
  //           var str =b.replace(/\//g,"");
  //           res.json({status: true, data:JSON.parse(str)})
  
  //         }
  //         else{
  //           res.json({status: true, data: []})
  //         }
  //         }
  //   } catch (error) {
  //     errorHandle.handleError(error, errorRes => {
  //       res.send(errorRes);
  //     });
  //   }
  // }

  async getDateWiseItemSales(req, res) {
    try {
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .input("RestaurantId", req.query.RestaurantId)
                        .input("FromDate", req.query.FromDate)
                        .input("ToDate", req.query.ToDate)
                        .input("OrderFrom", req.query.OrderFrom)
                        .execute("getDateWiseItemSales")
        if (result.recordset[0].mainData!=null){
          // let sendingData = [...JSON.parse(result.recordset[0].mainData)[0].FoodDetails]
          // for (let eachData of sendingData) {
          //   if (eachData.looseItemDetails != []) {
          //       eachData.looseItemDetails = JSON.parse(eachData.looseItemDetails)
          //   } else {
          //       eachData.looseItemDetails = []
          //   }
          // }
          let finalData=[]
          // finalData.push({ FoodDetails:sendingData})
          finalData.push({ FoodDetails:JSON.parse(result.recordset[0].mainData)[0].FoodDetails})
          finalData.push({ BuffetDetails:JSON.parse(result.recordset[0].mainData)[0].BuffetDetails})
          finalData.push({ ComplementaryDetails:JSON.parse(result.recordset[0].mainData)[0].ComplementaryDetails})
        
          res.json({status: true, data:finalData})

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

  // async getDateWiseItemSales(req, res) {
  //   try {
  //     // console.log("hello")
  //     if (
  //       req.query.RestaurantId &&
  //       req.query.FromDate &&
  //       req.query.ToDate &&
  //       req.query.OrderFrom
  //     ) {
  //       const pool = await poolPromise;
  //       pool.query(
  //         `SELECT * FROM OrderHeader WHERE RestaurantId=${req.query.RestaurantId} AND CAST(OrderDate as DATE) >= '${req.query.FromDate}' AND CAST(OrderDate as DATE)<='${req.query.ToDate}' AND OrderFrom='${req.query.OrderFrom}'`,
  //         function(err, amountRes) {
  //           if (err) {
  //             throw err;
  //           }
  //           if (amountRes.recordset.length > 0) {
  //             getOrderDetails(req, (err, resp) => {
  //               if (err) {
  //                 throw err;
  //               } else {
  //                 if (resp.length > 0) {
  //                   res.json({ status: true, data: resp });
  //                 } else {
  //                   res.json({ status: true, data: [] });
  //                 }
  //               }
  //             });
  //           } else {
  //             res.json({ status: true, data: [] });
  //           }
  //         }
  //       );
  //     } else throw "Please fill all the details!";
  //   } catch (error) {
  //     errorHandle.handleError(error, errorRes => {
  //       res.send(errorRes);
  //     });
  //   }
  // }
  async getDateAndStatusSpecificData(req, res) {
    try {
      const pool = await poolPromise;
      let result = await pool
          .request()
          .input("OrderHeaderSl",req.query.OrderHeaderSl)
          .input("RestaurantId", req.query.RestaurantId)
          .input("FromDate",req.query.FromDate)
          .input("ToDate",req.query.ToDate)
          .input("BookingStatus",req.query.BookingStatus)
          .input("orderDate", req.query.orderDate)
          .input("OrderFrom",req.query.OrderFrom)
          .execute("getOrderDetailsByOrderId")
      if (result.recordset[0].mainData != null) {
          res.json({ status: true, data: JSON.parse(result.recordset[0].mainData) })

      } else {
          res.json({ status: true, data: "No data found." })
      }

  } catch (error) {
      errorHandle.handleError(error, errorRes => {
          res.send(errorRes);
      });
  }
  }
  // async getDateAndStatusSpecificData(req, res) {
  //   try {
  //     if (
  //       !req.query.hasOwnProperty("orderDate") ||
  //       !req.query.hasOwnProperty("RestaurantId") ||
  //       !req.query.hasOwnProperty("OrderFrom")
  //     )
  //       throw "Please provide all the details!";
  //     const pool = await poolPromise;

  //     const resultOfOrderHeader = await pool.query(
  //       `SELECT OrderHeader.OrderHeaderSl, 
  //               OrderHeader.OrderId, 
  //               OrderHeader.NetAmount, 
  //               OrderHeader.TaxAmount, 
  //               OrderHeader.PaymentType, 
  //               OrderHeader.CustomerId,  
  //               OrderHeader.BillAmount, 
  //               OrderHeader.OrderDate, 
  //               OrderHeader.RestaurantId, 
  //               OrderHeader.TableId, 
  //               OrderHeader.BookingType, 
  //               OrderHeader.BookingStatus, 
  //               OrderHeader.PaymentStatus,
  //               OrderHeader.OfferAmount,
  //               OrderHeader.OfferId 
  //               FROM OrderHeader 
  //               WHERE CAST(OrderHeader.OrderDate as DATE)='${req.query.orderDate}' 
  //               AND BookingStatus IN ('O', 'P', 'S', 'C') 
  //               AND OrderHeader.RestaurantId = ${req.query.RestaurantId} 
  //               AND OrderFrom ='${req.query.OrderFrom}'
  //               AND OrderHeader.PaymentStatus='S'`
  //     );
  //     if (resultOfOrderHeader.recordset.length > 0) {
  //       let orderHeaderArray = [];
  //       orderHeaderArray.push(...resultOfOrderHeader.recordset);
  //       getAppendingData(req.query.RestaurantId, orderHeaderArray, result => {
  //         res.json({ status: true, data: result });
  //       });
  //     } else {
  //       res.json({ status: true, message: "No data found" });
  //     }
  //   } catch (error) {
  //     errorHandle.handleError(error, errorRes => {
  //       res.send(errorRes);
  //     });
  //   }
  // }

  async getDateAndStatusSpecificDataV2(req, res) {
    try {
      if (!(
        req.query.hasOwnProperty("orderDate") ||
        req.query.hasOwnProperty("RestaurantId") ||
        req.query.hasOwnProperty("OrderFrom")
      ))throw "Please provide all the details!";
        else {
          const pool = await poolPromise;
          let result = await pool
                          .request()
                          .input("orderDate", req.query.orderDate)
                          .input("RestaurantId", req.query.RestaurantId)
                          .input("OrderFrom",req.query.OrderFrom)
                          .execute("getDateAndStatusSpecificDataV2")
          if (result.recordset[0].mainData!=null){
            res.json({status: true, data:JSON.parse(result.recordset[0].mainData)})
  
          }
          else{
            res.json({status: true, message: "No data found"})
          }
          }
    } catch (error) {
      errorHandle.handleError(error, errorRes => {
        res.send(errorRes);
      });
    }
  }

  // async getDateAndStatusSpecificDataV2(req, res) {
  //   try {
  //     if (
  //       !req.query.hasOwnProperty("orderDate") ||
  //       !req.query.hasOwnProperty("RestaurantId") ||
  //       !req.query.hasOwnProperty("OrderFrom")
  //     )
  //       throw "Please provide all the details!";
  //     const pool = await poolPromise;

  //     const resultOfOrderHeader = await pool.query(
  //       `SELECT OrderHeader.OrderHeaderSl, OrderHeader.OrderId, OrderHeader.NetAmount, OrderHeader.TaxAmount, OrderHeader.PaymentType, OrderHeader.CustomerId,  OrderHeader.BillAmount, OrderHeader.OrderDate, OrderHeader.RestaurantId, OrderHeader.TableId, OrderHeader.BookingType, OrderHeader.BookingStatus, OrderHeader.OrderFrom, OrderHeader.PaymentStatus FROM OrderHeader WHERE CAST(OrderHeader.OrderDate as DATE)='${req.query.orderDate}' AND BookingStatus IN ('O', 'P', 'S', 'C') AND OrderHeader.RestaurantId = ${req.query.RestaurantId} AND OrderFrom LIKE ('%${req.query.OrderFrom}%')`
  //     );
  //     const countStats = await pool.query(
  //       `SELECT COUNT(BookingStatus) AS TotalOrders,
  //       COUNT(CASE WHEN BookingStatus LIKE '%O%' THEN 1 END) AS Ordered,
  //       COUNT(CASE WHEN BookingStatus LIKE '%P%' THEN 1 END) AS Prepared,
  //       COUNT(CASE WHEN BookingStatus LIKE '%S%' THEN 1 END) AS Served,
  //       COUNT(CASE WHEN BookingStatus LIKE '%C%' THEN 1 END) AS Cancelled,
  //       COUNT(CASE WHEN PaymentStatus LIKE '%P%' AND BookingStatus LIKE '%S%' THEN 1 END) AS PaymentPending,
  //       COUNT(CASE WHEN PaymentStatus LIKE '%S%' AND BookingStatus LIKE '%S%' THEN 1 END) AS Closed
  //       FROM OrderHeader WHERE RestaurantId='${req.query.RestaurantId}' AND CAST(OrderHeader.OrderDate as DATE)='${req.query.orderDate}' AND OrderFrom LIKE ('%${req.query.OrderFrom}%')`
  //     );

  //     if (resultOfOrderHeader.recordset.length > 0) {
  //       let orderHeaderArray = [];
  //       orderHeaderArray.push(...resultOfOrderHeader.recordset);
  //       getAppendingData(req.query.RestaurantId, orderHeaderArray, result => {
  //         res.json({
  //           status: true,
  //           data: {
  //             OrderDetails: result,
  //             OrderStatus:
  //               countStats.recordset.length > 0 ? countStats.recordset[0] : []
  //           }
  //         });
  //       });
  //     } else {
  //       res.json({ status: true, message: "No data found" });
  //     }
  //   } catch (error) {
  //     errorHandle.handleError(error, errorRes => {
  //       res.send(errorRes);
  //     });
  //   }
  // }

  async getOrderDataByWaiterId(req, res) {
    try {
      if (!(
        req.query.hasOwnProperty("orderDate") &&
        req.query.hasOwnProperty("WaiterId") &&
        req.query.hasOwnProperty("RestaurantId") &&
        req.query.hasOwnProperty("OrderFrom")
      ))throw "Please provide all the details.";
      else {
          const pool = await poolPromise;
          let result = await pool
                          .request()
                          .input("orderDate", req.query.orderDate)
                          .input("WaiterId", req.query.WaiterId)
                          .input("RestaurantId",req.query.RestaurantId)
                          .input("OrderFrom",req.query.OrderFrom)
                          .execute("getOrderDataByWaiterId")
          if (result.recordset[0].mainData!=null){
            res.json({status: true, data:JSON.parse(result.recordset[0].mainData)})
  
          }
          else{
            res.json({status: true, message:"No data found"})
          }
          }
    } catch (error) {
      errorHandle.handleError(error, errorRes => {
        res.send(errorRes);
      });
    }
  }

  // async getOrderDataByWaiterId(req, res) {
  //   try {
  //     if (
  //       !req.query.hasOwnProperty("orderDate") &&
  //       !req.query.hasOwnProperty("WaiterId") &&
  //       !req.query.hasOwnProperty("RestaurantId") &&
  //       !req.query.hasOwnProperty("OrderFrom")
  //     )
  //       throw "Please provide all the details.";
  //     const pool = await poolPromise;
  //     const resultOfOrderHeader = await pool.query(
  //       `SELECT OrderHeader.OrderHeaderSl,OrderHeader.OrderId, OrderHeader.OrderDate, OrderHeader.RestaurantId, OrderHeader.TableId, OrderHeader.BookingType, OrderHeader.PaymentStatus, OrderHeader.BookingStatus FROM OrderHeader WHERE CAST(OrderHeader.OrderDate as DATE)='${req.query.orderDate}' AND BookingStatus IN ('O', 'P', 'S', 'C') AND OrderHeader.RestaurantId = ${req.query.RestaurantId} AND OrderFrom ='${req.query.OrderFrom}'`
  //     );
  //     if (resultOfOrderHeader.recordset.length > 0) {
  //       let orderHeaderArray = [];
  //       orderHeaderArray.push(...resultOfOrderHeader.recordset);
  //       getAppendingDataforWaiterId(
  //         req.query.RestaurantId,
  //         req.query.WaiterId,
  //         orderHeaderArray,
  //         async function(result) {
  //           var newResult = await result.filter(value => {
  //             return value.FoodDetails.length > 0;
  //           });
  //           res.json({ status: true, data: newResult });
  //         }
  //       );
  //     } else {
  //       res.json({ status: true, message: "No data found" });
  //     }
  //   } catch (error) {
  //     errorHandle.handleError(error, errorRes => {
  //       res.send(errorRes);
  //     });
  //   }
  // }

  async getAllPaymentPendingData(req, res) {
    try {
      if (!(
        req.query.hasOwnProperty("OrderDate") &&
        req.query.hasOwnProperty("RestaurantId") &&
        req.query.hasOwnProperty("OrderFrom")
      ))throw "Please provide a OrderDate.";
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .input("OrderDate",req.query.OrderDate)
                        .input("RestaurantId",req.query.RestaurantId)
                        .input("OrderFrom",req.query.OrderFrom)
                        .execute("getAllPaymentPendingData")
        if (result.recordset[0].mainData != null) {
          let sendingData = [...JSON.parse(result.recordset[0].mainData)]
          for (let eachData of sendingData) {
              // console.log("each Data", eachData.);
              if (eachData.FoodDetails != []) {
                  eachData.FoodDetails = JSON.parse(eachData.FoodDetails)
              } else {
                  eachData.FoodDetails = []
              }
          }
          res.json({ status: true, data: sendingData })
        }
        else{
          res.json({status: true, message: "No data found"})
        } 
    } catch (error) {
      errorHandle.handleError(error, errorRes => {
        res.send(errorRes);
      });
    }
  }

  // async getAllPaymentPendingData(req, res) {
  //   try {
  //     if (
  //       !req.query.hasOwnProperty("OrderDate") &&
  //       !req.query.hasOwnProperty("RestaurantId") &&
  //       !req.query.hasOwnProperty("OrderFrom")
  //     )
  //       throw "Please provide a OrderDate.";
  //     const pool = await poolPromise;
  //     const result1 = await pool.query(
  //       `SELECT OrderHeader.OrderHeaderSl, OrderHeader.OrderId, OrderHeader.OrderDate, OrderHeader.RestaurantId, RestaurantMaster.RestaurantName, RestaurantMaster.GSTIN, OrderHeader.TableId, OrderHeader.BookingType, OrderHeader.BookingStatus, OrderHeader.PaymentStatus, OrderHeader.BillAmount, OrderHeader.TaxAmount, OrderHeader.NetAmount FROM OrderHeader, RestaurantMaster WHERE CAST(OrderHeader.OrderDate as DATE)='${req.query.OrderDate}' AND OrderHeader.PaymentStatus IN ('P') AND OrderHeader.RestaurantId = ${req.query.RestaurantId} AND OrderHeader.RestaurantId = RestaurantMaster.RestaurantId AND OrderHeader.BookingStatus IN ('S') AND OrderHeader.OrderFrom ='${req.query.OrderFrom}'`
  //     );
  //     const result2 = await pool.query(
  //       `SELECT OrderHeader.OrderHeaderSl, OrderHeader.OrderId, OrderHeader.OrderDate, OrderHeader.RestaurantId, RestaurantMaster.RestaurantName, RestaurantMaster.GSTIN, OrderHeader.TableId, OrderHeader.BookingType, OrderHeader.BookingStatus, OrderHeader.PaymentStatus, OrderHeader.BillAmount, OrderHeader.TaxAmount, OrderHeader.NetAmount FROM OrderHeader, RestaurantMaster WHERE CAST(OrderHeader.OrderDate as DATE)='${req.query.OrderDate}' AND OrderHeader.PaymentStatus IN ('P') AND OrderHeader.RestaurantId = ${req.query.RestaurantId} AND OrderHeader.TableId IS NULL AND OrderHeader.RestaurantId = RestaurantMaster.RestaurantId AND OrderHeader.BookingStatus IN ('S') AND OrderHeader.OrderFrom ='${req.query.OrderFrom}'`
  //     );
  //     var resultOfOrderHeader = [...result1.recordset, ...result2.recordset];
  //     if (resultOfOrderHeader.length > 0) {
  //       let orderHeaderArray = [];
  //       orderHeaderArray.push(...resultOfOrderHeader);
  //       getAppendingData(req.query.RestaurantId, orderHeaderArray, result => {
  //         res.json({ status: true, data: result });
  //       });
  //     } else {
  //       res.json({ status: true, message: "No data found" });
  //     }
  //   } catch (error) {
  //     errorHandle.handleError(error, errorRes => {
  //       res.send(errorRes);
  //     });
  //   }
  // }

  async getOrderDetailsbyOrderHeaderSl(req, res) {
    try {
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .input("OrderHeaderSl", req.query.OrderHeaderSl)
                        .execute("getOrderDetailsbyOrderHeaderSl")
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

  // async getOrderDetailsbyOrderHeaderSl (req, res) {
  //   try {
  //     const pool = await poolPromise;
  //     const result = await pool.query(`
  //                   SELECT oh.RestaurantId, od.FoodId, fm.FoodName, od.FoodVarietyId ,fm.FoodCategoryId, oh.OrderHeaderSl,
  //                     (SELECT TOP 1 FoodCategoryName FROM FoodCategoryMaster WHERE FoodCategoryId=fm.FoodCategoryId) as FoodCategoryName, 
  //                     od.OrderQuantity, od.BookingType, od.Tariff, od.NetTariff, fm.ImageLink,
  //                     fm.ActiveStatus, fm.CreatedBy ,fm.CreatedDate ,fm.UpdatedBy ,fm.UpdatedDate,fm.FoodTimingId,fm.Description,
  //                     ISNULL((select TaxId, ServiceName, TaxDescription, TaxPercentage, RefNumber FROM TaxMaster WHERE ActiveStatus = 'A' AND ServiceName = 'Restaurant' FOR JSON PATH), '[]') as TaxResult,
  //                     od.ComplementaryId, od.WaiterId , od.ServedTime, od.OrderSl, ISNULL(od.CGST,0) as CGST, ISNULL(od.SGST,0) as SGST, 
  //                     ISNULL(Concat(fqm.FoodQuantity,' ',(select ConfigurationMaster.ConfigName from ConfigurationMaster where ConfigurationMaster.ConfigId=fqm.FoodQuantityTypeId)),0) AS FoodQuantityName,
  //                     ISNULL(fqm.UniqueId,0) as UniqueId
  //                   FROM OrderHeader as oh
  //                   INNER JOIN OrderDetails as od ON od.OrderHeaderSl = oh.OrderHeaderSl
  //                   INNER JOIN FoodMaster as fm ON fm.FoodId = od.FoodId
  //                   LEFT JOIN FoodQuantityMaster as fqm ON fqm.UniqueId = od.FoodVarietyId
  //                   WHERE od.OrderHeaderSl = ${req.query.OrderHeaderSl}
  //                   `)
  //     if (result.recordset.length > 0) {
  //       for (let eachOrder of result.recordset) {
  //         eachOrder.TaxResult = JSON.parse(eachOrder.TaxResult)
  //       }
  //       console.log("result.recordset",result.recordset);
  //       res.json({status: true, data:result.recordset})
  //     }
  //     else {
  //       res.json({status: false, data: "no data found"})
  //     }

  //   } catch (error) {
  //     errorHandle.handleError(error, (errorRes)=> {
  //       res.send(errorRes)
  //     })
  //   }
  // }
}

async function getFoodDetails(RestaurantId, OrderHeaderSl, callback) {
  try {
    const pool = await poolPromise;
    const result = await pool.query(
      `SELECT OrderHeader.CustomerId, OrderHeader.OrderId, OrderHeader.OrderHeaderSl, OrderHeader.OrderDate, OrderHeader.RestaurantId, RestaurantMaster.RestaurantName, RestaurantMaster.GSTIN, OrderHeader.TableId, OrderHeader.BookedChairs, OrderHeader.BookingType, OrderHeader.BookingStatus, OrderHeader.PaymentType, OrderHeader.PaymentStatus, OrderHeader.BillAmount, OrderHeader.TaxAmount, OrderHeader.GuestName, OrderHeader.GuestMobile, OrderHeader.CustomerGSTNo, OrderHeader.NetAmount, OrderHeader.HotelOrderId, OrderHeader.HotelRoomNo, OrderHeader.CancelDate, OrderHeader.CancelCharges, OrderHeader.CancelRefund FROM OrderHeader, RestaurantMaster WHERE OrderHeader.OrderHeaderSl='${OrderHeaderSl}' AND RestaurantMaster.RestaurantId = OrderHeader.RestaurantId`
    );
    if (result.recordset.length === 0) {
      callback(null, []);
      return;
    }
    let orderHeaderArray = [];
    orderHeaderArray.push(...result.recordset);
    getAppendingData(
      result.recordset[0].RestaurantId,
      orderHeaderArray,
      result => {
        callback(null, result);
      }
    );
  } catch (error) {
    errorHandle.handleError(error, errorRes => {
      callback(errorRes, null);
    });
  }
}

function check(result) {
  for (let i = 0; i < result.recordset.length; i++) {
    if (result.recordset[i].OrderQuantity != 0) {
      return true;
    }
  }
  return false;
}

function getQuantityDetails(input) {
  let DetailsArray = [];
  DetailsArray = input;
  let FoodId = [],
    OrderQuantity = [],
    Tariff = [],
    FoodVarietyId = [];
  for (let i = 0; i < input.length; i++) {
    OrderQuantity.push(input[i].OrderQuantity);
    FoodId.push(input[i].FoodId);
    Tariff.push(input[i].Tariff);
    FoodVarietyId.push(input[i].FoodVarietyId);
  }
  return { OrderQuantity, FoodId, Tariff, FoodVarietyId };
}

function getAppendingData(RestaurantId, orderHeaderArray, callback) {
  orderHeaderArray.map(async (value, index) => {
    const pool = await poolPromise;
    const result1 = await pool
      .request()
      .query(
        `SELECT OrderDetails.RestaurantId, 
          OrderDetails.OrderId, 
          OrderDetails.OrderHeaderSl, 
          OrderDetails.OrderSl, 
          OrderDetails.FoodId, 
          FoodMaster.FoodName, 
          FoodMaster.FoodToken,
          OrderDetails.OrderQuantity,  
          ISNULL(OrderDetails.FoodVarietyId,0) as FoodVarietyId, 
          Concat(FoodQuantityMaster.FoodQuantity,' ',(select ConfigurationMaster.ConfigName from ConfigurationMaster where ConfigurationMaster.ConfigId=FoodQuantityMaster.FoodQuantityTypeId)) AS FoodVarietyName, 
          OrderDetails.TableId, 
          OrderDetails.Tariff, 
          OrderDetails.NetTariff, 
          OrderDetails.OrderTime, 
          OrderDetails.ServedTime, 
          OrderDetails.BookingStatus, 
          OrderDetails.WaiterId, 
          OrderDetails.BuffetId, 
          OrderDetails.BookingType 
          FROM OrderDetails, FoodQuantityMaster, FoodMaster 
          WHERE FoodQuantityMaster.UniqueId=OrderDetails.FoodVarietyId 
          AND OrderDetails.FoodId=FoodMaster.FoodId 
          AND OrderDetails.OrderId='${value.OrderId}' 
          AND BookingStatus IN ('O', 'P', 'S', 'C') 
          AND OrderDetails.OrderHeaderSl='${value.OrderHeaderSl}'`
      );
    
    const result2 = await pool
      .request()
      .query(
        `SELECT OrderDetails.RestaurantId, 
        OrderDetails.OrderHeaderSl, 
        OrderDetails.OrderId, 
        OrderDetails.OrderSl, 
        OrderDetails.FoodId, 
        FoodMaster.FoodName, 
        FoodMaster.FoodToken,
        OrderDetails.OrderQuantity, 
        0 AS FoodVarietyId,
        'null' AS FoodVarietyName,
        OrderDetails.TableId, 
        OrderDetails.Tariff, 
        OrderDetails.NetTariff, 
        OrderDetails.OrderTime, 
        OrderDetails.ServedTime, 
        OrderDetails.BookingStatus, 
        OrderDetails.WaiterId, 
        OrderDetails.BuffetId,
        OrderDetails.BookingType 
        FROM OrderDetails,FoodMaster 
        WHERE OrderDetails.FoodId=FoodMaster.FoodId 
        AND OrderDetails.OrderId='${value.OrderId}' 
        AND (OrderDetails.FoodVarietyId IS NULL OR OrderDetails.FoodVarietyId=0)
        AND BookingStatus IN ('O', 'P', 'S', 'C') 
        AND OrderDetails.OrderHeaderSl='${value.OrderHeaderSl}' 
        and BookingType!='Buffet'`
      );

      const result4 = await pool
      .request()
      .query(
        `SELECT OrderDetails.RestaurantId, OrderDetails.OrderHeaderSl, OrderDetails.OrderId,
        (null) as OrderSl,
        (null) as FoodId,
        (select top(1) BuffetName from BuffetMaster where BuffetId=OrderDetails.BuffetId) as FoodName,
        OrderDetails.OrderQuantity, 'null' AS FoodVarietyId,
        'null' AS FoodVarietyName,OrderDetails.TableId, OrderDetails.Tariff, 
        OrderDetails.NetTariff, OrderDetails.OrderTime, OrderDetails.ServedTime, OrderDetails.BookingStatus, OrderDetails.WaiterId, 
        OrderDetails.BuffetId,OrderDetails.BookingType FROM OrderDetails,FoodMaster WHERE OrderDetails.FoodId=FoodMaster.FoodId AND 
        OrderDetails.OrderId='${value.OrderId}' AND (OrderDetails.FoodVarietyId IS NULL OR OrderDetails.FoodVarietyId=0) 
        AND BookingStatus IN ('O', 'P', 'S', 'C') AND OrderDetails.OrderHeaderSl='${value.OrderHeaderSl}' and BookingType='Buffet' group by BuffetId,OrderDetails.RestaurantId,OrderDetails.OrderHeaderSl, 
        OrderDetails.OrderId,OrderDetails.OrderQuantity, OrderDetails.TableId, OrderDetails.Tariff, 
        OrderDetails.NetTariff, OrderDetails.OrderTime, OrderDetails.ServedTime, OrderDetails.BookingStatus, OrderDetails.WaiterId, 
        OrderDetails.BuffetId,OrderDetails.BookingType`
      );
    // const result3 = await pool
    //   .request()
    //   .query(
    //     `SELECT OrderDetails.RestaurantId, OrderDetails.OrderHeaderSl, OrderDetails.OrderId, OrderDetails.OrderSl, OrderDetails.SoftDrinkId, (SoftDrinkMaster.SoftDrinkName) as FoodName,OrderDetails.OrderQuantity, OrderDetails.SoftDrinkQuantityId, ConfigurationMaster.ConfigName AS SoftDrinkQuantityName, OrderDetails.TableId, OrderDetails.Tariff, OrderDetails.OrderTime, OrderDetails.ServedTime, OrderDetails.NetTariff, OrderDetails.BookingStatus, OrderDetails.WaiterId, OrderDetails.BookingType FROM OrderDetails,SoftDrinkMaster,ConfigurationMaster WHERE OrderDetails.SoftDrinkId=SoftDrinkMaster.SoftDrinkId AND OrderDetails.OrderId='${value.OrderId}' AND OrderDetails.SoftDrinkQuantityId = ConfigurationMaster.ConfigId AND BookingStatus IN ('O', 'P', 'S', 'C') AND OrderDetails.OrderHeaderSl='${value.OrderHeaderSl}'`
    //   );
    var finalData = [...result1.recordset, ...result2.recordset, ...result4.recordset];
    getWaiterName(RestaurantId, finalData, () => {
      orderHeaderArray[index]["FoodDetails"] = finalData;
      // if (result3.recordset.length > 0)
      //   orderHeaderArray[index]["SoftDrinkDetails"] = result3.recordset;
      if (index === orderHeaderArray.length - 1) callback(orderHeaderArray);
    });
  });
}

// Last Changes For the Reason for the WaiterId Based on DateWise.
// Changes:- OrderDetails.OrderId -> OrderDetails.OrderHeaderSl
async function getAppendingDataforWaiterId(
  RestaurantId,
  WaiterId,
  orderHeaderArray,
  callback
) {
  var asyncArr = [],
    resultArr = [];
  for (var i = 0; i < orderHeaderArray.length; i++) {
    append(orderHeaderArray[i], i);
  }
  async function append(value, index) {
    asyncArr.push(async cb => {
      const pool = await poolPromise;
      const result1 = await pool
        .request()
        // The Bellow Query will Return the same Result If WaiterMaster from Node Api.
        .query(
          `SELECT OrderDetails.RestaurantId, OrderDetails.OrderId, OrderDetails.OrderHeaderSl, OrderDetails.OrderSl, OrderDetails.FoodId, FoodMaster.FoodName, OrderDetails.OrderQuantity,OrderDetails.FoodVarietyId, ConfigurationMaster.ConfigName As FoodVarietyName, OrderDetails.TableId, OrderDetails.Tariff, OrderDetails.NetTariff, OrderDetails.OrderTime, OrderDetails.ServedTime, OrderDetails.BookingType, OrderDetails.BookingStatus, OrderDetails.WaiterId FROM OrderDetails, ConfigurationMaster, FoodMaster, WaiterMaster WHERE ConfigurationMaster.ConfigId=OrderDetails.FoodVarietyId AND OrderDetails.FoodId=FoodMaster.FoodId AND OrderDetails.OrderHeaderSl='${value.OrderHeaderSl}' AND OrderDetails.WaiterId='${WaiterId}' AND BookingStatus IN ('O', 'P', 'S', 'C') AND OrderDetails.WaiterId IS NOT NULL`
        );
      const result2 = await pool
        .request()
        .query(
          `SELECT OrderDetails.RestaurantId, OrderDetails.OrderHeaderSl, OrderDetails.OrderId, OrderDetails.OrderSl, OrderDetails.FoodId, FoodMaster.FoodName, OrderDetails.OrderQuantity,OrderDetails.TableId,OrderDetails.Tariff, OrderDetails.NetTariff, OrderDetails.OrderTime, OrderDetails.ServedTime, OrderDetails.BookingStatus, OrderDetails.BookingType, OrderDetails.WaiterId FROM OrderDetails,FoodMaster WHERE OrderDetails.FoodId=FoodMaster.FoodId AND OrderDetails.OrderHeaderSl='${value.OrderHeaderSl}' AND OrderDetails.WaiterId='${WaiterId}' AND OrderDetails.FoodVarietyId IS NULL AND BookingStatus IN ('O', 'P', 'S', 'C') AND OrderDetails.WaiterId IS NOT NULL`
        );
      var finalData = [...result1.recordset, ...result2.recordset];
      value["FoodDetails"] = finalData;
      resultArr.push(value);
      if (index == orderHeaderArray.length) {
        cb(null, null);
      }
    });
  }
  async.parallel(asyncArr, async (err, result) => {
    let newResult = await resultArr.filter(value => {
      return value.FoodDetails.length > 0;
    });
    if (newResult.length == 0) return callback([]);
    for (let i = 0; i < newResult.length; i++) {
      newResult[i].FoodDetails;
      getWaiterFromApi(
        RestaurantId,
        newResult[i].FoodDetails,
        i,
        (index, waiterNames) => {
          newResult[index]["FoodDetails"] = waiterNames;
          if (i == newResult.length - 1) {
            callback(newResult);
          }
        }
      );
    }
  });
}

async function checkAllBookingStatus(
  OrderData,
  orderDetails,
  OrderHeaderSl,
  BookingStatus,
  callback
) {
  const pool = await poolPromise;
  let FoodOrders = orderDetails.filter(
    order => order.hasOwnProperty("FoodId") && order.FoodId != null
  );
  let Orders = FoodOrders.filter(order => order.BookingStatus == BookingStatus);
  let TableData = orderDetails.filter(order => order.TableId != null);
  if (FoodOrders.length === Orders.length) {
    if (BookingStatus === "C" && TableData.length > 0) {
      let Query =
        OrderData[0].PaymentStatus == "P"
          ? ""
          : `, CancelDate = GETDATE(), CancelCharges = 0, CancelRefund = ${OrderData[0].NetAmount}`;
      await pool.query(
        `UPDATE OrderHeader SET BookingStatus = '${BookingStatus}', TableStatus = 'A' ${Query} WHERE OrderHeaderSl = '${OrderHeaderSl}'`
      );
    } else {
      await pool.query(
        `UPDATE OrderHeader SET BookingStatus = '${BookingStatus}' WHERE OrderHeaderSl = '${OrderHeaderSl}'`
      );
    }
    callback(null);
  } else {
    callback(null);
  }
}

function getWaiterFromApi(RestaurantId, orderDetailsArr, index, callback) {
  this.apiService = new ApiService();
  this.apiService.CMCommonReport(RestaurantId, apiResponse => {
    orderDetailsArr.map(value => {
      if (value.hasOwnProperty("WaiterId") && value.WaiterId != null) {
        let matchingName = apiResponse.filter(val => {
          return val.EmpId == value.WaiterId;
        });
        value["WaiterName"] =
          matchingName.length > 0
            ? matchingName[0].EmpFirstName + " " + matchingName[0].EmpLastName
            : null;
      }
    });
    callback(index, orderDetailsArr);
  });
}

async function getWaiterName(RestaurantId, OrderDetailsArr, callback) {
  const pool = await poolPromise;
  async.map(
    OrderDetailsArr,
    function(value, cb) {
      if (value.hasOwnProperty("BuffetId") && value.BuffetId != null) {
        pool.query(
          `SELECT BuffetName, Tariff from BuffetMaster where BuffetId = ${value.BuffetId}`,
          function(err, result) {
            if (result.recordset.length > 0) {
              value["BuffetName"] = result.recordset[0].BuffetName;
              value.NetTariff =
                Number(result.recordset[0].Tariff) *
                Number(value.OrderQuantity);
              cb(null, value);
            } else {
              cb(null, value);
            }
          }
        );
      } else if (value.hasOwnProperty("WaiterId") && value.WaiterId != null) {
        this.apiService = new ApiService();

        this.apiService.CMCommonReport(RestaurantId, apiResponse => {
          // console.log("apiResponse", apiResponse);
          let matchingName = apiResponse.filter(val => {
            return val.EmpId == value.WaiterId;
          });
          value["WaiterName"] =
            matchingName.length > 0
              ? matchingName[0].EmpFirstName + " " + matchingName[0].EmpLastName
              : null;
          cb(null, value);
        });
      } else {
        cb(null, value);
      }
    },
    function(err, result) {
      callback(null);
    }
  );
}

async function getAllOrder(req, callback){
  const pool = await poolPromise;
  let FoodDetails = [];
  

  result=await pool.query(
    `SELECT MAX(OrderDetails.RestaurantId) AS RestaurantId, OrderDetails.FoodId, MAX(FoodMaster.FoodName) AS FoodName, 
    OrderDetails.FoodVarietyId, SUM(OrderDetails.OrderQuantity) AS Quantity
    ,(((OrderDetails.CGST+OrderDetails.SGST)/100)*sum(NetTariff)) as TaxAmount
    ,SUM(NetTariff) AS Amount 
	  ,Concat((SELECT FoodQuantityMaster.FoodQuantity FROM FoodQuantityMaster WHERE UniqueId=OrderDetails.FoodVarietyId),' ',(select ConfigurationMaster.ConfigName from ConfigurationMaster where ConfigurationMaster.ConfigId IN (SELECT FoodQuantityMaster.FoodQuantityTypeId FROM FoodQuantityMaster WHERE UniqueId=OrderDetails.FoodVarietyId))) AS FoodVarietyName
    FROM OrderDetails
    INNER JOIN FoodMaster ON OrderDetails.FoodId=FoodMaster.FoodId
    WHERE OrderDetails.RestaurantId=${req.query.RestaurantId}
    AND OrderDetails.FoodId=FoodMaster.FoodId 
    AND CAST(OrderDate as DATE) >= '${req.query.FromDate}' AND CAST(OrderDate as DATE)<='${req.query.ToDate}'
    AND (OrderDetails.BuffetId IS NULL or OrderDetails.BuffetId = 0) 
    AND (OrderDetails.ComplementaryId IS NULL or OrderDetails.ComplementaryId=0) AND OrderDetails.FoodId IS NOT NULL
    GROUP BY OrderDetails.FoodId, OrderDetails.FoodVarietyId,OrderDetails.CGST,OrderDetails.SGST`,
  );
  if(result.recordset.length>0){
    FoodDetails.push(...result.recordset);
  }
  result3=await pool.query(
    `SELECT MAX(OrderDetails.RestaurantId) AS RestaurantId, OrderDetails.FoodId, MAX(FoodMaster.FoodName) AS FoodName
    ,(((OrderDetails.CGST+OrderDetails.SGST)/100)*sum(NetTariff)) as TaxAmount
    ,SUM(NetTariff) AS Amount,SUM(OrderQuantity) as Quantity
    FROM OrderDetails
    INNER JOIN FoodMaster ON OrderDetails.FoodId=FoodMaster.FoodId
   
    WHERE OrderDetails.RestaurantId=${req.query.RestaurantId} and OrderDetails.FoodVarietyId IS NULL
    AND OrderDetails.FoodId=FoodMaster.FoodId 
    AND CAST(OrderDate as DATE) >= '${req.query.FromDate}' AND CAST(OrderDate as DATE)<='${req.query.ToDate}'
    AND (OrderDetails.BuffetId IS NULL or OrderDetails.BuffetId = 0) 
    AND (OrderDetails.ComplementaryId IS NULL or OrderDetails.ComplementaryId=0) AND OrderDetails.FoodId IS NOT NULL 
    GROUP BY OrderDetails.FoodId, OrderDetails.FoodVarietyId,OrderDetails.CGST,OrderDetails.SGST `
    
  );
  if(result3.recordset.length>0){
    FoodDetails.push(...result3.recordset);
  }
   return FoodDetails
}
// async function getAllOrder(req, callback){
//   const pool = await poolPromise;
//   let FoodDetails = [];
  

//   result=await pool.query(
//     `SELECT MAX(OrderDetails.RestaurantId) AS RestaurantId, OrderDetails.FoodId, MAX(FoodMaster.FoodName) AS FoodName, 
//     OrderDetails.FoodVarietyId, SUM(OrderDetails.OrderQuantity) AS Quantity
//     ,(((OrderDetails.CGST+OrderDetails.SGST)/100)*sum(NetTariff)) as TaxAmount
//     ,SUM(NetTariff) AS Amount , cm.ConfigName as  FoodVarietyName
//     FROM OrderDetails
//     INNER JOIN FoodMaster ON OrderDetails.FoodId=FoodMaster.FoodId
//     INNER JOIN ConfigurationMaster as cm ON cm.ConfigId = OrderDetails.FoodVarietyId
//     WHERE OrderDetails.RestaurantId=${req.query.RestaurantId}
//     AND OrderDetails.FoodId=FoodMaster.FoodId 
//     AND CAST(OrderDate as DATE) >= '${req.query.FromDate}' AND CAST(OrderDate as DATE)<='${req.query.ToDate}'
//     AND OrderDetails.BuffetId IS NULL 
//     AND OrderDetails.ComplementaryId IS NULL AND OrderDetails.FoodId IS NOT NULL 
//     GROUP BY OrderDetails.FoodId, OrderDetails.FoodVarietyId,OrderDetails.CGST,OrderDetails.SGST, OrderDetails.FoodVarietyId, cm.ConfigName`,
//     // function(err, result) {
//     //   if (err) {
//     //     return err;
//     //   }
//     //    FoodDetails.push(...result.recordset);

//     // }
//   );
//   if(result.recordset.length>0){
//     FoodDetails.push(...result.recordset);
//   }

//   // result2=await pool.query(
//   //   `SELECT MAX(OrderDetails.RestaurantId) AS RestaurantId, (OrderDetails.SoftDrinkId) as FoodId, MAX(SoftDrinkMaster.SoftDrinkName) AS FoodName, 
//   //   OrderDetails.SoftDrinkQuantityId, MAX(ConfigurationMaster.ConfigName) AS FoodVarietyName, SUM(OrderDetails.OrderQuantity) AS Quantity,
//   //   (((OrderDetails.CGST+OrderDetails.SGST)/100)*sum(NetTariff)) as TaxAmount
//   //   ,SUM(NetTariff) AS Amount 
//   //   FROM OrderDetails,SoftDrinkMaster,ConfigurationMaster WHERE OrderDetails.RestaurantId=${req.query.RestaurantId} AND OrderDetails.SoftDrinkId=SoftDrinkMaster.SoftDrinkId 
//   //   AND CAST(OrderDate as DATE) >= '${req.query.FromDate}' AND CAST(OrderDate as DATE)<='${req.query.ToDate}' AND OrderDetails.FoodId IS NULL 
//   //   AND OrderDetails.SoftDrinkQuantityId = ConfigurationMaster.ConfigId GROUP BY OrderDetails.SoftDrinkId, OrderDetails.SoftDrinkQuantityId,OrderDetails.CGST,OrderDetails.SGST`
//   // );
//   // if(result2.recordset.length>0){
//   //   FoodDetails.push(...result2.recordset);
//   // }

//   result3=await pool.query(
//     `SELECT MAX(OrderDetails.RestaurantId) AS RestaurantId, OrderDetails.FoodId, MAX(FoodMaster.FoodName) AS FoodName
//     ,(((OrderDetails.CGST+OrderDetails.SGST)/100)*sum(NetTariff)) as TaxAmount
//     ,SUM(NetTariff) AS Amount,SUM(OrderQuantity) as Quantity
//     FROM OrderDetails
//     INNER JOIN FoodMaster ON OrderDetails.FoodId=FoodMaster.FoodId
   
//     WHERE OrderDetails.RestaurantId=${req.query.RestaurantId} and OrderDetails.FoodVarietyId IS NULL
//     AND OrderDetails.FoodId=FoodMaster.FoodId 
//     AND CAST(OrderDate as DATE) >= '${req.query.FromDate}' AND CAST(OrderDate as DATE)<='${req.query.ToDate}'
//     AND OrderDetails.BuffetId IS NULL 
//     AND OrderDetails.ComplementaryId IS NULL AND OrderDetails.FoodId IS NOT NULL 
//     GROUP BY OrderDetails.FoodId, OrderDetails.FoodVarietyId,OrderDetails.CGST,OrderDetails.SGST `
    
//   );
//   if(result3.recordset.length>0){
//     FoodDetails.push(...result3.recordset);
//   }
//    return FoodDetails
// }

async function getOrderDetails(req, callback) {
  const pool = await poolPromise;
  let food=await getAllOrder(req, callback)
  // console.log(food,"food")
  
  
  
  async.parallel(
    [

     async function() {
       return (null, { FoodDetails: food});
      },
      
     
      function(callback) {
        pool.query(
          `SELECT MAX(OrderDetails.RestaurantId) AS RestaurantId, OrderDetails.BuffetId, MAX(BuffetMaster.BuffetName) AS BuffetName, MAX(OrderQuantity) AS Quantity FROM OrderDetails,BuffetMaster WHERE OrderDetails.RestaurantId=${req.query.RestaurantId} AND OrderDetails.BuffetId=BuffetMaster.BuffetId AND  CAST(OrderDate as DATE) >= '${req.query.FromDate}' AND CAST(OrderDate as DATE)<='${req.query.ToDate}' AND OrderDetails.BuffetId IS NOT NULL GROUP BY OrderDetails.BuffetId`,
          function(err, result) {
            if (err) {
              return callback(err);
            }
            if (result.recordset.length > 0) {
              getBuffetAmount(result.recordset, BuffetDetailsArr => {
                return callback(null, { BuffetDetails: BuffetDetailsArr });
              });
            } else {
              return callback(null, { BuffetDetails: result.recordset });
            }
          }
        );
      },
      function(callback) {
        pool.query(
          `SELECT MAX(RestaurantId) AS RestaurantId, 
            ComplementaryId, 
            MAX(OrderQuantity) AS Quantity, 
            Amount = 0 
            FROM OrderDetails 
            WHERE RestaurantId=${req.query.RestaurantId} 
            AND CAST(OrderDate as DATE) >= '${req.query.FromDate}' 
            AND CAST(OrderDate as DATE)<='${req.query.ToDate}' 
            AND (ComplementaryId IS NOT NULL AND ComplementaryId!=0)
            GROUP BY ComplementaryId`, 
          function(err, result) {
            if (err) {
              return callback(err);
            }
            if (result.recordset.length > 0) {
              getFoodTimingName(result.recordset, complementaryArray => {
                return callback(null, {
                  ComplementaryDetails: complementaryArray
                });
              });
            } else {
              return callback(null, { ComplementaryDetails: result.recordset});
            }
           
         
          }
        );
      }
      // ,function(callback) {
      //   pool.query(
      //     `SELECT od.RestaurantId,od.FoodId,fm.FoodName,od.OrderQuantity AS Quantity,
      //               (((od.CGST+od.SGST)/100)*(NetTariff)) as TaxAmount,NetTariff AS Amount
      //               FROM OrderDetails AS od
      //               INNER JOIN FoodMaster AS fm
      //               ON fm.FoodId=(SELECT FoodId FROM FoodMaster WHERE FoodName='Others' AND RestaurantId=${req.query.RestaurantId}) 
      //               Where od.RestaurantId=${req.query.RestaurantId} 
      //               AND od.FoodId=(SELECT FoodId FROM FoodMaster WHERE FoodName='Others' AND RestaurantId=${req.query.RestaurantId})
      //               AND  CAST(OrderDate as DATE) >= '${req.query.FromDate}' 
      //                       AND CAST(OrderDate as DATE)<='${req.query.ToDate}' `,
      //     function(err, result) {
      //       if (err) {
      //         return callback(err);
      //       }
      //       // return callback(null, { Others: result.recordset });
      //       FoodDetails.push(...result.recordset);
      //       return callback(null, { FoodDetails: FoodDetails});
      //     }
      //   );
      // }
      
    ],
    function(error, callbackResults) {
      if (error) {
        callback(error, null);
      } else {
        callback(null, callbackResults);
      }
    }
  );
}

async function getBuffetAmount(BuffetDetailsArr, callback) {
  const pool = await poolPromise;
  async.map(
    BuffetDetailsArr,
    (value, cb) => {
      pool.query(
        `SELECT Tariff FROM BuffetMaster WHERE BuffetMaster.BuffetId = ${value.BuffetId}`,
        function(err, result) {
          if (err) {
            return cb(err);
          }
          value["Amount"] =
            Number(value.Quantity) * Number(result.recordset[0].Tariff);
          cb(null, null);
        }
      );
    },
    function(err, result) {
      callback(BuffetDetailsArr);
    }
  );
}

async function getFoodTimingName(complementaryArr, callback) {
  const pool = await poolPromise;
  async.map(
    complementaryArr,
    (value, cb) => {
      pool.query(
        `SELECT FoodTimingId FROM ComplementaryMaster WHERE UniqueId='${value.ComplementaryId}'`,
        function(err, result) {
          if (err) {
            return cb(err);
          }
          if (result.recordset.length > 0) {
            pool.query(
              `SELECT FoodTimingName FROM FoodTimingMaster WHERE FoodTimingId='${result.recordset[0].FoodTimingId}'`,
              function(err, result1) {
                if (err) {
                  return cb(err);
                }
                if (result1.recordset.length > 0) {
                  value["ComplementaryName"] =
                    result1.recordset[0].FoodTimingName;
                  cb(null, null);
                } else {
                  cb(null, null);
                }
              }
            );
          } else {
            cb(null, null);
          }
        }
      );
    },
    function(err, result) {
      callback(complementaryArr);
    }
  );
}

const orderDetails = new OrderDetails();

module.exports = orderDetails;















// const errorHandle = require("../services/errorHandler");
// const commonMsgs = require("../CommonMsg.json");
// const { poolPromise, sql } = require("../db");
// const async = require("async");
// const ApiService = require("../services/API_services");

// class OrderDetails {
//   async getAllData(req, res) {
//     try {
//       const pool = await poolPromise;
//       const result = await pool.query(
//         `SELECT RestaurantId, OrderId, OrderSl, FoodId, FoodVarietyId, TableId, Tariff, BookingStatus, Comments, CancelDate, CancelCharges, CancelRefund from OrderDetails`
//       );
//       res.json({ status: true, data: result.recordset });
//     } catch (error) {
//       errorHandle.handleError(error, errorRes => {
//         res.send(errorRes);
//       });
//     }
//   }

//   async getOrderDetailsByOrderId(req, res) {
//     try {
//       const pool = await poolPromise;
//       const result = await pool.query(

//          /** Removed the comparison for restaurantId with restaurantId in restaurant master because of the requirement **/

//         `SELECT OrderHeader.CustomerId, OrderHeader.OrderId, OrderHeader.OrderHeaderSl, OrderHeader.OrderDate, OrderHeader.RestaurantId, OrderHeader.OrderFrom, OrderHeader.TableId, OrderHeader.BookedChairs, OrderHeader.BookingType, OrderHeader.BookingStatus, OrderHeader.PaymentType, OrderHeader.PaymentStatus, OrderHeader.BillAmount, OrderHeader.TaxAmount, OrderHeader.GuestName, OrderHeader.GuestMobile, OrderHeader.CustomerGSTNo, OrderHeader.NetAmount, OrderHeader.HotelOrderId, OrderHeader.HotelRoomNo,OrderHeader.OfferAmount,OrderHeader.OfferId
//         FROM OrderHeader WHERE OrderHeader.OrderHeaderSl='${req.query.OrderHeaderSl}'`

//         // `SELECT OrderHeader.CustomerId, OrderHeader.OrderId, OrderHeader.OrderHeaderSl, OrderHeader.OrderDate, OrderHeader.RestaurantId, RestaurantMaster.RestaurantName, RestaurantMaster.GSTIN, OrderHeader.OrderFrom, OrderHeader.TableId, OrderHeader.BookedChairs, OrderHeader.BookingType, OrderHeader.BookingStatus, OrderHeader.PaymentType, OrderHeader.PaymentStatus, OrderHeader.BillAmount, OrderHeader.TaxAmount, OrderHeader.GuestName, OrderHeader.GuestMobile, OrderHeader.CustomerGSTNo, OrderHeader.NetAmount, OrderHeader.HotelOrderId, OrderHeader.HotelRoomNo
//         // FROM OrderHeader, RestaurantMaster WHERE OrderHeader.OrderHeaderSl='${req.query.OrderHeaderSl}' AND RestaurantMaster.RestaurantId = OrderHeader.RestaurantId`
//       );
//       if (result.recordset.length === 0) {
//         res.json({ status: true, message: "No data found." });
//         return;
//       }
      

//       let orderHeaderArray = [];
//       orderHeaderArray.push(...result.recordset);
//       getAppendingData(
//         result.recordset[0].RestaurantId,
//         orderHeaderArray,
//         result => {
//           res.json({ status: true, data: result });
//         }
//       );
//     } catch (error) {
//       errorHandle.handleError(error, errorRes => {
//         res.send(errorRes);
//       });
//     }
//   }

//   async updateOrderDetails(req, res) {
//     const { RestaurantId, OrderHeaderSl, OrderSl, BookingStatus } = req.body;
//     try {
//       if (!OrderSl || !BookingStatus) return res.json(commonMsgs.NullMsg);
//       let ServedTime = "";
//       if (req.body.hasOwnProperty("ServedTime")) {
//         ServedTime = `'${req.body.ServedTime}'`;
//       } else {
//         ServedTime = `NULL`;
//       }
//       const pool = await poolPromise;
//       var result = await pool.query(
//         `UPDATE OrderDetails SET BookingStatus = '${BookingStatus}', ServedTime=${ServedTime} WHERE OrderSl='${OrderSl}'`
//       );
//       if (result.rowsAffected[0] == 0) {
//         const resultOfOrderDetails = await pool.request().query(
//           `SELECT OrderDetails.OrderId, OrderDetails.FoodId, OrderDetails.OrderQuantity,
//           OrderDetails.FoodVarietyId, OrderDetails.TableId, OrderDetails.BookingStatus 
//           FROM OrderDetails WHERE OrderDetails.OrderHeaderSl='${OrderHeaderSl}'`
//         );
//         var orderDetails = resultOfOrderDetails.recordset;
//         checkAllBookingStatus(
//           [],
//           orderDetails,
//           OrderHeaderSl,
//           BookingStatus,
//           () => {
//             res.json(commonMsgs.updateMsg);
//           }
//         );
//       } else {
//         res.json(commonMsgs.updateMsg);
//       }
//     } catch (error) {
//       errorHandle.handleError(error, errorRes => {
//         res.send(errorRes);
//       });
//     }
//   }

//   async updateOrderQuantity(req, res) {
//     const OrderId = req.body.OrderId;
//     const BillAmount = req.body.BillAmount;
//     const { FoodId, OrderQuantity, Tariff, FoodVarietyId } = getQuantityDetails(
//       req.body.FoodDetails
//     );
//     try {
//       for (let i = 0; i < FoodId.length; i++) {
//         if (!FoodId) return res.json(commonMsgs.NullMsg);
//         else if (OrderQuantity[i] == 0) {
//           const pool = await poolPromise;
//           await pool.query(
//             `UPDATE OrderDetails SET BookingStatus = 'C', OrderQuantity = '${OrderQuantity[i]}', Tariff='${Tariff[i]}' WHERE OrderId ='${OrderId}' AND FoodId='${FoodId[i]}' AND FoodVarietyId='${FoodVarietyId[i]}'; UPDATE OrderHeader SET BillAmount  = '${BillAmount}' WHERE OrderId ='${OrderId}'`
//           );
//           const result = await pool.query(
//             `SELECT OrderQuantity FROM OrderDetails WHERE OrderId ='${OrderId}'`
//           );
//           if (!check(result)) {
//             `UPDATE OrderHeader SET BookingStatus  = 'C' WHERE OrderId ='${OrderId}'`;
//           }
//           res.json(commonMsgs.CancelMsg);
//         } else {
//           const pool = await poolPromise;
//           await pool.query(
//             `UPDATE OrderDetails SET OrderQuantity = '${OrderQuantity[i]}', Tariff = '${Tariff[i]}' WHERE FoodId = '${FoodId[i]}' AND OrderId = '${OrderId}' AND FoodVarietyId = '${FoodVarietyId[i]}';UPDATE OrderHeader SET BillAmount  = '${BillAmount}' WHERE OrderId ='${OrderId}'`
//           );
//           res.json(commonMsgs.updateMsg);
//         }
//       }
//     } catch (error) {
//       errorHandle.handleError(error, errorRes => {
//         res.send(errorRes);
//       });
//     }
//   }

//   async cancelOrderDetails(req, res) {
//     const {
//       RestaurantId,
//       OrderHeaderSl,
//       OrderSl,
//       BillAmount,
//       TaxAmount,
//       NetAmount
//     } = req.body;
//     try {
//       if (
//         !req.body.hasOwnProperty("RestaurantId") ||
//         !req.body.hasOwnProperty("OrderHeaderSl") ||
//         !req.body.hasOwnProperty("OrderSl") ||
//         !req.body.hasOwnProperty("BillAmount") ||
//         !req.body.hasOwnProperty("TaxAmount") ||
//         !req.body.hasOwnProperty("NetAmount")
//       )
//         return res.json(commonMsgs.NullMsg);
//       const pool = await poolPromise;
//       async.waterfall(
//         [
//           function(cb) {
//             getFoodDetails(RestaurantId, OrderHeaderSl, (err, response) => {
//               if (err) {
//                 cb(err, null);
//               } else {
//                 cb(null, response);
//               }
//             });
//           },
//           function(OrderData, cb) {
//             var FoodDetails = OrderData[0].FoodDetails;
//             var singleFoodData =
//               FoodDetails[
//                 FoodDetails.findIndex(x => x.OrderSl === Number(OrderSl))
//               ];
//             let QueryForOrderHeader =
//               OrderData[0].PaymentStatus == "P"
//                 ? ""
//                 : `, CancelDate = GETDATE(), CancelCharges = 0, CancelRefund = ${
//                     OrderData[0].CancelRefund == null
//                       ? singleFoodData.NetTariff
//                       : Number(OrderData[0].CancelRefund) +
//                         Number(singleFoodData.NetTariff)
//                   }`;
//             let QueryForOrderDetails =
//               OrderData[0].PaymentStatus == "P"
//                 ? ""
//                 : `, CancelDate = GETDATE(), CancelCharges = 0, CancelRefund = ${singleFoodData.NetTariff}`;
//             pool.query(
//               `UPDATE OrderHeader SET BillAmount = '${BillAmount}', TaxAmount = '${TaxAmount}', NetAmount = '${NetAmount}' ${QueryForOrderHeader} WHERE OrderHeaderSl = '${OrderHeaderSl}' AND RestaurantId = ${RestaurantId};UPDATE OrderDetails SET BookingStatus = 'C' ${QueryForOrderDetails} WHERE OrderHeaderSl = '${OrderHeaderSl}' AND OrderSl = '${OrderSl}'`,
//               function(err, result) {
//                 if (err) {
//                   cb(err, null);
//                 } else {
//                   cb(null, singleFoodData, OrderData, NetAmount);
//                 }
//               }
//             );
//           },
//           function(singleFoodData, OrderData, NetAmount, cb) {
//             checkAllBookingStatus(
//               OrderData,
//               OrderData[0].FoodDetails,
//               OrderHeaderSl,
//               "C",
//               () => {
//                 cb(null, [singleFoodData, OrderData, NetAmount]);
//               }
//             );
//           }
//         ],
//         function(err, results) {
//           if (err) {
//             errorHandle.handleError(error, errorRes => {
//               res.send(errorRes);
//             });
//           } else {
//             var singleFoodData = results[0];
//             var OrderData = results[1];
//             OrderData[0].PaymentStatus != "P" ?
//             res.json({
//               status: true,
//               TotalAmount: OrderData[0].NetAmount,
//               CancellationCharges: 0,
//               RefundAmount: singleFoodData.NetTariff,
//               BalanceAmount: results[2]
//             }):res.json({ status: true,
//               message: "Data Updated Successfully",})
//           }
//         }
//       );
//     } catch (error) {
//       errorHandle.handleError(error, errorRes => {
//         res.send(errorRes);
//       });
//     }
//   }

//   async getDateSpecificData(req, res) {
//     try {
//       if (
//         !req.query.hasOwnProperty("orderDate") &&
//         !req.query.hasOwnProperty("RestaurantId") &&
//         !req.query.hasOwnProperty("OrderFrom")
//       )
//         throw "Please provide a orderDate.";
//       if (req.query.hasOwnProperty("bookingStatus")) {
//         const pool = await poolPromise;
//         const resultOfOrderHeader = await pool.query(
//           `SELECT OrderHeader.OrderHeaderSl, OrderHeader.OrderId, OrderHeader.OrderDate, OrderHeader.RestaurantId, OrderHeader.TableId, OrderHeader.BookingType, OrderHeader.BookingStatus FROM OrderHeader WHERE CAST(OrderHeader.OrderDate as DATE)='${req.query.orderDate}' AND OrderHeader.BookingStatus='${req.query.bookingStatus}' AND OrderHeader.RestaurantId = ${req.query.RestaurantId} AND OrderFrom ='${req.query.OrderFrom}'`
//         );
//         if (resultOfOrderHeader.recordset.length === 0) {
//           res.json({ status: true, message: "No data found." });
//           return;
//         }
//         let orderHeaderArray = [];
//         orderHeaderArray.push(...resultOfOrderHeader.recordset);
//         getAppendingData(req.query.RestaurantId, orderHeaderArray, result => {
//           res.json({ status: true, data: result });
//         });
//       } else {
//         const pool = await poolPromise;
//         const resultOfOrderHeader = await pool.query(
//           `SELECT OrderHeader.OrderId, OrderHeader.OrderDate, OrderHeader.RestaurantId, OrderHeader.TableId, OrderHeader.BookingType, OrderHeader.BookingStatus FROM OrderHeader WHERE CAST(OrderHeader.OrderDate as DATE)='${req.query.orderDate}' AND OrderHeader.RestaurantId = ${req.query.RestaurantId} AND OrderFrom ='${req.query.OrderFrom}'`
//         );
//         if (resultOfOrderHeader.recordset.length === 0) {
//           res.json({ status: true, message: "No data found." });
//           return;
//         }
//         let orderHeaderArray = [];
//         orderHeaderArray.push(...resultOfOrderHeader.recordset);
//         getAppendingData(req.query.RestaurantId, orderHeaderArray, result => {
//           res.json({ status: true, data: result });
//         });
//       }
//     } catch (error) {
//       errorHandle.handleError(error, errorRes => {
//         res.send(errorRes);
//       });
//     }
//   }

//   async getDateWiseItemSales(req, res) {
//     try {
//       if (
//         req.query.RestaurantId &&
//         req.query.FromDate &&
//         req.query.ToDate &&
//         req.query.OrderFrom
//       ) {
//         const pool = await poolPromise;
//         pool.query(
//           `SELECT * FROM OrderHeader WHERE RestaurantId=${req.query.RestaurantId} AND CAST(OrderDate as DATE) >= '${req.query.FromDate}' AND CAST(OrderDate as DATE)<='${req.query.ToDate}' AND OrderFrom='${req.query.OrderFrom}'`,
//           function(err, amountRes) {
//             if (err) {
//               throw err;
//             }
//             if (amountRes.recordset.length > 0) {
//               getOrderDetails(req, (err, resp) => {
//                 if (err) {
//                   throw err;
//                 } else {
//                   if (resp.length > 0) {
//                     res.json({ status: true, data: resp });
//                   } else {
//                     res.json({ status: true, data: [] });
//                   }
//                 }
//               });
//             } else {
//               res.json({ status: true, data: [] });
//             }
//           }
//         );
//       } else throw "Please fill all the details!";
//     } catch (error) {
//       errorHandle.handleError(error, errorRes => {
//         res.send(errorRes);
//       });
//     }
//   }

//   async getDateAndStatusSpecificData(req, res) {
//     try {
//       if (
//         !req.query.hasOwnProperty("orderDate") ||
//         !req.query.hasOwnProperty("RestaurantId") ||
//         !req.query.hasOwnProperty("OrderFrom")
//       )
//         throw "Please provide all the details!";
//       const pool = await poolPromise;

//       const resultOfOrderHeader = await pool.query(
//         `SELECT OrderHeader.OrderHeaderSl, OrderHeader.OrderId, OrderHeader.NetAmount, OrderHeader.TaxAmount, OrderHeader.PaymentType, OrderHeader.CustomerId,  OrderHeader.BillAmount, OrderHeader.OrderDate, OrderHeader.RestaurantId, OrderHeader.TableId, OrderHeader.BookingType, OrderHeader.BookingStatus, OrderHeader.PaymentStatus,OrderHeader.OfferAmount,OrderHeader.OfferId FROM OrderHeader WHERE CAST(OrderHeader.OrderDate as DATE)='${req.query.orderDate}' AND BookingStatus IN ('O', 'P', 'S', 'C') AND OrderHeader.RestaurantId = ${req.query.RestaurantId} AND OrderFrom ='${req.query.OrderFrom}'`
//       );
//       if (resultOfOrderHeader.recordset.length > 0) {
//         let orderHeaderArray = [];
//         orderHeaderArray.push(...resultOfOrderHeader.recordset);
//         getAppendingData(req.query.RestaurantId, orderHeaderArray, result => {
//           res.json({ status: true, data: result });
//         });
//       } else {
//         res.json({ status: true, message: "No data found" });
//       }
//     } catch (error) {
//       errorHandle.handleError(error, errorRes => {
//         res.send(errorRes);
//       });
//     }
//   }

//   async getDateAndStatusSpecificDataV2(req, res) {
//     try {
//       if (
//         !req.query.hasOwnProperty("orderDate") ||
//         !req.query.hasOwnProperty("RestaurantId") ||
//         !req.query.hasOwnProperty("OrderFrom")
//       )
//         throw "Please provide all the details!";
//       const pool = await poolPromise;

//       const resultOfOrderHeader = await pool.query(
//         `SELECT OrderHeader.OrderHeaderSl, OrderHeader.OrderId, OrderHeader.NetAmount, OrderHeader.TaxAmount, OrderHeader.PaymentType, OrderHeader.CustomerId,  OrderHeader.BillAmount, OrderHeader.OrderDate, OrderHeader.RestaurantId, OrderHeader.TableId, OrderHeader.BookingType, OrderHeader.BookingStatus, OrderHeader.OrderFrom, OrderHeader.PaymentStatus FROM OrderHeader WHERE CAST(OrderHeader.OrderDate as DATE)='${req.query.orderDate}' AND BookingStatus IN ('O', 'P', 'S', 'C') AND OrderHeader.RestaurantId = ${req.query.RestaurantId} AND OrderFrom LIKE ('%${req.query.OrderFrom}%')`
//       );
//       const countStats = await pool.query(
//         `SELECT COUNT(BookingStatus) AS TotalOrders,
//         COUNT(CASE WHEN BookingStatus LIKE '%O%' THEN 1 END) AS Ordered,
//         COUNT(CASE WHEN BookingStatus LIKE '%P%' THEN 1 END) AS Prepared,
//         COUNT(CASE WHEN BookingStatus LIKE '%S%' THEN 1 END) AS Served,
//         COUNT(CASE WHEN BookingStatus LIKE '%C%' THEN 1 END) AS Cancelled,
//         COUNT(CASE WHEN PaymentStatus LIKE '%P%' AND BookingStatus LIKE '%S%' THEN 1 END) AS PaymentPending,
//         COUNT(CASE WHEN PaymentStatus LIKE '%S%' AND BookingStatus LIKE '%S%' THEN 1 END) AS Closed
//         FROM OrderHeader WHERE RestaurantId='${req.query.RestaurantId}' AND CAST(OrderHeader.OrderDate as DATE)='${req.query.orderDate}' AND OrderFrom LIKE ('%${req.query.OrderFrom}%')`
//       );

//       if (resultOfOrderHeader.recordset.length > 0) {
//         let orderHeaderArray = [];
//         orderHeaderArray.push(...resultOfOrderHeader.recordset);
//         getAppendingData(req.query.RestaurantId, orderHeaderArray, result => {
//           res.json({
//             status: true,
//             data: {
//               OrderDetails: result,
//               OrderStatus:
//                 countStats.recordset.length > 0 ? countStats.recordset[0] : []
//             }
//           });
//         });
//       } else {
//         res.json({ status: true, message: "No data found" });
//       }
//     } catch (error) {
//       errorHandle.handleError(error, errorRes => {
//         res.send(errorRes);
//       });
//     }
//   }

//   async getOrderDataByWaiterId(req, res) {
//     try {
//       if (
//         !req.query.hasOwnProperty("orderDate") &&
//         !req.query.hasOwnProperty("WaiterId") &&
//         !req.query.hasOwnProperty("RestaurantId") &&
//         !req.query.hasOwnProperty("OrderFrom")
//       )
//         throw "Please provide all the details.";
//       const pool = await poolPromise;
//       const resultOfOrderHeader = await pool.query(
//         `SELECT OrderHeader.OrderHeaderSl,OrderHeader.OrderId, OrderHeader.OrderDate, OrderHeader.RestaurantId, OrderHeader.TableId, OrderHeader.BookingType, OrderHeader.PaymentStatus, OrderHeader.BookingStatus FROM OrderHeader WHERE CAST(OrderHeader.OrderDate as DATE)='${req.query.orderDate}' AND BookingStatus IN ('O', 'P', 'S', 'C') AND OrderHeader.RestaurantId = ${req.query.RestaurantId} AND OrderFrom ='${req.query.OrderFrom}'`
//       );
//       if (resultOfOrderHeader.recordset.length > 0) {
//         let orderHeaderArray = [];
//         orderHeaderArray.push(...resultOfOrderHeader.recordset);
//         getAppendingDataforWaiterId(
//           req.query.RestaurantId,
//           req.query.WaiterId,
//           orderHeaderArray,
//           async function(result) {
//             var newResult = await result.filter(value => {
//               return value.FoodDetails.length > 0;
//             });
//             res.json({ status: true, data: newResult });
//           }
//         );
//       } else {
//         res.json({ status: true, message: "No data found" });
//       }
//     } catch (error) {
//       errorHandle.handleError(error, errorRes => {
//         res.send(errorRes);
//       });
//     }
//   }

//   async getAllPaymentPendingData(req, res) {
//     try {
//       if (
//         !req.query.hasOwnProperty("OrderDate") &&
//         !req.query.hasOwnProperty("RestaurantId") &&
//         !req.query.hasOwnProperty("OrderFrom")
//       )
//         throw "Please provide a OrderDate.";
//       const pool = await poolPromise;
//       const result1 = await pool.query(
//         `SELECT OrderHeader.OrderHeaderSl, OrderHeader.OrderId, OrderHeader.OrderDate, OrderHeader.RestaurantId, RestaurantMaster.RestaurantName, RestaurantMaster.GSTIN, OrderHeader.TableId, OrderHeader.BookingType, OrderHeader.BookingStatus, OrderHeader.PaymentStatus, OrderHeader.BillAmount, OrderHeader.TaxAmount, OrderHeader.NetAmount FROM OrderHeader, RestaurantMaster WHERE CAST(OrderHeader.OrderDate as DATE)='${req.query.OrderDate}' AND OrderHeader.PaymentStatus IN ('P') AND OrderHeader.RestaurantId = ${req.query.RestaurantId} AND OrderHeader.RestaurantId = RestaurantMaster.RestaurantId AND OrderHeader.BookingStatus IN ('S') AND OrderHeader.OrderFrom ='${req.query.OrderFrom}'`
//       );
//       const result2 = await pool.query(
//         `SELECT OrderHeader.OrderHeaderSl, OrderHeader.OrderId, OrderHeader.OrderDate, OrderHeader.RestaurantId, RestaurantMaster.RestaurantName, RestaurantMaster.GSTIN, OrderHeader.TableId, OrderHeader.BookingType, OrderHeader.BookingStatus, OrderHeader.PaymentStatus, OrderHeader.BillAmount, OrderHeader.TaxAmount, OrderHeader.NetAmount FROM OrderHeader, RestaurantMaster WHERE CAST(OrderHeader.OrderDate as DATE)='${req.query.OrderDate}' AND OrderHeader.PaymentStatus IN ('P') AND OrderHeader.RestaurantId = ${req.query.RestaurantId} AND OrderHeader.TableId IS NULL AND OrderHeader.RestaurantId = RestaurantMaster.RestaurantId AND OrderHeader.BookingStatus IN ('S') AND OrderHeader.OrderFrom ='${req.query.OrderFrom}'`
//       );
//       var resultOfOrderHeader = [...result1.recordset, ...result2.recordset];
//       if (resultOfOrderHeader.length > 0) {
//         let orderHeaderArray = [];
//         orderHeaderArray.push(...resultOfOrderHeader);
//         getAppendingData(req.query.RestaurantId, orderHeaderArray, result => {
//           res.json({ status: true, data: result });
//         });
//       } else {
//         res.json({ status: true, message: "No data found" });
//       }
//     } catch (error) {
//       errorHandle.handleError(error, errorRes => {
//         res.send(errorRes);
//       });
//     }
//   }
// }

// async function getFoodDetails(RestaurantId, OrderHeaderSl, callback) {
//   try {
//     const pool = await poolPromise;
//     const result = await pool.query(
//       `SELECT OrderHeader.CustomerId, OrderHeader.OrderId, OrderHeader.OrderHeaderSl, OrderHeader.OrderDate, OrderHeader.RestaurantId, RestaurantMaster.RestaurantName, RestaurantMaster.GSTIN, OrderHeader.TableId, OrderHeader.BookedChairs, OrderHeader.BookingType, OrderHeader.BookingStatus, OrderHeader.PaymentType, OrderHeader.PaymentStatus, OrderHeader.BillAmount, OrderHeader.TaxAmount, OrderHeader.GuestName, OrderHeader.GuestMobile, OrderHeader.CustomerGSTNo, OrderHeader.NetAmount, OrderHeader.HotelOrderId, OrderHeader.HotelRoomNo, OrderHeader.CancelDate, OrderHeader.CancelCharges, OrderHeader.CancelRefund FROM OrderHeader, RestaurantMaster WHERE OrderHeader.OrderHeaderSl='${OrderHeaderSl}' AND RestaurantMaster.RestaurantId = OrderHeader.RestaurantId`
//     );
//     if (result.recordset.length === 0) {
//       callback(null, []);
//       return;
//     }
//     let orderHeaderArray = [];
//     orderHeaderArray.push(...result.recordset);
//     getAppendingData(
//       result.recordset[0].RestaurantId,
//       orderHeaderArray,
//       result => {
//         callback(null, result);
//       }
//     );
//   } catch (error) {
//     errorHandle.handleError(error, errorRes => {
//       callback(errorRes, null);
//     });
//   }
// }

// function check(result) {
//   for (let i = 0; i < result.recordset.length; i++) {
//     if (result.recordset[i].OrderQuantity != 0) {
//       return true;
//     }
//   }
//   return false;
// }

// function getQuantityDetails(input) {
//   let DetailsArray = [];
//   DetailsArray = input;
//   let FoodId = [],
//     OrderQuantity = [],
//     Tariff = [],
//     FoodVarietyId = [];
//   for (let i = 0; i < input.length; i++) {
//     OrderQuantity.push(input[i].OrderQuantity);
//     FoodId.push(input[i].FoodId);
//     Tariff.push(input[i].Tariff);
//     FoodVarietyId.push(input[i].FoodVarietyId);
//   }
//   return { OrderQuantity, FoodId, Tariff, FoodVarietyId };
// }

// function getAppendingData(RestaurantId, orderHeaderArray, callback) {
//   orderHeaderArray.map(async (value, index) => {
//     const pool = await poolPromise;
//     const result1 = await pool
//       .request()
//       .query(
//         `SELECT OrderDetails.RestaurantId, OrderDetails.OrderId, OrderDetails.OrderHeaderSl, OrderDetails.OrderSl, OrderDetails.FoodId, FoodMaster.FoodName, OrderDetails.OrderQuantity,  OrderDetails.FoodVarietyId, ConfigurationMaster.ConfigName As FoodVarietyName, OrderDetails.TableId, OrderDetails.Tariff, OrderDetails.NetTariff, OrderDetails.OrderTime, OrderDetails.ServedTime, OrderDetails.BookingStatus, OrderDetails.WaiterId, OrderDetails.BuffetId, OrderDetails.BookingType FROM OrderDetails, ConfigurationMaster, FoodMaster WHERE ConfigurationMaster.ConfigId=OrderDetails.FoodVarietyId AND OrderDetails.FoodId=FoodMaster.FoodId AND OrderDetails.OrderId='${value.OrderId}' AND BookingStatus IN ('O', 'P', 'S', 'C') AND OrderDetails.OrderHeaderSl='${value.OrderHeaderSl}'`
//       );
//     const result2 = await pool
//       .request()
//       .query(
//         `SELECT OrderDetails.RestaurantId, OrderDetails.OrderHeaderSl, OrderDetails.OrderId, OrderDetails.OrderSl, OrderDetails.FoodId, FoodMaster.FoodName, OrderDetails.OrderQuantity, OrderDetails.TableId, OrderDetails.Tariff, OrderDetails.NetTariff, OrderDetails.OrderTime, OrderDetails.ServedTime, OrderDetails.BookingStatus, OrderDetails.WaiterId, OrderDetails.BuffetId,OrderDetails.BookingType FROM OrderDetails,FoodMaster WHERE OrderDetails.FoodId=FoodMaster.FoodId AND OrderDetails.OrderId='${value.OrderId}' AND OrderDetails.FoodVarietyId IS NULL AND BookingStatus IN ('O', 'P', 'S', 'C') AND OrderDetails.OrderHeaderSl='${value.OrderHeaderSl}' and BookingType!='Buffet'`
//       );

//       const result4 = await pool
//       .request()
//       .query(
//         `SELECT OrderDetails.RestaurantId, OrderDetails.OrderHeaderSl, OrderDetails.OrderId,
//         (null) as OrderSl,
//         (null) as FoodId,
//         (select top(1) BuffetName from BuffetMaster where BuffetId=OrderDetails.BuffetId) as FoodName,
//         OrderDetails.OrderQuantity, OrderDetails.TableId, OrderDetails.Tariff, 
//         OrderDetails.NetTariff, OrderDetails.OrderTime, OrderDetails.ServedTime, OrderDetails.BookingStatus, OrderDetails.WaiterId, 
//         OrderDetails.BuffetId,OrderDetails.BookingType FROM OrderDetails,FoodMaster WHERE OrderDetails.FoodId=FoodMaster.FoodId AND 
//         OrderDetails.OrderId='${value.OrderId}' AND OrderDetails.FoodVarietyId IS NULL 
//         AND BookingStatus IN ('O', 'P', 'S', 'C') AND OrderDetails.OrderHeaderSl='${value.OrderHeaderSl}' and BookingType='Buffet' group by BuffetId,OrderDetails.RestaurantId,OrderDetails.OrderHeaderSl, 
//         OrderDetails.OrderId,OrderDetails.OrderQuantity, OrderDetails.TableId, OrderDetails.Tariff, 
//         OrderDetails.NetTariff, OrderDetails.OrderTime, OrderDetails.ServedTime, OrderDetails.BookingStatus, OrderDetails.WaiterId, 
//         OrderDetails.BuffetId,OrderDetails.BookingType`
//       );
//     const result3 = await pool
//       .request()
//       .query(
//         `SELECT OrderDetails.RestaurantId, OrderDetails.OrderHeaderSl, OrderDetails.OrderId, OrderDetails.OrderSl, OrderDetails.SoftDrinkId, (SoftDrinkMaster.SoftDrinkName) as FoodName,OrderDetails.OrderQuantity, OrderDetails.SoftDrinkQuantityId, ConfigurationMaster.ConfigName AS SoftDrinkQuantityName, OrderDetails.TableId, OrderDetails.Tariff, OrderDetails.OrderTime, OrderDetails.ServedTime, OrderDetails.NetTariff, OrderDetails.BookingStatus, OrderDetails.WaiterId, OrderDetails.BookingType FROM OrderDetails,SoftDrinkMaster,ConfigurationMaster WHERE OrderDetails.SoftDrinkId=SoftDrinkMaster.SoftDrinkId AND OrderDetails.OrderId='${value.OrderId}' AND OrderDetails.SoftDrinkQuantityId = ConfigurationMaster.ConfigId AND BookingStatus IN ('O', 'P', 'S', 'C') AND OrderDetails.OrderHeaderSl='${value.OrderHeaderSl}'`
//       );
//     var finalData = [...result1.recordset, ...result2.recordset, ...result4.recordset];
//     getWaiterName(RestaurantId, finalData, () => {
//       orderHeaderArray[index]["FoodDetails"] = finalData;
//       if (result3.recordset.length > 0)
//         orderHeaderArray[index]["SoftDrinkDetails"] = result3.recordset;
//       if (index === orderHeaderArray.length - 1) callback(orderHeaderArray);
//     });
//   });
// }

// // Last Changes For the Reason for the WaiterId Based on DateWise.
// // Changes:- OrderDetails.OrderId -> OrderDetails.OrderHeaderSl
// async function getAppendingDataforWaiterId(
//   RestaurantId,
//   WaiterId,
//   orderHeaderArray,
//   callback
// ) {
//   var asyncArr = [],
//     resultArr = [];
//   for (var i = 0; i < orderHeaderArray.length; i++) {
//     append(orderHeaderArray[i], i);
//   }
//   async function append(value, index) {
//     asyncArr.push(async cb => {
//       const pool = await poolPromise;
//       const result1 = await pool
//         .request()
//         // The Bellow Query will Return the same Result If WaiterMaster from Node Api.
//         .query(
//           `SELECT OrderDetails.RestaurantId, OrderDetails.OrderId, OrderDetails.OrderHeaderSl, OrderDetails.OrderSl, OrderDetails.FoodId, FoodMaster.FoodName, OrderDetails.OrderQuantity,OrderDetails.FoodVarietyId, ConfigurationMaster.ConfigName As FoodVarietyName, OrderDetails.TableId, OrderDetails.Tariff, OrderDetails.NetTariff, OrderDetails.OrderTime, OrderDetails.ServedTime, OrderDetails.BookingType, OrderDetails.BookingStatus, OrderDetails.WaiterId FROM OrderDetails, ConfigurationMaster, FoodMaster, WaiterMaster WHERE ConfigurationMaster.ConfigId=OrderDetails.FoodVarietyId AND OrderDetails.FoodId=FoodMaster.FoodId AND OrderDetails.OrderHeaderSl='${value.OrderHeaderSl}' AND OrderDetails.WaiterId='${WaiterId}' AND BookingStatus IN ('O', 'P', 'S', 'C') AND OrderDetails.WaiterId IS NOT NULL`
//         );
//       const result2 = await pool
//         .request()
//         .query(
//           `SELECT OrderDetails.RestaurantId, OrderDetails.OrderHeaderSl, OrderDetails.OrderId, OrderDetails.OrderSl, OrderDetails.FoodId, FoodMaster.FoodName, OrderDetails.OrderQuantity,OrderDetails.TableId,OrderDetails.Tariff, OrderDetails.NetTariff, OrderDetails.OrderTime, OrderDetails.ServedTime, OrderDetails.BookingStatus, OrderDetails.BookingType, OrderDetails.WaiterId FROM OrderDetails,FoodMaster WHERE OrderDetails.FoodId=FoodMaster.FoodId AND OrderDetails.OrderHeaderSl='${value.OrderHeaderSl}' AND OrderDetails.WaiterId='${WaiterId}' AND OrderDetails.FoodVarietyId IS NULL AND BookingStatus IN ('O', 'P', 'S', 'C') AND OrderDetails.WaiterId IS NOT NULL`
//         );
//       var finalData = [...result1.recordset, ...result2.recordset];
//       value["FoodDetails"] = finalData;
//       resultArr.push(value);
//       if (index == orderHeaderArray.length) {
//         cb(null, null);
//       }
//     });
//   }
//   async.parallel(asyncArr, async (err, result) => {
//     let newResult = await resultArr.filter(value => {
//       return value.FoodDetails.length > 0;
//     });
//     if (newResult.length == 0) return callback([]);
//     for (let i = 0; i < newResult.length; i++) {
//       newResult[i].FoodDetails;
//       getWaiterFromApi(
//         RestaurantId,
//         newResult[i].FoodDetails,
//         i,
//         (index, waiterNames) => {
//           newResult[index]["FoodDetails"] = waiterNames;
//           if (i == newResult.length - 1) {
//             callback(newResult);
//           }
//         }
//       );
//     }
//   });
// }

// async function checkAllBookingStatus(
//   OrderData,
//   orderDetails,
//   OrderHeaderSl,
//   BookingStatus,
//   callback
// ) {
//   const pool = await poolPromise;
//   let FoodOrders = orderDetails.filter(
//     order => order.hasOwnProperty("FoodId") && order.FoodId != null
//   );
//   let Orders = FoodOrders.filter(order => order.BookingStatus == BookingStatus);
//   let TableData = orderDetails.filter(order => order.TableId != null);
//   if (FoodOrders.length === Orders.length) {
//     if (BookingStatus === "C" && TableData.length > 0) {
//       let Query =
//         OrderData[0].PaymentStatus == "P"
//           ? ""
//           : `, CancelDate = GETDATE(), CancelCharges = 0, CancelRefund = ${OrderData[0].NetAmount}`;
//       await pool.query(
//         `UPDATE OrderHeader SET BookingStatus = '${BookingStatus}', TableStatus = 'A' ${Query} WHERE OrderHeaderSl = '${OrderHeaderSl}'`
//       );
//     } else {
//       await pool.query(
//         `UPDATE OrderHeader SET BookingStatus = '${BookingStatus}' WHERE OrderHeaderSl = '${OrderHeaderSl}'`
//       );
//     }
//     callback(null);
//   } else {
//     callback(null);
//   }
// }

// function getWaiterFromApi(RestaurantId, orderDetailsArr, index, callback) {
//   this.apiService = new ApiService();
//   this.apiService.CMCommonReport(RestaurantId, apiResponse => {
//     orderDetailsArr.map(value => {
//       if (value.hasOwnProperty("WaiterId") && value.WaiterId != null) {
//         let matchingName = apiResponse.filter(val => {
//           return val.EmpId == value.WaiterId;
//         });
//         value["WaiterName"] =
//           matchingName.length > 0
//             ? matchingName[0].EmpFirstName + " " + matchingName[0].EmpLastName
//             : null;
//       }
//     });
//     callback(index, orderDetailsArr);
//   });
// }

// async function getWaiterName(RestaurantId, OrderDetailsArr, callback) {
//   const pool = await poolPromise;
//   async.map(
//     OrderDetailsArr,
//     function(value, cb) {
//       if (value.hasOwnProperty("BuffetId") && value.BuffetId != null) {
//         pool.query(
//           `SELECT BuffetName, Tariff from BuffetMaster where BuffetId = ${value.BuffetId}`,
//           function(err, result) {
//             if (result.recordset.length > 0) {
//               value["BuffetName"] = result.recordset[0].BuffetName;
//               value.NetTariff =
//                 Number(result.recordset[0].Tariff) *
//                 Number(value.OrderQuantity);
//               cb(null, value);
//             } else {
//               cb(null, value);
//             }
//           }
//         );
//       } else if (value.hasOwnProperty("WaiterId") && value.WaiterId != null) {
//         this.apiService = new ApiService();

//         this.apiService.CMCommonReport(RestaurantId, apiResponse => {
//           // console.log("apiResponse", apiResponse);
//           let matchingName = apiResponse.filter(val => {
//             return val.EmpId == value.WaiterId;
//           });
//           value["WaiterName"] =
//             matchingName.length > 0
//               ? matchingName[0].EmpFirstName + " " + matchingName[0].EmpLastName
//               : null;
//           cb(null, value);
//         });
//       } else {
//         cb(null, value);
//       }
//     },
//     function(err, result) {
//       callback(null);
//     }
//   );
// }

// async function getOrderDetails(req, callback) {
//   const pool = await poolPromise;
//   async.parallel(
//     [
//       function(callback) {
       
//         pool.query(
//           `SELECT MAX(OrderDetails.RestaurantId) AS RestaurantId, OrderDetails.FoodId, MAX(FoodMaster.FoodName) AS FoodName, 
//           OrderDetails.FoodVarietyId, SUM(OrderDetails.OrderQuantity) AS Quantity
//           ,(((OrderDetails.CGST+OrderDetails.SGST)/100)*sum(NetTariff)) as TaxAmount
//           ,SUM(NetTariff) AS Amount , cm.ConfigName as  FoodVarietyName
//           FROM OrderDetails
//           INNER JOIN FoodMaster ON OrderDetails.FoodId=FoodMaster.FoodId
//           INNER JOIN ConfigurationMaster as cm ON cm.ConfigId = OrderDetails.FoodVarietyId
//           WHERE OrderDetails.RestaurantId=${req.query.RestaurantId}
//           AND OrderDetails.FoodId=FoodMaster.FoodId 
//           AND CAST(OrderDate as DATE) >= '${req.query.FromDate}' AND CAST(OrderDate as DATE)<='${req.query.ToDate}'
//           AND OrderDetails.BuffetId IS NULL 
//           AND OrderDetails.ComplementaryId IS NULL AND OrderDetails.FoodId IS NOT NULL 
//           GROUP BY OrderDetails.FoodId, OrderDetails.FoodVarietyId,OrderDetails.CGST,OrderDetails.SGST, OrderDetails.FoodVarietyId, cm.ConfigName`,
//           function(err, result) {
//             if (err) {
//               return callback(err);
//             }
//             return callback(null, { FoodDetails: result.recordset });
//           }
//         );
//       },
//       function(callback) {
//         pool.query(
//           `SELECT MAX(OrderDetails.RestaurantId) AS RestaurantId, OrderDetails.SoftDrinkId, MAX(SoftDrinkMaster.SoftDrinkName) AS SoftDrinkName, 
//           OrderDetails.SoftDrinkQuantityId, MAX(ConfigurationMaster.ConfigName) AS SoftDrinkQuantityName, SUM(OrderDetails.OrderQuantity) AS Quantity,
//           (((OrderDetails.CGST+OrderDetails.SGST)/100)*sum(NetTariff)) as TaxAmount
//           ,SUM(NetTariff) AS Amount 
//           FROM OrderDetails,SoftDrinkMaster,ConfigurationMaster WHERE OrderDetails.RestaurantId=${req.query.RestaurantId} AND OrderDetails.SoftDrinkId=SoftDrinkMaster.SoftDrinkId 
//           AND CAST(OrderDate as DATE) >= '${req.query.FromDate}' AND CAST(OrderDate as DATE)<='${req.query.ToDate}' AND OrderDetails.FoodId IS NULL 
//           AND OrderDetails.SoftDrinkQuantityId = ConfigurationMaster.ConfigId GROUP BY OrderDetails.SoftDrinkId, OrderDetails.SoftDrinkQuantityId,OrderDetails.CGST,OrderDetails.SGST`,
//           function(err, result) {
//             if (err) {
//               return callback(err);
//             }
//             return callback(null, { SoftDrinkDetails: result.recordset });
//           }
//         );
//       },
//       function(callback) {
//         pool.query(
//           `SELECT MAX(OrderDetails.RestaurantId) AS RestaurantId, OrderDetails.BuffetId, MAX(BuffetMaster.BuffetName) AS BuffetName, MAX(OrderQuantity) AS Quantity FROM OrderDetails,BuffetMaster WHERE OrderDetails.RestaurantId=${req.query.RestaurantId} AND OrderDetails.BuffetId=BuffetMaster.BuffetId AND  CAST(OrderDate as DATE) >= '${req.query.FromDate}' AND CAST(OrderDate as DATE)<='${req.query.ToDate}' AND OrderDetails.BuffetId IS NOT NULL GROUP BY OrderDetails.BuffetId`,
//           function(err, result) {
//             if (err) {
//               return callback(err);
//             }
//             if (result.recordset.length > 0) {
//               getBuffetAmount(result.recordset, BuffetDetailsArr => {
//                 return callback(null, { BuffetDetails: BuffetDetailsArr });
//               });
//             } else {
//               return callback(null, { BuffetDetails: result.recordset });
//             }
//           }
//         );
//       },
//       function(callback) {
//         pool.query(
//           `SELECT MAX(RestaurantId) AS RestaurantId, ComplementaryId, MAX(OrderQuantity) AS Quantity, Amount = 0 FROM OrderDetails WHERE RestaurantId=${req.query.RestaurantId} AND CAST(OrderDate as DATE) >= '${req.query.FromDate}' AND CAST(OrderDate as DATE)<='${req.query.ToDate}' AND ComplementaryId IS NOT NULL GROUP BY ComplementaryId`, 
//           function(err, result) {
//             if (err) {
//               return callback(err);
//             }
//             if (result.recordset.length > 0) {
//               getFoodTimingName(result.recordset, complementaryArray => {
//                 return callback(null, {
//                   ComplementaryDetails: complementaryArray
//                 });
//               });
//             } else {
//               return callback(null, { ComplementaryDetails: result.recordset });
//             }
//           }
//         );
//       }
//       ,function(callback) {
//         pool.query(
//           `SELECT od.RestaurantId,od.FoodId,fm.FoodName,od.OrderQuantity AS Quantity,
//                     (((od.CGST+od.SGST)/100)*(NetTariff)) as TaxAmount,NetTariff AS Amount
//                     FROM OrderDetails AS od
//                     INNER JOIN FoodMaster AS fm
//                     ON fm.FoodId=(SELECT FoodId FROM FoodMaster WHERE FoodName='Others' AND RestaurantId=${req.query.RestaurantId}) 
//                     Where od.RestaurantId=${req.query.RestaurantId} 
//                     AND od.FoodId=(SELECT FoodId FROM FoodMaster WHERE FoodName='Others' AND RestaurantId=${req.query.RestaurantId})
//                     AND  CAST(OrderDate as DATE) >= '${req.query.FromDate}' 
//                             AND CAST(OrderDate as DATE)<='${req.query.ToDate}' `,
//           function(err, result) {
//             if (err) {
//               return callback(err);
//             }
//             return callback(null, { Others: result.recordset });
//           }
//         );
//       }
//     ],
//     function(error, callbackResults) {
//       if (error) {
//         callback(error, null);
//       } else {
//         callback(null, callbackResults);
//       }
//     }
//   );
// }

// async function getBuffetAmount(BuffetDetailsArr, callback) {
//   const pool = await poolPromise;
//   async.map(
//     BuffetDetailsArr,
//     (value, cb) => {
//       pool.query(
//         `SELECT Tariff FROM BuffetMaster WHERE BuffetMaster.BuffetId = ${value.BuffetId}`,
//         function(err, result) {
//           if (err) {
//             return cb(err);
//           }
//           value["Amount"] =
//             Number(value.Quantity) * Number(result.recordset[0].Tariff);
//           cb(null, null);
//         }
//       );
//     },
//     function(err, result) {
//       callback(BuffetDetailsArr);
//     }
//   );
// }

// async function getFoodTimingName(complementaryArr, callback) {
//   const pool = await poolPromise;
//   async.map(
//     complementaryArr,
//     (value, cb) => {
//       pool.query(
//         `SELECT FoodTimingId FROM ComplementaryMaster WHERE UniqueId='${value.ComplementaryId}'`,
//         function(err, result) {
//           if (err) {
//             return cb(err);
//           }
//           if (result.recordset.length > 0) {
//             pool.query(
//               `SELECT FoodTimingName FROM FoodTimingMaster WHERE FoodTimingId='${result.recordset[0].FoodTimingId}'`,
//               function(err, result1) {
//                 if (err) {
//                   return cb(err);
//                 }
//                 if (result1.recordset.length > 0) {
//                   value["ComplementaryName"] =
//                     result1.recordset[0].FoodTimingName;
//                   cb(null, null);
//                 } else {
//                   cb(null, null);
//                 }
//               }
//             );
//           } else {
//             cb(null, null);
//           }
//         }
//       );
//     },
//     function(err, result) {
//       callback(complementaryArr);
//     }
//   );
// }

// const orderDetails = new OrderDetails();

// module.exports = orderDetails;
