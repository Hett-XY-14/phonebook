const { builtinModules } = require('module')
const mongoose = require('mongoose')
require('dotenv').config()
const url = process.env.MONGODB_URI

console.log("attempting to connect to MongoDB...")

mongoose
.connect(url)
.then((result) => {
    console.log("connection to MongoDB stablished!")
})
.catch((error) => {
    console.log("the connection to MongoDB has failed, the next error has ocurred: ", error.message)
})

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true
    },
    number: {
        type: String,
        required: true,
        minLength: 10,
        maxLength: 10
    }
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Person = mongoose.model('Person', personSchema)

module.exports = Person