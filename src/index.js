require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const userRoutes = require("./routes/user.routes");
const videoRoutes = require("./routes/video.routes");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/v1/auth", authRoutes);
app.use("/", videoRouter);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Successful connection to mongodb");
  })
  .catch((err) => {
    console.log("Unsuccessful connection to mongodb");
    console.log(err);
  });

app.listen(process.env.PORT, () => {
  console.log(`Server started on port: ${process.env.PORT}`);
});
