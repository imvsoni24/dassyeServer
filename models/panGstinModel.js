const mongoose = require("mongoose")

const panGstinSchema = mongoose.Schema({
  id:{
    type:String,
    required:true
  },
    panNumber: {
      type: String,
      required:true
    },
    gstinNumber:{
     type:String,
    }
  })

const panGstinModel = mongoose.model("panGstin",panGstinSchema)
module.exports = panGstinModel