const express = require("express")
const User = require("../models/User")
const Order = require("../models/Order")

const auth = require("../middleware/authMiddleware")

const router = express.Router()

// CREATE ORDER

router.post("/place", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)

    if (!user) {
      return res.status(404).json({ msg: "User not found" })
    }

    const { address, paymentMethod } = req.body

    if (!address) {
      return res.status(400).json({ msg: "Address required" })
    }

    // ✅ correct nested total
    const total = user.cart.reduce((sum, restaurant) => {
      return (
        sum +
        restaurant.items.reduce(
          (sub, item) => sub + item.price * item.quantity + 40 + 20,
          0
        )
      )
    }, 0)

    const newOrder = new Order({
      userId: user._id,
      items: user.cart,
      totalAmount: total,
      address,
      paymentMethod
    })

    await newOrder.save()

    user.cart = []
    await user.save()

    res.json({
      msg: "Order placed successfully",
      orderId: newOrder._id
    })

  } catch (error) {
    console.log("ORDER ERROR:", error) // 🔥 IMPORTANT
    res.status(500).json({ msg: "Server error" })
  }
})

// GET USER ORDERS

router.get("/myorders", auth, async(req,res)=>{

  const orders = await Order.find({
    userId: req.user.id
  })

  res.json(orders)

})

module.exports = router