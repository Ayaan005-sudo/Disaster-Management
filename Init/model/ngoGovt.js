const mongoose=require('mongoose');
const Schema=require("schema");

const NGOgovtschema=new mongoose.Schema({
    id:{
        type:String,
        required:true,
        unique:true,
    },
name:{
    type:String,
    required:true,
},
country:String,
focus:String,
email:{
    type:String,
required:true,
}
});

const Ngon=mongoose.model("Ngon",NGOgovtschema);
module.exports=Ngon;