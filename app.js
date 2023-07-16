const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser') // use bodyParser to get post form data correctly
const methodOverride = require('method-override')
const session = require('express-session')
const flash = require('connect-flash')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const routes = require('./routes') // 引用路由器
const usePassport = require('./config/passport')
require('./config/mongoose')

const app = express()

// handlebars setting
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: 'hbs' }))
app.set('view engine', 'hbs') 

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))

app.use(bodyParser.urlencoded({ extended : true }))
app.use(methodOverride('_method')) // 設定每一筆請求都會透過 methodOverride 進行前置處理

usePassport(app)
app.use(flash())
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  res.locals.success_msg = req.flash('success_msg')  // 設定 success_msg 訊息
  res.locals.warning_msg = req.flash('warning_msg')  // 設定 warning_msg 訊息
  next()
})
app.use(routes) // 將 request 導入路由器

app.listen(process.env.PORT, () => {
  console.log(`Express is listening on localhost:${process.env.PORT}`)
})