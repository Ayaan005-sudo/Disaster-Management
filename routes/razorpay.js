const express=require("express");
const router=express.Router();
const RazorPayHandler=require("../controlers/razorpay.js");
const wrapAsync=require("../utils/wrapAsync.js");
const {isLoggedin,isUser,isNgo}=require("../Middleware.js");
router.post("/create-order",RazorPayHandler.createOrder);
router.post("/payment",RazorPayHandler.payment);
router.post("/verify-payment",RazorPayHandler.VerifyPayment);
router.post("/donate",isLoggedin,RazorPayHandler.donate);


module.exports=router;