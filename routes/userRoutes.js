const express = require("express");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const router = express.Router();
const authController = require("../controller/web/user.controller");
const { cloudinary } = require("../config/cloudinary");
// const authMiddleware = require('../middlewares/authMiddleware');

//  Cloudinary Storage Setup 
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "profiles", 
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

//  Multer Upload Middleware 
const upload = multer({ storage });

//  AUTH ROUTES 
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);

// router.get("/authcheck", authController.authMiddleware, (req, res) => {
//   console.log("Auth middleware hit hoa hai");
//   res.json({
//     authenticated: true,
//     message: "Welcome to Homepage",
//     user: req.user,
//   });
// });

router.get("/authcheck", authController.authMiddleware, (req, res) => {
  console.log("Auth middleware hit hoa hai");

  try {
    res.status(200).json({
      authenticated: true,
      message: "Welcome to Homepage",
      user: req.user,
    });
  } catch (err) {
    console.error("AuthCheck error:", err);
    res.status(500).json({ authenticated: false, message: "Server error" });
  }
});

// PROFILE ROUTES 
router.get("/profile", authController.authMiddleware, authController.getProfile);



// Update profile picture
router.put("/profile/image",authController.authMiddleware, upload.single("profileImage"), authController.updateProfileImage);


module.exports = router;
