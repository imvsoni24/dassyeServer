const express = require("express")
const panAadhaarModel = require("../models/panAadhaar.model")

const panAadhaarRoute = express.Router()

panAadhaarRoute.post("/savePanAadhaar",async(req,res)=>{
    try{
        const {id,panNumber,aadhaarNumber} = req.body
        let existPan = await panAadhaarModel.findOne({panNumber})
        if(existPan){
            return res.json({message:"Pan number already exist"})
        }
        let panAadhaar = new panAadhaarModel({id,panNumber,aadhaarNumber})
        await panAadhaar.save()
        res.json({message:"Details has been added"})
    }
    catch(error){
        res.json({message:error._message})
    }
})

panAadhaarRoute.get("/getPanAadhaar",async(req,res)=>{
    try {
      const id = req.header('id');
      console.log(id)
      const details = await panAadhaarModel.findOne({ id });
      console.log(details)
      res.json({ data: details });
    } catch (error) {
      res.json({ message: error._message });
    }
  })

panAadhaarRoute.patch("/updatePanAadhaar/:id", async (req, res) => {
    try {
      const { panNumber,aadhaarNumber } = req.body;
      const id = req.params.id;
  
  
      await panAadhaarModel.findByIdAndUpdate({ _id: id }, {
        panNumber,aadhaarNumber
      });
  
      res.json({ message: 'Updated successfully'});
    } catch (error) {
      res.json({ message: 'An error occurred while updating.' });
    }
  });

module.exports = panAadhaarRoute