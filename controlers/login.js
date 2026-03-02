//express
const express=require("express");
const app=express();
//models
const User=require("../Init/model/user.js");
const NGO=require("../Init/model/ngoACC.js");
const NGON=require("../Init/model/ngoGovt.js");
//passport
const passport=require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const LocalStratergy=require("passport-local");

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
      user.role="User";
      done(null, user);
    } else {
      const ngo = await NGO.findById(obj.id);
      ngo.role="NGO"
      done(null, ngo);
    }
  } catch (err) {
    done(err);
  }
});





module.exports.Userlogin=(req,res)=>{
    res.render("./login/user.ejs",{
      showSearch:false,
        shownavbar:false,
        showfooter:false,
    })
}

module.exports.UserloginPost=async(req,res,next)=>{
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

module.exports.NgoLogin=(req,res)=>{
 res.render("./login/ngo.ejs",{
      showSearch:false,
        shownavbar:false,
        showfooter:false,
    })
}
module.exports.NgoLoginPost=(req,res,next)=>{
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
  
}

module.exports.VerifyOtp=async(req,res)=>{
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
}