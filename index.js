const express = require("express")
const app = express()
const {initializeDatabase} = require("./db/db.connect")
const Event = require("./models/event.models")
const Speaker =  require("./models/speaker.models")
app.use(express.json())
initializeDatabase()

const cors = require("cors");
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

async function createSpeaker(newSpeaker){
    try{
        const speaker = new Speaker(newSpeaker)
        const saveSpeaker = await speaker.save()
        return saveSpeaker
    } catch(error){
        throw error 
    }
    
}
app.post("/speakers",async(req,res)=>{
    try{
        const savedSpeaker = await createSpeaker(req.body)
        res.status(201).json({message: "Speaker added successfully." , speaker: savedSpeaker})
    } catch(error){
        res.status(500).json({error: "Failed to add speaker"})
    }
})

async function createEvent(newEvent){
    try{
        const event = new Event(newEvent)
        const saveEvent = await event.save()
        return saveEvent
    } catch(error){
        throw error 
    }
    
}

app.post("/events",async(req,res)=>{
    try{
        const savedEvent = await createEvent(req.body)
        res.status(201).json({message: "Event added successfully." , event: savedEvent})
    } catch(error){
        res.status(500).json({error: "Failed to add event"})
    }
})


async function readAllEvents(){
   try{
      const allEvents = await Event.find().populate("speakers")
      console.log(allEvents)
      return allEvents
    } catch(error){
        console.log(error)
    }
}

app.get("/events",async(req,res) => {
    try{
        const events = await readAllEvents()
        if(events.length != 0){
            res.json(events)
        } else {
            res.status(404).json({ error: "No events found."})
        }
    }catch(error){
        res.status(500).json({error: "Failed to fetch events"})
    }
})

//get events by id
async function readEventById(eventId){
    try{
        const event = await Event.findById(eventId).populate("speakers")
        return event
    } catch(error){
        throw error
    }
}

app.get("/events/:eventId", async (req,res) => {
    try{
        const event = await readEventById(req.params.eventId)
        if(event){
            res.json(event)
        } else {
            res.status(404).json({error: "Event not found"})
        }
    } catch(error){
        res.status(500).json({error: "Failed to fetch event."})
    }
} )

//Search box to read a event by its title from the Database
async function readEventByTitle(eventTitle){
    try{
        const event = await Event.findOne({title:eventTitle}).populate("speakers")
        return event
    } catch(error){
        throw error
    }
}

app.get("/events/title/:eventTitle", async (req,res) => {
    try{
        const event = await readEventByTitle(req.params.eventTitle)
        if(event){
            res.json(event)
        } else {
            res.status(404).json({error: "Event not found"})
        }
    } catch(error){
        res.status(500).json({error: "Failed to fetch event."})
    }
} )



//Dropdown to read all events by type from the Database

async function readEventByType(eventType){
    try{
        const events = await Event.find({type:eventType}).populate("speakers")
        return events
    } catch(error){
        throw error
    }

}

app.get("/events/type/:eventType", async (req,res) => {
    try{
        const events = await readEventByType(req.params.eventType)
        if(events){
            res.json(events)
        } else {
            res.status(404).json({error: "Event not found"})
        }
    } catch(error){
        res.status(500).json({error: "Failed to fetch event."})
    }
} )


//Search box to read a event by its tags from the Database
async function readEventByTag(eventTag){
    try{
        const event = await Event.find({tags:eventTag}).populate("speakers")
        return event
    } catch(error){
        throw error
    }
}

app.get("/events/tags/:eventTag", async (req,res) => {
    try{
        const event = await readEventByTag(req.params.eventTag)
        if(event){
            res.json(event)
        } else {
            res.status(404).json({error: "Event not found"})
        }
    } catch(error){
        res.status(500).json({error: "Failed to fetch event."})
    }
} )


//to delete a event data by their ID in the Database
async function deleteEvent(eventId){
    try{
        const deletedEvent = await Event.findByIdAndDelete(eventId)
        return deletedEvent
    } catch (error){
        console.log(error)
    }
}

app.delete("/events/:eventId" , async(req,res) => {
    try{ 
        const deletedEvent = await deleteEvent(req.params.eventId)
        if(deletedEvent){
            res.status(200).json({message: "Event deleted successfully."})
        }       
    } catch(error){
        res.status(500).json({error: "Failed to delete event."})
    }
} )


// to update a event data by their ID in the Database
async function updateEvent(eventId, dataToUpdate) {
    try{
        const updatedEvent = await Event.findByIdAndUpdate(eventId,dataToUpdate,{new:true,})
        return updatedEvent
    } catch(error){
        console.log("Error in updating Event " , error)
    }
}

app.post("/events/:eventId" , async(req,res)=>{
    try{
        const updatedEvent = await updateEvent(req.params.eventId, req.body)
        if(updatedEvent){
            res.status(200).json({message: "Event updated successully.", updatedEvent:updatedEvent})
        } else {
            res.status(404).json({error: "Event not found"})
        }
    } catch(error){
        res.status(500).json({error: "failed to update event."})
    }
})

const PORT = 3000
app.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}`)
})