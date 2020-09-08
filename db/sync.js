const sequelize = require('./connection')

module.exports = function() {
  sequelize.sync({ force: true })
    .then(() => console.log('Sync db successfully'))
    .catch(err => console.log(err))
}