const express = require("express");
const mongoose = require('mongoose')
const cors = require("cors");
const bodyParser =require("body-parser");
const userRoute = require('./Routes/userRoutes')

const app = express();
app.use(cors())
app.use(bodyParser.json())

mongoose.connect()
  .then((req,res)=>{
    res.send('connected to db')
  })
  .catch(err=> {
    res.send('connection failed',err)
  })

  app.use('/user/auth',userRoute)

app.listen(5000, () => {
  console.log("Server started on port: 5000");
});
