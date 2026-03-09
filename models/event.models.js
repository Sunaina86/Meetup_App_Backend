const mongoose = require("mongoose")

const eventSchema  = new mongoose.Schema({
    title: { type: String, required: true },
    date: { type: String, required: true },
    type: { type: String, enum: ["Online", "Offline"], required: true },
    imageUrl: { type: String, required: true },
    description: String,
    topic: String,
    sessionTimings: String,
    speakers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Speaker" }],
    price: Number,
    venue: String,
    address: String,
    additionalInfo: String,
    tags: [String],  
    
    },{
        timestamps:true
    })

    const Event = mongoose.model("Event",eventSchema )

    module.exports = Event