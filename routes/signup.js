const express=require("express");
const router=express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const SignupController =require("../controlers/signup.js");


router.get("/user",SignupController.SignupUser);
router.post("/user",wrapAsync(SignupController.SignUpPost));
router.get("/ngo",SignupController.SignupNgo);
router.post("/ngo",SignupController.SignUpPostNgo);


module.exports=router;