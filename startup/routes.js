const morgan = require('morgan')
const express = require('express')
// requires routes
const auth = require('../routes/auth')
const users = require('../routes/users')
const permissions = require('../routes/permissions')
// error handler middleware
const error = require('../middleware/error')
module.exports = function(app) {
  // middleware
  app.use(express.json())
  app.use(morgan('dev'))
  // routes
  app.use('/api/auth', auth)
  app.use('/api/users', users)
  app.use('/api/permissions', permissions)
  // last middleware to handle route's error
  app.use(error)
}