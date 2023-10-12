const express = require("express");
const otpGenerator = require('otp-generator');
const nodemailer = require("nodemailer")
const bcrypt = require("bcrypt");
const saveOTPModel = require("../models/saveOTP.model");
const shopSignupModel = require("../models/ShopSignup.model");
const jwt = require("jsonwebtoken")
require("dotenv").config();
const shopAuthRoute = express.Router()

shopAuthRoute.post("/sendShopOTP", async (req, res) => {
  try {
    const { email } = req.body;

    // Check if the email id is already registered
    const exist = await shopSignupModel.findOne({ email });
    if (exist) {
      return res.json({ message: 'Email id is already registered.' });
    }

    // Generate OTP
    const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false });

    // Send OTP via email

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.email,
        pass: process.env.pass,
      },
    });

    // Email content
    const mailOptions = {
      from: 'imvsoni24@gmail.com',
      to: email,
      subject: 'OTP Verification',
      text: `Your OTP for verification is: ${otp}`,
    };

    // Send the email
    transporter.sendMail(mailOptions, async(error, info) => {
      if (error) {
        return res.json({ message: 'Failed to send OTP via email, Check your email id' });
      } else {
        const newOTP = new saveOTPModel({ email, otp });
        await newOTP.save();
        res.json({ message: 'OTP sent successfully' });
      }
    });

    

  } catch (error) {
    res.json({ message: error });
  }
});


shopAuthRoute.post("/verifyShopOTP",async(req,res)=>{
  try {
    const { otp} = req.body;

    // Find the user by otp
    const checkOTP = await saveOTPModel.findOne({ otp });

    if (!checkOTP) {
      return res.json({ message: 'Invalid OTP' });
    }
    res.json({ message: 'OTP verified' });

  } catch (error) {
    res.json({ message: error });
  }
})

shopAuthRoute.post("/shopSignup", async (req, res) => {
    try {
      const { shopName,location,typeOfShop, mobileNumber,email,password } = req.body;
  
      // Check if the email id is already registered
      const exist = await shopSignupModel.findOne({ email });
      if (exist) {
        return res.json({ message: 'Email id is already registered.' });
      }

      if (!password || password.trim() === '') {
        return res.json({ message: 'Please set a password.' });
      }
      bcrypt.hash(password, 5, async (err, hash) => {
        if (err) {
          res.json({ message: err });
        } else {

      const newOne = new shopSignupModel({ shopName,location,typeOfShop, mobileNumber,email, password:hash });
      await newOne.save();
      await saveOTPModel.deleteMany({email})
      res.json({ message: 'Registered successfully' });
        }

    })} catch (error) {
      console.error(error);
      res.json({ message: error._message });
    }
  });
  
  shopAuthRoute.post("/shopLogin", async (req, res) => {
    const { email, password } = req.body;
    const exist = await shopSignupModel.findOne({ email });
    if (!exist) {
      res.json({ message: "Not exist, please register" });
    } else {
      try {
        bcrypt.compare(password, exist.password, (err, result) => {
          if (result) {
            const token = jwt.sign({id: exist._id},process.env.tokenKey);
            if (token) {
              jwt.verify(token,process.env.tokenKey,(err, decoded) => {
                if (decoded) {
                  res.json({
                    message: "Successfully login",
                    token: token,
                    id:decoded.id,
                  });
                } else {
                  res.json({ message: err });
                }
              });
            }
          } else {
            res.json({ message: "Credentials are wrong" });
          }
        });
      } catch (err) {
        res.json({ message: err });
      }
    }
  });

  shopAuthRoute.get("/getShopProfile",async(req,res)=>{
    try {
      const shopId = req.header('Shop-Id');
      const details = await shopSignupModel.findOne({ _id: shopId });
      console.log(details)
      res.json({ data: details });
    } catch (error) {
      res.json({ message: error._message });
    }
  })

  shopAuthRoute.patch("/updateShopProfile/:id", async (req, res) => {
    try {
      const { shopName,typeOfShop, location, mobileNumber, email } = req.body;
      const id = req.params.id;
  
  
      await shopSignupModel.findByIdAndUpdate({ _id: id }, {
        shopName,
        typeOfShop,
        location,
        mobileNumber,
        email,
      });
  
      res.json({ message: 'Updated successfully'});
    } catch (error) {
      res.json({ message: 'An error occurred while updating.' });
    }
  });

  shopAuthRoute.patch("/updateShopPassword/:id", async (req, res) => {
    try {
      const { password } = req.body;
      const id = req.params.id;
  
      const hashedPassword = await bcrypt.hash(password, 5);
  
      await shopSignupModel.findByIdAndUpdate({ _id: id }, {
        password:hashedPassword
      });
  
      res.json({ message: 'Updated successfully'});
    } catch (error) {
      res.json({ message: 'An error occurred while updating.' });
    }
  });




module.exports = shopAuthRoute