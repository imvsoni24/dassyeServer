const express = require("express")
const licenseModel = require("../models/licenseModel")

const licenseRoute = express.Router()

licenseRoute.post("/saveLicense",async(req,res)=>{
    try{
        const {id,licenseNumber,issuingAuthority,expirationDate} = req.body
        let exist = await licenseModel.findOne({licenseNumber})
        if(exist){
            return res.json({message:"License already exist"})
        }
        let license = new licenseModel({id,licenseNumber,issuingAuthority,expirationDate})
        await license.save()
        res.json({message:"License has been added"})
    }
    catch(error){
        res.json({message:error._message})
    }
})

licenseRoute.get("/getLicense",async(req,res)=>{
    try {
      const id = req.header('id');
      const details = await licenseModel.findOne({ id });
      console.log(details)
      res.json({ data: details });
    } catch (error) {
      res.json({ message: error._message });
    }
  })

  licenseRoute.patch("/updateLicense/:id", async (req, res) => {
    try {
      const { licenseNumber,issuingAuthority,expirationDate } = req.body;
      const id = req.params.id;
  
  
      await licenseModel.findByIdAndUpdate({ _id: id }, {
        licenseNumber,issuingAuthority,expirationDate
      });
  
      res.json({ message: 'Updated successfully'});
    } catch (error) {
      res.json({ message: 'An error occurred while updating.' });
    }
  });

module.exports = licenseRoute