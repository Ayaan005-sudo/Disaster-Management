const mongoose =require("mongoose");
const schema=require("schema");


const fundReqSchema=new mongoose.Schema({
pdfUrl:{
type:String,
require:true,

},
reason:{
    type:String,
    require:true,
},
amount:{
    type:Number,
    require:true,
},
 status:{
        type:String,
        enum:["PENDING","APPROVED","REJECTED"],
        default:"PENDING"
    },
userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ngoACC", 
    require: true,
  }
})
module.exports=mongoose.model("fundReq",fundReqSchema);