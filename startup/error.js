module.exports = function() {
  require('express-async-errors')
  
  process.on('uncaughtException', err => {
    console.log(err)
    process.exit(1)
  })
  process.on('unhandledRejection', err => {
    throw err
  })
}