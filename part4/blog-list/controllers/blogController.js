const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const logger = require('../utils/logger')

blogsRouter.get('/', (req, res,next) => {

  logger.info('request arrived')
  Blog.find({}).then((blogs) => {
    res.json(blogs)
  }).catch(next)
})

blogsRouter.get('/:id', (req, res, next) => {
  Blog.findById(req.params.id)
    .then((blog) => {
      if (blog) res.json(blog)
      else res.status(404).end()
    })
    .catch((error) => next(error))
})

module.exports = blogsRouter
