const Joi = require('joi')
const Sequelize = require('sequelize')
const sequelize = require('../db/connection')

const UserPermission = sequelize.define('UserPermission', {
  id: {
    type: Sequelize.INTEGER(11),
    primaryKey: true,
    autoIncrement: true
  },
  permissionId: {
    type: Sequelize.INTEGER(11)
  },
  userId: {
    type: Sequelize.INTEGER(11)
  }
}, {
  tableName: 'user_permissions'
})

function validateUserPermission(req, res, next) {
  const schema = Joi.object({
    id: Joi.number(),
    permissionId: Joi.number(),
    userId: Joi.number()
  })
  const { error } = schema.validate(req.body, {
    presence: (req.method !== 'PATCH') ? 'required' : 'optional',
    abortEarly: false
  })
  if (error) return res.json({ status: 400, message: error.message })
  next()
}

module.exports = {
  UserPermission,
  validateUserPermission
}