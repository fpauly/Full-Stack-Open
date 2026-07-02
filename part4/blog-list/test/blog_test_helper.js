// const { urlencoded } = require('express')
const Blog = require('../models/blog')
const User = require('../models/user')

const initialUsers = [

  {
    username: 'fan',
    name: 'Fan',

  },
  {
    username: 'lei',
    name: 'Lei',

  },
  {
    username: 'new user',
    name: 'New User'
  },
]

const initialBlogs = [
  {
    title: 'First Blog',
    author: 'Fan',
    url: 'http://test.com/11',
    likes: 10
  },
  {
    title: 'Second Blog',
    author: 'Fan',
    url: 'http://test.com/22',
    likes: 20
  }
]

const nonExistingId = async () => {
  const blog = new Blog({ title: 'thisisforemptyblog' })
  await blog.save()
  await blog.deleteOne()
  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  return blogs.map(b => b.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({}).populate('blogs', { title: 1, author: 1, url: 1, likes: 1 })
  return users.map(u => u.toJSON())
}

module.exports = {
  initialUsers,
  initialBlogs,
  nonExistingId,
  blogsInDb,
  usersInDb
}