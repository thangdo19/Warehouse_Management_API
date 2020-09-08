const { User } = require('../models/User')
const { Permission, validatePermission } = require('../models/Permission')
const Joi = require('joi')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const express = require('express')
const router = express.Router()

router.post('/', [validate], async (req, res) => {
  const user = await User.findOne({ where: { email: req.body.email }})
  if (!user) return res.json({ status: 400, message: 'Invalid email or password' })

  const isValidPassword = await bcrypt.compare(req.body.password, user.password)
  if (!isValidPassword) return res.json({ status: 400, message: 'Invalid email or password' })

  const token = jwt.sign({ id: user.id }, process.env.JWT_KEY)
  return res.json({ status: 200, token })
})

function validate(req, res, next) {
  const schema = Joi.object({
    email: Joi.string().email().max(255),
    password: Joi.string().max(1024),
  })
  const { error } = schema.validate(req.body, {
    presence: 'required',
    abortEarly: false
  })
  if (error) return res.json({ status: 400, message: error.message })
  next()
}

module.exports = router