const express = require("express")
const bankDetailsModel = require("../models/bankDetailsModel")

const bankDetailsRoute = express.Router()

bankDetailsRoute.post("/saveBankDetails",async(req,res)=>{
    try{
        const {id,accountNumber,bankName,ifscCode} = req.body
        let exist = await bankDetailsModel.findOne({accountNumber})
        if(exist){
            return res.json({message:"Account already exist"})
        }
        let bankDetails = new bankDetailsModel({id,accountNumber,bankName,ifscCode})
        await bankDetails.save()
        res.json({message:"Account has been added"})
    }
    catch(error){
        res.json({message:error._message})
    }
})

bankDetailsRoute.get("/getBankDetails",async(req,res)=>{
    try {
      const id = req.header('id');
      const details = await bankDetailsModel.findOne({ id });
      console.log(details)
      res.json({ data: details });
    } catch (error) {
      res.json({ message: error._message });
    }
  })

  bankDetailsRoute.patch("/updateBankDetails/:id", async (req, res) => {
    try {
      const { accountNumber,bankName,ifscCode } = req.body;
      const id = req.params.id;
  
  
      await bankDetailsModel.findByIdAndUpdate({ _id: id }, {
        accountNumber,bankName,ifscCode
      });
  
      res.json({ message: 'Updated successfully'});
    } catch (error) {
      res.json({ message: 'An error occurred while updating.' });
    }
  });

module.exports = bankDetailsRoute