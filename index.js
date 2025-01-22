const express = require('express')
const cors = require('cors')
require('dotenv').config()
const morgan = require('morgan')
const Person = require('./models/person')

const app = express()

const errorHandler = (error, request, response, next) => {
  const { name, message } = error
  console.error(`${name}: ${message}`)

  switch (name) {
    case 'CastError':
      return response.status(400).send({ error: 'malformatted id' })
    case 'ValidationError':
      return response.status(400).send({ error: message })
  }

  next(error)
}

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

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const { name, number } = request.body
  const person = new Person({ name, number })
  person
    .save()
    .then(saved => response.json(saved))
    .catch(error => next(error))
})

app.patch('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndUpdate(
    request.params.id,
    { number: request.body.number },
    { new: true, runValidators: true },
  )
    .then(updated => {
      if (updated) {
        response.json(updated)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => response.status(204).end())
    .catch(error => next(error))
})

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
