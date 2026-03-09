const mongoose = require("mongoose")

const speakerSchema = new mongoose.Schema({
      name: String,
      designation: String,
      speakerImage: String
})

const Speaker = mongoose.model("Speaker",speakerSchema )

module.exports = Speaker