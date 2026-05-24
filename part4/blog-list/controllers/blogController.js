const blogsRouter = require('express').Router()
const { response } = require('../app')
const Blog = require('../models/blog')
const logger = require('../utils/logger')

blogsRouter.get('/', async(req, res,next) => {

  // logger.info('request arrived')
  // try {
    const blogs = await Blog.find({})
    res.status(200).json(blogs)
  // } catch(error){
  //   next(error)
  // }
  
  // Blog.find({}).then((blogs) => {
  //   res.json(blogs)
  // }).catch(next)
})

blogsRouter.get('/:id', async(req, res, next) => {
  // try {
    const blog = await Blog.findById(req.params.id)
    if (blog) res.json(blog)
      else res.status(404).end()
  // } catch(error) {
  //   next(error)
  // }
  
  // Blog.findById(req.params.id)
  //   .then((blog) => {
  //     if (blog) res.json(blog)
  //     else res.status(404).end()
  //   })
  //   .catch((error) => next(error))
})

blogsRouter.post('/',async(req,res,next)=>{
  const body = req.body
  const blog = new Blog({
    title:body.title,
    author:body.author,
    url:body.url,
    likes:body.likes
  })
  // try{
    const savedBlog = await blog.save()
    // res.status(201)
    // res.json(savedBlog)
    res.status(201).json(savedBlog)
  // }catch(error){
  //   next(error)
  // }
  

})

blogsRouter.delete('/:id', async(request,response)=>{
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})
module.exports = blogsRouter
