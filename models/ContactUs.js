const mongoose = require("mongoose");
const{Schema}= mongoose;
const ContactSchema = new Schema({
    
    
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
    message:{
        type:String,
    },
    subject:{
        type:String
    }})



const ContactModel = mongoose.model("Contact", ContactSchema)
module.exports = ContactModel;