const express = require("express");
const mongoose = require('mongoose')
const cors = require("cors");
const bodyParser =require("body-parser");
const userRoute = require('./Routes/userRoutes')

const app = express();
app.use(cors())
app.use(bodyParser.json())

mongoose.connect("mongodb+srv://rajinrk:1RLdyeLz8uyvHHMh@cluster0.pt8bbn4.mongodb.net/?retryWrites=true&w=majority")
  .then(()=>{
    console.log('connected to db')
  })
  .catch(err=> {
    console.log('connection failed',err)
  })

  app.use('/user/auth',userRoute)

app.listen(5000, () => {
  console.log("Server started on port: 5000");
});
