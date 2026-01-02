const user=require("./Init/model/user.js")
// const Ngo=require("./Init/model/ngoAcc.js");

module.exports.isLoggedin=(req,res,next)=>{
if(!req.isAuthenticated()){
    req.session.url=req.originalUrl;
    req.flash("failure","you must be loggin either as a NGO or User");
    return res.redirect("/home")
}
next();

}

module.exports.isUser=(req,res,next)=>{
    if(!req.isAuthenticated()||req.session.role!=="user"){
        req.session.url=req.originalUrl;
        req.flash("failur","you msurt login as User");
       return res.redirect("/login/user");
    }
    next()

}

module.exports.isNgo=(req,res,next)=>{
    if(!req.isAuthenticated()||req.session.role!=="NGO"){
    req.session.url=req.originalUrl;
     req.flash("failur","you msurt login as Ngo");
     return res.redirect("/login/Ngo");
    }
    next();
}

module.exports.redirectUrl=(req,res,next)=>{
if(req.session.url){
res.locals.url=req.session.url;
}
    
next();

}