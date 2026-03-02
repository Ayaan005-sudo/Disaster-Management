const express=require("express");
const router=express.Router();
const fundControler=require("../controlers/funds.js");
const {isLoggedin,isUser,isNgo}=require("../Middleware.js");
const wrapAsync = require("../utils/wrapAsync.js");

router.get("/",isLoggedin,fundControler.fundsGet);
router.get("/:action/:id",fundControler.fundsAction);

module.exports=router;
