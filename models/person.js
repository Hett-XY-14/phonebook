const mongoose = require('mongoose')
require('dotenv').config()
const url = process.env.MONGODB_URI

console.log('attempting to connect to MongoDB...')

mongoose
    .connect(url)
    .then(() => {
        console.log('connection to MongoDB stablished!')
    })
    .catch((error) => {
        console.log('the connection to MongoDB has failed, the next error has ocurred: ', error.message)
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true
    },
    number: {
        type: String,
        validate: {
            validator: (value) => {
                return /\d{2,3}-\d{5,}/y.test(value)
            },
            message: 'Valid formats: xxx-xxxxx... or xx-xxxxxx... (8 or more digits)' 
        },
        required: true,
        minLength: 8,
        maxLength: 14
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