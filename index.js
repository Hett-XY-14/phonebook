const express = require('express')
const app = express()
app.use(express.json())

const cors = require('cors')
app.use(cors())

const morgan = require('morgan')
morgan.token('body', (request) => JSON.stringify(request.body))
app.use(morgan(':method :url :status :res[content-length] :response-time ms :body'))

let persons = [
    { 
        "id": 1,
        "name": "Arto Hellas", 
        "number": "040-123456"
      },
      { 
        "id": 2,
        "name": "Ada Lovelace", 
        "number": "39-44-5323523"
      },
      { 
        "id": 3,
        "name": "Dan Abramov", 
        "number": "12-43-234345"
      },
      { 
        "id": 4,
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122"
      }
]

app.get('/', (request, response) => {
    response.send('<h1>Hello World</h1>')
})

app.get('/api/persons/', (request, response) => {
    response.json(persons)
})

app.get('/info/' , (request, response) => {
    const time = new Date()
    const entries = persons.length
    console.log(`Time: ${time}; Entries: ${entries}`)
    response.send(`<p>Phonebook has info for ${entries} people</p><p>${time}</p>`)
})

app.get('/api/persons/:id/', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find((person) => {
        return (person.id === id)
    })
    if(!person) {
        return response.status(404).end()
    }
    response.json(person)
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
    } else if (checkExistence(person.name)) {
        return response.status(400).json({
            error: "name must be unique"
        })
    } else {
        const newPerson = {
            name: person.name,
            number: person.number,
            id: generateID(99999999)
        }
        persons = persons.concat(newPerson)
        response.json(newPerson)
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

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)