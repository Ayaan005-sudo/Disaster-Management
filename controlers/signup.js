const express=require("express");
const mongoose = require('mongoose');

const User=require("../Init/model/user.js");
const NGO=require("../Init/model/ngoACC.js");
const NGON=require("../Init/model/ngoGovt.js");

const nodemailer=require("nodemailer");
const transporter = require("../utils/nodemailer.js");
const { read } = require("fs");

module.exports.SignupUser=(req,res)=>{
res.render("signupUser.ejs",{
  showSearch:false,
    shownavbar:false,
    showfooter:false,
});
};

module.exports.SignUpPost=async(req,res)=>{
    try{
        let{username,email,password}=req.body;
        let user2=new User(req.body);
        let registerUser=await User.register(user2 ,password);
        console.log(registerUser);
        req.login(registerUser,(err)=>{
            if(err){
               return next( new expressError(err));
            }
            req.flash("success","your account has been created successfully");
            req.session.role="user";
             return res.redirect("/home");
        })}
        catch(e){
    req.flash("failure",e.message);
    res.redirect("/signup/user");
        }
}

module.exports.SignupNgo=(req,res)=>{
    res.render("signupNgo.ejs",{
      showSearch:false,
        shownavbar:false,
    showfooter:false,
    });
}

module.exports.SignUpPostNgo=async(req,res)=>{
    let{organization,email,Ngoid,password}=req.body;
    let NgoGovt1=await NGON.findOne({id:Ngoid,email:email});
    if(!NgoGovt1){
    req.flash("failure","you must enter valid details");
    return res.redirect("/signup/ngo");
    }
    
    //otp generation
    const otp=Math.floor(10000+Math.random()*900000);
    console.log("otp generated : ",otp);
    
    
    //nodemailer works
    const info = await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your NGO registration",
        text: `Your OTP for NGO registration is ${otp} . It is valid for 5 minutes only.`
       
      });
      req.session.otp=otp;
      req.session.ngoData=req.body;
      
      res.render("OTP.ejs",{
         shownavbar:false,
        showfooter:false,
      });
}

