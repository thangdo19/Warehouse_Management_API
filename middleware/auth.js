const jwt = require('jsonwebtoken')

module.exports = function(req, res, next) {
  const token = req.header('x-auth-token')
  if (!token) return res.json({ status: 401, message: 'Access denied. No token provided' })

  try {
    // decode token
    req.user = jwt.verify(token, process.env.JWT_KEY)
    next() 
  }
  catch(err) {
    return res.json({ status: 400, message: 'Invalid token' })
  }
}