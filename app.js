const express = require('express')
const port = 3000

// 
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const app = express()

const mongoose = require('mongoose')
mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })

// 取得資料庫連線狀態
const db = mongoose.connection
// 連線異常
db.on('error', () => {
  console.log('mongodb error!')
})
// 連線成功
db.once('open', () => {
  console.log('mongodb connected!')
})

app.get('/', (req, res) => {
  res.send('It\'s a to-do list.')
})

app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})