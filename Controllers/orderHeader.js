const errorHandle = require("../services/errorHandler");
const commonMsgs = require("../CommonMsg.json");
const utilityFile = require("../utility");
const { poolPromise, sql } = require("../db");
const async = require("async");
const ApiService = require("../services/API_services");


class OrderHeader {
  async getAllData(req, res) {
    try {
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .execute("getOrderHeaderDetails")
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
  //       `SELECT RestaurantId, TableId, OrderId, OrderDate, CustomerId, GuestName, GuestMobile, GuestMailId, OfferId, PaymentType, BookingStatus, BookingType, Comments, CancelDate, CancelCharges, CancelRefund from OrderHeader`
  //     );
  //     res.json({ status: true, data: result.recordset });
  //   } catch (error) {
  //     errorHandle.handleError(error, (errorRes) => {
  //       res.send(errorRes);
  //     });
  //   }
  // }

  async getHoldDate(req, res) {
    try {
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .input("RestaurantId", req.query.RestaurantId)
                        .execute("getHoldDate")
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
  // async getHoldDate(req, res) {
  //   try{
  //     const pool = await poolPromise;
  //     const result = await pool.query(
  //                       `select * from (
  //                         SELECT oh.OrderId, oh.OrderHeaderSl, oh.DinningId, oh.TableId, oh.BookingStatus, ISNULL(oh.NetAmount,0) as NetAmount, ISNULL(oh.BillAmount,0) as BillAmount, ISNULL(oh.TaxAmount,0) as TaxAmount, oh.CreatedBy, oh.CustomerId, oh.RestaurantId, oh.BookedChairs, oh.TableStatus, 
  //                           (SELECT od.FoodId, fm.FoodName, od.OrderTime, od.FoodVarietyId, od.OrderQuantity, od.BuffetId, od.BookingType, od.Tariff, od.NetTariff, od.ComplementaryId, od.WaiterId ,
  //                             od.BookingStatus, od.OrderHeaderSl, od.ServedTime, od.OrderSl, ISNULL(od.CGST,0) as CGST, ISNULL(od.SGST,0) as SGST,
  //                             Concat(FoodQuantityMaster.FoodQuantity,' ',(select ConfigurationMaster.ConfigName from ConfigurationMaster where ConfigurationMaster.ConfigId=FoodQuantityMaster.FoodQuantityTypeId)) AS FoodQuantityName
  //                             FROM OrderDetails as od 
  //                             INNER JOIN FoodMaster as fm ON fm.FoodId = od.FoodId
  //                             LEFT JOIN FoodQuantityMaster ON FoodQuantityMaster.FoodId=fm.FoodId AND FoodQuantityMaster.UniqueId = od.FoodVarietyId
  //                             WHERE od.OrderHeaderSl = oh.OrderHeaderSl FOR JSON PATH) as OrderDetails
                             
  //                       FROM OrderHeader as oh
  //                       WHERE oh.RestaurantId=${req.query.RestaurantId} AND oh.PaymentStatus = 'P' AND CAST(oh.OrderDate as date) = CAST(GETDATE() as date))as a where OrderDetails!='[]'`
  //                     )
            
  //       if (result.recordset.length > 0 ) {
  //         console.log("hold data", result.recordset);
  //           let sendingData = [... result.recordset]
  //           for( let eachData of sendingData) {
  //             // console.log("each Data", eachData.);
  //             if (eachData.OrderDetails != null) {
  //               eachData.OrderDetails = JSON.parse(eachData.OrderDetails)
  //             }
  //             else {
  //               eachData.OrderDetails = []
  //             }
  //           }
  //           res.json({ status: true, data: sendingData })

  //         }
  //       else {
  //         res.json({ status: true, data: [] })
  //       }
              


  //   } catch (error) {
  //     errorHandle.handleError(error, (errorRes) => {
  //       res.send(errorRes);
  //     })
  //   }
  // }

  async deleteHoldData (req, res) {
    try {
      console.log("delete data", req.query);
      const pool = await poolPromise;
      if (req.query.deleteHeader === "true") {
        pool.query( `DELETE FROM OrderDetails WHERE OrderHeaderSl = ${req.query.OrderHeaderSl}` ,
              (err, result) => {
                      try{
                        if (err) throw err;
                        pool.query(`DELETE FROM OrderHeader WHERE OrderHeaderSl= ${req.query.OrderHeaderSl}`, 
                        (subErr, subresult) => {
                            try {
                              if (subErr) throw subErr;
                              res.json({status: true,message:"Data Deleted Successfully!"})
                            } catch (error){
                              errorHandle.handleError(error, (errorRes) => {
                                res.send(errorRes);
                              });
                            }
                        })
                    } catch (error){
                      errorHandle.handleError(error, (errorRes) => {
                        res.send(errorRes);
                      });
                    }
              }
            )
      } else {
        pool.query(`DELETE FROM OrderDetails WHERE OrderSl = ${req.query.OrderSl}` , 
          (err, result) => {
            if (err) throw err;
            pool.query(`UPDATE OrderHeader SET TaxAmount = TaxAmount - ${req.query.Tax}, BillAmount = BillAmount - ${req.query.NetTariff }, NetAmount = NetAmount- ${req.query.NetTariff- req.query.Tax}, OfferAmount = ${req.query.OfferAmount ? req.query.OfferAmount : 0} WHERE OrderHeaderSl = ${req.query.OrderHeaderSl}`, 
            (subErr, subRes) => {
                try {
                    if (subErr) throw subErr
                    if (req.query.OrderQuantity != "false") {
                      pool.query(`UPDATE StockInMaster SET IssuedQty = IssuedQty-${req.query.OrderQuantity} , BalanceQty = BalanceQty+${req.query.OrderQuantity} WHERE FoodId = ${req.query.FoodId} AND FoodQuantityId = ${req.query.FoodQuantityId}`, 
                        (subErr2, subRes2)=> {
                            try {
                              if (subErr2) throw subErr2;
                              res.json({status: true,message:"Data Deleted Successfully!"});
                            }catch (error){
                              errorHandle.handleError(error, (errorRes) => {
                                res.send(errorRes);
                              });
                            }
                        })
                    }else {
                      res.json({status: true,message:"Data Deleted Successfully!"});
                    }
              }catch (error){
                errorHandle.handleError(error, (errorRes) => {
                  res.send(errorRes);
                });
              }

          })
          })

      }
    } catch (error){
      errorHandle.handleError(error, (errorRes) => {
        res.send(errorRes);
      });
    }
  }
  async deleteMultipleHoldData (req, res) {
    try{
        const pool = await poolPromise;
        console.log("req ", req.body);
        let { OrderHeaderIds } = await req.body
        console.log("deleteMultipleHoldData", OrderHeaderIds);
        let result = await pool.request()
                            .input("OrderHeaderIds", OrderHeaderIds)
                            .execute("deleteMultipleOrders")
        console.log("result delete", result)
        if (result.recordset[0][""][1] == 1) {
          res.json({status:true})
        }
        else {
          res.json({status: false, message:result.recordset[0][""][0]})
        }
    } catch (error) {
      errorHandle.handleError(error, (errorRes)=> {
        res.send(errorRes);
      })
    }

  }

  async getDataOnBookingStatus(req, res) {
    try {
      if (!(
        req.query.OrderDate ||
        req.query.RestaurantId ||
        req.query.OrderFrom
      ))return res.json(commonMsgs.NullMsg);
        else {
          const pool = await poolPromise;
          let result = await pool
                          .request()
                          .input("OrderDate", req.query.OrderDate)
                          .input("BookingStatus", req.query.BookingStatus)
                          .input("RestaurantId",  req.query.RestaurantId)
                          .input("OrderFrom", req.query.OrderFrom)
                          .execute("getDataOnBookingStatus")
          if (result.recordset[0].mainData!=null){
            res.json({status: true, data:JSON.parse(result.recordset[0].mainData)})

          }
          else{
            res.json({status: true, data: []})
          }
          }
    } catch (error) {
      errorHandle.handleError(error, (errorRes) => {
        res.send(errorRes);
      });
    }
  }
  // async getDataOnBookingStatus(req, res) {
  //   try {
  //     if (
  //       !req.query.OrderDate ||
  //       !req.query.RestaurantId ||
  //       !req.query.OrderFrom
  //     )
  //       return res.json(commonMsgs.NullMsg);
  //     let date = req.query.OrderDate.replace(/-/g, "/");
  //     const pool = await poolPromise;
  //     const resultOfOrderHeader = await pool.query(
  //       `SELECT RestaurantId, TableId, OrderId, OrderDate, OrderHeaderSl, CustomerId, GuestName, GuestMobile, GuestMailId, OfferId, PaymentType, BillAmount, TaxAmount, NetAmount, BookingStatus, BookingType, Comments, CancelDate, CancelCharges, CancelRefund FROM OrderHeader WHERE CONVERT(VARCHAR(10), OrderDate, 111)='${date}' AND BookingStatus='${req.query.BookingStatus}' AND RestaurantId=${req.query.RestaurantId} AND OrderFrom = '${req.query.OrderFrom}'`
  //     );
  //     if (resultOfOrderHeader.recordset.length > 0) {
  //       let orderHeaderArray = [];
  //       orderHeaderArray.push(...resultOfOrderHeader.recordset);
  //       getAppendingData(req.query.RestaurantId, orderHeaderArray, (result) => {
  //         res.json({ status: true, data: result });
  //       });
  //     } else {
  //       res.json({ status: true, data: [] });
  //     }
  //   } catch (error) {
  //     errorHandle.handleError(error, (errorRes) => {
  //       res.send(errorRes);
  //     });
  //   }
  // }

  async getClosedData(req, res) {
    try {
        const pool = await poolPromise;
        let result = await pool
                          .request()
                          .input("OrderDate", req.query.OrderDate)
                          .input("BookingStatus", req.query.BookingStatus)
                          .input("RestaurantId",  req.query.RestaurantId)
                          .input("OrderFrom", req.query.OrderFrom)
                          .input("PaymentStatus", req.query.PaymentStatus)
                          .execute("getDataOnBookingStatus")
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

  // async getClosedData(req, res) {
  //   try {
  //     let date = req.query.OrderDate.replace(/-/g, "/");
  //     const pool = await poolPromise;
  //     const resultOfOrderHeader = await pool.query(
  //       `SELECT RestaurantId, TableId, OrderId, OrderDate, OrderHeaderSl, CustomerId, GuestName, GuestMobile, GuestMailId, OfferId, PaymentType, BookingStatus, BookingType, Comments, CancelDate, CancelCharges, CancelRefund, NetAmount FROM OrderHeader WHERE RestaurantId='${req.query.RestaurantId}' AND CONVERT(VARCHAR(10), OrderDate, 111)='${date}' AND BookingStatus='${req.query.BookingStatus}' AND PaymentStatus='${req.query.PaymentStatus}' AND OrderFrom = '${req.query.OrderFrom}'`
  //     );
  //     if (resultOfOrderHeader.recordset.length > 0) {
  //       let orderHeaderArray = [];
  //       orderHeaderArray.push(...resultOfOrderHeader.recordset);
  //       getAppendingData(req.query.RestaurantId, orderHeaderArray, (result) => {
  //         res.json({ status: true, data: result });
  //       });
  //     } else {
  //       res.json({ status: true, data: [] });
  //     }
  //   } catch (error) {
  //     errorHandle.handleError(error, (errorRes) => {
  //       res.send(errorRes);
  //     });
  //   }
  // }

  async getAllStatus(req, res) {
    try {
      if (!(
        req.query.OrderDate ||
        req.query.RestaurantId ||
        req.query.OrderFrom
      ))
        return res.json(commonMsgs.NullMsg);
      else {
          const pool = await poolPromise;
          let result = await pool
                          .request()
                          .input("OrderDate", req.query.OrderDate)
                          .input("RestaurantId",  req.query.RestaurantId)
                          .input("OrderFrom", req.query.OrderFrom)
                          .execute("getAllStatus")
          if (result.recordset[0].mainData!=null){
            res.json({status: true, data:JSON.parse(result.recordset[0].mainData)})

          }
          else{
            res.json({status: true, data: []})
          }
          }
    } catch (error) {
      errorHandle.handleError(error, (errorRes) => {
        res.send(errorRes);
      });
    }
  }

  // async getAllStatus(req, res) {
  //   try {
  //     if (
  //       !req.query.OrderDate ||
  //       !req.query.RestaurantId ||
  //       !req.query.OrderFrom
  //     )
  //       return res.json(commonMsgs.NullMsg);
  //     let date = req.query.OrderDate.replace(/-/g, "/");
  //     const pool = await poolPromise;
  //     const result = await pool.query(
  //       `SELECT COUNT(BookingStatus) AS TotalOrders,
  //       COUNT(CASE WHEN BookingStatus LIKE '%O%' THEN 1 END) AS Ordered,
  //       COUNT(CASE WHEN BookingStatus LIKE '%P%' THEN 1 END) AS Prepared,
  //       COUNT(CASE WHEN BookingStatus LIKE '%S%' THEN 1 END) AS Served,
  //       COUNT(CASE WHEN BookingStatus LIKE '%C%' THEN 1 END) AS Cancelled,
  //       COUNT(CASE WHEN BookingStatus LIKE '%C%' AND CancelRefund IS NOT NULL THEN 1 END) AS Refunded,
  //       COUNT(CASE WHEN PaymentStatus LIKE '%P%' AND BookingStatus LIKE '%S%' THEN 1 END) AS PaymentPending,
  //       COUNT(CASE WHEN PaymentStatus LIKE '%S%' AND BookingStatus LIKE '%S%' THEN 1 END) AS Closed
  //       FROM OrderHeader WHERE RestaurantId='${req.query.RestaurantId}' AND CONVERT(VARCHAR(10), OrderDate, 111)='${date}' AND OrderFrom = '${req.query.OrderFrom}'`
  //     );
  //     res.json({ status: true, data: result.recordset });
  //   } catch (error) {
  //     errorHandle.handleError(error, (errorRes) => {
  //       res.send(errorRes);
  //     });
  //   }
  // }


  async getDateWiseSales(req, res) {
    try {
      if (
        req.query.RestaurantId &&
        req.query.FromDate &&
        req.query.ToDate &&
        req.query.OrderFrom
      ) {
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .input("RestaurantId",req.query.RestaurantId)
                        .input("FromDate",req.query.FromDate)
                        .input("ToDate",req.query.ToDate)
                        .input("OrderFrom",req.query.OrderFrom)
                        .input("UserId",req.query.UserId)
                        .execute("getDateWiseSales")
        if (result.recordset[0].mainData!=null){
          res.json({status: true, data:JSON.parse(result.recordset[0].mainData)[0]})

        }
        else{
          res.json({status: true, data:[]})
        }
      } else throw "Please fill all the details!";
    } catch (error) {
      errorHandle.handleError(error, (errorRes) => {
        res.send(errorRes);
      });
    }
  }

  // async getDateWiseSales(req, res) {
  //   try {
  //     if (
  //       req.query.RestaurantId &&
  //       req.query.FromDate &&
  //       req.query.ToDate &&
  //       req.query.OrderFrom
  //     ) {
  //       if(req.query.hasOwnProperty("UserId")){
  //         const pool = await poolPromise;
  //       pool.query(
  //         `SELECT SUM(BillAmount) AS BillAmount, 
  //                 SUM(NetAmount) AS NetAmount, 
  //                 COUNT(OrderId) AS TotalOrders, 
  //                 COUNT(PaymentType) AS CountOfPaymentType, PaymentType 
  //           FROM OrderHeader
  //           WHERE RestaurantId=${req.query.RestaurantId}
  //           AND CreatedBy=${req.query.UserId}
  //           AND PaymentStatus='S' 
  //           AND CAST(OrderDate as DATE) >= '${req.query.FromDate}' 
  //           AND CAST(OrderDate as DATE)<='${req.query.ToDate}' 
  //           AND OrderFrom='${req.query.OrderFrom}' 
  //           GROUP BY(PaymentType)`,
  //         function (err, amountRes) {
  //           if (err) {
  //             throw err;
  //           } else {
  //             getPaymentMode(amountRes.recordset, (error, response) => {
  //               if (error) {
  //                 return res.json({ status: false, error: error });
  //               }
  //               pool.query(
  //                 `SELECT SUM(BillAmount) AS TotalBillAmount, 
  //                         SUM(NetAmount) AS TotalNetAmount, 
  //                         SUM(TaxAmount) AS TotalTaxAmount, 
  //                         COUNT(OrderId) AS Orders 
  //                     FROM OrderHeader 
  //                     WHERE RestaurantId=${req.query.RestaurantId} 
  //                     AND CreatedBy=${req.query.UserId}
  //                     AND PaymentStatus='S' 
  //                     AND CAST(OrderDate as DATE) >= '${req.query.FromDate}' 
  //                     AND CAST(OrderDate as DATE)<='${req.query.ToDate}' 
  //                     AND OrderFrom='${req.query.OrderFrom}'`,
  //                 (err, res1) => {
  //                   if (err) {
  //                     throw err;
  //                   } else {
  //                     let output = {
  //                       TotalBillAmount:
  //                         res1.recordset.length > 0
  //                           ? res1.recordset[0].TotalBillAmount
  //                           : 0,
  //                       TotalNetAmount:
  //                         res1.recordset.length > 0
  //                           ? res1.recordset[0].TotalNetAmount
  //                           : 0,
  //                       TotalTaxAmount:
  //                         res1.recordset.length > 0
  //                           ? res1.recordset[0].TotalTaxAmount
  //                           : 0,
  //                       CGST:
  //                         res1.recordset.length > 0
  //                           ? res1.recordset[0].TotalTaxAmount / 2
  //                           : 0,
  //                       SGST:
  //                         res1.recordset.length > 0
  //                           ? res1.recordset[0].TotalTaxAmount / 2
  //                           : 0,
  //                       Orders:
  //                         res1.recordset.length > 0
  //                           ? res1.recordset[0].Orders
  //                           : 0,
  //                       OrderDetails: response,
  //                     };
  //                     return res.json({ status: true, data: output });
  //                   }
  //                 }
  //               );
  //             });
  //           }
  //         }
  //       );
  //       }
  //       else{
  //       const pool = await poolPromise;
  //       pool.query(
  //         `SELECT SUM(BillAmount) AS BillAmount, SUM(NetAmount) AS NetAmount, COUNT(OrderId) AS TotalOrders, COUNT(PaymentType) AS CountOfPaymentType, PaymentType 
  //         FROM OrderHeader WHERE RestaurantId=${req.query.RestaurantId} AND PaymentStatus='S' AND CAST(OrderDate as DATE) >= '${req.query.FromDate}' AND CAST(OrderDate as DATE)<='${req.query.ToDate}' AND OrderFrom='${req.query.OrderFrom}' GROUP BY(PaymentType)`,
  //         function (err, amountRes) {
  //           if (err) {
  //             throw err;
  //           } else {
  //             getPaymentMode(amountRes.recordset, (error, response) => {
  //               if (error) {
  //                 return res.json({ status: false, error: error });
  //               }
  //               pool.query(
  //                 `SELECT SUM(BillAmount) AS TotalBillAmount, SUM(NetAmount) AS TotalNetAmount, SUM(TaxAmount) AS TotalTaxAmount, COUNT(OrderId) AS Orders FROM OrderHeader WHERE RestaurantId=${req.query.RestaurantId} AND PaymentStatus='S' AND CAST(OrderDate as DATE) >= '${req.query.FromDate}' AND CAST(OrderDate as DATE)<='${req.query.ToDate}' AND OrderFrom='${req.query.OrderFrom}'`,
  //                 (err, res1) => {
  //                   if (err) {
  //                     throw err;
  //                   } else {
  //                     let output = {
  //                       TotalBillAmount:
  //                         res1.recordset.length > 0
  //                           ? res1.recordset[0].TotalBillAmount
  //                           : 0,
  //                       TotalNetAmount:
  //                         res1.recordset.length > 0
  //                           ? res1.recordset[0].TotalNetAmount
  //                           : 0,
  //                       TotalTaxAmount:
  //                         res1.recordset.length > 0
  //                           ? res1.recordset[0].TotalTaxAmount
  //                           : 0,
  //                       CGST:
  //                         res1.recordset.length > 0
  //                           ? res1.recordset[0].TotalTaxAmount / 2
  //                           : 0,
  //                       SGST:
  //                         res1.recordset.length > 0
  //                           ? res1.recordset[0].TotalTaxAmount / 2
  //                           : 0,
  //                       Orders:
  //                         res1.recordset.length > 0
  //                           ? res1.recordset[0].Orders
  //                           : 0,
  //                       OrderDetails: response,
  //                     };
  //                     return res.json({ status: true, data: output });
  //                   }
  //                 }
  //               );
  //             });
  //           }
  //         }
  //       );
  //       }
  //     } else throw "Please fill all the details!";
  //   } catch (error) {
  //     errorHandle.handleError(error, (errorRes) => {
  //       res.send(errorRes);
  //     });
  //   }
  // }
  // async getDateWiseSales(req, res) {
  //   try {
  //     if (
  //       req.query.RestaurantId &&
  //       req.query.FromDate &&
  //       req.query.ToDate &&
  //       req.query.OrderFrom
  //     ) {
  //       const pool = await poolPromise;
  //       pool.query(
  //         `SELECT SUM(BillAmount) AS BillAmount, SUM(NetAmount) AS NetAmount, COUNT(OrderId) AS TotalOrders, COUNT(PaymentType) AS CountOfPaymentType, PaymentType 
  //         FROM OrderHeader WHERE RestaurantId=${req.query.RestaurantId} AND PaymentStatus='S' AND CAST(OrderDate as DATE) >= '${req.query.FromDate}' AND CAST(OrderDate as DATE)<='${req.query.ToDate}' AND OrderFrom='${req.query.OrderFrom}' GROUP BY(PaymentType)`,
  //         function (err, amountRes) {
  //           if (err) {
  //             throw err;
  //           } else {
  //             getPaymentMode(amountRes.recordset, (error, response) => {
  //               if (error) {
  //                 return res.json({ status: false, error: error });
  //               }
  //               pool.query(
  //                 `SELECT SUM(BillAmount) AS TotalBillAmount, SUM(NetAmount) AS TotalNetAmount, SUM(TaxAmount) AS TotalTaxAmount, COUNT(OrderId) AS Orders FROM OrderHeader WHERE RestaurantId=${req.query.RestaurantId} AND PaymentStatus='S' AND CAST(OrderDate as DATE) >= '${req.query.FromDate}' AND CAST(OrderDate as DATE)<='${req.query.ToDate}' AND OrderFrom='${req.query.OrderFrom}'`,
  //                 (err, res1) => {
  //                   if (err) {
  //                     throw err;
  //                   } else {
  //                     let output = {
  //                       TotalBillAmount:
  //                         res1.recordset.length > 0
  //                           ? res1.recordset[0].TotalBillAmount
  //                           : 0,
  //                       TotalNetAmount:
  //                         res1.recordset.length > 0
  //                           ? res1.recordset[0].TotalNetAmount
  //                           : 0,
  //                       TotalTaxAmount:
  //                         res1.recordset.length > 0
  //                           ? res1.recordset[0].TotalTaxAmount
  //                           : 0,
  //                       CGST:
  //                         res1.recordset.length > 0
  //                           ? res1.recordset[0].TotalTaxAmount / 2
  //                           : 0,
  //                       SGST:
  //                         res1.recordset.length > 0
  //                           ? res1.recordset[0].TotalTaxAmount / 2
  //                           : 0,
  //                       Orders:
  //                         res1.recordset.length > 0
  //                           ? res1.recordset[0].Orders
  //                           : 0,
  //                       OrderDetails: response,
  //                     };
  //                     return res.json({ status: true, data: output });
  //                   }
  //                 }
  //               );
  //             });
  //           }
  //         }
  //       );
  //     } else throw "Please fill all the details!";
  //   } catch (error) {
  //     errorHandle.handleError(error, (errorRes) => {
  //       res.send(errorRes);
  //     });
  //   }
  // }

  async getRoomLinkedOrders(req, res) {
    try {
      if (!req.query.Date || !req.query.HotelOrderId || !req.query.HotelRoomNo)
        return res.json(commonMsgs.NullMsg);
      else {
          const pool = await poolPromise;
          let result = await pool
                          .request()
                          .input("Date", req.query.Date)
                          .input("HotelOrderId",  req.query.HotelOrderId)
                          .input("HotelRoomNo", req.query.HotelRoomNo)
                          .execute("getRoomLinkedOrders")
          if (result.recordset[0].mainData!=null){
            res.json({status: true, data:JSON.parse(result.recordset[0].mainData)})

          }
          else{
            res.json({status: true, data: []})
          }
          }
    } catch (error) {
      errorHandle.handleError(error, (errorRes) => {
        res.send(errorRes);
      });
    }
  }

  // async getRoomLinkedOrders(req, res) {
  //   try {
  //     if (!req.query.Date || !req.query.HotelOrderId || !req.query.HotelRoomNo)
  //       return res.json(commonMsgs.NullMsg);
  //     const pool = await poolPromise;
  //     pool.query(
  //       `SELECT OrderHeader.RestaurantId, OrderHeader.OrderId, OrderHeader.OrderHeaderSl, OrderHeader.OrderDate, OrderHeader.CustomerId, OrderHeader.GuestName, OrderHeader.GuestMobile, OrderHeader.GuestMailId, OrderHeader.PaymentType, OrderHeader.OfferId, OrderHeader.BillAmount, OrderHeader.OfferAmount, OrderHeader.TaxAmount, OrderHeader.NetAmount, OrderHeader.BookingMedia, OrderHeader.CreatedBy, OrderHeader.CustomerGSTNo, OrderHeader.BookingType, OrderHeader.PaymentStatus, OrderHeader.HotelOrderId, OrderHeader.HotelRoomNo FROM OrderHeader WHERE CAST(OrderHeader.OrderDate as DATE) = '${req.query.Date}' AND OrderHeader.HotelOrderId = ${req.query.HotelOrderId} AND OrderHeader.HotelRoomNo = ${req.query.HotelRoomNo} AND OrderHeader.PaymentType = 112`,
  //       function (err, result) {
  //         if (err) {
  //           throw err;
  //         } else {
  //           res.json({ status: true, data: result.recordset });
  //         }
  //       }
  //     );
  //   } catch (error) {
  //     errorHandle.handleError(error, (errorRes) => {
  //       res.send(errorRes);
  //     });
  //   }
  // }

  async getHotelOrders(req, res) {
    try {
      if (!req.query.HotelOrderId || !req.query.RestaurantId)
        return res.json(commonMsgs.NullMsg);
      else {
          const pool = await poolPromise;
          let result = await pool
                          .request()
                          .input("HotelOrderId", req.query.HotelOrderId)
                          .input("RestaurantId", req.query.RestaurantId)
                          .execute("getHotelOrders")
          if (result.recordset[0].mainData!=null){
            res.json({status: true, data:JSON.parse(result.recordset[0].mainData)})

          }
          else{
            res.json({status: true, data: []})
          }
          }
    } catch (error) {
      errorHandle.handleError(error, (errorRes) => {
        res.send(errorRes);
      });
    }
  }

  // async getHotelOrders(req, res) {
  //   try {
  //     if (!req.query.HotelOrderId || !req.query.RestaurantId)
  //       return res.json(commonMsgs.NullMsg);
  //     const pool = await poolPromise;
  //     pool.query(
  //       `SELECT OrderHeader.RestaurantId, OrderHeader.OrderId, OrderHeader.OrderHeaderSl, OrderHeader.OrderDate, OrderHeader.CustomerId, OrderHeader.GuestName, OrderHeader.GuestMobile, OrderHeader.GuestMailId, OrderHeader.PaymentType, OrderHeader.OfferId, OrderHeader.BillAmount, OrderHeader.OfferAmount, OrderHeader.TaxAmount, OrderHeader.NetAmount, OrderHeader.BookingMedia, OrderHeader.CreatedBy, OrderHeader.CustomerGSTNo, OrderHeader.BookingType, OrderHeader.PaymentStatus, OrderHeader.HotelOrderId, OrderHeader.HotelRoomNo FROM OrderHeader WHERE OrderHeader.HotelOrderId = ${req.query.HotelOrderId} AND OrderHeader.RestaurantId = ${req.query.RestaurantId} AND OrderHeader.PaymentType = 112`,
  //       function (err, result) {
  //         if (err) {
  //           throw err;
  //         } else {
  //           if (result.recordset.length > 0) {
  //             let orderHeaderArray = [];
  //             orderHeaderArray.push(...result.recordset);
  //             getAppendingData(
  //               req.query.RestaurantId,
  //               orderHeaderArray,
  //               (result) => {
  //                 // console.log("Result++++++", result[0].OrderDetails);
  //                 return res.json({ status: true, data: result });
  //               }
  //             );
  //           } else {
  //             res.json({ status: true, data: [] });
  //           }
  //         }
  //       }
  //     );
  //   } catch (error) {
  //     errorHandle.handleError(error, (errorRes) => {
  //       res.send(errorRes);
  //     });
  //   }
  // }

  // async addData(req, res) {
  //   try {
  //     let necessaryFields = [
  //       "RestaurantId",
  //       "OrderId",
  //       "TableId",
  //       "OrderDate",
  //       "CustomerId",
  //       "PaymentType",
  //       "BookingMedia",
  //       "BookingStatus",
  //       "CreatedBy",
  //       "CreatedDate",
  //     ];
  //     // console.log("req body", req.body);
  //     var orderIdRes = await createOrderId({
  //       BookingMedia: req.body.BookingMedia,
  //       CreatedBy: req.body.CreatedBy,
  //       RestaurantId: req.body.RestaurantId,
  //       CustomerId: req.body.CustomerId,
  //       OrderDate: req.body.OrderDate,
  //     });
  //     // console.log("orderId", orderIdRes);
  //     req.body["orderId"] = "";
  //     req.body["orderId"] = orderIdRes.value;
  //     var requestData = JSON.parse(JSON.stringify(req.body));
  //     // console.log("request Data", requestData);
  //     let { ColNameQuery, ColValueQuery } = getQueryForOrderHeader(
  //       requestData,
  //       necessaryFields
  //     );
  //     // console.log("ColNameQuery, ColValueQuery", ColNameQuery, ColValueQuery)
  //     updateStockInMaster(req.body)
  //       .then(async function (result) {
  //         const pool = await poolPromise;
  //         console.log(`insert data INSERT INTO OrderHeader(${ColNameQuery}) VALUES(${ColValueQuery})`)
  //         let addOrderHeader = await pool.query(
  //           `INSERT INTO OrderHeader(${ColNameQuery}) VALUES(${ColValueQuery})`
  //         );
  //         var getOrderHeaderSl = "";
  //         if (addOrderHeader.rowsAffected.length > 0) {
  //           getOrderHeaderSl = await pool.query(
  //             `SELECT OrderHeaderSl FROM OrderHeader WHERE OrderId='${orderIdRes.value}' AND OrderDate = '${req.body.OrderDate}' AND RestaurantId = ${req.body.RestaurantId}`
  //           );
  //           req.body.OrderDetails = await mergeOrderHeaderSl(
  //             req.body.OrderDetails,
  //             getOrderHeaderSl.recordset[0].OrderHeaderSl
  //           );
  //           // if (req.body.hasOwnProperty("SoftDrinkDetails")) {
  //           //   req.body.SoftDrinkDetails = await mergeOrderHeaderSl(
  //           //     req.body.SoftDrinkDetails,
  //           //     getOrderHeaderSl.recordset[0].OrderHeaderSl
  //           //   );
  //           // }
  //           let insertQueries = await getQueryForOrderDetails(
  //             req.body,
  //             necessaryFields
  //           );
  //           async.map(
  //             insertQueries,
  //             function (query, cb) {
  //               pool.query(query, function (err, result) {
  //                 if (err) {
  //                   cb(err, null);
  //                 } else {
  //                   cb(null, null);
  //                 }
  //               });
  //             },
  //             function (err, result) {
  //               if (err) {
  //                 res.json({ statu: false, err: err });
  //               } else {
  //                 var response = {
  //                   status: true,
  //                   message: "Data Added Successfully",
  //                   OrderHeaderSl: getOrderHeaderSl.recordset[0].OrderHeaderSl,
  //                 };
  //                 res.json(response);
  //               }
  //             }
  //           );
  //         }
  //       })
  //       .catch(function (error) {
  //         errorHandle.handleError(error, (errorRes) => {
  //           res.send(errorRes);
  //         });
  //       });
  //   } catch (error) {
  //     errorHandle.handleError(error, (errorRes) => {
  //       res.send(errorRes);
  //     });
  //   }
  // }
  async addData(req, res) {
    try {
       const { 
                BookingMedia,
                BookingStatus ,
                CreatedBy ,
                CustomerId  ,
                BillAmount ,
                TaxAmount ,
                NetAmount ,
                OrderDate ,
                RestaurantId  ,
                OrderDetails ,
                // parcelChargesDetails,
                OfferAmount,
                OfferId ,
                PaymentType ,
                PaymentStatus ,
                TableId ,
                DinningId ,
                BookedChairs ,
                TableStatus ,
                BookingType,
                GuestName ,
                GuestMobile ,
                GuestMailId ,
                CustomerGSTNo
              }= await req.body;
        const pool = await poolPromise;
        console.log("cus", CustomerId, CreatedBy);
        console.log(BookingMedia,
                BookingStatus ,
                CreatedBy ,
                CustomerId  ,
                BillAmount ,
                TaxAmount ,
                NetAmount ,
                OrderDate ,
                RestaurantId  ,
                OrderDetails ,
                // parcelChargesDetails,
                OfferAmount,
                OfferId ,
                PaymentType ,
                PaymentStatus ,
                TableId ,
                DinningId ,
                BookedChairs ,
                TableStatus ,
                // SoftDrinkDetails ,
                BookingType,
                GuestName ,
                GuestMobile ,
                GuestMailId ,
                CustomerGSTNo, JSON.stringify(OrderDetails))

        let result = await pool.request()
                                  .input("BookingMedia",BookingMedia )
                                  .input("BookingStatus",BookingStatus )
                                  .input("CreatedBy",CreatedBy )
                                  .input("CustomerId",CustomerId )
                                  .input("BillAmount",BillAmount )
                                  .input("TaxAmount", TaxAmount )
                                  .input("NetAmount",NetAmount )
                                  .input("OrderDate",OrderDate )
                                  .input("RestaurantId", RestaurantId  )
                                  .input("OrderDetails", OrderDetails? JSON.stringify(OrderDetails) : null )
                                  // .input("parcelChargesDetails", parcelChargesDetails? JSON.stringify(parcelChargesDetails) : null )
                                  .input("OfferAmount",OfferAmount)
                                  .input("OfferId", OfferId ? OfferId: null )
                                  .input("PaymentType",PaymentType )
                                  .input("PaymentStatus",PaymentStatus )
                                  .input("TableId",TableId ? TableId : null)
                                  .input("DinningId" ,DinningId ? DinningId : null)
                                  .input("BookedChairs", BookedChairs ? BookedChairs[0]: null )
                                  .input("TableStatus", TableStatus? TableStatus : null )
                                  .input("BookingType", BookingType ? BookingType[0] : null)
                                  .input("GuestName", GuestName? GuestName: null )
                                  .input("GuestMobile", GuestMobile? GuestMobile: null)
                                  .input("GuestMailId", GuestMailId? GuestMailId: null )
                                  .input("CustomerGSTNo", CustomerGSTNo ? CustomerGSTNo : null)
                                  .execute("addOrderHeaderDetails")
      console.log("result", result.recordset)   
      if (result.recordset[0][""][1] == 1) {
        res.json({status:true, message: "Data Added Successfully", OrderHeaderSl: result.recordset[0][""][2],OrderDetails:JSON.parse(result.recordset[0][""][3])})

      }
      else {
        res.json({status: false, message:result.recordset[0][""][0]})
      }
                            
      // let necessaryFields = [
      //   "RestaurantId",
      //   "OrderId",
      //   "TableId",
      //   "OrderDate",
      //   "CustomerId",
      //   "PaymentType",
      //   "BookingMedia",
      //   "BookingStatus",
      //   "CreatedBy",
      //   "CreatedDate",
      // ];
      // var orderIdRes = await createOrderId({
      //   BookingMedia: req.body.BookingMedia,
      //   CreatedBy: req.body.CreatedBy,
      //   RestaurantId: req.body.RestaurantId,
      //   CustomerId: req.body.CustomerId,
      //   OrderDate: req.body.OrderDate,
      // });
      // req.body["orderId"] = "";
      // req.body["orderId"] = orderIdRes.value;
      // var requestData = JSON.parse(JSON.stringify(req.body));
      // let { ColNameQuery, ColValueQuery } = getQueryForOrderHeader(
      //   requestData,
      //   necessaryFields
      // );
      // updateStockInMaster(req.body)
      //   .then(async function (result) {
      //     const pool = await poolPromise;
      //     let addOrderHeader = await pool.query(
      //       `INSERT INTO OrderHeader(${ColNameQuery}) VALUES(${ColValueQuery})`
      //     );
      //     var getOrderHeaderSl = "";
      //     if (addOrderHeader.rowsAffected.length > 0) {
      //       getOrderHeaderSl = await pool.query(
      //         `SELECT OrderHeaderSl FROM OrderHeader WHERE OrderId='${orderIdRes.value}' AND OrderDate = '${req.body.OrderDate}' AND RestaurantId = ${req.body.RestaurantId}`
      //       );
      //       req.body.OrderDetails = await mergeOrderHeaderSl(
      //         req.body.OrderDetails,
      //         getOrderHeaderSl.recordset[0].OrderHeaderSl
      //       );
      //       if (req.body.hasOwnProperty("SoftDrinkDetails")) {
      //         req.body.SoftDrinkDetails = await mergeOrderHeaderSl(
      //           req.body.SoftDrinkDetails,
      //           getOrderHeaderSl.recordset[0].OrderHeaderSl
      //         );
      //       }
      //       let insertQueries = await getQueryForOrderDetails(
      //         req.body,
      //         necessaryFields
      //       );
      //       async.map(
      //         insertQueries,
      //         function (query, cb) {
      //           pool.query(query, function (err, result) {
      //             if (err) {
      //               cb(err, null);
      //             } else {
      //               cb(null, null);
      //             }
      //           });
      //         },
      //         function (err, result) {
      //           if (err) {
      //             res.json({ statu: false, err: err });
      //           } else {
      //             var response = {
      //               status: true,
      //               message: "Data Added Successfully",
      //               OrderHeaderSl: getOrderHeaderSl.recordset[0].OrderHeaderSl,
      //             };
      //             res.json(response);
      //           }
      //         }
      //       );
      //     }
      //   })
      //   .catch(function (error) {
      //     errorHandle.handleError(error, (errorRes) => {
      //       res.send(errorRes);
      //     });
      //   });
    } catch (error) {
      errorHandle.handleError(error, (errorRes) => {
        res.send(errorRes);
      });
    }
  }
  async updateOrder(req, res) {
    try{
      let {CreatedBy,
            CustomerId,
            RestaurantId,
            BookingStatus,
            BillAmount,
            TaxAmount,
            NetAmount,
            PaymentStatus,
            OrderId,
            OrderHeaderSl,
            SoftDrinkDetails,
            OrderDetails} = await req.body
      if (BillAmount === null) {
        // console.log("came true")
        BillAmount = NetAmount
      }
      if (TaxAmount === null) {
        // console.log("came true")
        TaxAmount = 0
      }
      console.log("JSON.stringify(OrderDetails)",JSON.stringify(OrderDetails), JSON.stringify(SoftDrinkDetails))
      // console.log("total", JSON.stringify([...orderDetails]))
      const pool = await poolPromise;
      const result = await pool.request()
                          .input("CreatedBy",CreatedBy)
                          .input("CustomerId",CustomerId)
                          .input("RestaurantId",RestaurantId)
                          .input("BookingStatus",BookingStatus)
                          .input("BillAmount",BillAmount)
                          .input("TaxAmount",TaxAmount)
                          .input("NetAmount",NetAmount)
                          .input("PaymentStatus",PaymentStatus)
                          .input("OrderId",OrderId)
                          .input("OrderHeaderSl",OrderHeaderSl)
                          // .input("SoftDrinkDetails",JSON.stringify(SoftDrinkDetails))
                          .input("OrderDetails",JSON.stringify([...OrderDetails]))
                          .execute("putOrderHeader")
        console.log("result.recordset", result.recordset)
        console.log("result", result.recordset[0][""][1])
      if (result.recordset[0][""][1] == 1) {
        res.json({status:true,message:"Data Updated Successfully",OrderDetails:JSON.parse(result.recordset[0][""][2])})
      }
      else {
        res.json({status: false, message:result.recordset[0][""][0]})
      }
    } catch (error) {
      errorHandle.handleError(error, (errorRes) => {
        res.send(errorRes);
      })
    }


  }
  async updateOrderHeader(req, res) {
    try{
      // .toString()
      // console.log(req.body.BookedChairs,req.body.BookedChairs.toString())
      let {CreatedBy,
            CustomerId,
            RestaurantId,
            BookingStatus,
            BillAmount,
            TaxAmount,
            NetAmount,
            PaymentStatus,
            
            OrderId,
            OrderHeaderSl,
            SoftDrinkDetails,
            OrderDetails} = await req.body
      // console.log("JSON.stringify(OrderDetails)",JSON.stringify(OrderDetails), JSON.stringify(SoftDrinkDetails))
      // console.log("total", JSON.stringify([...orderDetails]))
      const pool = await poolPromise;
      const result = await pool.request()
                          .input("CreatedBy",CreatedBy)
                          .input("CustomerId",CustomerId)
                          .input("RestaurantId",RestaurantId)
                          .input("BookingStatus",BookingStatus)
                          .input("BillAmount",BillAmount)
                          .input("TaxAmount",TaxAmount)
                          .input("NetAmount",NetAmount)
                          .input("PaymentStatus",PaymentStatus)
                          .input("OrderId",OrderId)
                          .input("OrderHeaderSl",OrderHeaderSl)
                          .input("BookedChairs",req.body.BookedChairs.toString())
                          .input("TableId",req.body.TableId.toString())
                          // .input("SoftDrinkDetails",JSON.stringify(SoftDrinkDetails))
                          .input("OrderDetails",JSON.stringify([...OrderDetails, ...SoftDrinkDetails]))
                          .execute("putOrderHeaderDeatils")
    
      if (result.recordset[0][""][1] == 1) {
        res.json({status:true,message:"Data Updated Successfully"})
      }
      else {
        res.status({status: false, message:result.recordset[0][""][0]})
      }
    } catch (error) {
      errorHandle.handleError(error, (errorRes) => {
        res.send(errorRes);
      })
    }
  }

  // async updateOrderHeader(req, res) {
  //   const {
  //     RestaurantId,
  //     OrderId,
  //     TableId,
  //     PaymentStatus,
  //     PaymentType,
  //     BillAmount,
  //     TaxAmount,
  //     NetAmount,
  //     OrderDetails,
  //     BookingStatus,
  //     OrderHeaderSl,
  //   } = req.body;
  //   try {
  //     const pool = await poolPromise;
  //     if (!OrderId || !BookingStatus || !OrderHeaderSl)
  //       return res.json(commonMsgs.NullMsg);
  //     async.waterfall(
  //       [
  //         function (callback) {
  //           var { queryValue } = utilityFile.getUpdateQueryModified(req.body);
  //           pool.query(
  //             `UPDATE OrderHeader SET ${queryValue} WHERE OrderHeaderSl = '${OrderHeaderSl}' AND RestaurantId = '${RestaurantId}'`,
  //             function (err, result) {
  //               if (err) {
  //                 callback(err, null);
  //               } else if (result.rowsAffected[0] === 0) {
  //                 callback(commonMsgs.DataNotFoundMsg, null);
  //               } else {
  //                 callback(null);
  //               }
  //             }
  //           );
  //         },
  //         function (callback) {
  //           updateInOrderDetails(req.body, (err, message) => {
  //             if (err) return callback(err, null);
  //             callback(null, commonMsgs.updateMsg);
  //           });
  //         },
  //         // function (updateMsg, callback) {
  //         //   if (req.body.hasOwnProperty("SoftDrinkDetails")) {
  //         //     updateInSoftDrinkDetails(req.body, (message) => {
  //         //       callback(null, message);
  //         //     });
  //         //   } else {
  //         //     callback(null, commonMsgs.updateMsg);
  //         //   }
  //         // },
  //       ],
  //       function (err, result) {
  //         if (err) {
  //           errorHandle.handleError(err, (errorRes) => {
  //             return res.send(errorRes);
  //           });
  //         } else {
  //           res.json(result);
  //         }
  //       }
  //     );
  //   } catch (error) {
  //     errorHandle.handleError(error, (errorRes) => {
  //       res.send(errorRes);
  //     });
  //   }
  // }

  async updateTableStatus(req, res) {
    const { RestaurantId, OrderHeaderSl, DinningId, TableStatus } = req.body;
    try {
      if (!RestaurantId || !OrderHeaderSl || !DinningId || !TableStatus)
        return res.json(commonMsgs.NullMsg);
      else {
          const pool = await poolPromise;
          let result = await pool
                          .request()
                          .input("TableStatus", req.body.TableStatus)
                          .input("RestaurantId", req.body.RestaurantId)
                          .input("OrderHeaderSl",req.body.OrderHeaderSl)
                          .input("DinningId",req.body.DinningId)
                          // .input("UpdatedBy",req.body.UpdatedBy)
                          .execute("updateTableStatus")
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

  // async updateTableStatus(req, res) {
  //   const { RestaurantId, OrderHeaderSl, DinningId, TableStatus } = req.body;
  //   try {
  //     if (!RestaurantId || !OrderHeaderSl || !DinningId || !TableStatus)
  //       return res.json(commonMsgs.NullMsg);
  //     const pool = await poolPromise;
  //     var result = await pool.query(
  //       `UPDATE OrderHeader SET TableStatus = '${TableStatus}' WHERE RestaurantId = '${RestaurantId}' AND OrderHeaderSl = '${OrderHeaderSl}' AND DinningId = '${DinningId}'`
  //     );
  //     if (result.rowsAffected[0] == 0)
  //       return res.json(commonMsgs.DataNotFoundMsg);
  //     res.json(commonMsgs.updateMsg);
  //   } catch (error) {
  //     errorHandle.handleError(error, (errorRes) => {
  //       res.send(errorRes);
  //     });
  //   }
  // }

  async updatePrintStatus(req, res) {
    try {
      const {
        RestaurantId,
        OrderId,
        OrderHeaderSl,
        PrintedBy,
        PrintReason,
      } = req.body;
      if (
        !RestaurantId ||
        !OrderId ||
        !OrderHeaderSl ||
        !PrintedBy ||
        !PrintReason
      )
        return res.json(commonMsgs.NullMsg);
      let queryValue = null;
      for (const [key, value] of Object.entries(req.body)) {
        if (key != "RestaurantId" && key != "OrderId" && key != "OrderHeaderSl")
          queryValue == null
            ? (queryValue = `${key}='${value}'`)
            : (queryValue += `,${key}='${value}'`);
      }
      const pool = await poolPromise;
      await pool.query(
        `UPDATE OrderHeader SET ${queryValue}, PrintDate = GETDATE(), PrintStatus = 'P' WHERE RestaurantId = ${RestaurantId} AND OrderId = ${OrderId} AND OrderHeaderSl = ${OrderHeaderSl}`
      );
      res.json(commonMsgs.updateMsg);
    } catch (error) {
      errorHandle.handleError(error, (errorRes) => {
        res.send(errorRes);
      });
    }
  }

  async updateBookingStatus(req, res) {
    const { RestaurantId, OrderHeaderSl, BookingStatus } = req.body;
    try {
      if (!RestaurantId || !OrderHeaderSl || !BookingStatus)
        return res.json(commonMsgs.NullMsg);
      const pool = await poolPromise;
      if (BookingStatus == "C") {
        var result = await pool.query(
          `UPDATE OrderHeader SET BookingStatus = '${BookingStatus}',TableStatus = 'A' WHERE RestaurantId = '${RestaurantId}' AND OrderHeaderSl = '${OrderHeaderSl}'`
        );
      } else {
        var result = await pool.query(
          `UPDATE OrderHeader SET BookingStatus = '${BookingStatus}' WHERE RestaurantId = '${RestaurantId}' AND OrderHeaderSl = '${OrderHeaderSl}'`
        );
      }
      if (result.rowsAffected[0] == 0) {
        return res.json(commonMsgs.DataNotFoundMsg);
      } else {
        let ServedTime = "";
        if (req.body.hasOwnProperty("ServedTime")) {
          ServedTime = `'${req.body.ServedTime}'`;
        } else {
          ServedTime = `NULL`;
        }
        let updateOrderDetails = await pool.query(
          `UPDATE OrderDetails SET BookingStatus = '${BookingStatus}', ServedTime=${ServedTime} WHERE RestaurantId = '${RestaurantId}' AND OrderHeaderSl = '${OrderHeaderSl}' AND BookingStatus IN ('O', 'P')`
        );
        if (updateOrderDetails.rowsAffected[0] == 0)
          return res.json(commonMsgs.DataNotFoundMsg);
        res.json(commonMsgs.updateMsg);
      }
    } catch (error) {
      errorHandle.handleError(error, (errorRes) => {
        res.send(errorRes);
      });
    }
  }

  async cancelOrderHeader(req, res) {
    var { RestaurantId, OrderHeaderSl, BookingStatus } = req.body;
    const pool = await poolPromise;
    async.waterfall(
      [
        function (cb) {
          getOrderDetails(RestaurantId, OrderHeaderSl, (err, response) => {
            if (err) {
              cb(err, null);
            } else {
              cb(null, response);
            }
          });
        },
        function (OrderDetails, cb) {
          let Query =
            OrderDetails[0].PaymentStatus == "P"
              ? ""
              : `, CancelDate = GETDATE(), CancelCharges = 0, CancelRefund = ${OrderDetails[0].NetAmount}`;
          pool.query(
            `UPDATE OrderHeader SET BookingStatus = '${BookingStatus}',TableStatus = 'A' ${Query} WHERE RestaurantId = '${RestaurantId}' AND OrderHeaderSl = '${OrderHeaderSl}'`,
            function (err, result) {
              if (err) {
                cb(err, null);
              } else if (result.rowsAffected[0] === 0) {
                cb(null, false, OrderDetails);
              } else {
                cb(null, true, OrderDetails);
              }
            }
          );
        },
        function (OrderHdrStatus, OrderDetails, cb) {
          if (!OrderHdrStatus) {
            cb(null, { status: false, message: "No Data Found" });
          } else {
            updateOrderDetails(BookingStatus, OrderDetails, (err, response) => {
              if (err) {
                cb(err, null);
              } else {
                cb(null, response);
              }
            });
          }
        },
      ],
      function (err, message) {
        if (err) {
          errorHandle.handleError(error, (errorRes) => {
            res.json(errorRes);
          });
        } else {
          // console.log("Message...", message)
          res.json(message);
        }
      }
    );
  }
}

async function updateOrderDetails(BookingStatus, OrderData, callback) {
  const pool = await poolPromise;
  var OrderDetails = OrderData[0].OrderDetails;
  async.map(
    OrderDetails,
    (value, cb) => {
      let Query =
        OrderData[0].PaymentStatus == "P"
          ? ""
          : `, CancelDate = GETDATE(), CancelCharges = 0, CancelRefund = ${value.NetTariff}`;
      pool.query(
        `UPDATE OrderDetails SET BookingStatus = '${BookingStatus}' ${Query} WHERE RestaurantId = '${OrderData[0].RestaurantId}' AND OrderHeaderSl = '${OrderData[0].OrderHeaderSl}' AND OrderSl = '${value.OrderSl}'`,
        function (err, result) {
          if (err) {
            cb(err, null);
          } else if (result.rowsAffected[0] === 0) {
            cb("No Data Found", null);
          } else {
            cb(null, null);
          }
        }
      );
    },
    function (err, message) {
      if (err) {
        callback(err, null);
      } else {
        if (OrderData[0].PaymentStatus == "P") {
          callback(null, {
            status: true,
            message: "Data Updated Successfully",
          });
        } else {
          callback(null, {
            status: true,
            message: "Data Updated Successfully",
            TotalAmount: OrderData[0].NetAmount,
            CacellationCharges: 0,
            RefundAmount: OrderData[0].NetAmount,
          });
        }
      }
    }
  );
}

async function getOrderDetails(RestaurantId, OrderHeaderSl, callback) {
  try {
    const pool = await poolPromise;
    const result = await pool.query(
      /** Removed the comparison for restaurantId with restaurantId in restaurant master because of the requirement **/

      `SELECT OrderHeader.CustomerId, OrderHeader.OrderId, OrderHeader.OrderHeaderSl, OrderHeader.OrderDate, OrderHeader.RestaurantId, RestaurantMaster.RestaurantName, RestaurantMaster.GSTIN, OrderHeader.TableId, OrderHeader.BookedChairs, OrderHeader.BookingType, OrderHeader.BookingStatus, OrderHeader.PaymentType, OrderHeader.PaymentStatus, OrderHeader.BillAmount, OrderHeader.TaxAmount, OrderHeader.GuestName, OrderHeader.GuestMobile, OrderHeader.CustomerGSTNo, OrderHeader.NetAmount, OrderHeader.HotelOrderId, OrderHeader.HotelRoomNo
      FROM OrderHeader, RestaurantMaster WHERE OrderHeader.OrderHeaderSl='${OrderHeaderSl}'`

      // `SELECT OrderHeader.CustomerId, OrderHeader.OrderId, OrderHeader.OrderHeaderSl, OrderHeader.OrderDate, OrderHeader.RestaurantId, RestaurantMaster.RestaurantName, RestaurantMaster.GSTIN, OrderHeader.TableId, OrderHeader.BookedChairs, OrderHeader.BookingType, OrderHeader.BookingStatus, OrderHeader.PaymentType, OrderHeader.PaymentStatus, OrderHeader.BillAmount, OrderHeader.TaxAmount, OrderHeader.GuestName, OrderHeader.GuestMobile, OrderHeader.CustomerGSTNo, OrderHeader.NetAmount, OrderHeader.HotelOrderId, OrderHeader.HotelRoomNo
      // FROM OrderHeader, RestaurantMaster WHERE OrderHeader.OrderHeaderSl='${OrderHeaderSl}' AND RestaurantMaster.RestaurantId = OrderHeader.RestaurantId`
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
      (result) => {
        callback(null, result);
      }
    );
  } catch (error) {
    errorHandle.handleError(error, (errorRes) => {
      callback(errorRes, null);
    });
  }
}

function getAppendingData(RestaurantId, orderHeaderArray, callback) {
  var count = 0;
  orderHeaderArray.map(async (value, index) => {
    const pool = await poolPromise;
    const result1 = await pool.request().query(
      `SELECT OrderDetails.RestaurantId, OrderDetails.OrderHeaderSl, OrderDetails.OrderId, OrderDetails.OrderSl, OrderDetails.FoodId, FoodMaster.FoodName, OrderDetails.OrderQuantity,
          OrderDetails.FoodVarietyId, ConfigurationMaster.ConfigName As FoodVarietyName, OrderDetails.TableId, OrderDetails.Tariff, OrderDetails.NetTariff, OrderDetails.OrderTime, OrderDetails.ServedTime, OrderDetails.BookingStatus, OrderDetails.BookingType, OrderDetails.WaiterId FROM OrderDetails, ConfigurationMaster, FoodMaster WHERE ConfigurationMaster.ConfigId = OrderDetails.FoodVarietyId AND OrderDetails.FoodId=FoodMaster.FoodId AND OrderDetails.OrderHeaderSl='${value.OrderHeaderSl}'`
    );
    const result2 = await pool
      .request()
      .query(
        `SELECT OrderDetails.RestaurantId, OrderDetails.OrderHeaderSl, OrderDetails.OrderId, OrderDetails.OrderSl, OrderDetails.FoodId, FoodMaster.FoodName, OrderDetails.OrderQuantity, OrderDetails.TableId, OrderDetails.Tariff, OrderDetails.NetTariff, OrderDetails.OrderTime, OrderDetails.ServedTime, OrderDetails.BookingStatus, OrderDetails.BookingType, OrderDetails.WaiterId FROM OrderDetails,FoodMaster WHERE OrderDetails.FoodId=FoodMaster.FoodId AND OrderDetails.OrderHeaderSl='${value.OrderHeaderSl}' AND OrderDetails.FoodVarietyId IS NULL`
      );
    var finalData = [...result1.recordset, ...result2.recordset];
    getWaiterName(RestaurantId, finalData).then(() => {
      count++;
      orderHeaderArray[index]["OrderDetails"] = finalData;
      if (count === orderHeaderArray.length) callback(orderHeaderArray);
    });
  });
}

async function getWaiterName(RestaurantId, OrderDetailsArr) {
  let promise = new Promise(function (resolve, reject) {
    this.apiService = new ApiService();
    this.apiService.CMCommonReport(RestaurantId, (apiResponse) => {
      async.map(
        OrderDetailsArr,
        (value, cb) => {
          if (value.hasOwnProperty("WaiterId") && value.WaiterId != null) {
            let matchingName = apiResponse.filter((val) => {
              return val.EmpId == value.WaiterId;
            });
            value["WaiterName"] =
              matchingName.length > 0
                ? matchingName[0].EmpFirstName +
                  " " +
                  matchingName[0].EmpLastName
                : null;
            cb(null, value);
          } else {
            cb(null, null);
          }
        },
        (err, result) => {
          resolve(null);
        }
      );
    });
  });
  return promise;
}

async function createOrderId(req) {
  var resData = {
    status: false,
    value: "",
    message: "",
  };
  const pool = await poolPromise;
  var orderId = "";
  let initiate = "1";
  let count = await pool
    .request()
    .query(
      `SELECT MAX(CAST(SUBSTRING(OrderId,CHARINDEX('-',OrderId)+1,LEN(OrderId)-CHARINDEX('-',OrderId)) AS INT)) FROM OrderHeader WHERE OrderHeader.RestaurantId=${req.RestaurantId} AND CAST(OrderDate AS DATE) = CAST ('${req.OrderDate}' as DATE)`
    );
  if (count.recordset[0][""] == 0 || count.recordset[0][""] == null) {
    resData.status = true;
    resData.value = initiate;
    return resData;
  } else {
    let maxBooking = count.recordset[0][""];
    maxBooking = Number(maxBooking) + 1;
    resData.status = true;
    resData.value = maxBooking;
    return resData;
  }
}

function getQueryForOrderHeader(input, fieldsArray) {
  delete input.OrderDetails;
  // if (input.hasOwnProperty("SoftDrinkDetails")) {
  //   delete input.SoftDrinkDetails;
  // }
  const { ColNameQuery, ColValueQuery } = utilityFile.getInsertQueryModified(
    input
  );
  return { ColNameQuery, ColValueQuery };
}

// getQueryForOrderDetails()

async function getQueryForOrderDetails(input, fieldsArray) {
  var SGST=0
  var CGST=0
  const pool =await  poolPromise;
  let taxSGST = await pool.query(`select ISNULL(TaxPercentage,0) as TaxPercentage from TaxMaster where ActiveStatus='A' and TaxDescription='SGST'`)
  if(taxSGST.recordset.length>0){
  var SGST=taxSGST.recordset[0].TaxPercentage
  }
 
  let taxCGST = await pool.query(`select ISNULL(TaxPercentage,0) as TaxPercentage from TaxMaster where ActiveStatus='A' and TaxDescription='CGST'`)
  if(taxCGST.recordset.length>0){
  var CGST=taxCGST.recordset[0].TaxPercentage
  }
  // select TaxDescription,TaxPercentage from TaxMaster where ActiveStatus='A'
  let orderDetailsArray = [];
  var insertQuery = [];
  orderDetailsArray = input.OrderDetails;
  let columnName = "";
  let columnValue = "";
  if (orderDetailsArray.length > 0) {
    for (let i = 0; i < orderDetailsArray.length; i++) {
      const {
        ColNameQuery,
        ColValueQuery,
      } = utilityFile.getInsertQueryModified(orderDetailsArray[i]);
      columnName = ColNameQuery;
      var tableId = `NULL`,
        bookedChairs = `NULL`;
      if (input.hasOwnProperty("TableId")) {
        tableId = `'${input.TableId.join(",")}'`;
      }
      if (input.hasOwnProperty("BookedChairs")) {
        bookedChairs = `'${input.BookedChairs.join(",")}'`;
      }
      columnValue +=
        "(" +
        ColValueQuery +
        ", " +
        `'${input.RestaurantId}'` +
        ", " +
        `'${input.BookingStatus}'` +
        ", " +
        `'${input.orderId}'` +
        ", " +
        tableId +
        ", " +
        bookedChairs +
        ", " +
        `'${input.CustomerId}'` +
        ", " +
        `'${input.CreatedBy}'` +
        ", " +
        `'${CGST}'` +
        ", " +
        `'${SGST}'` +
        "),";
    }
    columnName +=
      ",RestaurantId, BookingStatus, OrderId, TableId, BookedChairs, CustomerId, CreatedBy,CGST,SGST";
    if (columnValue.charAt(columnValue.length - 1) === ",") {
      columnValue = columnValue.substring(0, columnValue.length - 1);
    }
    console.log("columnName", columnName);
    insertQuery.push(
      `INSERT INTO OrderDetails(${columnName}) VALUES${columnValue}`
    );
  }
  // if (input.hasOwnProperty("SoftDrinkDetails")) {
  //   let columnNameForSoftDrink = "";
  //   let columnValueForSoftDrink = "";
  //   for (let i = 0; i < input.SoftDrinkDetails.length; i++) {
  //     const {
  //       ColNameQuery,
  //       ColValueQuery,
  //     } = utilityFile.getInsertQueryModified(input.SoftDrinkDetails[i]);
  //     columnNameForSoftDrink = ColNameQuery;
  //     var tableId = `NULL`,
  //       bookedChairs = `NULL`;
  //     if (input.hasOwnProperty("TableId")) {
  //       tableId = `'${input.TableId.join(",")}'`;
  //     }
  //     if (input.hasOwnProperty("BookedChairs")) {
  //       bookedChairs = `'${input.BookedChairs.join(",")}'`;
  //     }
  //     columnValueForSoftDrink +=
  //       "(" +
  //       ColValueQuery +
  //       ", " +
  //       `'${input.RestaurantId}'` +
  //       ", " +
  //       `'${input.BookingStatus}'` +
  //       ", " +
  //       `'${input.orderId}'` +
  //       ", " +
  //       tableId +
  //       ", " +
  //       bookedChairs +
  //       ", " +
  //       `'${input.CustomerId}'` +
  //       ", " +
  //       `'${input.CreatedBy}'` +
  //       ", " +
  //       `'${CGST}'` +
  //       ", " +
  //       `'${SGST}'` +
  //       "),";
  //   }
  //   columnNameForSoftDrink +=
  //     ",RestaurantId, BookingStatus, OrderId, TableId, BookedChairs, CustomerId, CreatedBy,CGST,SGST";
  //   if (
  //     columnValueForSoftDrink.charAt(columnValueForSoftDrink.length - 1) === ","
  //   ) {
  //     columnValueForSoftDrink = columnValueForSoftDrink.substring(
  //       0,
  //       columnValueForSoftDrink.length - 1
  //     );
  //   }
  //   insertQuery.push(
  //     `INSERT INTO OrderDetails(${columnNameForSoftDrink}) VALUES${columnValueForSoftDrink}`
  //   );
  // }
  return insertQuery;
}

function getQueryForUpdateOrder(
  input,
  RestaurantId,
  OrderId,
  TableId,
  chairs,
  orderHeaderSl,
  CustomerId,
  CreatedBy,
  SGST,
  CGST
) {
  let columnName = "";
  let columnValue = "";
  var { ColNameQuery, ColValueQuery } = utilityFile.getInsertQueryModified(
    input
  );
  columnName = ColNameQuery;
  columnValue +=
    "(" +
    ColValueQuery +
    ", " +
    `'${RestaurantId}'` +
    ", " +
    `'O'` +
    ", " +
    `'${OrderId}'` +
    ", " +
    `'${TableId}'` +
    ", " +
    `'${chairs}'` +
    ", " +
    `'${orderHeaderSl}'` +
    ", " +
    `'${CustomerId}'` +
    ", " +
    `'${CreatedBy}'` +
    ", " +
    `'${SGST}'` +
    ", " +
    `'${CGST}'` +
    "),";
  columnName +=
    ",RestaurantId, BookingStatus, OrderId, TableId, BookedChairs, OrderHeaderSl, CustomerId, CreatedBy,SGST,CGST";
  return { columnName, columnValue };
}

async function updateInOrderDetails(reqData, callback) {
  var SGST=0
  var CGST=0
  const pool =await  poolPromise;
  let taxSGST = await pool.query(`select ISNULL(TaxPercentage,0) as TaxPercentage from TaxMaster where ActiveStatus='A' and TaxDescription='SGST'`)
  if(taxSGST.recordset.length>0){
  var SGST=taxSGST.recordset[0].TaxPercentage
  }
 
  let taxCGST = await pool.query(`select ISNULL(TaxPercentage,0) as TaxPercentage from TaxMaster where ActiveStatus='A' and TaxDescription='CGST'`)
  if(taxCGST.recordset.length>0){
  var CGST=taxCGST.recordset[0].TaxPercentage
  }
  var OrderDetails = reqData.OrderDetails;
  var CreatedBy = "";
  if (reqData.hasOwnProperty("CreatedBy")) {
    CreatedBy = reqData.CreatedBy;
  } else {
    CreatedBy = reqData.CustomerId;
  }
  // const pool = await poolPromise;
  async.map(
    OrderDetails,
    (value, cb) => {
      if (!value.hasOwnProperty("OrderSl")) {
        let { columnName, columnValue } = getQueryForUpdateOrder(
          value,
          reqData.RestaurantId,
          reqData.OrderId,
          reqData.TableId,
          reqData.hasOwnProperty("BookedChairs") ? reqData.BookedChairs : "",
          reqData.OrderHeaderSl,
          reqData.CustomerId,
          CreatedBy,
          SGST,
          CGST
        );
        if (columnValue.charAt(columnValue.length - 1) === ",") {
          columnValue = columnValue.substring(0, columnValue.length - 1);
        }
        pool.query(
          `INSERT INTO OrderDetails(${columnName}) VALUES${columnValue}`,
          function (err, result) {
            if (err) {
              cb(err, null);
            } else {
              cb(null, null);
            }
          }
        );
      } else {
        let keyArr = [];
        var { queryValue } = utilityFile.getUpdateQueryModified(value, keyArr);
        pool.query(
          `UPDATE OrderDetails SET ${queryValue}  WHERE OrderHeaderSl = ${reqData.OrderHeaderSl} AND OrderSl = '${value.OrderSl}'`,
          function (err, result) {
            if (err) {
              cb(err, null);
            } else if (result.rowsAffected[0] == 0) {
              cb(commonMsgs.DataNotFoundMsg, null);
            } else {
              cb(null, null);
            }
          }
        );
      }
    },
    function (err, result) {
      if (err) {
        return callback(err, null);
      } else {
        return callback(null, commonMsgs.updateMsg);
      }
    }
  );
}

// async function updateInSoftDrinkDetails(reqData, callback) {
//   var SGST=0
//   var CGST=0
//   const pool =await  poolPromise;
//   let taxSGST = await pool.query(`select ISNULL(TaxPercentage,0) as TaxPercentage from TaxMaster where ActiveStatus='A' and TaxDescription='SGST'`)
//   if(taxSGST.recordset.length>0){
//   var SGST=taxSGST.recordset[0].TaxPercentage
//   }
 
//   let taxCGST = await pool.query(`select ISNULL(TaxPercentage,0) as TaxPercentage from TaxMaster where ActiveStatus='A' and TaxDescription='CGST'`)
//   if(taxCGST.recordset.length>0){
//   var CGST=taxCGST.recordset[0].TaxPercentage
//   }
//   var SoftDrinkDetails = reqData.SoftDrinkDetails;
//   // const pool = await poolPromise;
//   async.map(
//     SoftDrinkDetails,
//     (value, cb) => {
//       if (!value.hasOwnProperty("OrderSl")) {
//         let { columnName, columnValue } = getQueryForUpdateOrder(
//           value,
//           reqData.RestaurantId,
//           reqData.OrderId,
//           reqData.TableId,
//           reqData.hasOwnProperty("BookedChairs") ? reqData.BookedChairs : "",
//           reqData.OrderHeaderSl,
//           reqData.CustomerId,
//           reqData.CreatedBy,
//           SGST,
//           CGST
//         );
//         if (columnValue.charAt(columnValue.length - 1) === ",") {
//           columnValue = columnValue.substring(0, columnValue.length - 1);
//         }
//         updateStockInMaster(reqData)
//           .then(function (result) {
//             pool.query(
//               `INSERT INTO OrderDetails(${columnName}) VALUES${columnValue}`,
//               function (err, result) {
//                 if (err) {
//                   cb({ status: false, message: err }, null);
//                 } else {
//                   cb(null, null);
//                 }
//               }
//             );
//           })
//           .catch((error) => {
//             cb({ status: false, message: error }, null);
//           });
//       } else {
//         let keyArr = [];
//         var { queryValue } = utilityFile.getUpdateQueryModified(value, keyArr);
//         pool.query(
//           `UPDATE OrderDetails SET ${queryValue}  WHERE OrderHeaderSl = ${reqData.OrderHeaderSl} AND OrderSl = '${value.OrderSl}'`,
//           function (err, result) {
//             if (err) {
//               cb({ status: false, message: err }, null);
//             } else if (result.rowsAffected[0] == 0) {
//               cb(commonMsgs.DataNotFoundMsg, null);
//             } else {
//               cb(null, null);
//             }
//           }
//         );
//       }
//     },
//     function (err, result) {
//       if (err) {
//         return callback(err);
//       } else {
//         return callback(commonMsgs.updateMsg);
//       }
//     }
//   );
// }
async function updateStockInMaster(reqData) {
  const pool = await poolPromise;
  let promise = new Promise(function (resolve, reject) {
    // if (reqData.hasOwnProperty("SoftDrinkDetails")) {
      async.map(
        reqData.OrderDetails,
        function (value, cb) {
          // console.log("value", value)
          pool.query(
            `SELECT top (1) StockInMaster.StockId,StockInMaster.FoodId, StockInMaster.FoodQuantityId, 
            StockInMaster.IssuedQty, StockInMaster.BalanceQty FROM StockInMaster WHERE FoodId = ${value.FoodId} 
            AND FoodQuantityId = ${value.FoodVarietyId} and BalanceQty>0 `,
            function (err, result) {
              if (err) {
                cb(err, null);
              } 
              else {
                // console.log("done")
                if (result.recordset.length > 0) {
                  if (value.OrderQuantity <= result.recordset[0].BalanceQty) {
                    let balanceQty =
                      result.recordset[0].BalanceQty -
                      Number(value.OrderQuantity);
                    let IssuedQty = "";
                    if (result.recordset[0].IssuedQty === 0) {
                      IssuedQty = value.OrderQuantity;
                    } else {
                      IssuedQty =
                        Number(value.OrderQuantity) +
                        Number(result.recordset[0].IssuedQty);
                    }
                    // console.log(`make stock update UPDATE StockInMaster SET BalanceQty = '${balanceQty}', IssuedQty = '${IssuedQty}' WHERE RestaurantId = '${reqData.RestaurantId}' AND FoodId = '${value.FoodId}' AND FoodQuantityId = '${value.FoodVarietyId}' AND StockId=${result.recordset[0].StockId}`)
                    pool.query(
                      `UPDATE StockInMaster SET BalanceQty = '${balanceQty}', IssuedQty = '${IssuedQty}' WHERE RestaurantId = '${reqData.RestaurantId}' AND FoodId = '${value.FoodId}' AND FoodQuantityId = '${value.FoodVarietyId}' AND StockId=${result.recordset[0].StockId}`,
                      function (error, result) {
                        if (error) {
                          // console.log("error came 1")
                          cb(error, null);
                        } else {
                          cb(null, null);
                        }
                      }
                    );
                  } else {


                    pool.query(`EXEC [updateStock] ${value.OrderQuantity},${reqData.RestaurantId},${value.FoodId},${value.FoodVarietyId}`,
                    function (error, result) {
                      if (error) {
                        console.log("came into errro")
                        cb(error, null);
                      } else {
                        cb(null, null);
                      }
                    }
                    );
                    // let balanceQty =
                    //   result.recordset[0].BalanceQty -
                    //   Number(value.OrderQuantity);
                    // if (balanceQty<0){
                    //   console.log("came1")
                    //   let balanceQty1 =Number(value.OrderQuantity) -result.recordset[0].BalanceQty;
                    //   let issued=result.recordset[0].IssuedQty + result.recordset[0].BalanceQty
                    //   pool.query(
                    //     `UPDATE top (1) StockInMaster SET BalanceQty = 0, IssuedQty = '${issued}' WHERE RestaurantId = '${reqData.RestaurantId}' AND SoftDrinkId = '${value.SoftDrinkId}' AND SoftDrinkQuantityId = '${value.SoftDrinkQuantityId}' AND StockId=${result.recordset[0].StockId} and BalanceQty>=${result.recordset[0].BalanceQty}`,
                        
                    //   );
                    //   console.log("came2")
                    //   pool.query(
                    //     `UPDATE top (1) StockInMaster SET BalanceQty =BalanceQty - ${balanceQty1}, IssuedQty = IssuedQty +'${issued}' WHERE RestaurantId = '${reqData.RestaurantId}' AND SoftDrinkId = '${value.SoftDrinkId}' AND SoftDrinkQuantityId = '${value.SoftDrinkQuantityId}'  and BalanceQty>=${balanceQty1}`,
                       

                    //     function (error, result) {
                    //       if (error) {
                    //         cb(error, null);
                    //       } else {
                    //         cb(null, null);
                    //       }
                    //     }
                    //   );


                      

                      

                     

                    //   }
                    


                  }
                } else {
                  // cb("Soft Drink Data Not Found", null);
                  cb(null, null);
                }
              }
            }
          );
        },
        function (err, result) {
          if (err) {
            reject(err);
          } else {
            resolve(null);
          }
        }
      );
    // } else {
    //   resolve(null);
    // }
  });
  return promise;
}

function mergeOrderHeaderSl(arrData, OrderHeaderSl) {
  for (let i = 0; i < arrData.length; i++) {
    arrData[i]["OrderHeaderSl"] = "";
    arrData[i]["OrderHeaderSl"] = OrderHeaderSl;
  }
  return arrData;
}

function checkReqObjects(input, fieldsArray) {
  let arrayOfInputsFromRequest = [];
  for (let field in input) {
    arrayOfInputsFromRequest.push(`${field}`);
  }
  let missingFields = fieldsArray.filter(
    ((i) => (a) => a !== arrayOfInputsFromRequest[i] || !++i)(0)
  );
  if (missingFields.length === 0) {
    return { status: true, action: "proceed" };
  } else {
    if (missingFields.length === 1) {
      let actionString = "Following field is missing:" + missingFields[0];
      return { status: false, action: actionString };
    } else {
      let actionString = "Following fields are missing:";
      missingFields.forEach((element) => {
        actionString += " " + element + ",";
      });
      return { status: false, action: actionString };
    }
  }
}

async function getPaymentMode(orderDetails, callback) {
  const pool = await poolPromise;
  async.map(
    orderDetails,
    (value, cb) => {
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

const orderHeader = new OrderHeader();

module.exports = orderHeader;
