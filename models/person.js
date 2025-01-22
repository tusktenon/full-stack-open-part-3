const mongoose = require('mongoose')

const personSchema = new mongoose.Schema({
  name: { type: String, minLength: 3, required: true, unique: true },
  number: {
    type: String,
    required: true,
    validate: {
      validator: v => /^\d{2}-\d{6,}$/.test(v) || /^\d{3}-\d{5,}$/.test(v),
      message: '{VALUE} is not a valid phone number'
    },
  },
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Person', personSchema)
