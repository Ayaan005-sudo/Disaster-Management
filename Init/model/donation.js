const mongoose =require("mongoose");
const schema=require("schema");
 const user=require("./user.js");


const donationSchema=new mongoose.Schema({
username:{
type:String,
require:true,

},
mobile:{
    type:Number,
    require:true,
},
email:{
    type:String,
    require:true,
},
amount:{
    type:Number,
    require:true,
},
paymentId:{
    type:String,
    require:true,
},
userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user", 
    required: true,
  }


})

const donation=mongoose.model("donation",donationSchema);
 module.exports=donation;