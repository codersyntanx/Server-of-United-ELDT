const mongoose = require("mongoose");
const{Schema}= mongoose;
const NewsSchema = new Schema({
  
   
    Email:{
        type:String
    },
    
}, { timestamps: true })



const NewsModel = mongoose.model("NewsLetter", NewsSchema)
module.exports = NewsModel;