const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: ["user", "restaurant", "delivery"],
    default: "user"
  },
 
  cart: [
    {
      restaurantId: String,
      restaurantName: String,
      items: [
        { name: String, price: Number, quantity: Number }
      ]
    }
  ],

  addresses: [
    {
      fullName: String,
      phone: String,
      city: String,
      pincode: String,
      addressLine: String
    }
  ]

}, { timestamps: true })

module.exports = mongoose.model("User", userSchema)