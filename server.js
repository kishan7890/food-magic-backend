const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const cookieparser = require("cookie-parser")
require("dotenv").config()

const connectDB = require("./config/db")

const authRoutes = require("./routes/authroutes")
const restaurantRoutes = require("./routes/restaurantRoutes")
const orderRoutes = require("./routes/orderRoutes")
const deliveryRoutes = require("./routes/deliveryRoutes")
const CartRoutes = require("./routes/cart")
const addressRoute = require("./routes/adress")

const app = express()


app.use(express.json());
app.use(cors({
  origin: "https://food-magic-frontend.vercel.app/",
  credentials: true
}))
app.use(cookieparser());

connectDB()

app.use("/api/auth", authRoutes)
app.use("/api/restaurants", restaurantRoutes)
app.use("/api/orders", orderRoutes)
app.use("/api/delivery", deliveryRoutes)
app.use("/api/cart",CartRoutes)
app.use("/api/address",addressRoute)

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log("Server running on port", PORT)
})