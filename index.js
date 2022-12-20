require('dotenv').config()
require('./mongo')
const Note = require('./models/Note')
const express = require('express')
const app = express()
const cors = require('cors')
const notFound = require('./middleware/notFound.js')
const handleErrors = require('./middleware/handleErrors')
const usersRouter = require('./controllers/users')

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

app.get('/api/notes/:id', (request, response, next) => {
  const { id } = request.params

  Note.findById(id)
    .then(note => {
      if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
    }).catch(err => next(err))
})

app.delete('/api/notes/:id', (request, response) => {
  const { id } = request.params
  Note.findByIdAndDelete(id)
    .then(noteRemove => {
      response.json(noteRemove)
    })
})

app.put('/api/notes/:id', (request, response) => {
  const { id } = request.params
  const note = request.body
  const updatedNoteInfo = {
    content: note.content,
    important: note.important
  }

  Note.findByIdAndUpdate(id, updatedNoteInfo, { new: true })
    .then(result => {
      response.json(result)
    })
})

app.use('/api/users', usersRouter)

app.use(notFound)
app.use(handleErrors)

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`)
})
