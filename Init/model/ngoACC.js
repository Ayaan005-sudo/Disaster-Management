const mongoose = require('mongoose');
const schema=require('schema');

const passportLocalMongoose = require('passport-local-mongoose');

const NGOSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
unique:true

    },
    ngoId:{
        type:String,
        required:true,
    }
   


});
NGOSchema.plugin(passportLocalMongoose,{
     usernameField: 'email'


});
module.exports = mongoose.model('NGO', NGOSchema);