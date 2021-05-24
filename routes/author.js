const express = require('express')
const author = require('../models/author')
const authorsRouter = express.Router()
const Author = require('../models/author')
const Book = require('../models/book')

authorsRouter.get('/',async (req,res)=>{
    let searchParams = {}
    if (req.query.name != null && req.query.name !== '') {
        searchParams.name = new RegExp(req.query.name, 'i')
    }
    try {
        const authors = await Author.find(searchParams)
        res.render('authors/index', {
            authors : authors,  
            searchParams: req.query
        })
    } catch {
        res.redirect('/')
    }
})

authorsRouter.get('/new',(req,res)=>{
    res.render('authors/new', {author: new Author()})
})
 
authorsRouter.post('/', async (req,res)=>{
    const author =  new Author({
        name: req.body.name
    })
    try {
        const newAthor = await author.save()
        res.redirect(`authors`)
    } catch {        
        res.render('authors/new', {
            author: author,
            errorMessage: 'Error creating new author'
        })
    }
})

authorsRouter.get('/:id', async (req, res) => {
    try {
        const author = await Author.findById(req.params.id)
        const books = await Book.find({author: req.params.id}).limit(5).exec()
        res.render('authors/show', {
            author: author,
            books: books 
        })
    } catch  {
        res.redirect('/authors')
    }
})

authorsRouter.get('/:id/edit', async (req, res) => {
    try {
        const author = await Author.findById(req.params.id)
        res.render('authors/edit', {
            author: author
        })
    } catch {
        res.redirect('/')
    }
})

authorsRouter.put('/:id',async (req, res) => {
    try {
        const author = await Author.findById(req.params.id)
        author.name = req.body.name
        await author.save()
        res.redirect('/authors')
    } catch {
        res.redirect('/')   
    }
})

authorsRouter.delete('/:id',async (req, res) => {
    try {
        const author = await Author.findById(req.params.id)
        await author.remove()
        res.redirect('/authors')
    } catch {
        if (author == null) {
            res.redirect('/')
        } else {
            res.redirect(`/authors/${req.params.id}`)
        }
    }
})

module.exports = authorsRouter