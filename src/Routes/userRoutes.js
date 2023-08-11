
const express = require('express')
const userRoute = express.Router()
const userModel = require('../model/userSchema')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

userRoute.post('/register', async (req, res) => {

    const { name, email, phone, profession, password } = req.body

    const hashedPassword = await bcrypt.hash(password, 10)
    const post = new userModel({
        name,
        email,
        password: hashedPassword,
        phone,
        profession
    })

    post.save()
        .then((result) => {
            res.status(201).json({
                message: 'registered succesfully',
                data: result
            })
        })
        .catch(err => {
            res.status(500).json({
                message: 'user already registered',
                error: err
            })
        })


})


userRoute.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "Email is not registered",
            });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(200).send({
                success: false,
                message: "Invalid Password",
            });
        }
        const token = await jwt.sign({ _id: user._id }, 'TunerAppGroup13', { expiresIn: "7d" });
        res.status(200).send({
            message: "login successfully",
            token,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in login",
            error,
        });
    }
})

module.exports = userRoute