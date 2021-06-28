require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const Contact = require('./models/contacts')

app.use(express.static('build'))
app.use(express.json())
app.use(morgan('tiny'));
app.use(cors())

const requestLogger = (request, response, next) => {
  console.log('Body:  ', request.body)
  next()
}
app.use(requestLogger)
 
// const generateId = () => {
//   let newId = 0
//   const id = contacts.map(contact => contact.id)
//   while(newId === 0 || id.indexOf(newId) !== -1){
//     newId = Math.floor(Math.random()*1000) + 1;
//   }
//   return newId
// }

app.get('/api/persons',(request, response, next) => {
  Contact.find({}).then(contacts => {
    response.json(contacts)
    // mongoose.connection.close()
  }).catch(error => next(error))
})

app.get('/api/persons/:id',(request, response, next) => {
  Contact.findById(request.params.id).then(result => {
    if(result){
      response.json(result)
    }else{
      return response.status(404).end()
    }
    // mongoose.connection.close()
  }).catch(error => next(error))
})

app.post('/api/persons',(request, response, next) => {
  const newContact = request.body
  if(!(newContact) || !(newContact.name) || !(newContact.number)){
    // mongoose.connection.close()
    return response.status(400).json({error:'Name or number cannot be Empty'})
  }
  Contact.find({name:newContact.name}).then(result => {
    if(result.length != 0){
      const editContact = {
        name: newContact.name,
        number: newContact.number,
      }
      Contact.findByIdAndUpdate(request.params.id,editContact,{new:true}).then(result => {
          response.json(result)
        // mongoose.connection.close()
      }).catch(error => next(error))
    }
  })
  const contact = new Contact({
    name: newContact.name,
    number: newContact.number,
  })
  contact.save().then(result => {
    response.json(result)
    // mongoose.connection.close()
  }).catch(error => next(error))
})

app.put('/api/persons/:id',(request, response, next) => {
  const newContact = request.body
  const editContact = {
    name: newContact.name,
    number: newContact.number,
  }
  Contact.findByIdAndUpdate(request.params.id,editContact,{new:true}).then(result => {
    response.json(result)
    // mongoose.connection.close()
  }).catch(error => next(error))
})

app.delete('/api/persons/:id',(request, response, next) => {
  Contact.findByIdAndRemove(request.params.id).then(result => {
      response.status(204).end()
    // mongoose.connection.close()
  }).catch(error => next(error))
})

app.get('/api/info',(request, response) => { 
  Contact.find({}).then(contacts => {
    response.send(`<div><p>Phonebook has info for ${contacts.length} people</p><p>${new Date()}</p></div>`)
    mongoose.connection.close()
  })
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }else if(error.name === 'ValidationError'){
    return response.status(400).send({ error: error.message })
  }
  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT,()=>{
  console.log(`Server running on port ${PORT}`)
})

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
