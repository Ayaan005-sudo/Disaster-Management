const Joi=require("joi");
const fundReq = require("./Init/model/fundReq");

module.exports.donationSchema=Joi.object({
    donation:Joi.object({
        email:Joi.string().email().required(),
        mobile:Joi.string().pattern(/^[0-9]{10}$/).required(),
        amount:Joi.number().min(10).required(),

    }).required(),
    id:Joi.string()
});

module.exports.fundReqSchema=Joi.object({
    fundReq:Joi.object({
        pdfUrl:Joi.string().required(),
        reason:Joi.string().required(),
        amount:Joi.number().required(),
    }).required(),
});


