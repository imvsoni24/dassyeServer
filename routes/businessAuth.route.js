const express = require("express");
const businessSignupModel = require("../models/businessSignup.model");
const otpGenerator = require('otp-generator');
const nodemailer = require("nodemailer")
const bcrypt = require("bcrypt");
const saveOTPModel = require("../models/saveOTP.model");
const jwt = require("jsonwebtoken")
require("dotenv").config();
const businessAuthRoute = express.Router()

businessAuthRoute.post("/sendBusinessOTP", async (req, res) => {
  try {
    const { email } = req.body;

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


businessAuthRoute.post("/verifyBusinessOTP",async(req,res)=>{
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

businessAuthRoute.post("/businessSignup", async (req, res) => {
    try {
      const { businessName,distributorName,location,website, mobileNumber,email,password } = req.body;
  
      // Check if the email id is already registered
      const exist = await businessSignupModel.findOne({ email });
      console.log(exist)
      if (exist) {
        return res.json({ message: 'Email id is already registered.' });
      }

      if (!password || password.trim() === '') {
        return res.json({ message: 'Please set a password.' });
      }
      const hash = await bcrypt.hash(password, 5);
      const newOne = new businessSignupModel({ businessName,distributorName,location,website, mobileNumber,email, password:hash });
      await newOne.save();
      await saveOTPModel.deleteMany({email})
      res.json({ message: 'Registered successfully' });
  } catch (error) {
      console.error(error);
      res.json({ message: error._message });
    }
  });
  
  businessAuthRoute.post("/businessLogin", async (req, res) => {
    const { email, password } = req.body;
    const exist = await businessSignupModel.findOne({ email });
    if (!exist) {
      res.json({ message: "Not exist, please register" });
    } else {
      try {
        bcrypt.compare(password, exist.password, (err, result) => {
          if (result) {
            const token = jwt.sign({id: exist._id},process.env.tokenKey);
            if (token) {
              jwt.verify(token,process.env.tokenKey,(err, decoded) => {
                console.log(decoded)
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

  businessAuthRoute.get("/getBusinessProfile",async(req,res)=>{
    try {
      const businessId = req.header('Business-Id');
      const details = await businessSignupModel.findOne({ _id: businessId });
      console.log(details)
      res.json({ data: details });
    } catch (error) {
      res.json({ message: error._message });
    }
  })

  businessAuthRoute.patch("/updateBusinessProfile/:id", async (req, res) => {
    try {
      const { businessName, distributorName, location, website, mobileNumber, email } = req.body;
      const id = req.params.id;
  
      // const hashedPassword = await bcrypt.hash(password, 5);
  
      await businessSignupModel.findByIdAndUpdate({ _id: id }, {
        businessName,
        distributorName,
        location,
        website,
        mobileNumber,
        email,
      });
  
      res.json({ message: 'Updated successfully'});
    } catch (error) {
      res.json({ message: 'An error occurred while updating.' });
    }
  });

  businessAuthRoute.patch("/updateBusinessPassword/:id", async (req, res) => {
    try {
      const { password } = req.body;
      const id = req.params.id;
  
      const hashedPassword = await bcrypt.hash(password, 5);
  
      await businessSignupModel.findByIdAndUpdate({ _id: id }, {
        password:hashedPassword
      });
  
      res.json({ message: 'Updated successfully'});
    } catch (error) {
      res.json({ message: 'An error occurred while updating.' });
    }
  });




module.exports = businessAuthRoute