const express=require("express");
const {isLoggedin,isUser,isNgo}=require("../Middleware.js");

module.exports.homeMain=(req,res)=>{
    res.render("home.ejs",{
      showSearch:false,
        shownavbar:true,
        stylePath:"/css/home.css",
        
        showfooter:true,
    });
 };

 module.exports.disasterManagement=(req,res)=>{
    res.render("disaster.ejs",{
      showSearch:false,
        shownavbar:false,
        stylePath2:"/css/disaster.css",
        showfooter:false,
       
    })
};

module.exports.dashboard=async(req,res)=>{
    res.render("dashboard.ejs",{
      showSearch:false,
        shownavbar:false,
        stylePath3:"/css/dashboard.css",
        showfooter:false,
        scriptPath:"/js/dashboard.js",
        date:new Date().toString(),
    })
};
module.exports.dashboardAPI=async(req,res)=>{
  let country=req.params.country;
   const apiKey = process.env.OPENCAGE_API_KEY; 

    const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(country)}&key=${apiKey}&limit=1`;
    const res1=await fetch(url);
    const data = await res1.json();
    res.json(data);
};

module.exports.liveUpdates=async(req,res)=>{
  res.render("live.ejs",{
    showSearch:true,
    shownavbar:false,
       
        showfooter:true,
        scriptPath:"/js/live-updates.js",
        stylePath3:"/css/live.css",
 });
 };

 module.exports.liveUpdatesAPI=async(req,res)=>{
  let lat=req.params.lat;
  let long=req.params.long;


let url=`https://api.opencagedata.com/geocode/v1/json?q=${lat}%2C+${long}&key=${process.env.OPENCAGE_API_KEY}`;
let res1=await fetch(url);
let data=await res1.json();
res.json(data);
 };
