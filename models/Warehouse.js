const Joi = require('joi')
const Sequelize = require('sequelize')
const sequelize = require('../db/connection')

const Warehouse = sequelize.define('Warehouse', {
  id: {
    type: Sequelize.INTEGER(11),
    primaryKey: true,
    autoIncrement: true
  },
  cityId: {
    type: Sequelize.INTEGER(11),
  },
  name: {
    type: Sequelize.STRING(255),
    allowNull: false
  },
  address: {
    type: Sequelize.STRING(255),
    allowNull: false
  },
  description: {
    type: Sequelize.STRING(255)
  },
}, { 
  tableName: 'warehouses'
})

function validateWarehouse(req, res, next) {
  const schema = Joi.object({
    cityId: Joi.number(),
    name: Joi.string().max(255),
    address: Joi.string().max(255),
    description: Joi.string().max(255).optional(),
  })
  // seek for error
  const { error } = schema.validate(req.body, {
    presence: (req.method !== 'PATCH') ? 'required' : 'optional',
    abortEarly: false
  })
  if (error) return res.json({ status: 400, message: error.message })
  // no validation error, pass to next middleware
  next()
}

module.exports = {
  Warehouse, 
  validateWarehouse
}