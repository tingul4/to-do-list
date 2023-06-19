const port = 3000
const express = require('express')
const methodOverride = require('method-override')
const app = express()

const Todo = require('./models/todo.js')

// use bodyParser to get post form data correctly
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended : true }))

// get password from .env
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
// 設定每一筆請求都會透過 methodOverride 進行前置處理
app.use(methodOverride('_method'))

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
    .sort({ _id: 'asc' })
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

app.get('/todos/:id', (req, res) => {
  const id = req.params.id

  return Todo.findById(id)
          .lean()
          .then(todo => res.render('details', { todo }))
          .catch(error => console.error(error))
})

app.get('/todos/:id/edit', (req, res) => {
  const id = req.params.id

  return Todo.findById(id)
          .lean()
          .then(todo => res.render('edit', { todo }))
          .catch(error => console.error(error))
})

app.put('/todos/:id', (req, res) => {
  const id = req.params.id
  const { name, isDone } = req.body
  return Todo.findById(id)
    .then(todo => {
      todo.name = name
      todo.isDone = isDone === 'on'
      return todo.save()
    })
    .then(() => res.redirect(`/todos/${id}`))
    .catch(error => console.log(error))
})

app.delete('/todos/:id', (req, res) => {
  const id = req.params.id

  return Todo.findById(id)
          .then(todo => todo.remove())
          .then(() => res.redirect('/'))
          .catch(error => console.error(error))
})

app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})