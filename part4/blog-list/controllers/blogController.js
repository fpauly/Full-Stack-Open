const blogsRouter = require('express').Router()
const { request, response } = require('../app')
// const { response } = require('../app')
const Blog = require('../models/blog')
const logger = require('../utils/logger')
const User = require('../models/user')

blogsRouter.get('/', async(req, res) => {
  // throw new Error('test error')
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

blogsRouter.get('/:id', async(req, res) => {
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

blogsRouter.post('/',async(req,res)=>{
  const body = req.body
  const user = await User.findById(req.userId)

  if(!user) {
    return res.status(400).json({error: 'userId missing or not valid'})
  }


  const blog = new Blog({
    title:body.title,
    author:body.author,
    url:body.url,
    likes:body.likes,
    user: user._id
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

blogsRouter.put('/:id',async(request,response)=>{
  const blog = await Blog.findById(request.params.id)
  if(!blog)
    return response.status(404).end()

  const {title,author,url,likes} = request.body
  blog.title = title //request.body.title
  blog.author = author
  blog.url = url
  blog.likes = likes

  const newBlog = await blog.save()
  
  return response.status(200).json(newBlog) 
  
})

blogsRouter.delete('/:id', async(request,response)=>{
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})
module.exports = blogsRouter
