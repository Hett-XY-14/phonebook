require('dotenv').config()
const express = require('express')
const app = express()
app.use(express.json())
//
const Person = require('./models/person')
//
const cors = require('cors')
app.use(cors())
//
app.use(express.static('build'))
//
const morgan = require('morgan')
const { nextTick } = require('process')
const { LOADIPHLPAPI } = require('dns')
morgan.token('body', (request) => JSON.stringify(request.body))
app.use(morgan(':method :url :status :res[content-length] :response-time ms :body'))
//

app.get('/api/persons/', (request, response) => {
    Person.find({}).then((persons) => {
        response.json(persons)
    })
})

app.get('/info/' , (request, response) => {
    const time = new Date()
    Person.find({}).then((persons) => {
        const entries = persons.length
        console.log(`Time: ${time}; Entries: ${entries}`)
        response.send(`<p>Phonebook has info for ${entries} people</p><p>${time}</p>`)
    })
})

app.get('/api/persons/:id/', (request, response, next) => {
    const id = request.params.id
    Person.findById(id).then((person) => {
        if (person) {
            response.json(person)
        } else {
            response.status(404).end()
        }
    }).catch((error) => {
        next(error)
    })
})

app.delete('/api/persons/:id/', (request, response, next) => {
    const id = request.params.id
    Person.findByIdAndDelete(id)
    .then((deletedPerson) => {
        response.json(deletedPerson)
    })
    .catch((error) => {
        next(error)
    })
})

app.post('/api/persons/', (request, response, next) => {
    const person = request.body
    const newPerson = new Person({
        name: person.name,
        number: person.number,
    })
    newPerson.save().then((savedNewPerson) => {
        response.json(savedNewPerson)
    })
    .catch((error) => {
        next(error)
    })
    
})

app.put('/api/persons/:id',  (request, response, next) => {
    const id = request.params.id
    const body = request.body

    const newPerson = {
        name : body.name,
        number : body.number
    }

    Person.findByIdAndUpdate(id, newPerson, {new: true, runValidators:true, context:'query'})
    .then((updatedPerson) => {
        response.json(updatedPerson)
    })
    .catch((error) => {
        next(error)
    })
})

const unknownEndPoint = (request, response) => {
    response.status(404).send({error : 'unknown endpoint'})
}
app.use(unknownEndPoint)

const errorHandler = (error, request, response, next) => {
    if (error.name === 'CastError') {
        console.log(error)
        return response.status(400).send({error : 'malformated id'})
    } else if (error.name === 'ValidationError') {
        console.log(error)
        return response.status(400).send({error: error.message})
    }
    next(error)
} 
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT)
console.log(`Server running on port ${PORT}`)