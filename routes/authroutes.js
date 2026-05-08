const express = require("express")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const User = require("../models/User")

const authMiddleware = require("../middleware/authMiddleware");


const router = express.Router()

// REGISTER

router.post("/register", async(req,res)=>{

  try {

    const { name, email, password } = req.body;

    // 1️⃣ check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists. Please login."
      });
    }

    // 2️⃣ hash password
    const hashedPassword = await bcrypt.hash(password, Number(process.env.SALT_ROUNDS));

    // 3️⃣ create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    // 4️⃣ response
    res.status(201).json({
      success: true,
      message: "Signup successful",
      user
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Internal server error"
    });

  }

})

// LOGIN

router.post("/login", async(req,res)=>{

  try {

    const { email, password } = req.body;

    // 1️⃣ find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    // 2️⃣ check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: "Wrong password" });
    }

    // 3️⃣ create token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );
    
    // 4️⃣ store token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // true in production
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000
    });

    // 5️⃣ send response
    res.status(200).json({
      success: true,
      message: "Sign in successful"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Server error"
    });

  }

})

// GET /api/auth/me

router.get("/me", authMiddleware, (req, res) => {
  res.json({
    user: req.user
  })
})

router.post("/logout", (req, res) => {
  res.clearCookie("token",{
    httpOnly: true,
    secure: true,
    sameSite: "none",
  })
  res.json({ msg: "Logged out" })
})



module.exports = router