const express = require("express");
const otpGenerator = require('otp-generator');
const nodemailer = require("nodemailer")
const bcrypt = require("bcrypt");
const saveOTPModel = require("../models/saveOTP.model");
const salesSignupModel = require("../models/SalesSignup.model");
const jwt = require("jsonwebtoken")
require("dotenv").config();
const salesAuthRoute = express.Router()

salesAuthRoute.post("/sendSalesOTP", async (req, res) => {
  try {
    const { email } = req.body;

    // Check if the email id is already registered
    const exist = await salesSignupModel.findOne({ email });
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


salesAuthRoute.post("/verifySalesOTP",async(req,res)=>{
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

salesAuthRoute.post("/salesSignup", async (req, res) => {
    try {
      const { fullName,position,companyName, mobileNumber,email,password } = req.body;
  
      // Check if the email id is already registered
      const exist = await salesSignupModel.findOne({ email });
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

      const newOne = new salesSignupModel({ fullName,position,companyName, mobileNumber,email, password:hash });
      await newOne.save();
      await saveOTPModel.deleteMany({email})
      res.json({ message: 'Registered successfully' });
        }

    })} catch (error) {
        console.log(error._message)
      res.json({ message: error._message });
    }
  });

  salesAuthRoute.post("/salesLogin", async (req, res) => {
    const { email, password } = req.body;
    const exist = await salesSignupModel.findOne({ email });
    if (!exist) {
      res.json({ message: "Not exist, please register" });
    } else {
      try {
        bcrypt.compare(password, exist.password, (err, result) => {
          if (result) {
            const token = jwt.sign({ email: exist.email},process.env.tokenKey);
            if (token) {
              jwt.verify(token,process.env.tokenKey,(err, decoded) => {
                if (decoded) {
                  res.json({
                    message: "Succesfully login",
                    token: token,
                    email:decoded.email,
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
  




module.exports = salesAuthRoute