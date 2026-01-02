
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

};



const Ngo=require("./model/ngoGovt.js");
const data=require("./govtNgolist.js");

const initData=async()=>{
await Ngo.deleteMany({});
await Ngo.insertMany(data);
console.log("work done");
}

initData();