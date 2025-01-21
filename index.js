const express = require('express')
const cors = require('cors')
require('dotenv').config()
const morgan = require('morgan')
const Person = require('./models/person')

const app = express()

/*
let persons = [
  {
    id: '1',
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: '2',
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: '3',
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: '4',
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
]
*/

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())

morgan.token('post-content', req =>
  req.method === 'POST' ? JSON.stringify(req.body) : '',
)

app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :post-content',
  ),
)

app.get('/', (request, response) => {
  response.send('<h1>Phonebook Server</h1>')
})

app.get('/info', (request, response) => {
  Person.estimatedDocumentCount().then(count => {
    response.send(`<p>Phonebook has entries for ${count} people.</p>
<p>${Date()}</p>`)
  })
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(people => response.json(people))
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id)
    .then(person => response.json(person))
    .catch(error => {
      console.log(`GET /api/persons/${request.params.id}:`, error.message)
      response.status(404).end()
    })
})

app.post('/api/persons', (request, response) => {
  const { name, number } = request.body

  if (!name) {
    return response.status(400).json({ error: 'name missing' })
  }

  if (!number) {
    return response.status(400).json({ error: 'number missing' })
  }

  const person = new Person({ name, number })
  person.save().then(saved => response.json(saved))
})

app.delete('/api/persons/:id', (request, response) => {
  persons = persons.filter(p => p.id !== request.params.id)
  response.status(204).end()
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
