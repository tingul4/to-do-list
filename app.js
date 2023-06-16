const port = 3000
const express = require('express')
const app = express()

const Todo = require('./models/todo.js')

// use bodyParser to get post form data correctly
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended : true }))

// get password from .env
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

// add handlebars 
const exphbs = require('express-handlebars')
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: 'hbs' }))
app.set('view engine', 'hbs')

const mongoose = require('mongoose')
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

app.get('/', (req, res) => {
  Todo
    .find()
    .lean()
    .then(todos => {
      res.render('index', { todos })
    })
    .catch(error => console.error(error))
})

app.get('/todos/new', (req, res) => {
  res.render('new')
})

app.post('/todos', (req, res) => {
  const name = req.body.name
  const todo = new Todo({ name })

  return todo.save()
          .then(() => {res.redirect('/')})
          .catch(error => console.error(error))
  // we can also use code below to create a new data
  // return Todo.create({ name })
  //         .then(() => {res.redirect('/')})
  //         .catch(error => console.error(error))
})

app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})