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
morgan.token('body', (request) => JSON.stringify(request.body))
app.use(morgan(':method :url :status :res[content-length] :response-time ms :body'))
//

app.get('/', (request, response) => {
    response.send('<h1>Phonebook app</h1>')
})

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

app.get('/api/persons/:id/', (request, response) => {
    const id = request.params.id
    Person.find({_id:id}).then((person) => {
        response.json(person)
    }).catch((error) => {
        console.log("error 404: person not found")
    })
})

app.delete('/api/persons/:id/', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter((person) => {
        return (person.id !== id)
    })
    response.status(204).end()
})

app.post('/api/persons/', (request, response) => {
    const person = request.body
    if(!person.name) {
        return response.status(400).json({
            error: "name missing"
        })
    } else if (!person.number) {
        return response.status(400).json({
            error: "number missing"
        })
    } else {
        const newPerson = new Person({
            name: person.name,
            number: person.number,
        })
        newPerson.save().then((savedNewPerson) => {
            response.json(savedNewPerson)
        })
    }
})

const generateID = () => {
    const id = Math.floor(Math.random() * 999999999999)
    return id
}

const checkExistence = (name) => {
    const names = persons.map((person) => {
        return person.name
    })
    return names.includes(name)
}

const PORT = process.env.PORT
app.listen(PORT)
console.log(`Server running on port ${PORT}`)