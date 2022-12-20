require('dotenv').config()
require('./mongo')
const Note = require('./models/Note')
const express = require('express')
const app = express()
const cors = require('cors')

app.use(cors())
app.use(express.json())

app.get('/', (request, response) => {
  response.send('<h1>Hola mundo</h1>')
})

app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

app.post('/api/notes', (request, response) => {
  const note = request.body

  const nuevaNota = new Note({
    content: note.content,
    date: new Date(),
    important: note.important
  })

  nuevaNota.save().then(savedNote => {
    response.json(savedNote)
  })
})

app.get('/api/notes/:id', (request, response) => {
  const { id } = request.params

  Note.findById(id)
    .then(note => {
      if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
    })
})

app.delete('/api/notes/:id', (request, response) => {
  const { id } = request.params
  Note.findByIdAndDelete(id)
    .then(noteRemove => {
      response.json(noteRemove)
    })
})

app.use((request, response) => {
  response.status(404).json({
    error: 'Not found'
  })
})

const PORT = 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
