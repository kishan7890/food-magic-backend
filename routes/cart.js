const express = require("express");

const User = require("../models/User")

const authMiddleware = require("../middleware/authMiddleware");


const router = express.Router()

// routes/cart.js

router.post("/add", authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.id)
  const item = req.body

  // 🚨 If cart has items from different restaurant → clear cart
  if (
    user.cart.length > 0 &&
    user.cart[0].restaurantId !== item.restaurantId
  ) {
    user.cart = [] // 🔥 clear old cart
  }

  const existingRestaurant = user.cart.find(
    (r) => r.restaurantId === item.restaurantId
  )

  if (existingRestaurant) {
    const existingItem = existingRestaurant.items.find(
      (i) => i.name === item.name
    )

    if (existingItem) {
      existingItem.quantity += 1
    } else {
      existingRestaurant.items.push({ ...item, quantity: 1 })
    }
  } else {
    user.cart.push({
      restaurantId: item.restaurantId,
      restaurantName: item.restaurantName,
      items: [{ ...item, quantity: 1 }],
    })
  }

  await user.save()
  res.json(user.cart)
})


router.get("/", authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.id)
  res.json(user.cart)
})


router.put("/increase", authMiddleware, async (req, res) => {
  try {
    const { restaurantId, name } = req.body

    const user = await User.findById(req.user.id)

    if (!user) {
      return res.status(404).json({ msg: "User not found" })
    }

    const restaurant = user.cart.find(
      (r) => r.restaurantId === restaurantId
    )

    if (!restaurant) {
      return res.status(404).json({ msg: "Restaurant not found in cart" })
    }

    const item = restaurant.items.find(
      (i) => i.name === name
    )

    if (!item) {
      return res.status(404).json({ msg: "Item not found in cart" })
    }

    // ✅ increase quantity
    item.quantity += 1

    await user.save()

    res.json(user.cart)

  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: "Server error" })
  }
})

router.put("/decrease", authMiddleware, async (req, res) => {
  try {
    const { restaurantId, name } = req.body

    const user = await User.findById(req.user.id)

    if (!user) {
      return res.status(404).json({ msg: "User not found" })
    }

    const restaurant = user.cart.find(
      (r) => r.restaurantId === restaurantId
    )

    if (!restaurant) {
      return res.status(404).json({ msg: "Restaurant not found" })
    }

    const item = restaurant.items.find(
      (i) => i.name === name
    )

    if (!item) {
      return res.status(404).json({ msg: "Item not found" })
    }

    // ✅ decrease quantity
    item.quantity -= 1

    // ✅ remove item if quantity <= 0
    if (item.quantity <= 0) {
      restaurant.items = restaurant.items.filter(
        (i) => i.name !== name
      )
    }

    // ✅ remove restaurant if empty
    if (restaurant.items.length === 0) {
      user.cart = user.cart.filter(
        (r) => r.restaurantId !== restaurantId
      )
    }

    await user.save()

    res.json(user.cart)

  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: "Server error" })
  }
})

router.delete("/remove", authMiddleware, async (req, res) => {
  try {
    const { restaurantId, name } = req.body

    const user = await User.findById(req.user.id)

    if (!user) {
      return res.status(404).json({ msg: "User not found" })
    }

    const restaurant = user.cart.find(
      (r) => r.restaurantId === restaurantId
    )

    if (!restaurant) {
      return res.status(404).json({ msg: "Restaurant not found" })
    }

    const itemExists = restaurant.items.some(
      (i) => i.name === name
    )

    if (!itemExists) {
      return res.status(404).json({ msg: "Item not found" })
    }

    // ✅ remove item
    restaurant.items = restaurant.items.filter(
      (i) => i.name !== name
    )

    // ✅ remove restaurant if empty
    if (restaurant.items.length === 0) {
      user.cart = user.cart.filter(
        (r) => r.restaurantId !== restaurantId
      )
    }

    await user.save()

    res.json(user.cart)

  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: "Server error" })
  }
})

module.exports = router