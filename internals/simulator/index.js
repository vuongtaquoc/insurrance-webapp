const cors = require('cors')
const express = require('express')
const fs = require('fs')
const path = require('path')

const rootDir = path.resolve(__dirname)

const app = express()

app.use(cors())

const routes = fs.readdirSync(path.join(rootDir, 'routes'))

routes.forEach(route => {
  require(`./routes/${route}`)(app)
})

app.listen(3000, () => console.log('App listening at :3000'))
