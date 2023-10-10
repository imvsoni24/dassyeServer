const express = require("express")
const licenseModel = require("../models/licenseModel")

const licenseRoute = express.Router()

licenseRoute.post("/saveLicense",async(req,res)=>{
    try{
        const {licenseNumber,issuingAuthority,expirationDate} = req.body
        let exist = await licenseModel.findOne({licenseNumber})
        if(exist){
            return res.json({message:"License already exist"})
        }
        let license = new licenseModel({licenseNumber,issuingAuthority,expirationDate})
        await license.save()
        res.json({message:"License has been added"})
    }
    catch(error){
        res.json({message:error._message})
    }
})

module.exports = licenseRoute