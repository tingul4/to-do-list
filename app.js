const express = require('express')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const mongoose = require('mongoose')
const Todo = require('./models/todo.js')
const bodyParser = require('body-parser') // use bodyParser to get post form data correctly
const routes = require('./routes') // 引用路由器
const port = 3000

const app = express()

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
} // get password from .env to connect MongoDB

// handlebars setting
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: 'hbs' }))
app.set('view engine', 'hbs') 

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

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

app.use(bodyParser.urlencoded({ extended : true }))
app.use(methodOverride('_method')) // 設定每一筆請求都會透過 methodOverride 進行前置處理
app.use(routes) // 將 request 導入路由器

app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})