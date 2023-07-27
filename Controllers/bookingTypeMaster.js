const errorHandle = require("../services/errorHandler");
const commonMsgs = require("../CommonMsg.json");
const { poolPromise, sql } = require("../db");

class BookingTypeMasterController {
  async getData(req, res) {
    try {
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .input("BookingTypeId", req.query.BookingTypeId)
                        .execute("getBookingTypeMasterData")
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
  // async getData(req, res) {
  //   try {
  //     if (!req.query.BookingTypeId) res.json(commonMsgs.NullMsg);
  //     else {
  //       const pool = await poolPromise;
  //       let result = await pool.query(
  //         `select * from BookingTypeMaster where BookingTypeMaster= ${req.query.BookingTypeId} AND ActiveStatus='A'`
  //       );
  //       res.json({ status: true, data: result.recordset });
  //     }
  //   } catch (error) {
  //     errorHandle.handleError(error, errorRes => {
  //       res.send(errorRes);
  //     });
  //   }
  // }
  async getDataByResId(req, res) {
    try {
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .input("RestaurantId", req.query.RestaurantId)
                        .execute("getDataByResId")
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
  // async getDataByResId(req, res) {
  //   try {
  //     if (!req.query.RestaurantId) res.json(commonMsgs.NullMsg);
  //     else {
  //       const pool = await poolPromise;
  //       let result = await pool.query(
  //         `select * from BookingTypeMaster where RestaurantId= ${req.query.RestaurantId}`
  //       );
  //       res.json({ status: true, data: result.recordset });
  //     }
  //   } catch (error) {
  //     errorHandle.handleError(error, errorRes => {
  //       res.send(errorRes);
  //     });
  //   }
  // }

  async addData(req, res) {
    try {
      if (
        !(req.body.RestaurantId && req.body.BookingType && req.body.CreatedBy)
      )
        res.json(commonMsgs.NullMsg);
        else {
          const pool = await poolPromise;
          let result = await pool
                          .request()
                          .input("RestaurantId", req.body.RestaurantId)
                          .input("BookingType", req.body.BookingType)
                          .input("CreatedBy",req.body.CreatedBy)
                          .execute("addBookingTypeData")
          if (result.recordset[0][""][1] == 1) {
            res.json(commonMsgs.AddMsg);
          }
          else {
            res.json({status: false, message:result.recordset[0][""][0]})
          }
          }
    } catch (error) {
      errorHandle.handleError(error, errorRes => {
        res.send(errorRes);
      });
    }
  }

  // async addData(req, res) {
  //   try {
  //     if (
  //       !(req.body.RestaurantId && req.body.BookingType && req.body.CreatedBy)
  //     )
  //       res.json(commonMsgs.NullMsg);
  //     else {
  //       let ColNameQuery = "ActiveStatus",
  //         ColValueQuery = "'A'";
  //       for (let key in req.body) {
  //         if (req.body[key]) {
  //           ColNameQuery += `${ColNameQuery != `` ? `,` : ``}${key}`;
  //           ColValueQuery += `${ColValueQuery != `` ? `,` : ``}'${
  //             req.body[key]
  //           }'`;
  //         }
  //       }
  //       const pool = await poolPromise;
  //       let result = await pool.query(
  //         `BEGIN
  //               IF NOT EXISTS (SELECT * FROM BookingTypeMaster 
  //                  WHERE BookingType = '${req.body.BookingType}' AND RestaurantId='${req.body.RestaurantId}')
  //               BEGIN
  //                 INSERT INTO BookingTypeMaster (${ColNameQuery})
  //                 VALUES (${ColValueQuery})
  //               END
  //             END`
  //       );
  //       if (result.rowsAffected.length == 0) {
  //         res.json({ status: false, message: "Booking type already exists!" });
  //       } else {
  //         res.json(commonMsgs.AddMsg);
  //       }
  //     }
  //   } catch (error) {
  //     errorHandle.handleError(error, errorRes => {
  //       res.send(errorRes);
  //     });
  //   }
  // }

  async updateData(req, res) {
    try {
      const { BookingTypeId, RestaurantId, UpdatedBy } = req.body;
      if (!BookingTypeId || !RestaurantId || !UpdatedBy)
        return res.json(commonMsgs.NullMsg);
      else {
          const pool = await poolPromise;
          let result = await pool
                          .request()
                          .input("RestaurantId", req.body.RestaurantId)
                          .input("BookingType", req.body.BookingType)
                          .input("UpdatedBy",req.body.UpdatedBy)
                          .input("BookingTypeId",req.body.BookingTypeId)
                          .execute("updateBookingTypeData")
          if (result.recordset[0][""][1] == 1) {
            res.json(commonMsgs.updateMsg);
          }
          else {
            res.json({status: false, message:result.recordset[0][""][0]})
          }
          }   
    } catch (error) {
      errorHandle.handleError(error, errorRes => {
        res.send(errorRes);
      });
    }
  }
  
  // async updateData(req, res) {
  //   try {
  //     const { BookingTypeId, RestaurantId, UpdatedBy } = req.body;
  //     if (!BookingTypeId || !RestaurantId || !UpdatedBy)
  //       return res.json(commonMsgs.NullMsg);
  //     let queryValue = null;
  //     for (const [key, value] of Object.entries(req.body)) {
  //       if (key != "BookingTypeId")
  //         queryValue == null
  //           ? (queryValue = `${key}='${value}'`)
  //           : (queryValue += `,${key}='${value}'`);
  //     }
  //     const pool = await poolPromise;
  //     let updateResult=await pool.query(
  //       `BEGIN
  //       IF NOT EXISTS (SELECT * FROM BookingTypeMaster 
  //          WHERE BookingType = '${req.body.BookingType}' AND RestaurantId='${req.body.RestaurantId}' AND BookingType !='${req.body.BookingType}')
  //       BEGIN
  //       UPDATE BookingTypeMaster SET ${queryValue}, UpdatedDate = GETDATE() WHERE BookingTypeId = ${BookingTypeId} AND RestaurantId = ${RestaurantId}
  //       END
  //     END`

  //       // `UPDATE BookingTypeMaster SET ${queryValue}, UpdatedDate = GETDATE() WHERE BookingTypeId = ${BookingTypeId} AND RestaurantId = ${RestaurantId}`
  //     );

  //     if (updateResult.rowsAffected.length == 0) {
  //       res.json({ status: false, message: "Booking Type already exists!" });
  //     } else {
  //       res.json(commonMsgs.updateMsg);
  //     }
  //   } catch (error) {
  //     errorHandle.handleError(error, errorRes => {
  //       res.send(errorRes);
  //     });
  //   }
  // }

  async deleteData(req, res) {
    const { ActiveStatus, BookingTypeId, RestaurantId } = req.query;
    try {
      console.log(BookingTypeId,ActiveStatus,RestaurantId)
      if (!BookingTypeId || !ActiveStatus) return res.json(commonMsgs.NullMsg);
      else {
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .input("ActiveStatus", req.query.ActiveStatus)
                        .input("BookingTypeId", req.query.BookingTypeId)
                        .input("RestaurantId",req.query.RestaurantId)
                        .execute("deletebookingTypeData")
        if (result.recordset[0][""][1] == 1) {
          res.json(commonMsgs.deleteMsg);
        }
        else {
          res.json({status: false, message:result.recordset[0][""][0]})
        }
        }
    } catch (error) {
      errorHandle.handleError(error, errorRes => {
        res.send(errorRes);
      });
    }
  }

  // async deleteData(req, res) {
  //   const { ActiveStatus, BookingTypeId, RestaurantId } = req.query;
  //   try {
  //     if (!BookingTypeId || !ActiveStatus) return res.json(commonMsgs.NullMsg);
  //     const pool = await poolPromise;
  //     await pool.query(
  //       `UPDATE BookingTypeMaster SET ActiveStatus = '${ActiveStatus}'  WHERE BookingTypeId = '${BookingTypeId}' AND RestaurantID = '${RestaurantId}'`
  //     );
  //     res.json(commonMsgs.deleteMsg);
  //   } catch (error) {
  //     errorHandle.handleError(error, errorRes => {
  //       res.send(errorRes);
  //     });
  //   }
  // }
}

const bookingTypeMaster = new BookingTypeMasterController();

module.exports = bookingTypeMaster;
