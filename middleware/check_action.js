const { User } = require('../models/User')
const { Permission } = require('../models/Permission')
const { PermissionDetail } = require('../models/PermissionDetail')

module.exports = function checkAction(actionName) {
  return async (req, res, next) => {
    const user = await User.findOne({ 
      where: { id: req.user.id },
      include: {
        model: Permission,
        as: 'permissions',
        include: {
          model: PermissionDetail,
          as: 'permissionDetails',
        }
      }, 
    })

    const permissions = await user.getPermissions()
    if (!permissions) return res.json({ status: 400, message: 'This user has no permission' })

    for (const permission of permissions) {
      const detail = (await permission.getPermissionDetails({ where: { actionName: actionName } }))[0]
      if (detail) if (detail.checkAction === true) return next()
    }

    return res.json({ status: 403, message: 'Access forbidden' })
  }
}