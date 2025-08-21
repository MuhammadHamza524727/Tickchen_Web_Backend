// const User = require('../../models/user');
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');
// const { cloudinary } = require('../../config/cloudinary');

// exports.register = async (req, res) => {
//   try {
//     const { username, email, password, role } = req.body;

//     if (!username || !email || !password) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     // ❌ No hashing here — model hook will do it
//     const newUser = await User.create({
//       username,
//       email,
//       password,
//       role: role || "user",
//     });

//     const token = jwt.sign(
//       { id: newUser._id, role: newUser.role },
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" }
//     );

//     res.cookie("token", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "strict",
//       maxAge: 7 * 24 * 60 * 60 * 1000,
//     });

//     res.status(201).json({
//       message: "User registered successfully",
//       user: {
//         id: newUser._id,
//         username: newUser.username,
//         email: newUser.email,
//         role: newUser.role,
//       },
//     });
//   } catch (error) {
//     console.error("Register Error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };
// exports.login = async (req, res) => {
//   try {
//     const { email, password, role } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     // 1️⃣ Static Admin Credentials
//     const STATIC_ADMIN_EMAIL = "hamza524727@gmail.com";
//     const STATIC_ADMIN_PASSWORD = "524727"; // Simple example, production me env variable me rakho

//     if (email === STATIC_ADMIN_EMAIL && password === STATIC_ADMIN_PASSWORD && role === "admin") {
//       const token = jwt.sign(
//         { id: "static-admin-id", role: "admin" },
//         process.env.JWT_SECRET,
//         { expiresIn: "7d" }
//       );

//       res.cookie("token", token, {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === "production",
//         sameSite: "strict",
//         maxAge: 7 * 24 * 60 * 60 * 1000,
//       });

//       return res.status(200).json({
//         message: "Static admin login successful",
//         user: {
//           id: "static-admin-id",
//           username: "Admin",
//           email: STATIC_ADMIN_EMAIL,
//           role: "admin", // fixed here
//         },
//         token
//       });
//     }

//     // 2️⃣ Normal User Flow (Database)
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: "User not found" });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: "Wrong password" });
//     }

//     const token = jwt.sign(
//       { id: user._id, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" }
//     );

//     res.cookie("token", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "strict",
//       maxAge: 7 * 24 * 60 * 60 * 1000,
//     });

//     res.status(200).json({
//       message: "Login successful",
//       user: {
//         id: user._id,
//         username: user.username,
//         email: user.email,
//         role: user.role,
//       },
//       token
//     });

//   } catch (error) {
//     console.error("Login Error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };
// exports.logout = (req, res) => {
//   res.clearCookie("token", {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     sameSite: "strict",
//   });
//   res.json({ message: "Logged out successfully" });
// };

// exports.authMiddleware = (req, res, next) => {
//   const token = req.cookies.token;
//   if (!token) {
//     return res.status(401).json({ authenticated: false, message: "Not authenticated" });
//   }
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch (error) {
//     return res.status(401).json({ authenticated: false, message: "Invalid token" });
//   }
// };


// exports.profile = async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).select("-password");
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     res.json(user);
//   } catch (error) {
//     console.error("Profile Error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// }

// exports.getProfile = async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).select("-password");
//     if (!user) return res.status(404).json({ message: "User not found" });
//     res.json(user);
//   } catch (err) {
//     console.error("getProfile error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// exports.updateProfileImage = async (req, res) => {
//   try {
//     // Cloudinary se image ka URL
//     const profileImage = req.file?.path || req.file?.secure_url;

//     if (!profileImage) {
//       return res.status(400).json({ success: false, error: "No image uploaded" });
//     }

//     // User update karo
//     const user = await User.findByIdAndUpdate(
//       req.params.id,
//       { profileImage },
//       { new: true }
//     );

//     if (!user) {
//       return res.status(404).json({ success: false, error: "User not found" });
//     }

//     res.json({ success: true, user ,message: "Profile image uploaded successfully"});
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// };


const User = require('../../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { cloudinary } = require('../../config/cloudinary');

exports.register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;


    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = await User.create({
      username,
      email,
      password,
      role: role || "user",
    });

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // res.cookie("token", token, {
    //   httpOnly: true,
    //   secure: false,
    //   sameSite: "lax",
    //   maxAge: 7 * 24 * 60 * 60 * 1000,
    // });

     res.cookie("token", token, {
      httpOnly: true,
      secure: true, // local pe false, prod pe true
      sameSite: 'None', // cors me allow hoga
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,

      },
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;


    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 1️⃣ Static Admin Credentials
    const STATIC_ADMIN_EMAIL = "hamza524727@gmail.com";
    const STATIC_ADMIN_PASSWORD = "524727";

    if (email === STATIC_ADMIN_EMAIL && password === STATIC_ADMIN_PASSWORD && role === "admin") {
      const token = jwt.sign(
        { id: "static-admin-id", role: "admin" },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      // res.cookie("token", token, {
      //   httpOnly: true,
      //   secure: process.env.NODE_ENV === "production",
      //   sameSite: "lax",
      //   maxAge: 7 * 24 * 60 * 60 * 1000,
      // });

      res.cookie("token", token, {
        httpOnly: true,
        secure: true, // local pe false, prod pe true
      sameSite: 'None',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });


      return res.status(200).json({
        message: "Static admin login successful",
        user: {
          id: "static-admin-id",
          username: "Admin",
          email: STATIC_ADMIN_EMAIL,
          role: "admin",
        },
        token
      });
    }

    // 2️⃣ Normal User Flow (Database)
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Wrong password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    // cors check se phle
    // res.cookie("token", token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   sameSite: "strict",
    //   maxAge: 7 * 24 * 60 * 60 * 1000,
    // });



    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // local pe false, prod pe true
      sameSite: 'None',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      token
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


exports.logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
  secure: true, // local pe false, prod pe true
      sameSite: 'None',
  }
  );
  res.json({ message: "Logged out successfully" });
};

// exports.authMiddleware = (req, res, next) => {
//   const token = req.cookies?.token;
//   console.log(token, 'YE  auth middle ware m cookies se tokn mila hain')
//   if (!token) {
//     return res.status(401).json({ authenticated: false, message: "Not authenticated" });
//   }
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch (error) {
//     return res.status(401).json({ authenticated: false, message: "Invalid token" });
//   }
// };

exports.authMiddleware = (req, res, next) => {
  console.log("Cookies received:", req.cookies); // <- check
  const token = req.cookies?.token;
  console.log("Token extracted:", token);
  if (!token) {
    return res.status(401).json({ authenticated: false, message: "Not authenticated" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("JWT verify error:", error);
    return res.status(401).json({ authenticated: false, message: "Invalid token" });
  }
};



exports.profile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Profile Error:", error);
    res.status(500).json({ message: "Server error" });
  }
}

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("getProfile error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateProfileImage = async (req, res) => {
  try {
    const profileImage = req.file?.path || req.file?.secure_url;

    if (!profileImage) {
      return res.status(400).json({ success: false, error: "No image uploaded" });
    }

    const userId = req.user.id;

    const user = await User.findByIdAndUpdate(
      userId,
      { profileImage },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    res.json({
      success: true,
      user,
      message: "Profile image uploaded successfully",
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};
