const express = require("express")
const panGstinModel = require("../models/panGstinModel")

const panGstinRoute = express.Router()

panGstinRoute.post("/panGstin",async(req,res)=>{
    try{
        const {panNumber,gstinNumber} = req.body
        let existPan = await panGstinModel.findOne({panNumber})
        if(existPan){
            return res.json({message:"Pan number already exist"})
        }
        let panGstin = new panGstinModel({panNumber,gstinNumber})
        await panGstin.save()
        res.json({message:"Details has been added"})
    }
    catch(error){
        res.json({message:error._message})
    }
})

module.exports = panGstinRoute