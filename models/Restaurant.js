const mongoose = require("mongoose")

const restaurantSchema = new mongoose.Schema({

  name: {type:String,required:true} ,
  image: String,
  location: {type:String,required:true},

  menu: [
    {
      name: String,
      image:String,
      price: Number
    }
  ]

})

module.exports = mongoose.model("Restaurant", restaurantSchema)