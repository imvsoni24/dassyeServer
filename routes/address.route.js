const express = require("express")
const addressModel = require("../models/addressModel")

const addressRoute = express.Router()

addressRoute.post("/saveaddress",async(req,res)=>{

    try{
        const {id,street,city,state,postal} = req.body
        let exist = await addressModel.findOne({street,city,state,postal,id})
        if(exist){
            return res.json({message:"Address already exist"})
        }
        let address = new addressModel({id,street,city,state,postal})
        await address.save()
        res.json({message:"Address has been added"})
    }
    catch(error){
        res.json({message:error._message})
    }

})

addressRoute.get("/getAddress",async(req,res)=>{
    try {
      const id = req.header('id');
      const details = await addressModel.findOne({ id });
      console.log(details)
      res.json({ data: details });
    } catch (error) {
      res.json({ message: error._message });
    }
  })

  addressRoute.patch("/updateAddress/:id", async (req, res) => {
    try {
      const { street,city,state,postal } = req.body;
      const id = req.params.id;
  
  
      await addressModel.findByIdAndUpdate({ _id: id }, {
        street,city,state,postal
      });
  
      res.json({ message: 'Updated successfully'});
    } catch (error) {
      res.json({ message: 'An error occurred while updating.' });
    }
  });

module.exports = addressRoute