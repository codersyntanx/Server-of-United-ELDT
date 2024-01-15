const mongoose = require("mongoose");
const{Schema}= mongoose;
const paymentSchema = new Schema({
  
    name:{
        type:String
    },
    dateOfBirth:{
        type:String
    },
    email:{
        type:String
    },
    phone:{
        type:String,
    },
    address:{
        type:String,
    },
    licenseState:{
        type:String
    },
    licenseNumber:{
        type:String
    },
    cardholderName:{
        type:String,
    },
    billingAddress:{
        type:String,
       
    },
    zip:{
        type:String,
       
    },
    licenseimage:{
        type:String,
    }
}, { timestamps: true })



const paymentModel = mongoose.model("payment", paymentSchema)
module.exports = paymentModel;