const sql = require("mssql");
//Import the mongoose module
const mongoose = require("mongoose");

const MSSQL_config = require("./config.json").MSSQL;

var config = MSSQL_config;

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then((pool) => {
    console.log("Connected to MSSQL");
    return pool;
  })
  .catch((err) => console.log("Database Connection Failed! Bad Config: ", err));

// mongoose
//   .connect("mongodb://127.0.0.1/FireBaseNotifications", {
//     useNewUrlParser: true,
//     useFindAndModify: false,
//     useUnifiedTopology: true,
//   })
//   .then(() => {
//     console.log(`MongoDb connected on port 127.0.0.1`);
//   })
//   .catch((err) => {
//     console.log("Unable to connect database", err);
//   });

module.exports = {
  sql,
  poolPromise,
};