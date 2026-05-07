const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema({

  userId: String,
  items: Array,
  totalAmount: Number,
  address: Object,

  paymentMethod: {
    type: String,
    enum: ["cod", "online"],
    default: "cod"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

}, { timestamps: true })

module.exports = mongoose.model("Order", orderSchema)