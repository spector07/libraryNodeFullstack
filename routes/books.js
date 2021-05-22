const express = require('express')
const booksRouter = express.Router()
const Book = require('../models/book')
const Author = require('../models/author')
const multer = require('multer')
const path = require('path')
/* const uploadPath = path.join('public', Book.coverImageBasePath)
const imageMimeTypes = ['images/jpeg', 'image/png', 'image/gif']
const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => {
        callback(null, imageMimeTypes.includes(file.mimetype))
    }
}) */

// All books
booksRouter.get('/',async (req,res)=>{
    let bookQuery = Book.find()
    if (req.query.title != null && req.query.title != '') {
        bookQuery = bookQuery.regex('title', new RegExp(req.query.title, 'i'))
    }
    if (req.query.publishedAfter != null && req.query.publishedAfter != '') {
        bookQuery = bookQuery.gte('publishDate', req.query.publishedAfter)
    }
    if (req.query.publishedBefore != null && req.query.publishedBefore != '') {
        bookQuery = bookQuery.lte('publishDate', req.query.publishedBefore)
    }
    try {
        const books = await bookQuery.exec()
        res.render('books/index',{
            books: books,
            searchParams: req.query
        })
    } catch(er) {
        res.redirect('/')
    }
})
 
// Create book route upload.single('cover'),
// const fileName = req.file != null ? req.file.filename : null
// coverImageName: fileName,

booksRouter.post('/',  async (req, res) => {
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        description: req.body.description
    })

    try {
        const newBook = await book.save()
        res.redirect('/books')
    } catch (err) {
        renderNewPage(res, new Book(), true)    
    }
})

// New book route
booksRouter.get('/new',async (req,res)=>{
    renderNewPage(res, new Book())    
})

async function renderNewPage(res, book, hasError = false) {
    try {
        const authors = await Author.find({})
        const params = {
            authors: authors,
            book: book
        }
        if(hasError) params.errorMessage = 'Error Creating Book'
        res.render('books/new',params)
    } catch (er){
        console.log(er)
        res.redirect('/books')
    }
}

module.exports = booksRouter