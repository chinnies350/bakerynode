const errorHandle = require("../services/errorHandler");
const commonMsgs = require("../CommonMsg.json");
const { poolPromise, sql } = require("../db");
const async = require("async");
const utilityFile = require("../utility");

class PreOrderController {
  async getPreOrderDeatilsByRestaurantId(req, res) {
    try {
      if (!req.query.RestaurantId) res.json(commonMsgs.NullMsg);
      else {
        const pool = await poolPromise;
        let result = await pool.query(
          `select poh.PreOrderId,poh.OrderHeaderSl,poh.AdvanceAmt,poh.BalanceAmt,poh.Description,poh.Instruction,poh.DeliveryDate,poh.Address1,poh.Address2,poh.Zipcode,poh.State,poh.District,
              poh.Lat,poh.Lang,substring(convert(char(8),poh.DeliveryTime,114), 1, 5) as DeliveryTime,
              oh.BillAmount,oh.BookingType,oh.BookingStatus,oh.OfferAmount,oh.NetAmount,oh.GuestMailId,
                            oh.GuestMobile,oh.GuestName,oh.OrderDate,oh.PaymentStatus,oh.PaymentType,oh.TaxAmount,oh.OrderId,
                            (SELECT od.FoodId, fm.FoodName, od.OrderTime, od.FoodVarietyId, od.OrderQuantity, od.BuffetId, od.BookingType, od.Tariff, od.NetTariff, od.ComplementaryId, od.WaiterId ,
                                                          od.BookingStatus, od.OrderHeaderSl, od.ServedTime, od.OrderSl, ISNULL(od.CGST,0) as CGST, ISNULL(od.SGST,0) as SGST
                                                          FROM OrderDetails as od 
                                                          INNER JOIN FoodMaster as fm ON fm.FoodId = od.FoodId
                                                          WHERE od.OrderHeaderSl = oh.OrderHeaderSl FOR JSON PATH) as OrderDetails
                            from PreOrderMaster as poh
                            inner join OrderHeader as oh on oh.OrderHeaderSl=poh.OrderHeaderSl where oh.RestaurantId=${req.query.RestaurantId} order by poh.DeliveryDate,poh.DeliveryTime ASC`
        );
        if (result.recordset.length > 0) {
          // console.log("hold data", result.recordset);
          let sendingData = [...result.recordset];
          for (let eachData of sendingData) {
            // console.log("each Data", eachData.);
            if (eachData.OrderDetails != null) {
              eachData.OrderDetails = JSON.parse(eachData.OrderDetails);
            } else {
              eachData.OrderDetails = [];
            }
          }
          res.json({ status: true, data: sendingData });
        } else {
          res.json({ status: true, data: [] });
        }
      }
    } catch (error) {
      errorHandle.handleError(error, (errorRes) => {
        res.send(errorRes);
      });
    }
  }


  async getAllData(req, res) {

    try {
      const pool = await poolPromise;
      let result = await pool
          .request()
          .input("OrderHeaderSl", req.query.OrderHeaderSl? req.query.OrderHeaderSl : null)
          .input("RestaurantId", req.query.RestaurantId? req.query.RestaurantId : null)
          .input("FromDate", req.query.FromDate? req.query.FromDate : null)
          .input("ToDate", req.query.ToDate? req.query.ToDate: null)
          .input("BookingStatus", req.query.BookingStatus? req.query.BookingStatus : null)
          .execute("getOrderDetailsByOrderId")
      if (result.recordset[0].mainData != null) {
          res.json({ status: true, data: JSON.parse(result.recordset[0].mainData) })

      } else {
          res.json({ status: true, data: "No data found."})
      }

  } catch (error) {
      errorHandle.handleError(error, errorRes => {
          res.send(errorRes);
      });
  }
}

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
                CustomerGSTNo,
                AdvanceAmt,
                BalanceAmt,
                DeliveryDate,
                DeliveryTime,
                PreOrderTypeDetails
              }= await req.body;
        const pool = await poolPromise;
        // console.log("cus", PreOrderTypeDetails, CreatedBy);
       

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
                                  .input("AdvanceAmt", AdvanceAmt ? AdvanceAmt : 0)
                                  .input("BalanceAmt", BalanceAmt ? BalanceAmt : 0)
                                  .input("DeliveryDate", DeliveryDate ? DeliveryDate : null)
                                  .input("DeliveryTime", DeliveryTime ? DeliveryTime : null)
                                  .input("PreOrderTypeDetails", PreOrderTypeDetails ? JSON.stringify(PreOrderTypeDetails) : null)
                                  .execute("PostPreOrder")  
      // console.log(result.recordset[0])
      if (result.recordset[0][""][1] == 1) {
        res.json({status:true, message: "Data Added Successfully", OrderHeaderSl: result.recordset[0][""][2],OrderDetails:JSON.parse(result.recordset[0][""][3])})

      }
      else {
        res.json({status: false, message:result.recordset[0][""][0]})
      }
                            
         } catch (error) {
      errorHandle.handleError(error, (errorRes) => {
        res.send(errorRes);
      });
    }
  }

  async updateData(req, res) {
    try {
      
      // console.log(req.body);
      const { 
        OrderId,
        OrderHeaderSl ,
        CreatedBy ,
        CustomerId  ,
        BillAmount ,
        TaxAmount ,
        NetAmount ,
        OrderDate ,
        RestaurantId  ,
        FoodDetails,
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
        CustomerGSTNo,
        AdvanceAmt,
        BalanceAmt,
        DeliveryDate,
        DeliveryTime,
        PreOrderTypeDetails,
        BookingStatus,
  
      }= await req.body;
      // console.log(FoodDetails)
      const pool = await poolPromise;
      let results = await pool
        .request()
        
        .input("PaymentType",PaymentType)
        .input("OrderId",OrderId)
        .input("OrderHeaderSl",OrderHeaderSl)
        .input("CreatedBy",CreatedBy)
        .input("RestaurantId", RestaurantId)
        .input("OrderDetails", JSON.stringify(FoodDetails))
        .input("GuestMobile",GuestMobile)
        .input("GuestName",GuestName)
        .input("AdvanceAmt",AdvanceAmt)
        .input("BalanceAmt",BalanceAmt)
        .input("DeliveryDate",DeliveryDate)
        .input("DeliveryTime",DeliveryTime)
        .input("CustomerId",CustomerId)
        .input("BookingStatus",BookingStatus)
        .input("BillAmount",BillAmount)
        .input("TaxAmount",TaxAmount)
        .input("NetAmount",NetAmount)
        .input("PaymentStatus",PaymentStatus)
        .input("PreOrderTypeDetails",JSON.stringify(PreOrderTypeDetails))
        .execute("putPreOrder");
      //console.log(results.recordset[0],"mohan");
      if (results.recordset[0][""][1] == 1) {
        var response = {
          status: true,
          message: "Data Updated Successfully",
          OrderDetails:JSON.parse(results.recordset[0][""][2])
        };
        res.json(response);
      } else {
        var response = {
          status: false,
          message: "error",
        };
        res.json(response);
      }
    } catch (error) {
      errorHandle.handleError(error, (errorRes) => {
        res.send(errorRes);
      });
    }
  }
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
  const { ColNameQuery, ColValueQuery } =
    utilityFile.getInsertQueryModified(input);
  return { ColNameQuery, ColValueQuery };
}

async function getQueryForOrderDetails(input, fieldsArray) {
  var SGST = 0;
  var CGST = 0;
  const pool = await poolPromise;
  let taxSGST = await pool.query(
    `select ISNULL(TaxPercentage,0) as TaxPercentage from TaxMaster where ActiveStatus='A' and TaxDescription='SGST'`
  );
  if (taxSGST.recordset.length > 0) {
    var SGST = taxSGST.recordset[0].TaxPercentage;
  }

  let taxCGST = await pool.query(
    `select ISNULL(TaxPercentage,0) as TaxPercentage from TaxMaster where ActiveStatus='A' and TaxDescription='CGST'`
  );
  if (taxCGST.recordset.length > 0) {
    var CGST = taxCGST.recordset[0].TaxPercentage;
  }
  // select TaxDescription,TaxPercentage from TaxMaster where ActiveStatus='A'
  let orderDetailsArray = [];
  var insertQuery = [];
  orderDetailsArray = input.OrderDetails;
  let columnName = "";
  let columnValue = "";
  if (orderDetailsArray.length > 0) {
    for (let i = 0; i < orderDetailsArray.length; i++) {
      const { ColNameQuery, ColValueQuery } =
        utilityFile.getInsertQueryModified(orderDetailsArray[i]);
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
    //console.log("columnName", columnName);
    insertQuery.push(
      `INSERT INTO OrderDetails(${columnName}) VALUES${columnValue}`
    );
  }

  return insertQuery;
}

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
            } else {
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
                  pool.query(
                    `EXEC [updateStock] ${value.OrderQuantity},${reqData.RestaurantId},${value.FoodId},${value.FoodVarietyId}`,
                    function (error, result) {
                      if (error) {
                        //console.log("came into errro");
                        cb(error, null);
                      } else {
                        cb(null, null);
                      }
                    }
                  );
                }
              } else {
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

const PreOrder = new PreOrderController();

module.exports = PreOrder;




// const errorHandle = require("../services/errorHandler");
// const commonMsgs = require("../CommonMsg.json");
// const { poolPromise, sql } = require("../db");
// const async = require("async");
// const utilityFile = require("../utility");


// class PreOrderController {
//     async getPreOrderDeatilsByRestaurantId(req, res) {
//         try {
//           if (!req.query.RestaurantId) res.json(commonMsgs.NullMsg);
//           else {
//             const pool = await poolPromise;
//             let result = await pool.query(
//               `select poh.PreOrderId,poh.OrderHeaderSl,poh.AdvanceAmt,poh.BalanceAmt,poh.Description,poh.Instruction,poh.DeliveryDate,poh.Address1,poh.Address2,poh.Zipcode,poh.State,poh.District,
//               poh.Lat,poh.Lang,substring(convert(char(8),poh.DeliveryTime,114), 1, 5) as DeliveryTime,
//               oh.BillAmount,oh.BookingType,oh.BookingStatus,oh.OfferAmount,oh.NetAmount,oh.GuestMailId,
//                             oh.GuestMobile,oh.GuestName,oh.OrderDate,oh.PaymentStatus,oh.PaymentType,oh.TaxAmount,oh.OrderId,
//                             (SELECT od.FoodId, fm.FoodName, od.OrderTime, od.FoodVarietyId, od.OrderQuantity, od.BuffetId, od.BookingType, od.Tariff, od.NetTariff, od.ComplementaryId, od.WaiterId ,
//                                                           od.BookingStatus, od.OrderHeaderSl, od.ServedTime, od.OrderSl, ISNULL(od.CGST,0) as CGST, ISNULL(od.SGST,0) as SGST
//                                                           FROM OrderDetails as od 
//                                                           INNER JOIN FoodMaster as fm ON fm.FoodId = od.FoodId
//                                                           WHERE od.OrderHeaderSl = oh.OrderHeaderSl FOR JSON PATH) as OrderDetails
//                             from PreOrderMaster as poh
//                             inner join OrderHeader as oh on oh.OrderHeaderSl=poh.OrderHeaderSl where oh.RestaurantId=${req.query.RestaurantId} order by poh.DeliveryDate,poh.DeliveryTime ASC`
//             );
//             if (result.recordset.length > 0) {
//                 // console.log("hold data", result.recordset);
//                   let sendingData = [... result.recordset]
//                   for( let eachData of sendingData) {
//                     // console.log("each Data", eachData.);
//                     if (eachData.OrderDetails != null) {
//                       eachData.OrderDetails = JSON.parse(eachData.OrderDetails)
//                     }
//                     else {
//                       eachData.OrderDetails = []
//                     }
//                   }
//                   res.json({ status: true, data: sendingData })
      
//                 }
//               else {
//                 res.json({ status: true, data: [] })
//               }
//           }
//         } catch (error) {
//           errorHandle.handleError(error, errorRes => {
//             res.send(errorRes);
//           });
//         }
//       }

      

//       async addData(req, res)
//       {
//         try {
//           let necessaryFields = [
//             "RestaurantId",
//             "OrderId",
//             "TableId",
//             "OrderDate",
//             "CustomerId",
//             "PaymentType",
//             "BookingMedia",
//             "BookingStatus",
//             "CreatedBy",
//             "CreatedDate",
//           ];
//           // console.log("req body", req.body);
//           var orderIdRes = await createOrderId({
//             BookingMedia: req.body.BookingMedia,
//             CreatedBy: req.body.CreatedBy,
//             RestaurantId: req.body.RestaurantId,
//             CustomerId: req.body.CustomerId,
//             OrderDate: req.body.OrderDate,
//           });
//           // console.log("orderId", orderIdRes);
//           req.body["orderId"] = "";
//           req.body["orderId"] = orderIdRes.value;
//           var requestData = JSON.parse(JSON.stringify(req.body));
//           // console.log("request Data", requestData);
//           let { ColNameQuery, ColValueQuery } = getQueryForOrderHeader(
//             requestData,
//             necessaryFields
//           );
//           // console.log("ColNameQuery, ColValueQuery", ColNameQuery, ColValueQuery)
//           updateStockInMaster(req.body)
//             .then(async function (result) {
//               const pool = await poolPromise;
//               // console.log(req.body.OrderDetails)
//               let addOrderHeader = await pool.query(
//                 `INSERT INTO OrderHeader(RestaurantId,OrderId,OrderDate,BookingType,GuestName,GuestMobile,OfferId,PaymentType,BillAmount,OfferAmount,TaxAmount,NetAmount,
//                   BookingMedia,BookingStatus,PaymentStatus,CreatedBy,CreatedDate,CustomerId) VALUES(${req.body.RestaurantId},${orderIdRes.value},
//                     '${req.body.OrderDate}','${req.body.BookingType}',
//                     '${req.body.GuestName}','${req.body.GuestMobile}',${req.body.OfferId},'${req.body.PaymentType}',${req.body.BillAmount},${req.body.OfferAmount},${req.body.TaxAmount},${req.body.NetAmount},
//                     '${req.body.BookingMedia}','${req.body.BookingStatus}','${req.body.PaymentStatus}',${req.body.CreatedBy},getdate(),${req.body.CreatedBy})`
//               );
//               var getOrderHeaderSl = "";
//               if (addOrderHeader.rowsAffected.length > 0) {
//                 getOrderHeaderSl = await pool.query(
//                   `SELECT OrderHeaderSl FROM OrderHeader WHERE OrderId='${orderIdRes.value}' AND OrderDate = '${req.body.OrderDate}' AND RestaurantId = ${req.body.RestaurantId}`
//                 );
//                 req.body.OrderDetails = await mergeOrderHeaderSl(
//                   req.body.OrderDetails,
//                   getOrderHeaderSl.recordset[0].OrderHeaderSl
//                 );
                
               

//                 let results = await pool
//                         .request()
//                         .input("OrderId", orderIdRes.value)
//                         .input("OrderHeaderSl", getOrderHeaderSl.recordset[0].OrderHeaderSl)
//                         .input("CreatedBy", req.body.CreatedBy)
//                         .input("RestaurantId", req.body.RestaurantId)
//                         .input("OrderDetails", JSON.stringify(req.body.OrderDetails))
//                         .input("GuestMobile", req.body.GuestMobile)
//                         .input("GuestName", req.body.GuestName)
//                         .input("AdvanceAmt", req.body.AdvanceAmt)
//                         .input("BalanceAmt", req.body.BalanceAmt)
//                         .input("Description", req.body.Description)
//                         .input("Instruction", req.body.Instruction)
//                         .input("DeliveryDate", req.body.DeliveryDate)
//                         .input("DeliveryTime", req.body.DeliveryTime)
//                         .input("Address1", req.body.Address1)
//                         .input("Address2", req.body.Address2)
//                         .input("Zipcode", req.body.Zipcode)
//                         .input("State", req.body.State)
//                         .input("District", req.body.District)
//                         .input("Lat", req.body.Lat)
//                         .input("Lang", req.body.Lang)
//                         .execute("PostPreOrder")

               

//                 console.log(results.recordset[0][""][1] == 1)
//                 if(results.recordset[0][""][1] == 1){
//                   var response = {
//                     status: true,
//                     message: "Data Added Successfully",
//                     OrderHeaderSl: getOrderHeaderSl.recordset[0].OrderHeaderSl,
//                   };
//                   res.json(response);
//                 }
//                 else{
//                   var response = {
//                     status: false,
//                     message: "error"
//                   };
//                   res.json(response);
//                 }
//               }
//             })
//             .catch(function (error) {
//               errorHandle.handleError(error, (errorRes) => {
//                 res.send(errorRes);
//               });
//             });
//         } catch (error) {
//           errorHandle.handleError(error, (errorRes) => {
//             res.send(errorRes);
//           });
//         }
//       }
//       async updateData(req, res)
//       {
//         try {
//           const pool = await poolPromise;
//           console.log(req.body.BillAmount)
//           let results = await pool
//                         .request()
//                         .input("OrderId",req.body.OrderId)
//                         .input("OrderHeaderSl",req.body.OrderHeaderSl)
//                         .input("CreatedBy", req.body.CreatedBy)
//                         .input("RestaurantId", req.body.RestaurantId)
//                         .input("OrderDetails", JSON.stringify(req.body.OrderDetails))
//                         .input("GuestMobile", req.body.GuestMobile)
//                         .input("GuestName", req.body.GuestName)
//                         .input("AdvanceAmt", req.body.AdvanceAmt)
//                         .input("BalanceAmt", req.body.BalanceAmt)
//                         .input("Description", req.body.Description)
//                         .input("Instruction", req.body.Instruction)
//                         .input("DeliveryDate", req.body.DeliveryDate)
//                         .input("DeliveryTime", req.body.DeliveryTime)
//                         .input("Address1", req.body.Address1)
//                         .input("Address2", req.body.Address2)
//                         .input("Zipcode", req.body.Zipcode)
//                         .input("State", req.body.State)
//                         .input("District", req.body.District)
//                         .input("Lat", req.body.Lat)
//                         .input("Lang", req.body.Lang)
//                         .input("CustomerId", req.body.CustomerId)
//                         .input("BookingStatus", req.body.BookingStatus)
//                         .input("BillAmount", req.body.BillAmount)
//                         .input("TaxAmount", req.body.TaxAmount)
//                         .input("NetAmount", req.body.NetAmount)
//                         .input("PaymentStatus", req.body.PaymentStatus)
//                         .execute("putPreOrder")
//                       // console.log()
//                         console.log(results.recordset)
//                         if(results.recordset[0][""][1] == 1){
//                           var response = {
//                             status: true,
//                             message: "Data Updated Successfully"
//                           };
//                           res.json(response);
//                         }
//                         else{
//                           var response = {
//                             status: false,
//                             message: "error"
//                           };
//                           res.json(response);
//                         }

//         } catch (error) {
//           errorHandle.handleError(error, (errorRes) => {
//             res.send(errorRes);
//           });
//         }
//       }
// }
// async function createOrderId(req) {
//     var resData = {
//       status: false,
//       value: "",
//       message: "",
//     };
//     const pool = await poolPromise;
//     var orderId = "";
//     let initiate = "1";
//     let count = await pool
//       .request()
//       .query(
//         `SELECT MAX(CAST(SUBSTRING(OrderId,CHARINDEX('-',OrderId)+1,LEN(OrderId)-CHARINDEX('-',OrderId)) AS INT)) FROM OrderHeader WHERE OrderHeader.RestaurantId=${req.RestaurantId} AND CAST(OrderDate AS DATE) = CAST ('${req.OrderDate}' as DATE)`
//       );
//     if (count.recordset[0][""] == 0 || count.recordset[0][""] == null) {
//       resData.status = true;
//       resData.value = initiate;
//       return resData;
//     } else {
//       let maxBooking = count.recordset[0][""];
//       maxBooking = Number(maxBooking) + 1;
//       resData.status = true;
//       resData.value = maxBooking;
//       return resData;
//     }
//   }

//   function getQueryForOrderHeader(input, fieldsArray) {
//     delete input.OrderDetails;
//     const { ColNameQuery, ColValueQuery } = utilityFile.getInsertQueryModified(
//       input
//     );
//     return { ColNameQuery, ColValueQuery };
//   }
  

  
//   async function getQueryForOrderDetails(input, fieldsArray) {
//     var SGST=0
//     var CGST=0
//     const pool =await  poolPromise;
//     let taxSGST = await pool.query(`select ISNULL(TaxPercentage,0) as TaxPercentage from TaxMaster where ActiveStatus='A' and TaxDescription='SGST'`)
//     if(taxSGST.recordset.length>0){
//     var SGST=taxSGST.recordset[0].TaxPercentage
//     }
   
//     let taxCGST = await pool.query(`select ISNULL(TaxPercentage,0) as TaxPercentage from TaxMaster where ActiveStatus='A' and TaxDescription='CGST'`)
//     if(taxCGST.recordset.length>0){
//     var CGST=taxCGST.recordset[0].TaxPercentage
//     }
//     // select TaxDescription,TaxPercentage from TaxMaster where ActiveStatus='A'
//     let orderDetailsArray = [];
//     var insertQuery = [];
//     orderDetailsArray = input.OrderDetails;
//     let columnName = "";
//     let columnValue = "";
//     if (orderDetailsArray.length > 0) {
//       for (let i = 0; i < orderDetailsArray.length; i++) {
//         const {
//           ColNameQuery,
//           ColValueQuery,
//         } = utilityFile.getInsertQueryModified(orderDetailsArray[i]);
//         columnName = ColNameQuery;
//         var tableId = `NULL`,
//           bookedChairs = `NULL`;
//         if (input.hasOwnProperty("TableId")) {
//           tableId = `'${input.TableId.join(",")}'`;
//         }
//         if (input.hasOwnProperty("BookedChairs")) {
//           bookedChairs = `'${input.BookedChairs.join(",")}'`;
//         }
//         columnValue +=
//           "(" +
//           ColValueQuery +
//           ", " +
//           `'${input.RestaurantId}'` +
//           ", " +
//           `'${input.BookingStatus}'` +
//           ", " +
//           `'${input.orderId}'` +
//           ", " +
//           tableId +
//           ", " +
//           bookedChairs +
//           ", " +
//           `'${input.CustomerId}'` +
//           ", " +
//           `'${input.CreatedBy}'` +
//           ", " +
//           `'${CGST}'` +
//           ", " +
//           `'${SGST}'` +
//           "),";
//       }
//       columnName +=
//         ",RestaurantId, BookingStatus, OrderId, TableId, BookedChairs, CustomerId, CreatedBy,CGST,SGST";
//       if (columnValue.charAt(columnValue.length - 1) === ",") {
//         columnValue = columnValue.substring(0, columnValue.length - 1);
//       }
//       console.log("columnName", columnName);
//       insertQuery.push(
//         `INSERT INTO OrderDetails(${columnName}) VALUES${columnValue}`
//       );
//     }
    
//     return insertQuery;
//   }
  
//   async function updateStockInMaster(reqData) {
//     const pool = await poolPromise;
//     let promise = new Promise(function (resolve, reject) {
//       // if (reqData.hasOwnProperty("SoftDrinkDetails")) {
//         async.map(
//           reqData.OrderDetails,
//           function (value, cb) {
//             // console.log("value", value)
//             pool.query(
//               `SELECT top (1) StockInMaster.StockId,StockInMaster.FoodId, StockInMaster.FoodQuantityId, 
//               StockInMaster.IssuedQty, StockInMaster.BalanceQty FROM StockInMaster WHERE FoodId = ${value.FoodId} 
//               AND FoodQuantityId = ${value.FoodVarietyId} and BalanceQty>0 `,
//               function (err, result) {
//                 if (err) {
//                   cb(err, null);
//                 } 
//                 else {
//                   // console.log("done")
//                   if (result.recordset.length > 0) {
//                     if (value.OrderQuantity <= result.recordset[0].BalanceQty) {
//                       let balanceQty =
//                         result.recordset[0].BalanceQty -
//                         Number(value.OrderQuantity);
//                       let IssuedQty = "";
//                       if (result.recordset[0].IssuedQty === 0) {
//                         IssuedQty = value.OrderQuantity;
//                       } else {
//                         IssuedQty =
//                           Number(value.OrderQuantity) +
//                           Number(result.recordset[0].IssuedQty);
//                       }
//                       // console.log(`make stock update UPDATE StockInMaster SET BalanceQty = '${balanceQty}', IssuedQty = '${IssuedQty}' WHERE RestaurantId = '${reqData.RestaurantId}' AND FoodId = '${value.FoodId}' AND FoodQuantityId = '${value.FoodVarietyId}' AND StockId=${result.recordset[0].StockId}`)
//                       pool.query(
//                         `UPDATE StockInMaster SET BalanceQty = '${balanceQty}', IssuedQty = '${IssuedQty}' WHERE RestaurantId = '${reqData.RestaurantId}' AND FoodId = '${value.FoodId}' AND FoodQuantityId = '${value.FoodVarietyId}' AND StockId=${result.recordset[0].StockId}`,
//                         function (error, result) {
//                           if (error) {
//                             // console.log("error came 1")
//                             cb(error, null);
//                           } else {
//                             cb(null, null);
//                           }
//                         }
//                       );
//                     } else {
  
  
//                       pool.query(`EXEC [updateStock] ${value.OrderQuantity},${reqData.RestaurantId},${value.FoodId},${value.FoodVarietyId}`,
//                       function (error, result) {
//                         if (error) {
//                           console.log("came into errro")
//                           cb(error, null);
//                         } else {
//                           cb(null, null);
//                         }
//                       }
//                       );
  
  
//                     }
//                   } else {
//                     cb(null, null);
//                   }
//                 }
//               }
//             );
//           },
//           function (err, result) {
//             if (err) {
//               reject(err);
//             } else {
//               resolve(null);
//             }
//           }
//         );
     
//     });
//     return promise;
//   }

//   function mergeOrderHeaderSl(arrData, OrderHeaderSl) {
//     for (let i = 0; i < arrData.length; i++) {
//       arrData[i]["OrderHeaderSl"] = "";
//       arrData[i]["OrderHeaderSl"] = OrderHeaderSl;
//     }
//     return arrData;
//   }


// const PreOrder = new PreOrderController();

// module.exports = PreOrder;