const mongoose = require("mongoose")

const panGstinSchema = mongoose.Schema({
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