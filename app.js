require("dotenv").config();


const express=require("express");
const app=express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const axios = require('axios');
const xml2js = require('xml2js');

const razorpay=require("razorpay");
const crypto=require("crypto")

//express-session
const session=require('express-session');
const LocalStratergy=require("passport-local");
const flash=require('connect-flash');

//mongoose require
const mongoose = require('mongoose');
main()
.then(()=>{
console.log("connenction succesfully")
})
.catch((err)=>{
    console.log(err);
})
async function main() {
    mongoose.connect('mongodb://127.0.0.1:27017/DisaterManagement');

}


//ejs require
// const path=require('path');
app.set("view engine","ejs");

//path require
const path=require("path");
app.set("views",path.join(__dirname,"/views"));


//public folder setting
// app.use(express.static("/public"));
app.use(express.static(path.join(__dirname,"public")));

const ejsMate=require("ejs-mate");
app.engine('ejs', ejsMate);


//passport requirement
const passport=require('passport');
const passportLocalMongoose = require('passport-local-mongoose');

//user model
const User=require("./Init/model/user.js");
const NGO=require("./Init/model/ngoACC.js");
const NGON=require("./Init/model/ngoGovt.js");
const Don=require("./Init/model/donation.js");
const fundReq=require("./Init/model/fundReq.js");
// const expressErrors = require("../AIRNB/utils/expressErrors.js");

//error handling
const expressError=require("./utils/expressErrors.js");
const wrapAsync=require("./utils/wrapAsync.js");


//nodemailer require
const nodemailer=require("nodemailer");
const transporter = require("./utils/nodemailer.js");
const { read } = require("fs");

 
// //fetch require
// const fetch=require("node-fetch");



//razorpay
let instance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});





//main work
let port=3000;
app.listen(port,()=>{
    console.log("app is listing");
});

const sessionOptions = {
  secret: process.env.SECRET_COOKIE,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};


app.use(session(sessionOptions));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
//stratergies
passport.use("user-local",new LocalStratergy(User.authenticate()));
passport.use("ngo-local",new LocalStratergy(NGO.authenticate()));

//serilalize
passport.serializeUser((entity, done) => {
  done(null, { id: entity.id, type: entity instanceof User ? "User" : "NGO" });
});

// Deserialize
passport.deserializeUser(async (obj, done) => {
  try {
    if (obj.type === "User") {
      const user = await User.findById(obj.id);
      done(null, user);
    } else {
      const ngo = await NGO.findById(obj.id);
      done(null, ngo);
    }
  } catch (err) {
    done(err);
  }
});


app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.failure=req.flash("failure");
  res.locals.currUser=req.user;
  res.locals.role=req.session.role; 
  next();
});

let {isLoggedin,isUser,isNgo}=require("./Middleware.js");
const Ngon = require("./Init/model/ngoGovt.js");

app.get("/demouser",async(req,res)=>{
    let fakeUser1=new User(
        {
            email:"janukhanah776@gmail.com",
            username:"janu khan",
        }
    );
   

    const registerUser=await User.register(fakeUser1 ,"helasfa");
    console.log(registerUser);
    res.send(registerUser);
})


 app.get("/home",(req,res)=>{
    res.render("home.ejs",{
      showSearch:false,
        shownavbar:true,
        stylePath:"/css/home.css",
        
        showfooter:true,
    });
 })

app.get("/disaster-management" ,isLoggedin,(req,res)=>{
    res.render("disaster.ejs",{
      showSearch:false,
        shownavbar:false,
        stylePath2:"/css/disaster.css",
        showfooter:false,
       
    })
})


// 

app.get("/home/dashboard",wrapAsync(async(req,res)=>{
    res.render("dashboard.ejs",{
      showSearch:false,
        shownavbar:false,
        stylePath3:"/css/dashboard.css",
        showfooter:false,
        scriptPath:"/js/dashboard.js",
        date:new Date().toString(),
    })
}));

app.get("/home/dashboard/data/:country",wrapAsync(async(req,res)=>{
  let country=req.params.country;
   const apiKey = process.env.OPENCAGE_API_KEY; 

    const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(country)}&key=${apiKey}&limit=1`;
    const res1=await fetch(url);
    const data = await res1.json();
    res.json(data);
}));

app.get("/funds",isLoggedin,async(req,res)=>{
 const userId = req.user._id;

  const donations = await Don.find({ userId: userId })
    .sort({ createdAt: -1 });
    apikey=process.env.RAZORPAY_FUNDS_OPTIONS
    res.render("funds.ejs",{
        shownavbar:true,
        showfooter:true,
        donations:donations,
        apikey:apikey
    })
})



app.get("/signup/user",(req,res)=>{
res.render("signupUser.ejs",{
  showSearch:false,
    shownavbar:false,
    showfooter:false,
});
});

app.post("/signup/user",wrapAsync (async(req,res)=>{
    try{
      console.log("hello");
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
    
}));


app.get("/signup/ngo",(req,res)=>{
    res.render("signupNgo.ejs",{
      showSearch:false,
        shownavbar:false,
    showfooter:false,
    });
});

app.post("/signup/ngo",async(req,res)=>{
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

});

// app.post("/verify-otp",async(req,res,next)=>{
// let{otp1,otp2,otp3,otp4,otp5,otp6}=req.body;
// let enteredOtp=otp1+otp2+otp3+otp4+otp5+otp6;
// console.log(enteredOtp);
// console.log(req.session.otp);
// if(enteredOtp==req.session.otp.toString()){
// console.log(req.session.ngoData);
// let ngoAcc1=new NGO({
    
//     email:req.session.ngoData.email,
//     ngoId:req.session.ngoData.Ngoid,
// });

//     let registerNGO=await NGO.register(ngoAcc1 ,req.session.ngoData.password);
//     console.log(registerNGO);
//     req.login(registerNGO,(err)=>{
//         if(err){
//            return next( new expressError(err));
//         };
       


//     req.flash("success","Congrates your are signIn now!");
//    return res.redirect("/home");
// })}

// else{
//     req.flash("failure","Enter valid otp");
//     res.redirect("/signup/ngo");
// }


// })

app.post("/verify-otp",wrapAsync( async (req, res, next) => {
  try {
    const { otp1, otp2, otp3, otp4, otp5, otp6 } = req.body;
    const enteredOtp = otp1 + otp2 + otp3 + otp4 + otp5 + otp6;

    if (String(enteredOtp) !== String(req.session.otp)) {
      req.flash("failure", "Invalid OTP");
      return res.redirect("/signup/ngo");
    }

    const { email, Ngoid, password } = req.session.ngoData;

    // Create NGO account
    const ngoAcc = new NGO({ email, ngoId: Ngoid });
    const registeredNGO = await NGO.register(ngoAcc, password);

    req.login(registeredNGO, (err) => {
      if (err) return next(err);
      req.flash("success", "Congrats, you are signed in!");
      req.session.role="ngo"
      return res.redirect("/home");
    });
  } catch (err) {
    console.error("Verify OTP error:", err);
    req.flash("failure", err.message);
    return res.redirect("/signup/ngo");
  }
}));






app.get("/login/user",async(req,res)=>{
    res.render("./login/user.ejs",{
      showSearch:false,
        shownavbar:false,
        showfooter:false,
    })
});

app.post("/login/user",async(req,res,next)=>{
  passport.authenticate("user-local", async (err, username, info) => {
      if (err) {
        return next(err);
      }
      if (!username) {
        req.flash("failure", "Invalid username or password!");
        return res.redirect("/login/user");
      }
      req.logIn(username, (err) => {
        if (err){ return next(err);}
        req.flash("success", "Welcome back!");
       req.session.role="user";
        return res.redirect("/home");
      });
    })(req, res, next);
  }
)

app.get("/login/ngo",async(req,res)=>{
    res.render("./login/ngo.ejs",{
      showSearch:false,
        shownavbar:false,
        showfooter:false,
    })
});

app.post("/login/ngo",async(req,res,next)=>{
  // console.log(req.body);
  passport.authenticate("ngo-local", async (err, username, info) => {
    // console.log("username: ",username);
      if (err) {
        return next(err);
      }
      if (!username) {
        req.flash("failure", "Invalid username or password!");
        return res.redirect("/login/ngo");
      }
      req.logIn(username, (err) => {
        if (err){ return next(err);}
        req.flash("success", "Welcome back!");
       req.session.role="ngo"
        return res.redirect("/home");
      });
    })(req, res, next);
  
})


// 

app.get("/logout",wrapAsync(async(req,res,next)=>{
  req.logout((err)=>{
    if(err){
next( new expressError(err));
      }
    req.flash("success","you are logged out");
    res.redirect("/home");
  })
}));


app.post("/create-order",(req,res)=>{
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
});


app.post("/payment",(req,res)=>{
  res.send("successfull");
});

app.post("/verify-payment", (req, res) => {
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
});

app.post("/donate",async (req,res)=>{
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
res.json({ success: true }); 
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
}
)


app.get("/emergency",async(req,res)=>{
  res.render("emergency.ejs",{
    showSearch:false,
shownavbar:true,
showfooter:true
  });
})


app.get("/raise-funds", async(req,res)=>{
res.render("raise-funds.ejs",{
  showSearch:false,
  shownavbar:false,
  showfooter:false,
});
});   


app.post("/raise-funds",async(req,res)=>{
  const{reason,pdfUrl,amount}=req.body;
  const fundReq1=new fundReq({
    reason,
    pdfUrl,
    amount,
    status:"PENDING",
    userId:req.user._id,
  });

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
   <a href="${rejectLink}>reject</a>
   `
   
  });

  req.flash("success","your form has been submitted you will get info on mail after inspection!");
  res.redirect('/raise-funds');
});

 app.post("/funds/:action/:id",async(req,res)=>{
  const{action,id}=req.params;
const fundreq1=fundReq.findById(id);
const ngo=await NGO.findById(fundReq1.userId);
console.log(ngo);
if(!fundreq1){
  return res.send("Request not found!");
}
if(action==approve){
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
   <p>Amount:${fundreq1.amout}<p>
   <h6><b>Your organisation also has to submit the proof of investment in form of file ans photos and after thet out twma will also inspect there!<b></h6>
   `
   
  });
  res.send(`fund request ${fundreq1.status}`);


 });

 app.get("/home/live-updates",async(req,res)=>{
  res.render("live.ejs",{
    showSearch:true,
    shownavbar:false,
       
        showfooter:true,
        scriptPath:"/js/live-updates.js",
 });
 })

 app.get("/home/live-updates/data/:lat/:long",async(req,res)=>{
  let lat=req.params.lat;
  let long=req.params.long;


let url=`https://api.opencagedata.com/geocode/v1/json?q=${lat}%2C+${long}&key=${process.env.OPENCAGE_API_KEY}`;
let res1=await fetch(url);
let data=await res1.json();
res.json(data);
 })


 app.get("/search",async(req,res)=>{
  let country=req.query.country;
 const data1=await fetch(` https://api.opencagedata.com/geocode/v1/json?q=${country}&key=${process.env.OPENCAGE_API_KEY}`);
  const res2=await data1.json();
  let formated=res2.results[0].formatted;
  console.log(res2.results[0].formatted);
  console.log(res2.results[0].bounds);
  minLat=res2.results[0].bounds.southwest.lat;
  minLon=res2.results[0].bounds.southwest.lng;
  maxLat=res2.results[0].bounds.northeast.lat;
   maxLon=res2.results[0].bounds.northeast.lng;

  // const{lat,long}=res.results[0].geometry;
 
  const data = await fetch(`https://eonet.gsfc.nasa.gov/api/v3/events?limit=5&days=20&bbox=${minLon},${minLat},${maxLon},${maxLat}`);
  const res1=await data.json();
  console.log(res1);
  res.render("search.ejs",{
    country:formated,
    res1:res1,
    showSearch:false,
    shownavbar:true,
    showfooter:true,
  })
 });




app.all("/*path",(req,res,next)=>{
    next( new expressError(404,"page not found"));
    
});

app.use((err,req,res,next)=>{
let{status=500,message="invalid something"}=err;
res.render("error.ejs",{message,
    shownavbar:false,
    showfooter:false,
});
});





