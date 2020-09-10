const Joi = require('joi')
const Sequelize = require('sequelize')
const sequelize = require('../db/connection')

const WarehouseProduct = sequelize.define('WarehouseProduct', {
  id: {
    type: Sequelize.INTEGER(11),
    primaryKey: true,
    autoIncrement: true
  },
  warehouseId: {
    type: Sequelize.INTEGER(11),
  },
  productId: {
    type: Sequelize.INTEGER(11),
  },
}, { tableName: 'warehouse_products' })

function validateWarehouseProduct(req, res, next) {
  const schema = Joi.object({
    warehouseId: Joi.number(),
    productId: Joi.number(),
  })
  const { error } = schema.validate(req.body, {
    presence: (req.method !== 'PATCH') ? 'required' : 'optional',
    abortEarly: false
  })
  if (error) return res.json({ status: 400, message: error.message })
  next()
}

module.exports = {
  WarehouseProduct,
  validateWarehouseProduct
}