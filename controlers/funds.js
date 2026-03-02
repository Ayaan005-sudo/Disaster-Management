const dotenv=require ("dotenv");
dotenv.config();
const NGO=require("../Init/model/ngoACC.js");
const NGON=require("../Init/model/ngoGovt.js");
const Don=require("../Init/model/donation.js");
const fundReq=require("../Init/model/fundReq.js");
const nodemailer=require("nodemailer");
const transporter = require("../utils/nodemailer.js");
const { read } = require("fs");

module.exports.fundsGet=async(req,res)=>{
    const userId = req.user._id;

  const donations = await Don.find({ userId: userId })
    .sort({ createdAt: -1 });
    console.log(donations);
    apikey=process.env.RAZORPAY_FUNDS_OPTIONS
    res.render("funds.ejs",{
        shownavbar:true,
        showfooter:true,
        donations:donations,
        apikey:apikey
    }
    )
}

module.exports.fundsAction=async(req,res)=>{
     const{action,id}=req.params;
const fundreq1=await fundReq.findById(id);
const ngo=await NGO.findById(fundreq1.userId);
console.log(ngo);
if(!fundreq1){
  return res.send("Request not found!");
}
if(action==="approve"){
  fundreq1.status="APPROVED";
}else{
  fundreq1.status="REJECTED";
};

await fundreq1.save();
const info = await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: ngo.email,
    subject: "FUND REQUEST UPDATE ",
   html:`
   <h3>Your fund request is ${fundreq1.status}</h3>
   <p>Amount:${fundreq1.amount}<p> 
   <h6><b>Your organisation also has to submit the proof of investment in form of file ans photos and after thet out twma will also inspect there!<b></h6>
   `
   
  });
  res.send(`fund request ${fundreq1.status}`);
}