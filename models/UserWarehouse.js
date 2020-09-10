const Joi = require('joi')
const Sequelize = require('sequelize')
const sequelize = require('../db/connection')

const UserWarehouse = sequelize.define('UserWarehouse', {
  id: {
    type: Sequelize.INTEGER(11),
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: Sequelize.INTEGER(11),
  },
  warehouseId: {
    type: Sequelize.INTEGER(11),
  },
}, { tableName: 'user_warehouses' })

function validateUserWarehouse(req, res, next) {
  const schema = Joi.object({
    userId: Joi.number(),
    warehouseId: Joi.number(),
  })
  const { error } = schema.validate(req.body, {
    presence: (req.method !== 'PATCH') ? 'required' : 'optional',
    abortEarly: false
  })
  if (error) return res.json({ status: 400, message: error.message })
  next()
}

module.exports = {
  UserWarehouse,
  validateUserWarehouse
}