const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use("/videos", express.static("uploads"));

// storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// upload API
app.post("/upload", upload.single("video"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  res.json({
    message: "Upload successful",
    file: req.file.filename
  });
});

// get all videos API
app.get("/videos-list", (req, res) => {
  fs.readdir("uploads", (err, files) => {
    if (err) {
      console.log(err);
      return res.status(500).json([]);
    }
    res.json(files);
  });
});

// start server
app.listen(3000, () => {
  console.log("🚀 Server running at http://localhost:3000");
});
