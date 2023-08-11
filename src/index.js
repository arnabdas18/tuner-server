require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const userRoutes = require("./routes/user.routes");
const videoRoutes = require("./routes/video.routes");

const app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/v1/auth", userRoutes);
app.use("/", videoRoutes);

mongoose
  .connect("mongodb+srv://rajinrk:tCnvp5cI2g18ff1k@cluster0.pt8bbn4.mongodb.net/?retryWrites=true&w=majority")
  .then(() => {
    console.log("Successful connection to mongodb");
  })
  .catch((err) => {
    console.log("Unsuccessful connection to mongodb");
    console.log(err);
  });

app.listen(4800, () => {
  console.log(`Server started on port: 4800`);
});
