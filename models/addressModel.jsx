const mongoose = require("mongoose")

const addressSchema = mongoose.Schema({
    street: {
      type: String,
      required: true,
    },
    city:{
     type:String,
     required:true
    },
    state:{
        type:String,
        required:true
    },
    postal:{
        type:String,
        required:true
    }
  })

const addressModel = mongoose.model("address",addressSchema)
module.exports = addressModel