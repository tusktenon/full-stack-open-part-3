const mongoose = require('mongoose')
const Person = require('./models/person')

const argv = process.argv

if (argv.length < 3) {
  handleArgsError()
}

const password = process.argv[2]
const url = `mongodb+srv://dcmurphy:${password}@cluster0.my3hy.mongodb.net/phoneNumberApp?retryWrites=true&w=majority&appName=Cluster0`
mongoose.connect(url)

switch (argv.length) {
  case 3:
    displayAllEntries().then(() => mongoose.connection.close())
    break
  case 5:
    addEntry(argv[3], argv[4]).then(() => mongoose.connection.close())
    break
  default:
    handleArgsError()
}

function displayAllEntries() {
  return Person.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
  })
}

function addEntry(name, number) {
  const person = new Person({ name, number })
  return person
    .save()
    .then(() => console.log(`added ${name} number ${number} to phonebook`))
    .catch(error => console.log(error.message))
}

function handleArgsError() {
  console.log(`Usages:
  node mongo.js <password>
  node mongo.js <password> <newName> <newNumber>`)
  process.exit(1)
}
