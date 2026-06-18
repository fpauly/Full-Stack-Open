const blogsRouter = require('express').Router()
const { request, response } = require('../app')
// const { response } = require('../app')
const Blog = require('../models/blog')
const logger = require('../utils/logger')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const getTokenFrom = request =>{
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer')) {
    return authorization.replace('Bearer ','')
  }
  return null
}

blogsRouter.get('/', async(req, res) => {
  // throw new Error('test error')
  // logger.info('request arrived')
  // try {
    const blogs = await Blog.find({}).populate('user',{username:1,name:1})
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
    const blog = await Blog.findById(req.params.id).populate('user',{username:1,name:1})
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

  const decodedToken = jwt.verify(getTokenFrom(req),process.env.SECRET)
  if(!decodedToken.id) {
    return res.status(401).json({error: 'token invalid'})

  }
  const user = await User.findById(decodedToken.id)
  // const user = await User.findById(body.user)

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
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
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
  await Blog.findByIdAndDelete(request.params.id).populate('user',{username:1,name:1})
  response.status(204).end()
})
module.exports = blogsRouter
