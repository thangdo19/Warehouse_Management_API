const { User, validateUser, validateUserPermissions } = require('../models/User')
const { Permission, validatePermission } = require('../models/Permission')
const { PermissionDetail } = require('../models/PermissionDetail')
const { Op } = require('sequelize')
const auth = require('../middleware/auth')
const checkAction = require('../middleware/check_action')
const _ = require('lodash')
const bcrypt = require('bcrypt')
const sequelize = require('../db/connection')
const express = require('express')
const router = express.Router()

router.get('/', async (req, res) => {
  const users = await User.findAll({
    attributes: { exclude: ['createdAt', 'updatedAt', 'password'] },
    include: {
      model: Permission,
      as: 'permissions',
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      include: {
        model: PermissionDetail,
        as: 'permissionDetails',
        attributes: { exclude: ['createdAt', 'updatedAt', 'permissionId'] }
      },
      through: { attributes: [] }
    }, 
  })
  return res.json({ status: 200, data: users })
})

router.get('/:id', async (req, res) => {
  const user = await User.findOne({ 
    where: { id: req.params.id },
    attributes: { exclude: ['createdAt', 'updatedAt', 'password'] },
    include: {
      model: Permission,
      as: 'permissions',
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      include: {
        model: PermissionDetail,
        as: 'permissionDetails',
        attributes: { exclude: ['createdAt', 'updatedAt', 'permissionId'] }
      },
      through: { attributes: [] }
    }, 
  })
  return res.json({ status: 200, data: user })
})

router.get('/test/:id', [auth, checkAction('EDIT_ORDER')], async (req, res) => {
  return res.json({ status: 200 })
})

router.post('/', [validateUser], async (req, res) => {
  const userInDb = await User.findOne({ where: {
    [Op.or]: { phone: req.body.phone, email: req.body.email }
  }})
  if (userInDb) return res.json({ status: 400, message: 'User already registered' })
  // hash password
  req.body.password = await bcrypt.hash(req.body.password, await bcrypt.genSalt(10))
  // create a new user
  const user = await User.create(req.body)
  const userInShort = _.omit(user.get({ plain: true }), ['createdAt', 'updatedAt', 'password'])
  return res.json({ status: 201, data: userInShort })
})

router.post('/permissions', [validateUserPermissions], async (req, res) => {
  const user = await User.findOne({ where: { id: req.body.userId }})
  if (!user) return res.json({ status: 404, message: 'User not found' })
  
  const transaction = await sequelize.transaction()
  try {
    for (const perId of req.body.permissionIds) {
      const userPermission = await user.addPermission(perId, { transaction: transaction })
      console.log(userPermission)
    }
  }
  catch(err) {
    console.log(err)
    await transaction.rollback()
    return res.json({ status: 400, message: err.message })
  }

  await transaction.commit()
  return res.json({ status: 200 })
})

router.patch('/:id', [validateUser], async (req, res) => {
  const user = await User.findOne({ where: {
    [Op.or]: { phone: req.body.phone, email: req.body.email }
  }})
  if (!user) return res.json({ status: 400, message: 'User not found' })
  // hash if has password
  if (req.body.password) {
    req.body.password = await bcrypt.hash(req.body.password, await bcrypt.genSalt(10))
  }
  // update the rest
  const newUser = await user.update(req.body)
  const newUserInShort = _.omit(newUser.get({ plain: true }), ['createdAt', 'updatedAt', 'password'])
  return res.json({ status: 200, data: newUserInShort })
})

router.delete('/:id', async (req, res) => {
  const deletedCount = await User.destroy({ where: { id: req.params.id }})
  return res.json({ status: 200, deletedCount })
})

module.exports = router