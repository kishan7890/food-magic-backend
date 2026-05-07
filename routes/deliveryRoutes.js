const express = require("express")

const Order = require("../models/Order")

const auth = require("../middleware/authMiddleware")

const router = express.Router()

// AVAILABLE ORDERS

router.get("/orders", auth, async(req,res)=>{

  const orders = await Order.find({
    status:"accepted"
  })

  res.json(orders)

})

// ACCEPT DELIVERY

router.patch("/accept/:id", auth, async(req,res)=>{

  const order = await Order.findByIdAndUpdate(

    req.params.id,

    {
      deliveryBoyId: req.user.id,
      status: "picked"
    },

    {new:true}

  )

  res.json(order)

})

module.exports = router