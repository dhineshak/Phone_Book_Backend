const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')

app.use(express.static('build'))
app.use(express.json())
app.use(morgan('tiny'));
app.use(cors())

const requestLogger = (request, response, next) => {
  console.log('Body:  ', request.body)
  next()
}

app.use(requestLogger)

let contacts = [
    {
      name: "Arto Hellas",
      number: "040-123456",
      id: 1
    },
    {
      name: "Ada Lovelace",
      number: "39-44-5323523",
      id: 2
    },
    {
      name: "Dan Abramov",
      number: "12-43-234345",
      id: 3
    },
    {
      name: "Dad",
      number: "39-23-6423122",
      id: 4
    }
  ]

const generateId = () => {
  let newId = 0
  const id = contacts.map(contact => contact.id)
  while(newId === 0 || id.indexOf(newId) !== -1){
    newId = Math.floor(Math.random()*1000) + 1;
  }
  return newId
}

app.get('/api/persons',(request, response) => {
  response.json(contacts)
})

app.get('/api/persons/:id',(request, response) => {
  const id = Number(request.params.id)
  const contact = contacts.filter(contact => contact.id === id)
  if(contact.length === 0){
    return response.status(404).end()
  }
  response.json(contact)
})

app.post('/api/persons/',(request, response) => {
  const newContact = request.body
  if(!(newContact) || !(newContact.name)){
    return response.status(400).json({error:'Name cannot be Empty'})
  }
  if(!(newContact.number)){
    return response.status(400).json({error:'Number cannot be Empty'})
  }
  const name = contacts.filter(contact => newContact.name === contact.name)
  
  if(name.length > 0){
    return response.status(400).json({error:'Name must be unique'})
  }
  newContact.id = generateId()
  contacts.push(newContact)
  response.json(newContact)
})

app.delete('/api/persons/:id',(request, response) => {
  const id = Number(request.params.id)
  contacts = contacts.filter(contact => contact.id != id)
  return response.status(204).end()
})

app.get('/api/info',(request, response) => { 
  response.send(`<div><p>Phonebook has info for ${contacts.length} people</p><p>${new Date()}</p></div>`)
})

const PORT = process.env.PORT || 3001
app.listen(PORT,()=>{
  console.log(`Server running on port ${PORT}`)
})

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
