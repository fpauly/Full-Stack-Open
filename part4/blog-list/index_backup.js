require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')



const app = express()

const blogSchema = mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
})

const Blog = mongoose.model('Blog',blogSchema)

const mongoUrl = process.env.MONGODB_URI

mongoose.connect(mongoUrl,{family:4})

app.use(express.json())

app.get('/',(request,response)=>{
  response.send('<h1 align = center>Hello Full Stack Open</h1>')
})

app.get('/api/blogs',(request,response)=>{
  Blog.find({}).then(blogs=>{
    response.json(blogs)
  })
})

app.post('/api/blogs',(request,response)=>{
  const blog = new Blog(request.body)

  blog.save().then(result=>{
    response.status(201).json(result)
  })
})

const PORT = process.env.PORT

//add this for favicon error
// app.get('/favicon.ico', (req, res) => res.status(204).end())


app.listen(PORT,()=>{
  console.log(`Server is running on port ${PORT}`)
})

