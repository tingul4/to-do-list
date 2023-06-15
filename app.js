const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('It\'s a to-do list.')
})

app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})