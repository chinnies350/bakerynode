const errorHandle = require("../services/errorHandler");
const commonMsgs = require("../CommonMsg.json");
const { poolPromise, sql } = require("../db");
const async=require('async')

class addOnsMapController {
  constructor() {
    return this;
  }

  async getDataByFoodId(req, res) {
    try {
      if (!req.query.FoodId) res.json(commonMsgs.NullMsg);
      else {
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .input("FoodId", req.query.FoodId)
                        .execute("getAddOnsMapData")
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

  // async getDataByFoodId(req, res) {
  //   try {
  //     if (!req.query.FoodId) res.json(commonMsgs.NullMsg);
  //     else {
  //       const pool = await poolPromise;
  //       let result = await pool.query(
  //         `select * from AddOnsMap where FoodId= ${req.query.FoodId}`
  //       );
  //       res.json({ status: true, data: result.recordset });
  //     }
  //   } catch (error) {
  //     errorHandle.handleError(error, (errorRes) => {
  //       res.send(errorRes);
  //     });
  //   }
  // }

  async getAllAddOnsData(req, res) {
    try {
      if (!req.query.RestaurantId) res.json(commonMsgs.NullMsg);
      const pool = await poolPromise;
      let result = await pool.query(
        `SELECT FoodId, AddOnsId FROM AddOnsMap`
          // `SELECT AddOnsMap.FoodId, FoodMaster.FoodName,
          // STUFF ((SELECT AddOnsMap.AddOnsId +',' FROM AddOnsMap FOR XML PATH('')), 1, 0, '')AS AddOnsId FROM AddOnsMap, FoodMaster WHERE AddOnsMap.FoodId=${req.query.FoodId} AND FoodMaster.RestaruantId=${req.query.RestaurantId} AND AddOnsMap.FoodId=FoodMaster.FoodId
          // `
      );
      getFoodName(result.recordset, (foodName)=>{
        getAddOnsData(foodName, (result)=>{
          res.json({ status: true, data: result });
        })
      })
    } catch (error) {
      errorHandle.handleError(error, (errorRes) => {
        res.send(errorRes);
      });
    }
  }

  async getAllAddOnsDataTEST(req,res) {
    try {
        if (req.query.RestaurantId && req.query.FoodId) {
          const pool = await poolPromise;
          let result = await pool
                        .request()
                        .input("RestaurantId", req.query.RestaurantId)
                        .input("FoodId", req.query.FoodId)
                        .query(`SELECT AddOnsMap.AddOnsId 
                        FROM AddOnsMap
                        INNER JOIN FoodMaster ON AddOnsMap.FoodId = FoodMaster.FoodId 
                        WHERE FoodMaster.RestaurantId=@RestaurantId AND AddOnsMap.FoodId=@FoodId`)
          const d = result.recordset[0].AddOnsId.split(",")
          let async_data = []
          var x;
          for (x in d) {
            const pool = await poolPromise;
            let r = await pool.query(`SELECT AddOnsName FROM AddOns WHERE AddOnsId='${d[x]}';`);
            async_data.push(r.recordset[0])
          }
          res.json({ status: true, data: async_data});
        } else {
          res.json({ status: true, data: "Please enter all Details!"});
        }
    } catch (error) {
      errorHandle.handleError(error, (errorRes) => {
        res.send(errorRes);
      });
    }
  }

  async addData(req, res) {
    try {
      if (!req.body.FoodId) res.json(commonMsgs.NullMsg);
      else {
        for (let key in req.body) {
          if (req.body[key]) {
            if (req.body[key] === "AddOnsId") {
              req.body[key].join(",");
            }
          }
        }
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .input("FoodId", req.body.FoodId)
                        .input("AddOnsId", req.body.AddOnsId)
                        .input("CreatedBy",req.body.CreatedBy)
                        .execute("addAddOnsMapData")
        if (result.recordset[0][""][1] == 1) {
          res.json(commonMsgs.AddMsg);
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

  // async addData(req, res) {
  //   try {
  //     if (!req.body.FoodId) res.json(commonMsgs.NullMsg);
  //     else {
  //       checkDataExist(req.body, async (response) => {
  //         if (response.length > 0) {
  //           res.json(commonMsgs.DuplicateRecordMsg);
  //         } else {
  //           let { columnName, columnValue } = getQueryForOrderDetails(req.body);
  //           if (columnValue.charAt(columnValue.length - 1) === ",") {
  //             columnValue = columnValue.substring(0, columnValue.length - 1);
  //           }
  //           if (columnName.charAt(columnName.length - 1) === ",") {
  //             columnName = columnName.substring(0, columnName.length - 1);
  //           }
  //           const pool = await poolPromise;
  //           await pool.query(
  //             `INSERT INTO AddOnsMap(${columnName}) VALUES${columnValue}`
  //           );
  //           res.json(commonMsgs.AddMsg);
  //         }
  //       })
  //     }
  //   } catch (error) {
  //     errorHandle.handleError(error, (errorRes) => {
  //       res.send(errorRes);
  //     });
  //   }
  // }

  async updateData(req, res) {
    try {
      // console.log("Request Body...", req.body);
      const { FoodId, UpdatedBy, AddOnsId } = req.body;
      if (!FoodId || !UpdatedBy || !AddOnsId) return res.json(commonMsgs.NullMsg);  
      else {
        for (let key in req.body) {
          if (req.body[key]) {
            if (req.body[key] === "AddOnsId") {
              req.body[key].join(",");
            }
          }
        }
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .input("FoodId", req.body.FoodId)
                        .input("AddOnsId", req.body.AddOnsId)
                        .input("UpdatedBy",req.body.UpdatedBy)
                        .execute("updateAddOnsMap")
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

  // async updateData(req, res) {
  //   try {
  //     // console.log("Request Body...", req.body);
  //     const { FoodId, UpdatedBy, AddOnsId } = req.body;
  //     if (!FoodId || !UpdatedBy || !AddOnsId) return res.json(commonMsgs.NullMsg);
      
  //     let queryValue = null;
  //     for (const [key, value] of Object.entries(req.body)) {
  //         queryValue == null
  //           ? (queryValue = `${key}='${value}'`)
  //           : (queryValue += `,${key}='${value}'`);
  //     }
  //     // console.log("Query...", `UPDATE AddOnsMap SET ${queryValue} WHERE FoodId=${FoodId}`)
  //       const pool = await poolPromise;
  //       await pool.query(
  //         `UPDATE AddOnsMap SET ${queryValue} WHERE FoodId=${FoodId}`
  //       );
  //       res.json(commonMsgs.updateMsg);
  //     // } 
  //     // else {
  //       // res.json(commonMsgs.DataNotFoundMsg);
  //       return;
  //     // }
  //   } catch (error) {
  //     errorHandle.handleError(error, (errorRes) => {
  //       res.send(errorRes);
  //     });
  //   }
  // }

  // async deleteData(req, res) {
  //     const { ActiveStatus, FoodId } = req.query;
  //     try {
  //         if (!FoodId || !ActiveStatus) return res.json(commonMsgs.NullMsg);
  //         const pool = await poolPromise;
  //         await pool.query(
  //             `UPDATE AddOnsMap SET ActiveStatus = '${ActiveStatus}'  WHERE FoodId = '${FoodId}'`
  //         );
  //         res.json(commonMsgs.deleteMsg);
  //     } catch (error) {
  //         errorHandle.handleError(error, (errorRes) => {
  //             res.send(errorRes);
  //         });
  //     }
  // }
}

async function getFoodName(addOns, callback){
  const pool = await poolPromise;
  async.map(addOns, (val, cb)=>{
    pool.query(`SELECT FoodName FROM FoodMaster WHERE FoodId=${val.FoodId}`,(err, res)=>{
      if(err){
        cb(err, null)
      }
      val["FoodName"]=null
      if(res.recordset.length>0){
        val["FoodName"]=res.recordset[0].FoodName
      }
      cb(null, null)
    })
    
  },(err, result)=>{
    if(err){
      return callback([]);
    }
    callback(addOns);
  });
}

async function getAddOnsData(addOns, callback){
  addOns.map((ele)=>{   
    ele.AddOnsId=ele.AddOnsId.split(',')
})

  const pool = await poolPromise;
  async.map(addOns, (val, cb)=>{
    if(val.AddOnsId.length>1){
      let temparr=[]
      async.map(val.AddOnsId, (addOnId, cb)=>{
        pool.query(`SELECT AddOnsName, AddOnsId FROM AddOns WHERE AddOnsId=${addOnId}`, (err, result)=>{
          if(err){
            cb(err, null)
          }
          temparr.push(result.recordset[0])
          val["AddOns"]=[]
          val.AddOns=temparr
          cb(null, null)
        })
      }, (err, resultOne)=>{if(err) return cb(err, null); cb(null, val)})
    }else{
      let temparr=[]
      pool.query(`SELECT AddOnsName, AddOnsId FROM AddOns WHERE AddOnsId=${val.AddOnsId}`,(err, res)=>{
        if(err){
          cb(err, null)
        }
        temparr.push(res.recordset[0])
        val["AddOns"]=[]
        val.AddOns=temparr
        cb(null, val);
      })
    }
  }, (err, result)=>{
    if(err){
      return callback("Error", err);
    }
    callback(result)
  });
}

function getQueryForOrderDetails(input) {
  var { FoodId, AddOnsId, CreatedBy } = input;
  let DetailsArray = [];
  DetailsArray = input.AddOns;
  // let colName = Object.keys(input);
  let columnValue = "";
  // UpdatedBy ? "," + UpdatedBy : "";
  let changeToString="";
  AddOnsId.forEach((e)=>{changeToString+=e+","});
  if (changeToString.charAt(changeToString.length - 1) === ",") {
    changeToString = changeToString.substring(0, changeToString.length - 1);
  }
  let columnName = "";
  columnName=`FoodId, AddOnsId, CreatedBy`
  columnValue=`( ${FoodId}, '${changeToString}', ${CreatedBy})`
  // columnName="(" +FoodId+"," +AddOnsId+","+"," +CreatedBy+","+"," +UpdatedBy+","+  ")"
  // columnValue += "(" +  FoodId + "," +  "'" +changeToString +"'" + (CreatedBy ? "," + CreatedBy : "") +   (UpdatedBy ? "," + UpdatedBy : "") + "),";
  // for (let i = 0; i < AddOnsId.length; i++) {
    // columnValue += "(" +  FoodId + "," +  AddOnsId[i] + (CreatedBy ? "," + CreatedBy : "") +   (UpdatedBy ? "," + UpdatedBy : "") + "),";
  // }

  // let columnName = "";
  // colName.forEach((element) => {
  //   columnName += element + ",";
  // });
  return { columnName, columnValue };
}

async function checkDataExist(input, callback) {
  const pool = await poolPromise;
  const result = await pool
  .request()
  .query(
      `SELECT AddOnsMap.FoodId FROM AddOnsMap WHERE FoodId=${input.FoodId}`
  );
  callback(result.recordset);
}

const addOnsMap = new addOnsMapController();

module.exports = addOnsMap;
