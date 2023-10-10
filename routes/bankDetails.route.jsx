const express = require("express")
const bankDetailsModel = require("../models/bankDetailsModel")

const bankDetailsRoute = express.Router()

bankDetailsRoute.post("/saveBankDetails",async(req,res)=>{
    try{
        const {accountNumber,bankName,ifscCode} = req.body
        let exist = await bankDetailsModel.findOne({accountNumber})
        if(exist){
            return res.json({message:"Account already exist"})
        }
        let bankDetails = new bankDetailsModel({accountNumber,bankName,ifscCode})
        await bankDetails.save()
        res.json({message:"Account is added"})
    }
    catch(error){
        res.json({message:error._message})
    }
})

module.exports = bankDetailsRoute