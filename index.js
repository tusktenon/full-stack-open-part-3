const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

const app = express()

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

app.use(cors())

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
  response.send(`<p>Phonebook has entries for ${persons.length} people.</p>
<p>${Date()}</p>`)
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const person = persons.find(p => p.id === request.params.id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.post('/api/persons', (request, response) => {
  const { name, number } = request.body

  if (!name) {
    return response.status(400).json({ error: 'name missing' })
  }

  if (!number) {
    return response.status(400).json({ error: 'number missing' })
  }

  if (persons.some(p => p.name === name)) {
    return response.status(409).json({ error: 'name must be unique' })
  }

  const id = String(Math.floor(Math.random() * 1_000_000))
  const person = { id, name, number }
  persons.push(person)
  response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
  persons = persons.filter(p => p.id !== request.params.id)
  response.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
