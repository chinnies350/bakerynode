module.exports.removeEmptyObjects = objInput => {
  let obj = {};
  for (const [key, value] of Object.entries(objInput)) {
    if (value != null && value != "") {
      obj[key] = value;
    }
  }
  return obj;
};

module.exports.addUOM = async (inputArr, pool, cb) => {
  for await (let [index, value] of inputArr.entries()) {
    let queryRes = await pool.request()
      .query(`SELECT configurationmaster.ConfigName as UOMName From ItemMaster, configurationmaster,ConfigurationType WHERE  ConfigurationType.TypeName='Unit of Measure' 
        AND configurationmaster.TypeId=ConfigurationType.TypeId AND configurationmaster.ConfigId=${value.UOM}`);
    inputArr[index] = await {
      ...value,
      UOMName: queryRes.recordset[0].UOMName
    };

    if (index == inputArr.length - 1) {
      cb(inputArr);
    }
  }
};

module.exports.getInsertQueryModified = req => {
  let ColNameQuery = "",
    ColValueQuery = "";
  if (!req) return;
  for (let key in req) {
    if (req[key]) {
      ColNameQuery += `${ColNameQuery != `` ? `,` : ``}${key}`;
      ColValueQuery += `${ColValueQuery != `` ? `,` : ``} '${req[key]}'`;
    } else if (
      (key == "FoodVarietyId" ||
        key == "WaiterId" ||
        key == "Tariff" ||
        key == "NetTariff" ||
        key == "BuffetId" ||
        key == "ComplementaryId") &&
      req[key] == ""
    ) {
      ColNameQuery += `${ColNameQuery != `` ? `,` : ``}${key}`;
      ColValueQuery += `${ColValueQuery != `` ? `,` : ``} NULL`;
    } else if (key == "BookedChairs" || key == "TableId") {
      req[key] = req[key].join(",");
      ColNameQuery += `${ColNameQuery != `` ? `,` : ``}${key}`;
      ColValueQuery += `${ColValueQuery != `` ? `,` : ``} '${req[key]}'`;
    }
  }
  return { ColNameQuery, ColValueQuery };
};

module.exports.getAddQuery = async (req, includeArr = []) => {
  let ColNameQuery = "",
    ColValueQuery = "";
  if (!req) return;
  for (let key in req) {
    if (includeArr.length != 0) {
      if (includeArr.includes(key)) {
        if (req[key]) {
          ColNameQuery += `${ColNameQuery != `` ? `,` : ``}${key} `;
          ColValueQuery += `${ColValueQuery != `` ? `,` : ``} '${req[key]}'`;
        }
      }
    } else {
      if (req[key]) {
        ColNameQuery += `${ColNameQuery != `` ? `,` : ``}${key} `;
        ColValueQuery += `${ColValueQuery != `` ? `,` : ``} '${req[key]}'`;
      }
    }
  }
  return { ColNameQuery, ColValueQuery };
};

module.exports.getUpdateQuery = async (req, excludeArr = []) => {
  let queryValue = null;
  for (const [key, value] of Object.entries(req)) {
    if (!excludeArr.includes(key))
      queryValue == null
        ? (queryValue = `${key}='${value}'`)
        : (queryValue += `,${key}='${value}'`);
  }
  return { queryValue };
};

function hash(arr, cb) {
  var deptHash = {};
  for (var i = 0; i < arr.length; i++) {
    deptHash[arr[i].ConfigId] = arr[i].ConfigName;
    if (arr.length - 1 == i) {
      cb(deptHash);
    }
  }
}

module.exports.namesOfItemMaster = (itemMastData, configData, cb) => {
  var resData = [];
  hash(configData, async hashData => {
    for (var i = 0; i < itemMastData.length; i++) {
      if (
        hashData.hasOwnProperty(itemMastData[i].ItemType) &&
        hashData.hasOwnProperty(itemMastData[i].UOM)
      ) {
        let tempObj = itemMastData[i];
        itemMastData[i]["ItemTypeName"] = hashData[itemMastData[i].ItemType];
        itemMastData[i]["UOM Name"] = hashData[itemMastData[i].UOM];
        await resData.push(tempObj);
      }
      if (itemMastData.length - 1 == i) {
        cb(resData);
      }
    }
  });
};

// Helper Funtions that are not used in restaurant

function getMultipleQueryValues(queryArr) {
  const newArr = queryArr.reduce(function(a, b) {
    return a.map(function(v, i) {
      return v + `,${b[i]}`;
    });
  });
  return Array.from(
    newArr.map(arr => {
      return `(${arr})`;
    })
  ).join(",");
}

function arrangeNames(deptData, configData, cb) {
  var resData = [];
  hash(configData, hashData => {
    for (var i = 0; i < deptData.length; i++) {
      if (
        hashData.hasOwnProperty(deptData[i].Department) &&
        hashData.hasOwnProperty(deptData[i].Designation)
      ) {
        let tempObj = deptData[i];
        deptData[i]["Department"] = hashData[deptData[i].Department];
        deptData[i]["Designation"] = hashData[deptData[i].Designation];
        resData.push(tempObj);
      }
      if (deptData.length - 1 == i) {
        cb(resData);
      }
    }
  });
}

async function allTourDetailsFound(arrayInput, pool, req, cb) {
  let allTourRes = arrayInput.map(async (value, index) => {
    let TourResult = value;
    // finding gallery details based on TourPackageId
    let result = await pool.query(
      `select GalleryId,ImageLink from TourGallery WHERE TourGallery.TourPackageId=${value.TourPackageId} AND TourGallery.ActiveStatus='A'`
    );
    TourResult["Gallery"] = result.recordset;

    result = await pool.query(
      `select AVG(FeedbackRating) as Rating from TourFeedBack where TourPackageId = ${value.TourPackageId}`
    );
    TourResult["AvgFeedbackRating"] = result.recordset[0].Rating;
    // finding tax details
    result = await pool.query(
      `select TaxId, TaxDescription, TaxPercentage,convert(varchar,EffectiveFrom,121) as EffectiveFrom,convert(varchar,EffectiveTill,121) as EffectiveTill from TaxMaster where ServiceName='Tour' AND ActiveStatus = 'A' AND '${req.query.CheckinDate}' BETWEEN EffectiveFrom AND EffectiveTill`
    );
    TourResult["TaxDetails"] = result.recordset;
    let tariffDates = await pool
      .request()
      .query(
        `select convert(varchar,SeasonStart,121) as SeasonStart,convert(varchar,SeasonEnd,121) as SeasonEnd,TariffTypeName,VehicleType,AdultTariff,ChildTariff From TariffMaster,TariffType  Where TariffMaster.TariffTypeId=TariffType.TariffTypeId AND TariffMaster.TourPackageId=TariffType.TourPackageId AND TariffMaster.TourPackageId=${value.TourPackageId} AND '${req.query.CheckinDate}' BETWEEN   SeasonStart AND SeasonEnd`
      );
    TourResult["TariffDetails"] = tariffDates.recordset;
    if (tariffDates.recordset.length > 0) {
      result = await pool
        .request()
        .query(
          `select SUM(NoOfAdult) as NoOfAdult,SUM(NoOfChild) as NoOfChild from BookingHdr Where TourPackageId=${value.TourPackageId} AND '${req.query.CheckinDate}' BETWEEN   '${tariffDates.recordset[0].SeasonStart}' AND '${tariffDates.recordset[0].SeasonEnd}'`
        );
      let NoOfAdult =
          result.recordset[0].NoOfAdult != null
            ? Number(result.recordset[0].NoOfAdult)
            : 0,
        NoOfChild =
          result.recordset[0].NoOfChild != null
            ? Number(result.recordset[0].NoOfChild)
            : 0;
      if (NoOfAdult < value.MaxAdult) {
        if (NoOfChild < value.MaxChild) {
          TourResult["AvailableSeats"] = {
            Adults: value.MaxAdult - result.recordset[0].NoOfAdult,
            Childs: value.MaxChild - result.recordset[0].NoOfChild
          };
          return TourResult;
        } else {
          TourResult["AvailableSeats"] = {
            Adults: value.MaxAdult - result.recordset[0].NoOfAdult,
            Childs: 0
          };
          return TourResult;
        }
      }
      return null;
    }
    return null;
  });
  Promise.all(allTourRes).then(arrayOfResponses => {
    let result = arrayOfResponses.filter(value => value != null);
    cb(result);
  });
}

async function createBookId(req) {
  var resData = {
    status: false,
    value: "",
    message: ""
  };
  const pool = await poolPromise;
  var bookingId = "";
  if (
    req.BookingMedia == "DW" ||
    req.BookingMedia == "DA" ||
    req.BookingMedia == "DI" ||
    req.BookingMedia == "WP" ||
    req.BookingMedia == "AP"
  ) {
    // Department booking
    let initiate = "1";
    let count = await pool
      .request()
      .query(
        `SELECT MAX(BookingHdr.BookingId) FROM BookingHdr WHERE (BookingMedia='DW' OR BookingMedia='DA' OR BookingMedia='DI' OR BookingMedia='WP' OR BookingMedia='AP') AND BookingHdr.TourPackageId=${req.TourPackageId}`
      );
    if (count.recordset[0][""] == 0 || count.recordset[0][""] == null) {
      // Initiate the booking id
      bookingId = String(req.TourPackageId) + "-" + initiate;
      resData.status = true;
      resData.value = bookingId;
      return resData;
    } else {
      // increment the booking id
      let maxBooking = count.recordset[0][""].split("-");
      maxBooking = Number(maxBooking[1]) + 1;
      bookingId = String(req.TourPackageId) + "-" + maxBooking;
      resData.status = true;
      resData.value = bookingId;
      return resData;
    }
  } else if (
    req.BookingMedia == "PW" ||
    req.BookingMedia == "PA" ||
    req.BookingMedia == "PI"
  ) {
    // Public booking
    let initiate = "1";
    let count = await pool
      .request()
      .query(
        `SELECT MAX(BookingHdr.BookingId) FROM BookingHdr WHERE (BookingMedia='PW' OR BookingMedia='PA' OR BookingMedia='PI')AND BookingHdr.TourPackageId=${req.TourPackageId} AND BookingHdr.CustomerId=${req.CustomerId}`
      );
    if (count.recordset[0][""] == 0 || count.recordset[0][""] == null) {
      // Initiate the booking id
      bookingId =
        String(req.TourPackageId) + String(req.CustomerId) + "-" + initiate;
      resData.status = true;
      resData.value = bookingId;
      return resData;
    } else {
      let maxBooking = count.recordset[0][""].split("-");
      maxBooking = Number(maxBooking[1]) + 1;
      bookingId =
        String(req.TourPackageId) + String(req.CustomerId) + "-" + maxBooking;
      resData.status = true;
      resData.value = bookingId;
      return resData;
    }
  } else {
    resData.message = "Please specify the correct channel name.";
    return resData;
  }
}

module.exports.getUpdateQueryModified = (req, excludeArr = []) => {
  let queryValue = null;
  for (const [key, value] of Object.entries(req)) {
    if (!excludeArr.includes(key))
      if (
        ![
          "RestaurantId",
          "OrderId",
          "OrderHeaderSl",
          "OrderSl",
          "FoodName",
          "FoodVarietyName",
          "SoftDrinkName",
          "SoftDrinkQuantityName",
          "WaiterName",
          "OrderDetails",
          "GSTIN",
          "OrderTime",
          "RestaurantName",
          "SoftDrinkDetails",
          "BuffetName",
          "ComplementaryName"
        ].includes(key)
      ) {
        if (
          !(
            (key == "FoodVarietyId" ||
              key == "WaiterId" ||
              key == "Tariff" ||
              key == "NetTariff" ||
              key == "GuestName" ||
              key == "GuestMobile" ||
              key == "CustomerGSTNo" ||
              key == "HotelOrderId" ||
              key == "HotelRoomNo" ||
              key == "PaymentType" ||
              key == "ServedTime" ||
              key == "BuffetId") &&
            value == null
          )
        ) {
          queryValue == null
            ? (queryValue = `${key}='${value}'`)
            : (queryValue += `,${key}='${value}'`);
        }
      }
  }
  return { queryValue };
};

module.exports.UserRightsRemoveDuplicates = (array, obj, cb) => {
  
  let objRes = {
    EmpId: null,
    UserId:null,
    MenuArray: [],
    EditRights: null,
    DeleteRights: null,
    ViewRights: null,
    UpdateRights: null,
    ImportRights: null,
  };
  if (obj.length > 0) {
    array.map(async (value, index) => {
      if (value.UserId == obj[0].UserId) {
        objRes.EmpId = obj.length > 0 ? obj[0].EmpId : null;
        objRes.UserId = obj.length > 0 ? obj[0].UserId : null;
        objRes.EditRights = value.EditRights;
        objRes.DeleteRights = value.DeleteRights;
        objRes.ViewRights = value.ViewRights;
        objRes.UpdateRights = value.UpdateRights;
        objRes.ImportRights = value.ImportRights;
        objRes.MenuArray.push({
          RoleAccessId: value.RoleAccessId,
          MenuId: value.MenuId,
          MenuName: value.ConfigName,
          Rights: value.Rights,
        });
        objRes.MenuArray.sort((a, b) => a.MenuId > b.MenuId ? 1 : -1);
      }

      if (index == array.length - 1) {
        objRes = {
          EmpName: obj.length > 0 ? obj[0].EmpName : null,
          ...objRes,
        };
        cb(objRes);
      }
    });
  } else cb(null)
};