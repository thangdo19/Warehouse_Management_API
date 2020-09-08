const Joi = require('joi')
const Sequelize = require('sequelize')
const sequelize = require('../db/connection')

const PermissionDetail = sequelize.define('PermissionDetail', {
  id: {
    type: Sequelize.INTEGER(11),
    primaryKey: true,
    autoIncrement: true
  },
  permissionId: {
    type: Sequelize.INTEGER(11)
  },
  actionCode: {
    type: Sequelize.STRING(255),
    allowNull: false
  },
  actionName: {
    type: Sequelize.STRING(255),
    allowNull: false
  },
  checkAction: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
    allowNull: false
  }
}, {
  tableName: 'permission_details'
})

function validatePermissionDetail(req, res, next) {
  const schema = Joi.object({
    permissionId: Joi.number(),
    actionCode: Joi.string().max(255),
    actionName: Joi.string().max(255),
    checkAction: Joi.boolean()
  })
  const { error } = schema.validate(req.body, {
    presence: (req.method !== 'PATCH') ? 'required' : 'optional',
    abortEarly: false
  })
  if (error) return res.json({ status: 400, message: error.message });
  next()
}

function validateActions(req, res, next) {
  const schema = Joi.object({
    permissionId: Joi.number(),
    actionNames: Joi.array().items(Joi.string().max(255)),
    havePermission: Joi.boolean()
  })
  const { error } = schema.validate(req.body, {
    presence: 'required',
    abortEarly: false
  })
  if (error) return res.json({ status: 400, message: error.message });
  next()
}

module.exports = {
  PermissionDetail,
  validatePermissionDetail,
  validateActions
}