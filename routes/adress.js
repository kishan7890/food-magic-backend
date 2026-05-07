const express = require("express")
const router = express.Router()

const User = require("../models/User")

const authMiddleware = require("../middleware/authMiddleware")

// ✅ Add Address
router.post("/", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)

    user.addresses.push(req.body)

    await user.save()

    res.json(user.addresses)

  } catch (error) {
    res.status(500).json({ msg: "Server error" })
  }
})

// GET addresses
router.get("/", authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.id)
  res.json(user.addresses)
})

module.exports = router