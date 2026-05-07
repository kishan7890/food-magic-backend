const express = require("express")

const Restaurant = require("../models/Restaurant")

const router = express.Router()

// GET ALL RESTAURANTS

router.get("/", async(req,res)=>{

  const restaurants = await Restaurant.find()

  res.json(restaurants)

})

// get single restaurant
router.get("/:id", async (req, res) => {

  const restaurant = await Restaurant.findById(req.params.id)

  res.json(restaurant)

})

// ADD RESTAURANT

router.post("/", async(req,res)=>{

  const restaurant = await Restaurant.create(req.body)

  res.json(restaurant)

})

module.exports = router