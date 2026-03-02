const dotenv=require("dotenv");
dotenv.config();
const fundReq=require("../Init/model/fundReq.js");
const nodemailer=require("nodemailer");
const transporter = require("../utils/nodemailer.js");
const { read } = require("fs");


module.exports.raiseFundGet=async(req,res)=>{
    res.render("raise-funds.ejs",{
  showSearch:false,
  shownavbar:false,
  showfooter:false,
   stylePath3:"/css/raise-funds.css",
});
}

module.exports.raiseFundPost=async(req,res)=>{
     const{pdfUrl,reason,amount}=req.body.fundReq;
  const fundReq1=new fundReq(req.body.fundReq);
   
   fundReq1.status="PENDING";
    fundReq1.userId=req.user._id;


await fundReq1.save();
console.log(fundReq1);

const approveLink=`http://localhost:3000/fund/approve/${fundReq1._id}`;
const rejectLink=`http://localhost:3000/fund/reject/${fundReq1._id}`;
const info = await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER2,
    subject: "FUND REQUEST ",
   html:`
   <a href="${approveLink}">approve</a>
   <br><br>
   <a href="${rejectLink}">reject</a>
   `
   
  });

  req.flash("success","your form has been submitted you will get info on mail after inspection!");
  res.redirect('/raise-funds');
}