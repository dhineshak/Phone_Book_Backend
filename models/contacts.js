const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log('connecting to', url)

const password = process.argv[2]

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
.then(result => {
  console.log('connected to MongoDB')
})
.catch((error) => {
  console.log('error connecting to MongoDB:', error.message)
})


const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength:2,
    maxLength:20,
    required:true
  },
  number: {
   type: String,
   required : true,
   minLength: 7,
   maxLength: 15
  }
})

contactSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Contact', contactSchema)

