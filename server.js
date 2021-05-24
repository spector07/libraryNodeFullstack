if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const authorsRouter = require('./routes/author') 
const route = require('./routes/index')
const mongoose = require('mongoose')
const booksRouter = require('./routes/books')   
const methodOverride = require('method-override')

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout',  'layouts/layout')
app.use(expressLayouts)
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }))
app.use(methodOverride('_method'))

mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true})
const db = mongoose.connection

db.on('error', error => console.log(error))
db.once('open', () => console.log('Connected to MongoDB'))

app.use('/', route)
app.use('/authors', authorsRouter)
app.use('/books', booksRouter)

app.listen(process.env.PORT || 3000)