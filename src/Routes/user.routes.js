const express = require("express");
const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userRoute = express.Router();

userRoute.post("/register", async (req, res) => {

  const { name, email, phone, profession, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new userModel({
    name,
    email,
    password: hashedPassword,
    phone,
    profession,
  });



  user.save()
    .then((result) => {
      res.status(201).json({
        success: true,
        message: 'Registered succesfully',
        data: result
      })
    })
    .catch(err => {
      res.status(500).json({
        success: false,
        message: 'User already registered',
        error: err
      })
    })
});

userRoute.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Email is not registered",
      });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({
        success: false,
        message: "Invalid Email or Password",
      });
    }
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(200).json({
      success: true,
      message: "LoggedIn successfully",
      data :{
        userId: user._id,
        token,
      }
     
    });
  } catch (error) {
    
    res.status(500).json({
      success: false,
      message: "Error in login",
      error,
    });
  }
});

module.exports = userRoute;
