const { Permission, validatePermission } = require('../models/Permission')
const { PermissionDetail, validateActions } = require('../models/PermissionDetail')
const sequelize = require('../db/connection')
const express = require('express')
const router = express.Router()

router.get('/', async (req, res) => {
  const permissions = await Permission.findAll({
    attributes: { exclude: ['createdAt', 'updatedAt'] }
  })
  return res.json({ status: 200, data: permissions })
})

router.get('/details', async (req, res) => {
  const details = await PermissionDetail.findAll({
    attributes: { exclude: ['createdAt', 'updatedAt'] }
  })
  return res.json({ status: 200, data: details })
})

router.post('/', [validatePermission], async (req, res) => {
  const transaction = await sequelize.transaction()
  try {
    const permission = await Permission.create(req.body, { transaction: transaction })
    await addDetails(permission.id, transaction)

    await transaction.commit()
    return res.json({ status: 201, data: permission })
  }
  catch(err) {
    await transaction.rollback()
    return res.json({ 
      status: 400,
      message: (err.parent) ? err.parent.sqlMessage : err.message 
    })
  }
})

router.patch('/details', [validateActions], async (req, res) => {
  const transaction = await sequelize.transaction()
  try {
    // loop for every actionName then update it
    for (const name of req.body.actionNames) {
      await PermissionDetail.update({ checkAction: (req.body.havePermission) ? true : false }, {
        transaction: transaction,
        where: { 
          permissionId: req.body.permissionId,
          actionName: name
        }
      })
    }
    // no error occurs, commit transaction & response
    await transaction.commit()
    return res.json({ status: 200 })
  }
  catch(err) {
    console.log(err)
    await transaction.rollback()
    return res.json({ status: 400, message: err.message })
  }
})

async function addDetails(perId, transaction) {
  const actionNames = [
    'CREATE_USER', 'VIEW_USER', 'EDIT_USER', 'DELETE_USER',
    'CREATE_PERMISSION', 'VIEW_PERMISSION', 'EDIT_PERMISSION', 'DELETE_PERMISSION',
  ]
  for (const action of actionNames) {
    await PermissionDetail.create(await createDetail(perId, action), { transaction: transaction })
  }
}

async function createDetail(permissionId, actionName) {
  const detailObj = {
    permissionId: permissionId,
    actionCode: actionName.split('_')[0],
    actionName: actionName,
    checkAction: 0
  }
  // create permission detail
  return detailObj
}

module.exports = router
