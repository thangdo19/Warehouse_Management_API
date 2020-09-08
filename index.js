const express = require('express')
const app = express()
require('./startup/config')()
require('./startup/error')()
require('./startup/routes')(app)
require('./startup/model_association')()
// require('./db/sync')() // create table & relationship
app.listen(port = (process.env.PORT || 3000), () => console.log(`Listening on port ${port}...`))