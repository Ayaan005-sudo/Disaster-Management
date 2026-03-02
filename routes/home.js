const express=require("express");
const router=express.Router();
const HomeControler=require("../controlers/home.js");
const {isLoggedin,isUser,isNgo}=require("../Middleware.js");
const wrapAsync = require("../utils/wrapAsync.js");


router.get("/",HomeControler.homeMain);


router.get("/disaster-management",isLoggedin,HomeControler.disasterManagement)
router.get("/dashboard",isLoggedin,wrapAsync(HomeControler.dashboard))
router.get("/dashboard/data/:country",wrapAsync(HomeControler.dashboardAPI))
router.get("/live-updates",isLoggedin,wrapAsync(HomeControler.liveUpdates) )
router.get("/live-updates/data/:lat/:long",wrapAsync(HomeControler.liveUpdatesAPI));

module.exports=router;