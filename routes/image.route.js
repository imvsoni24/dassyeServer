const express = require("express")

const imageRoute = express.Router()
const multer = require("multer");
const imageModel = require("../models/imageModel");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now()+"-"+file.originalname);
  },
});
const upload = multer({ storage:storage});

imageRoute.post("/addImage",upload.single("file"),async(req,res)=>{
    const data = req.body
    
    try{
        let newImage = new imageModel({image:req.file?req.file.filename:null,id:data.id,type:data.type})
        await newImage.save()
        res.json({ message: "Image uploaded successfully" });
    }
    catch(error){
        res.json({message:error._message})
    }
})

imageRoute.get("/getImage", async (req, res) => {
  const id = req.header('id');

  try {
    const image = await imageModel.find({ id: id });
    console.log(image)
    if (image) {
      res.json({ image: image })
    } else {
      res.json({ message: "Image not found" });
    }
  } catch (error) {
    res.json({ message: error._message });
  }
});


module.exports = imageRoute