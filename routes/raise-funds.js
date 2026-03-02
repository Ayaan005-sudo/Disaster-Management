const express=require("express");
const router=express.Router();
const {isLoggedin,isUser,isNgo}=require("../Middleware.js");
const wrapAsync = require("../utils/wrapAsync.js");
const raiseFund=require("../controlers/raise-funds.js");

router.get("/",raiseFund.raiseFundGet);
router.post("/",raiseFund.raiseFundPost);

module.exports=router;