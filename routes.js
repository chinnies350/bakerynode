const router = require("express").Router();

const BookingTypeMaster = require("./Controllers/bookingTypeMaster");
const ShiftMaster = require("./Controllers/shiftMaster");
const OfferMaster = require("./Controllers/offerMaster");
const UserRights = require("./Controllers/userRights");
const VendorMaster = require("./Controllers/vendorMaster");
const ItemMaster = require("./Controllers/itemMaster");
const TaxMaster = require("./Controllers/taxMaster");
const ItemPurHdr_Dtl = require("./Controllers/itemPurHdr_Dtl");
const ItemIssHdr_Dtl = require("./Controllers/itemIssHdr_Dtl");
const DropDownApi = require("./Controllers/dropDownApi");
const ConfigType = require("./Controllers/configurationType");
const ConfigMaster = require("./Controllers/configMaster");
const BuffetMaster = require("./Controllers/buffetMaster");
const FoodCategoryMaster = require("./Controllers/foodCategoryMaster");
const FoodTimingMaster = require("./Controllers/foodTimingMaster");
const FoodMaster = require("./Controllers/foodMaster");
const FoodQuantityMaster = require("./Controllers/foodQuantityMaster");
const DinningMaster = require("./Controllers/dinningMaster");
const DinningTableMaster = require("./Controllers/dinningTableMaster");
const AddOnsMaster = require("./Controllers/addOnsMaster");
const AddOnsMap = require("./Controllers/addOnsMap");
const RestaurantMaster = require("./Controllers/restaurantMaster");
const TariffMaster = require("./Controllers/tariffMaster");
const TariffTypeMaster = require("./Controllers/tariffTypeMaster");
const WaiterMaster = require("./Controllers/waiterMaster");
const OrderDetails = require("./Controllers/orderDetails");
const OrderHeader = require("./Controllers/orderHeader");
const RestaurantFeedBack = require("./Controllers/restaurantFeedback");
const DashBoard = require("./Controllers/dashBoardMaster");
const QrCode = require("./Controllers/qrCodeGenerator");
// const SoftDrinkMaster = require("./Controllers/softDrinkMaster");
// const SoftDrinkQuantityMaster = require("./Controllers/softDrinkQuantityMaster");
const mapFoodItemsToBar = require("./Controllers/mapFoodItemsToBarMaster");
const StockInMaster = require("./Controllers/stockInMaster");
const ComplementaryMaster = require("./Controllers/ComplementaryMaster");
const ShiftWiseStockInMaster = require("./Controllers/shiftwiseStockInMaster");
const UPIMaster = require("./Controllers/upiMaster");
const StatsMaster = require("./Controllers/statistics");
const WaiterMappingMaster = require("./Controllers/waiterMappingMaster");
const PreferenceMaster = require("./Controllers/preferenceMaster");
const AllItems = require("./Controllers/allItems");
const PreOrder=require("./Controllers/preOrderMaster");
const QuickAdd = require("./Controllers/quickAdd");
const AppSettings = require("./Controllers/appSettings");
const PackingType = require("./Controllers/packingTypeMaster");
const PrintingInstructionConfig = require("./Controllers/printingInstructionConfig");


//PrintingInstructionConfig
router.get("/getPrintingInstructionConfig", PrintingInstructionConfig.getData);
router.post("/addPrintingInstructionConfig", PrintingInstructionConfig.addData);
router.post("/addBranchPrintingInstructionConfig", PrintingInstructionConfig.addBranchData);
router.put("/updatePrintingInstructionConfig", PrintingInstructionConfig.updateData);
router.delete("/deletePrintingInstructionConfig", PrintingInstructionConfig.deleteData);

//PackingType
router.get("/getPackingType", PackingType.getData);
router.post("/addPackingType", PackingType.addData);
router.put("/updatePackingType", PackingType.updateData);
router.delete("/deletePackingType", PackingType.deleteData);

//QuickAdd
router.get("/getQuickAddData", QuickAdd.getData);
router.post("/addQuickAddData", QuickAdd.addData);
router.put("/updateQuickAddData", QuickAdd.updateData);
router.delete("/deleteQuickAddData", QuickAdd.deleteData);

//AppSettings
router.get("/getAppSettings", AppSettings.getData);
router.post("/addAppSettings", AppSettings.addData);
router.put("/updateAppSettings", AppSettings.updateData);

router.post("/addPreOrderData", PreOrder.addData);
router.get("/getPreOrderDeatils", PreOrder.getAllData);
router.put("/updatePreOrderData", PreOrder.updateData);


//Stats
router.get("/getOrderTypes", StatsMaster.getOrderTypes);
router.get("/getIndividualOrderTypes", StatsMaster.getIndividualOrderTypes);
router.get("/getIndividualOrdersCount", StatsMaster.getIndividualOrderCount);
router.get("/getCountAndRevenueForDates", StatsMaster.getCountAndRevenueForDates);


//AllItems
router.get("/getAllItemsData", AllItems.getData);
router.get("/getAllItemsIdData", AllItems.getAllFoodIdByRestaurantId);
router.post("/addAllItemsData", AllItems.addData);
router.put("/updateAllItemsData", AllItems.updateData);

//PreferenceMaster
router.get("/getPreferenceMasterData", PreferenceMaster.getData);
router.get("/getPreferenceMasterDataByRestaurantId", PreferenceMaster.getDataByRestaurantId);
router.post("/addPreferenceMasterData", PreferenceMaster.addData);
router.put("/updatePreferenceMasterData", PreferenceMaster.updateData);

//Dinning Master
router.get("/getBookingTypeData", BookingTypeMaster.getData);
router.get("/getBookingTypeDataByResId", BookingTypeMaster.getDataByResId);
router.post("/addBookingTypeData", BookingTypeMaster.addData);
router.put("/updateBookingTypeData", BookingTypeMaster.updateData);
router.delete("/deletebookingTypeData", BookingTypeMaster.deleteData);

//Shift Master
router.get("/getAllShiftMasterData", ShiftMaster.getAllData);
router.post("/addShiftMasterData", ShiftMaster.addData);
router.put("/updateShiftMasterData", ShiftMaster.updateData);
router.delete("/deleteShiftMasterData", ShiftMaster.deleteData);

//Offer / Discount Master
router.get("/getAllOfferMasterData", OfferMaster.getAllData);
router.get("/getOfferMasterData", OfferMaster.getOfferData);
router.post("/addOfferMasterData", OfferMaster.addData);
router.put("/updateOfferMasterData", OfferMaster.updateData);
router.delete("/deleteOfferMasterData", OfferMaster.deleteData);

//User Access Rights
router.get("/getAllMenuOption", UserRights.getAllMenuOption);
router.get("/getAllUserRightsData", UserRights.getAllUserRightsData);
router.get("/getUserRightsDataByUserId", UserRights.getUserRightsDataByUserId);
router.post("/addUserRightsData", UserRights.addData);
router.put("/updateUserRightsData", UserRights.updateData);

//Vendor Master
router.get("/getAllVendorMasterData", VendorMaster.getAllData);
router.post("/addVendorMasterData", VendorMaster.addData);
router.put("/updateVendorMasterData", VendorMaster.updateData);
router.delete("/deleteVendorMasterData", VendorMaster.deleteData);

//Item master
router.get("/getAllItemMasterData", ItemMaster.getData);
router.post("/addItemMasterData", ItemMaster.addData);
router.put("/updateItemMasterData", ItemMaster.updateData);
router.delete("/deleteItemMasterData", ItemMaster.deleteData);

//Tax Master
router.get("/getAllTaxMasterData", TaxMaster.getAllData);
router.get("/getTaxData", TaxMaster.getTaxData);
router.post("/addTaxMasterData", TaxMaster.addData);
router.put("/updateTaxMasterData", TaxMaster.updateData);
router.delete("/deleteTaxMasterData", TaxMaster.deleteData);

//Item Purchase Header AND Item Purchase Detail
router.get("/getAllItemPurHdrDtlData", ItemPurHdr_Dtl.getData);
router.post("/addItemPurHdrDtlData", ItemPurHdr_Dtl.addData);
router.put("/updateItemPurHdrDtlData", ItemPurHdr_Dtl.updateData);
router.delete("/deleteItemPurHdrDtlData", ItemPurHdr_Dtl.deleteData);

//Item Issue Header AND Iteam Issue Detail
router.get("/getAllItemIssHdrDtlData", ItemIssHdr_Dtl.getData);
router.post("/addItemIssHdrDtlData", ItemIssHdr_Dtl.addData);
router.put("/updateItemIssHdrDtlData", ItemIssHdr_Dtl.updateData);
router.delete("/deleteItemIssHdrDtlData", ItemIssHdr_Dtl.deleteData);

//Drop down api
router.get("/getAllTariffName", DropDownApi.getAllTariffNameData);
router.get("/getAllConfigMst", DropDownApi.getAllConfigMstData);
router.get("/getAllOfferName", DropDownApi.getAllOfferNameData);
router.get("/getAllVendorName", DropDownApi.getAllVendorNameData);
router.get("/getAllConfigType", DropDownApi.getAllConfigTypeData);
router.get("/getAllRestaurants", DropDownApi.getAllRestaurants);
router.get("/getAllRestaurantType", DropDownApi.getAllRestaurantType);
router.get("/getQuantityType", DropDownApi.getQuantityType);
router.get("/getItemName", DropDownApi.getItem);
router.get("/getRestaurantName", DropDownApi.getRestaurantName);
router.get("/getFoodName", DropDownApi.getFoodName);
router.get("/getCommonConfigData", DropDownApi.getCommonConfigData);

//Configuration type
router.get("/getAllConfigTypeData", ConfigType.getData);
router.post("/addConfigTypeData", ConfigType.addData);
router.put("/updateConfigTypeData", ConfigType.updateData);
router.delete("/deleteConfigTypeData", ConfigType.deleteData);

//Configuration master
router.get("/getAllConfigMasterData", ConfigMaster.getData);
router.get("/getConfigMaster", ConfigMaster.getSingleData);
router.post("/addConfigMasterData", ConfigMaster.addData);
router.put("/updateConfigMasterData", ConfigMaster.updateData);
router.delete("/deleteConfigMasterData", ConfigMaster.deleteData);

//Buffet Master
router.get("/getBuffetData", BuffetMaster.getData);
router.get("/getAllBuffetData", BuffetMaster.getAllBuffetData);
router.get("/getAllBuffetDataByResId", BuffetMaster.getAllBuffetDataByResId);
router.post("/addBuffetData", BuffetMaster.addData);
router.put("/updateBuffetData", BuffetMaster.updateData);
router.delete("/deleteBuffetData", BuffetMaster.deleteData);

//FoodTimingMaster
router.get("/getFoodTimingData", FoodTimingMaster.getData);
router.get(
  "/getAllFoodTimingDataByResId",
  FoodTimingMaster.getAllFoodTimingDataByResId
);
// router.get("/getAllFoodData", FoodMaster.getAllFoodData);
router.get("/getAllFoodSingleData", FoodMaster.getAllFoodSingleData);
router.post("/addFoodTimingData", FoodTimingMaster.addData);
router.put("/updateFoodTimingData", FoodTimingMaster.updateData);
router.delete("/deleteFoodTimingData", FoodTimingMaster.deleteData);

//Food Category Master
router.get("/getFoodCategoryData", FoodCategoryMaster.getData);
// router.get("/getAllFoodCategoryDataByResId", FoodCategoryMaster.getAllDataByResId);
router.get("/getFoodCategoryDataByResId", FoodCategoryMaster.getDataByResId);
router.get("/getDataByCategoryTypeId", FoodCategoryMaster.getDataByCategoryTypeId);
router.post("/addFoodCategoryData", FoodCategoryMaster.addData);
router.put(
  "/updateFoodCategoryData",
  FoodCategoryMaster.updateFoodCategoryData
);
router.delete("/deleteFoodCategoryData", FoodCategoryMaster.deleteData);

//Food Master

router.get("/getOthersFoodNameByFoodCategoryId",FoodMaster.getOthersFoodNameByFoodCategoryId);
router.get("/getFoodData", FoodMaster.getData);
router.get("/getFoodDataByResId", FoodMaster.getDataByResId);
router.get("/getAllFoodData", FoodMaster.getAllFoodData);
router.get(
  "/getAllFoodDataByFoodCategoryId",
  FoodMaster.getAllFoodDataByFoodCategoryId
);
router.get(
  "/getFoodDataByFoodCategoryId",
  FoodMaster.getFoodDataByFoodCategoryId
);
router.get(
  "/getFoodQuantityByFoodId",
  FoodMaster.getFoodQuantityByFoodId
);
router.get(
  "/getFoodDataByFoodName",
  FoodMaster.getFoodDataByFoodName
);

router.post("/addFoodData", FoodMaster.addData);
router.put("/updateFoodData", FoodMaster.updateData);
router.delete("/deleteFoodData", FoodMaster.deleteData);

//Food Quantity Master
router.get("/getFoodQuantityData", FoodQuantityMaster.getData);
router.get("/getAllFoodQuantityData", FoodQuantityMaster.getAllData);
router.get("/getQuantityDataByFoodId", FoodQuantityMaster.getQuantityDataByFoodId);
router.get("/getAllQuantityDataByFoodId", FoodQuantityMaster.getAllQuantityDataByFoodId);
router.get(
  "/getFoodQuantityDataByResId",
  FoodQuantityMaster.getFoodQuantityDataByResId
);
router.get(
  "/getFoodQuantityDataBySingleResId",
  FoodQuantityMaster.getFoodQuantityDataBySingleResId
);
router.get("/getAvailableStock", FoodQuantityMaster.getAvailableStock);
router.get("/getTariffByFoodId", FoodQuantityMaster.getTariffByFoodId);
router.post("/addFoodQuantityData", FoodQuantityMaster.addData);
router.post("/addFoodQuantitySingleData", FoodQuantityMaster.addSingleData);
router.put("/updateSingleData", FoodQuantityMaster.updateSingleData);
router.put("/updateFoodQuantityData", FoodQuantityMaster.updateData);
router.delete("/deleteFoodQuantityData", FoodQuantityMaster.deleteData);

//Dinning Table Master
router.get("/getAllDinningTableData", DinningTableMaster.getAllData);
router.get(
  "/getDinningTableDataByResId",
  DinningTableMaster.getDinningTableDataByResId
);
router.get("/getDinningTableData", DinningTableMaster.getData);
router.get(
  "/getDinningTableDataByDinningId",
  DinningTableMaster.getDataByDinningId
);
router.get("/getTableStatus", DinningTableMaster.getTableStatus);
router.post("/addDinningTableData", DinningTableMaster.addData);
router.put("/updateDinningTableData", DinningTableMaster.updateData);
router.delete("/deleteDinningTableData", DinningTableMaster.deleteData);

//Dinning Master
router.get("/getDinningData", DinningMaster.getData);
router.get("/getDinningDataByResId", DinningMaster.getDataByResId);
router.post("/addDinningData", DinningMaster.addData);
router.put("/updateDinningData", DinningMaster.updateData);
router.delete("/deleteDinningData", DinningMaster.deleteData);

//Add Ons Master
router.get("/getAddOnsData", AddOnsMaster.getData);
router.get("/getAllAddOnsDataByResId", AddOnsMaster.getAllAddOnsDataByResId);
router.post("/addAddOnsData", AddOnsMaster.addData);
router.put("/updateAddOnsData", AddOnsMaster.updateData);
router.delete("/deleteAddOnsData", AddOnsMaster.deleteData);

//Add Ons Map
router.get("/getAddOnsMapData", AddOnsMap.getDataByFoodId);
router.get("/getAllAddOnsData", AddOnsMap.getAllAddOnsData);
router.post("/addAddOnsMapData", AddOnsMap.addData);
router.post("/updateAddOnsMap", AddOnsMap.updateData);
// router.delete("/deleteAddOnsMapData", AddOnsMap.deleteData);

//Restaurant Master
router.get("/getRestaurant", RestaurantMaster.getData);
router.get("/getAllRestaurant", RestaurantMaster.getAllRestaurant);
router.post("/addRestaurant", RestaurantMaster.addData);
router.put("/updateRestaurant", RestaurantMaster.updateData);
router.delete("/deleteRestaurant", RestaurantMaster.deleteData);

//Tariff Master
router.get("/getAllTariffMasterData", TariffMaster.getAllData);
// router.get("/getTariffDataByFoodId", TariffMaster.getTariffDataByFoodId);
router.post("/addTariffMasterData", TariffMaster.addData);
router.put("/updateTariffMasterData", TariffMaster.updateData);
router.delete("/deleteTariffMasterData", TariffMaster.deleteData);

//Tariff Type master
router.get("/getAllTariffTypeData", TariffTypeMaster.getAllData);
router.post("/addTariffTypeData", TariffTypeMaster.addData);
router.put("/updateTariffTypeData", TariffTypeMaster.updateData);
router.delete("/deleteTariffTypeData", TariffTypeMaster.deleteData);

//Waiter master
router.get("/getAllWaiters", WaiterMaster.getData);
router.post("/addWaiter", WaiterMaster.addData);
router.post("/updateWaiterDetails", WaiterMaster.updateData);
router.delete("/deleteWaiter", WaiterMaster.deleteData);
router.get("/getWaitersBasedOnShift", WaiterMaster.getWorkersShift);
// router.get("/getOrdersBasedOnWaiterId", WaiterMaster.getOrdersBasedOnWaiterId);

//Order Header
router.get("/getHoldData", OrderHeader.getHoldDate);
router.get("/getOrderHeaderDetails", OrderHeader.getAllData);
router.get("/getDataOnBookingStatus", OrderHeader.getDataOnBookingStatus);
router.get("/getClosedData", OrderHeader.getClosedData);
router.get("/getAllStatus", OrderHeader.getAllStatus);
router.get("/getDateWiseSales", OrderHeader.getDateWiseSales);
router.get("/getRoomLinkedOrders", OrderHeader.getRoomLinkedOrders);
router.get("/getHotelOrders", OrderHeader.getHotelOrders);
router.post("/addOrderHeaderDetails", OrderHeader.addData);
router.post("/updateOrderDetails", OrderHeader.updateOrder)
router.put("/updateOrderHeader", OrderHeader.updateOrderHeader);
router.put("/updateTableStatus", OrderHeader.updateTableStatus);
router.put("/updateBookingStatus", OrderHeader.updateBookingStatus);
router.put("/updatePrintStatus", OrderHeader.updatePrintStatus);
router.put("/cancelOrderHeader", OrderHeader.cancelOrderHeader);
router.put("/deleteMultipleOrders", OrderHeader.deleteMultipleHoldData);
router.delete("/deleteHoldData", OrderHeader.deleteHoldData);

//Order Details
router.get("/getOrderDetails", OrderDetails.getAllData);
router.get("/getOrderDetailsByOrderId", OrderDetails.getOrderDetailsByOrderId);
router.get(
  "/getDateAndStatuswiseOrderDetails",
  OrderDetails.getDateAndStatusSpecificData
);
router.get(
  "/getDateAndStatuswiseOrderDetailsV2",
  OrderDetails.getDateAndStatusSpecificDataV2
);
router.get("/getOrderDetailsbyOrderHeaderSl", OrderDetails.getOrderDetailsbyOrderHeaderSl);
router.get("/getOrderDataByWaiterId", OrderDetails.getOrderDataByWaiterId);
router.get("/getAllPaymentPendingData", OrderDetails.getAllPaymentPendingData);
router.get("/getDatewiseOrderDetails", OrderDetails.getDateSpecificData);
router.get("/getDateWiseItemSales", OrderDetails.getDateWiseItemSales);
router.put("/updateOrderDetails", OrderDetails.updateOrderDetails);
router.put("/cancelOrderDetails", OrderDetails.cancelOrderDetails);
router.put("/updateOrderQuantity", OrderDetails.updateOrderQuantity);

// DashBoard
// router.get("/getSAdminDashBoardData", DashBoard.getData);
router.get("/getAdminDashBoardData", DashBoard.getRestaurantAndAmountByDate);

//Restaurant Feed Back
router.get("/getAllRestaurantFeedBackData", RestaurantFeedBack.getAllData);
router.post("/addRestaurantFeedBackData", RestaurantFeedBack.addData);

//QR Code Generator
router.get("/getDinningDataByRestaurantd", QrCode.getDinningDataByRestaurantd);
router.get("/getTableIdByDinningId", QrCode.getTableIdByDinningId);

// //Soft Drink Master
// router.get("/getAllSoftDrink", SoftDrinkMaster.getData);
// router.get("/getSoftDrinkData", SoftDrinkMaster.getSoftDrinkData);
// router.post("/addSoftDrinkData", SoftDrinkMaster.addData);
// router.put("/updateSoftDrinkData", SoftDrinkMaster.updateData);
// router.delete("/deleteSoftDrinkData", SoftDrinkMaster.deleteData);

//Soft Drink Quantity Master
// router.get(
//   "/getSoftDrinkQuantityDataByResId",
//   SoftDrinkQuantityMaster.getSoftDrinkQuantityDataByResId
// );
// router.post("/addSoftDrinkQuantityData", SoftDrinkQuantityMaster.addData);
// router.put("/updateSoftDrinkQuantityData", SoftDrinkQuantityMaster.updateData);
// router.delete(
//   "/deleteSoftDrinkQuantityData",
//   SoftDrinkQuantityMaster.deleteData
// );

//Map Food Items to Bar
router.get("/getAllFoodItems", mapFoodItemsToBar.getAllFoodItems);
router.post("/addFoodItemsData", mapFoodItemsToBar.addData);
router.put("/updateFoodItems", mapFoodItemsToBar.updateData);
router.delete("/deleteFoodItems", mapFoodItemsToBar.deleteData);

//StockInMaster
router.get("/getStockInMasterData", StockInMaster.getData);
router.get("/getQuatitybyId",StockInMaster.getQuantity);
router.get("/getActualRate", StockInMaster.getActualRate);
router.get(
  "/getStockInMasterDataByResId",
  StockInMaster.getStockInMasterDataByResId
);
router.post("/addStockinMasterData", StockInMaster.addData);
router.put("/updateStockInMasterData", StockInMaster.updateData);

//Complementary Master
router.get("/getComplementaryData", ComplementaryMaster.getData);
router.get("/getAllComplementaryData", ComplementaryMaster.getAllData);
router.get("/getAllDataFromComplementaryMaster", ComplementaryMaster.getAllDataFromComplementaryMaster);
router.post("/addComplementaryData", ComplementaryMaster.addData);
router.put("/updateComplementaryData", ComplementaryMaster.updateData);
router.delete("/deleteComplementaryData", ComplementaryMaster.deleteData);
router.delete("/deleteComplementaryDataFromTable", ComplementaryMaster.deleteComplementaryData);

//ShiftWise Stock In Master
router.post("/addShiftWiseStockInMasterData", ShiftWiseStockInMaster.addData);
router.get(
  "/getShiftWiseStockInMaster",
  ShiftWiseStockInMaster.getShiftWiseData
);
router.get(
  "/getAcceptancePendingData",
  ShiftWiseStockInMaster.getAcceptancePendingData
);
router.put(
  "/updateShiftWiseStockInMaster",
  ShiftWiseStockInMaster.updateShiftWiseStockInMaster
);
router.put(
  "/updateShiftWiseStatusChange",
  ShiftWiseStockInMaster.updateShiftWiseStatusChange
);

//UPI Master
router.get("/getAllUPIDataByResId", UPIMaster.getAllUPIDataByResId);
router.get("/getUPIDataByUPIId", UPIMaster.getUPIDataByUPIId);
router.post("/addUPIData", UPIMaster.addData);
router.put("/updateUPIData", UPIMaster.updateData);
router.delete("/deleteUPIData", UPIMaster.deleteData);

//Waiter Mapping Master
router.get(
  "/getWaiterMappingDataByResId",
  WaiterMappingMaster.getWaiterMappingDataByResId
);
router.get(
  "/getWaiterMappingDataByWaiterId",
  WaiterMappingMaster.getWaiterMappingDataByWaiterId
);
router.post("/addWaiterMapping", WaiterMappingMaster.addWaiterMapping);
router.put("/updateWaiterMapping", WaiterMappingMaster.updateWaiterMapping);
router.delete("/deleteWaiterMapping", WaiterMappingMaster.deleteWaiterMapping);

module.exports = router;