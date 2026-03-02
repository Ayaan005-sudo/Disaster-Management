const dotenv=require("dotenv");
dotenv.config();
const express=require("express");
const app=express();
const razorpay=require("razorpay");
const crypto=require("crypto")
const Don=require("../Init/model/donation.js");
const fundReq=require("../Init/model/fundReq.js");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.failure=req.flash("failure");
  res.locals.currUser=req.user;
 res.locals.role = req.user ? req.user.role : null;
  next();
});

let instance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


module.exports.createOrder=(req,res)=>{
    let options = {
  amount: req.body.amount*100,  // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
  currency: "INR",
  receipt: "order_rcptid_11",
  
};
instance.orders.create(options, function(err, order) {
  if(err){
    console.log(err);
    return res.status(500).json({error:err});
  }
  console.log("order created :",order.id);
  console.log("order : ",order);
  res.json(order);
});
}

module.exports.payment=(req,res)=>{
res.send("successfull");
}

module.exports.VerifyPayment=(req,res)=>{
    console.log("verify-payment hit.... ")
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    
      const key_secret = `${process.env.RAZORPAY_KEY_SECRET}`;
    
      const body = razorpay_order_id + "|" + razorpay_payment_id;
    
      const expectedSignature = crypto
        .createHmac("sha256", key_secret)
        .update(razorpay_order_id+"|"+razorpay_payment_id)
        .digest("hex");
    
      if (expectedSignature === razorpay_signature) {
        console.log(" Payment Signature Verified");
        res.status(200).json({ success: true, message: "Payment verified" });
      } else {
        console.log(" Invalid Signature");
        res.status(400).json({ success: false, message: "Invalid signature" });
      }
}

module.exports.donate=async(req,res)=>{
     try{
      let{user,mobile,email,amount,id}=req.body;
      console.log(req.user);
      let id2=req.user._id ;
      let don1=new Don({
    username:user,
    mobile:mobile,
    email:email,
    amount:amount,
    paymentId:id,
    userId:id2,
    
      });
    
    await don1.save();
    console.log("don1 : ",don1);
    res.json({ success: true }); 
      } catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
      }
}