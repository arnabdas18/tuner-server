const express = require("express");
const mongoose = require('mongoose')

const app = express();

mongoose.connect()
  .then((req,res)=>{
    res.send('connected to db')
  })
  .catch(err=> {
    res.send('connection failed',err)
  })

app.listen(5000, () => {
  console.log("Server started on port: 5000");
});
