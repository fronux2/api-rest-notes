const usersRouter = require('express').Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')

usersRouter.post('/', async (request, response) => {
  const { body } = request
  const { username, name, password } = body
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)
  const newUser = new User({
    username,
    name,
    password: passwordHash
  })
  const savedUser = await newUser.save()
  response.json(savedUser)
})

module.exports = usersRouter
