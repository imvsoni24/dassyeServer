const express = require("express")
const panGstinModel = require("../models/panGstinModel")

const panGstinRoute = express.Router()

panGstinRoute.post("/savePanGstin",async(req,res)=>{
    try{
        const {id,panNumber,gstinNumber} = req.body
        let existPan = await panGstinModel.findOne({panNumber})
        if(existPan){
            return res.json({message:"Pan number already exist"})
        }
        let panGstin = new panGstinModel({id,panNumber,gstinNumber})
        await panGstin.save()
        res.json({message:"Details has been added"})
    }
    catch(error){
        res.json({message:error._message})
    }
})

panGstinRoute.get("/getPanGst",async(req,res)=>{
    try {
      const id = req.header('id');
      console.log(id)
      const details = await panGstinModel.findOne({ id });
      console.log(details)
      res.json({ data: details });
    } catch (error) {
      res.json({ message: error._message });
    }
  })

  panGstinRoute.patch("/updatePanGst/:id", async (req, res) => {
    try {
      const { panNumber,gstinNumber } = req.body;
      const id = req.params.id;
  
  
      await panGstinModel.findByIdAndUpdate({ _id: id }, {
        panNumber,gstinNumber
      });
  
      res.json({ message: 'Updated successfully'});
    } catch (error) {
      res.json({ message: 'An error occurred while updating.' });
    }
  });

module.exports = panGstinRoute