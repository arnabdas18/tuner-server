
const express = require('express')
const userRoute = express.Router()
const userSchema = require('../model/userSchema')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

userRoute.post('/register', (req,res)=>{

    const {name,email,phone,profession,password} = req.body
    
        const hashedPassword = bcrypt.hash(password,10)
        const post = new userSchema({
            name,
            email,
            password : hashedPassword,
            phone,
            profession
        })

        post.save()
            .then((result)=>{
                res.status(201).json({
                    message : 'registered succesfully',
                    data : result
                })
            })
            .catch(err => {
                res.status(500).json({
                    message : 'user already registered',
                    error : err
                })
            })


})


userRoute.post('/login', (req,res)=>{

    const {email,password} = req.body;
    userSchema.findOne({email})
        .then(user => {
            if(user){
                bcrypt.compare(password,result.password)
                .then(pwdResponse => {
                    if(pwdResponse){
                        const token = jwt.sign({id : user._id, email : user.email }, 'TunerAppGroup13',  {expiresIn : "5d"})
                        res.status(200).json({
                            message : 'User Logged in succesfully',
                            token
                        })
                    }
                    else{
                        res.status(400).json({
                            message : 'email or password incorrect'
                        })
                    }
                  
                })
                .catch(err => {
                    res.status(400).json({
                        message : 'internal server error'
                    })
                })
            }
            else{
                res.status(400).json({
                    message : 'user not registered'
                })
            }
          
        })
        .catch(err =>{
            res.status(500).json({
                message : 'unknown error',
                error : err
            })
        })
})

module.exports = userRoute