const mongoose = require('mongoose');
const schema=require('schema');

const passportLocalMongoose = require('passport-local-mongoose');

const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,


    }


});
userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', userSchema);