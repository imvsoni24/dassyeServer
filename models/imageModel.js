const mongoose = require("mongoose")

const imageSchema = mongoose.Schema({
    id:{
        type:String,
        required:true
      },
    image:{
        type:String
    },
    type:{
        type:String,
        required:true
    }
})

const imageModel = mongoose.model("image",imageSchema)

module.exports = imageModel