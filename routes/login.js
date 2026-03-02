const express=require("express");
const router=express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const LoginControler=require("../controlers/login.js");

router.get("/user",LoginControler.Userlogin);
router.post("/user",LoginControler.UserloginPost);
router.get("/ngo",LoginControler.NgoLogin);
router.post("/ngo",LoginControler.NgoLoginPost);
router.post("/verify-otp",LoginControler.VerifyOtp);
module.exports=router;