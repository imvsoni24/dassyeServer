const express = require("express")
const addressModel = require("../models/addressModel")

const addressRoute = express.Router()

addressRoute.post("/saveaddress",async(req,res)=>{

    try{
        const {street,city,state,postal} = req.body
        let address = new addressModel({street,city,state,postal})
        await address.save()
        res.json({message:"Address has been added"})
    }
    catch(error){
        res.json({message:error._message})
    }

})

module.exports = addressRoute