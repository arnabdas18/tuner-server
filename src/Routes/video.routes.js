require("dotenv").config();
const express = require("express");
const VideoModel = require("../models/video.model");
const UserModel = require("../models/user.model");
const cloudinary = require("cloudinary").v2;
const authMiddleware = require("../middleware/authMiddleware");
const multer = require("multer");

const videoRoutes = express.Router();

const path = require("path");

const storage = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname);
    if (ext !== ".mp4" && ext !== ".mkv") {
      cb(new Error("File type is not supported", false));
      return;
    }
    cb(null, true);
  },
});

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function getDate() {
  let today = new Date();
  let day = today.getDate();
  let month = today.toLocaleString("default", { month: "long" });
  let year = today.getFullYear();

  return `${day} ${month} ${year}`;
}

videoRoutes.post(
  "/create/:userId",
  storage.single("video"),
  async (req, res) => {
    console.log(req.body)
    try {
      const { userId } = req.params;
      const currDate = getDate();
      if (!userId) {
        return res.status(401).json({ error: "User not found in Database" });
      }
      const cloudinaryResponse = await cloudinary.uploader.upload(
        req.file.path,
        {
          resource_type: "video",
          folder: "tuner",
          eager: [{ format: "jpeg", effect: "preview:duration_2" }],
          eager_async: true,
          filename_override: req.body.title,
          quality: 60,
        }
      );

      const newVideo = new VideoModel({
        ...req.body,
        video: cloudinaryResponse.secure_url,
        thumbnail: cloudinaryResponse.eager[0].secure_url,
        date: currDate,
      });

      const savedVideo = await newVideo.save();
      user.myVideos.unshift(savedVideo._id);
      await user.save();

      return res.status(201).json({ result: savedVideo,status : true });
    } catch (err) {
      console.log(err.message);
      return res.status(500).json({ error: err.message,status : false });
    }
  }
);

videoRoutes.get("/video/search", async (req, res) => {
  try {
    const queryString = req.query.q;
    const videos = await VideoModel.find({
      title: { $regex: query, $options: "i" },
    }).limit(40);

    return res.status(200).json({ result: videos });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

videoRoutes.get("/searchlist/video/:videoId", async (req, res) => {
  try {
    const { videoId } = req.params;
    const video = await VideoModel.findById(videoId);
    return res.status(200).json({ result: video });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

videoRoutes.get("/home/video/:videoId", async (req, res) => {
  try {
    const { videoId } = req.params;
    const video = await VideoModel.findById(videoId);
    return res.status(200).json({ result: video });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

videoRoutes.get("/video", async (req, res) => {
  try {
    const allVideos = await VideoModel.find();
    return res.status(200).json(allVideos);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

videoRoutes.put("/video/:userId/:videoId", async (req, res) => {
  const { userId, videoId } = req.params;
  const { title, description, category, visibility } = req.body;

  try {
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User Not Found" });
    }

    const videoIndex = user.myVideos.findIndex((id) => id === videoId);
    if (videoIndex === -1) {
      return res.status(404).json({ error: "Video Not Found In MyVideos" });
    }

    let video = await VideoModel.findById(videoId);
    if (!video) {
      return res.status(404).json({ error: "Video Not Found" });
    }

    video.title = title;
    video.description = description;
    video.category = category;
    video.visibility = visibility;

    await video.save();

    return res.status(200).json({ result: "Video Updated Successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

videoRoutes.delete(
  "/video/:userId/:videoId",
  authMiddleware,
  async (req, res) => {
    try {
      const { userId, videoId } = req.params;

      const user = await UserModel.findById(userId);

      if (!user) return res.status(404).json({ error: "User not found" });

      const videoIndex = user.myVideos.findIndex((id) => id === videoId);
      if (videoIndex === -1)
        return res.status(404).json({ error: "Video not found in MyVideos" });

      user.myVideos.splice(videoIndex, 1);
      await user.save();

      await VideoModel.findByIdAndDelete(videoId);

      return res.status(200).json({ result: "Video deleted successfully" });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
);

videoRoutes.get("/myVideo", authMiddleware, async (req, res) => {
  try {
    const myVideo = await VideoModel.find({ postedBy: req.user._id });
    return res.status(200).json(myVideo);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = videoRoutes;
