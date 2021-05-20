const express = require('express')
const authorsRouter = express.Router()
const Author = require('../models/author')

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

module.exports = authorsRouter