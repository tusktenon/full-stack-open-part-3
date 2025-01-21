const mongoose = require('mongoose')

const url = process.env.MONGODB_URI
console.log('connecting to MongoDB...')
mongoose
  .connect(url)
  .then(() => console.log('connection established'))
  .catch(error => console.log('connection failed:', error.message))

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Person', personSchema)
