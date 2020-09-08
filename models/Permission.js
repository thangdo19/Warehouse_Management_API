const Joi = require('joi')
const Sequelize = require('sequelize')
const sequelize = require('../db/connection')

const Permission = sequelize.define('Permission', {
  id: {
    type: Sequelize.INTEGER(11),
    primaryKey: true,
    autoIncrement: true
  },
  permissionName: {
    type: Sequelize.STRING(255),
    allowNull: false,
    unique: true
  }
})

function validatePermission(req, res, next) {
  const schema = Joi.object({
    permissionName: Joi.string().max(255)
  })
  const { error } = schema.validate(req.body, {
    presence: (req.method) ? 'required' : 'optional',
    abortEarly: false
  })
  if (error) return res.json({ status: 400, message: error.message });
  next()
}

module.exports = {
  Permission,
  validatePermission
}