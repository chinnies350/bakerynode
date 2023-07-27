const errorHandle = require("../services/errorHandler");
const commonMsgs = require("../CommonMsg.json");
const utilityFile = require("../utility");
const { poolPromise, sql } = require("../db");
var API_Service = require("../services/API_services");
var async = require("async");

class UserRightsController {
  async getAllMenuOption(req, res) {
    try {
        const pool = await poolPromise;
        let result = await pool
                        .request()
                        .execute("getAllMenuOption")
        if (result.recordset[0].mainData!=null){
          res.json({status: true, data:JSON.parse(result.recordset[0].mainData)})

        }
        else{
          res.json({status: true, data:"No records Found!"})
        }
     
    } 
    catch (error) {
      errorHandle.handleError(error, errorRes => {
        res.send(errorRes);
      });
    }
  }
  // async getAllMenuOption(req, res) {
  //   try {
  //     const pool = await poolPromise;
  //     pool.query(
  //       `SELECT ConfigurationMaster.ConfigId AS MenuId,ConfigurationMaster.ConfigName AS MenuName FROM ConfigurationMaster,ConfigurationType WHERE ConfigurationType.TypeId=ConfigurationMaster.TypeId AND ConfigurationType.TypeName='Menu Option'`,
  //       function(err, result) {
  //         if (result.recordset.length > 0) {
  //           res.json({ status: true, data: result.recordset });
  //         } else {
  //           res.json({ status: true, data: "No records Found!" });
  //         }
  //       }
  //     );
  //   } catch (error) {
  //     errorHandle.handleError(error, errorRes => {
  //       res.send(errorRes);
  //     });
  //   }
  // }

  async getAllUserRightsData(req, res) {
    let apiService = new API_Service();
    apiService.CMCommonReport(req.query.RestaurantId, async resName => {
      // statically declared api response because api is not working
      // console.log("resName =>",resName);
      resName =
        resName == null
          ? [
              {
                UserId: 1176,
                EmpName: "Murali"
              }
            ]
          : resName;
      if (resName != null) {
        poolPromise
          .then(pool => {
            pool.query(
              `SELECT RoleAccessId,UserId,MenuId,Rights,EditRights,DeleteRights,ViewRights,UpdateRights,ImportRights,ConfigName FROM UserRights,ConfigurationMaster,ConfigurationType WHERE ConfigurationType.TypeId=ConfigurationMaster.TypeId AND ConfigurationType.TypeName='Menu Option' AND ConfigId=MenuId`,
              (error, result) => {
                // console.log("result @@@@",result);
                if (error)
                  errorHandle.handleError(error, errorRes => {
                    res.send(errorRes);
                  });
                else {
                  let asyncArr = [],
                    resultArr = [];
                  pool.query(
                    `SELECT MAX(UserId) as UserId FROM UserRights GROUP BY UserId`,
                    (err, userlist) => {
                      for (
                        let index = 0;
                        index < userlist.recordset.length;
                        index++
                      ) {
                        append(userlist.recordset[index], index);
                      }

                      function append(elem, index) {
                        asyncArr.push(cb => {
                          let obj = resName.filter((value) => {
                          
                            return value.UserId === elem.UserId
                          });

                          // console.log("Obj+++", obj)
                          // let obj = resName.filter(
                          //   value => value.UserId == elem.UserId
                          // );
                          utilityFile.UserRightsRemoveDuplicates(
                            result.recordset,
                            obj,
                            response => {
                              response != null
                                ? resultArr.push(response)
                                : null;
                              cb(null, null);
                            }
                          );
                        });
                      }
                      async.parallel(asyncArr, async (error, result) => {
                        if (error) throw error;
                        else {
                          res.json({
                            status: true,
                            data: resultArr
                          });
                        }
                      });
                    }
                  );
                }
              }
            );
          })
          .catch(error => {
            errorHandle.handleError(error, errorRes => {
              res.send(errorRes);
            });
          });
      } else res.json({ status: true, data: "No users Found!" });
    });
    // }
  }

  async getUserRightsDataByUserId(req, res) {
    try {
      if (req.query.EmpId) {
        let apiService = new API_Service();
        apiService.CMCommonReport(req.query.RestaurantId, async resName => {
          resName =
            resName == null
              ? [
                  {
                    UserId: 1176,
                    EmpName: "Rajesh"
                  }
                ]
              : resName;
          try {
            
            if (resName != null) {
              const pool = await poolPromise;
              let result = await pool.query(
                `                
                SELECT RoleAccessId,UserId,MenuId,Rights,EditRights,DeleteRights,ViewRights,UpdateRights,ImportRights,ConfigName 
                FROM UserRights,ConfigurationMaster,ConfigurationType 
                WHERE UserId='${req.query.EmpId}' 
                AND ConfigurationType.TypeId=ConfigurationMaster.TypeId 
                AND ConfigurationType.TypeName='Menu Option' AND ConfigId=MenuId
                `
              );
              if (result.recordset.length > 0) {
                let obj = resName.filter((value) => {
                  
                  return value.UserId == req.query.EmpId
                });
                
                utilityFile.UserRightsRemoveDuplicates(
                  result.recordset,
                  obj,
                  response => {
                    res.json({ status: true, data: response });
                  }
                );
              } else {
                res.json({ status: true, data: "No records Found!" });
              }
            } else throw "No users found!";
          } catch (error) {
            errorHandle.handleError(error, errorRes => {
              res.send(errorRes);
            });
          }
        });
      } else throw "Please provide EmpId!.";
    } catch (error) {
      errorHandle.handleError(error, errorRes => {
        res.send(errorRes);
      });
    }
  }

  async addData(req, res) {
    try {
      if (req.body.EmpId && req.body.MenuId && req.body.Rights) {
        const pool = await poolPromise;
        let menuList = String(req.body.MenuId).includes("~")
            ? req.body.MenuId.split("~")
            : //123~124~125
              //Y~N~
              [req.body.MenuId],
          rightsList = String(req.body.Rights).includes("~")
            ? req.body.Rights.split("~")
            : [req.body.Rights];
        let resultMap = menuList.map(async (value, index) => {


          const result = await pool
            .request()
            .input("UserId", req.body.UserId)
            .input("MenuId", value)
            .input("Rights", rightsList[index])
            .input("EditRights", req.body.EditRights)
            .input("DeleteRights", req.body.DeleteRights)
            .input("ViewRights", req.body.ViewRights)
            .input("UpdateRights", req.body.UpdateRights)
            .input("ImportRights", req.body.ImportRights)
            .input("CreatedBy", req.body.CreatedBy)
            .input("UpdatedBy", req.body.UpdatedBy)

            .query(
              `IF NOT EXISTS (SELECT * FROM UserRights WHERE UserId=@UserId AND MenuId=@MenuId) INSERT INTO UserRights (CreatedBy,UserId,MenuId,Rights,EditRights,DeleteRights,ViewRights,UpdateRights,ImportRights,UpdatedBy) VALUES (@CreatedBy,@UserId,@MenuId,@Rights,@EditRights,@DeleteRights,@ViewRights,@UpdateRights,@ImportRights,@UpdatedBy); IF EXISTS (SELECT * FROM UserRights WHERE UserId=@UserId AND MenuId=@MenuId) UPDATE UserRights SET UserId=@UserId,MenuId=@MenuId,Rights=@Rights,EditRights=@EditRights,DeleteRights=@DeleteRights,ViewRights=@ViewRights,UpdateRights=@UpdateRights,ImportRights=@ImportRights,UpdatedBy=@UpdatedBy  WHERE UserId = @UserId AND MenuId= @MenuId`
            );
          resultMap.push(result);
        });
        // Promise.all(resultMap).then(arrayOfResponses => {
        res.json(commonMsgs.AddMsg);
        // });
      } else throw "Please fill all the details!";
    } catch (error) {
      errorHandle.handleError(error, errorRes => {
        res.send(errorRes);
      });
    }
  }
  
  async updateData(req, res) {
    try {

      if (req.body.EmpId && req.body.MenuId) {
        const pool = await poolPromise;
        let objArr = utilityFile.removeEmptyObjects(req.body);
       
        let queryValue = null;
        let menuList = String(req.body.MenuId).includes("~")
            ? req.body.MenuId.split("~")
            : [req.body.MenuId],
          rightsList = String(req.body.Rights).includes("~")
            ? req.body.Rights.split("~")
            : [req.body.Rights];
        let resultMap = menuList.map(async (value1, index) => {
          queryValue = null;
          for (const [key, value] of Object.entries(objArr)) {
                      if (key != "RoleAccessId" && key != "EmpId") {
              if (key != "MenuId" && key != "Rights")
                queryValue == null
                  ? (queryValue = `${key}=@${key}`)
                  : (queryValue += `,${key}=@${key}`);
              else if (key == "MenuId")
                queryValue == null
                  ? (queryValue = `${key}=${value1}`)
                  : (queryValue += `,${key}=${value1}`);
              else if (key == "Rights")
                queryValue += `,${key}= '${rightsList[index]}'`;
            }
          }
                //  console.log("User query =>",`UPDATE UserRights SET ${queryValue}  WHERE UserId = @UserId AND MenuId= @MenuId`);
          const result = await pool
            .request()
            .input("UserId", req.body.UserId)
            .input("MenuId", value1)
            .input("Rights", rightsList[index])
            .input("EditRights", req.body.EditRights)
            .input("DeleteRights", req.body.DeleteRights)
            .input("ViewRights", req.body.ViewRights)
            .input("UpdateRights", req.body.UpdateRights)
            .input("ImportRights", req.body.ImportRights)
            .input("UpdatedBy", req.body.UpdatedBy)
            .query(
                       `UPDATE UserRights SET ${queryValue}  WHERE UserId = @UserId AND MenuId= @MenuId `
            );
          resultMap.push(result);
        });

        Promise.all(resultMap).then(arrayOfResponses => {
          res.json({ status: true, message: "Data updated successfully." });
        });
      } else throw "Please fill RoleAccessId!";
    } catch (error) {
      errorHandle.handleError(error, errorRes => {
        res.send(errorRes);
      });
    }
  }

 
}

const userRights = new UserRightsController();

module.exports = userRights;
