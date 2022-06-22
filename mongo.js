const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    console.log('Or provide the password, the name and the phone number to be added to the database \n in the form: node mongo.js <password> <name> <phone number>')
    process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://HHG:${password}@cluster0.x7byrh3.mongodb.net/PhonebookDB?retryWrites=true&w=majority`

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {    
    mongoose
    .connect(url)
    .then((result) => {
        Person
        .find({})
        .then((result) => {
            result.forEach(person => {
                console.log(person)
            })
            mongoose.connection.close()
        })
    })
    .catch((err) => {
        console.log(err)
    })

} else if (process.argv.length === 5) {

    const name = process.argv[3]
    const phoneNumber = process.argv[4]
    mongoose
        .connect(url)
        .then((result) => {
            const person =  new Person({
                name : name,
                number : phoneNumber,
            })
            return person.save()
        })
        .then(() => {
            console.log(`added ${name} number ${phoneNumber} to phonebook`)
            mongoose.connection.close()
        })
        .catch((err) => {
            console.log(err)
        })
}