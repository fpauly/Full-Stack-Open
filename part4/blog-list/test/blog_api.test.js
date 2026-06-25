const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const assert = require('node:assert')
const Blog = require('../models/blog')
// const { title } = require('node:process')
const bcrypt = require('bcrypt')
const helper = require('./blog_test_helper')
const User = require('../models/user')
// const loginRouter = require('../controllers/login')
// const { application } = require('express')
const api = supertest(app)

describe('when there is initially some blogs saved', () => {

  beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    const initialPass = await bcrypt.hash('123456', 10)
    const users = helper.initialUsers.map(u => new User(u))
    // users.map(u=>u.passwordHash = initialPass)

    users.forEach(u => u.passwordHash = initialPass)
    const savedUsers = await User.insertMany(users)
    const userId = savedUsers[0].id
    // const blogs = helper.initialBlogs.map(b => ({ ...b, user: userId }))
    // const savedBlogs = await Blog.insertMany(blogs)

    // savedUsers.forEach(u=>u.blogs.push(userId))
    // await Promise.add(savedUsers.map(u => u.save()))
    const blogIds = (await Blog.find({ user: userId })).map(b => b._id)
    await User.updateOne(
      { _id: userId },
      { $push: { blogs: { $each: blogIds } } }
    )

    // const blogObjs = helper.initialBlogs.map(blog => new Blog(blog))
    // const promiseArray = blogObjs.map(blog=>blog.save())
    // await Promise.all(promiseArray)

    // for (let blog of helper.initialBlogs){
    //     let blogObj = new Blog(blog)
    //     await blogObj.save()
    // }

    // for (let blogKey in helper.initialBlogs){
    //     let blogObj = new Blog(helper.initialBlogs[blogKey])
    //     await blogObj.save()
    // }

    // let blogObject = new Blog(helper.initialBlogs[0])
    // await blogObject.save()
    // blogObject = new Blog(helper.initialBlogs[1])
    // await blogObject.save()
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })


  // test part 4.8
  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('a specific blog is within the returned blogs', async () => {
    // const response = await api.get('/api/blogs')
    const blogs = await helper.blogsInDb()
    const titles = blogs.map(b => b.title)
    assert(titles.includes('First Blog'))

  })

  describe('viewing a specific blog', () => {
    // test part 4.9
    test('blogs have id instead of _id', async () => {
      let blogs = await helper.blogsInDb()
      blogs.forEach(obj => {
        assert.ok(obj.id !== undefined, 'id should be defined')
        assert.ok(obj._id === undefined, '_id should not be defined')
      })
    })

    test('a specific blog can be viewed', async () => {
      const blogAtStart = await helper.blogsInDb()
      const blogToView = blogAtStart[0]
      // console.log('test start')
      // console.log(blogToView)
      // console.log('test end')
      const resultBlog = await api
        .get(`/api/blogs/${blogToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      assert.deepStrictEqual(resultBlog.body, blogToView)
    })
  })

  describe('addition of a new blog', () => {

    // let token
    // beforeEach(async()=>{
    //   //login


    //   const loginData = {
    //     username:'fan',
    //     password:'123456'
    //   }
    //   const loginResult = await api
    //                             .post('/api/login')
    //                             .send(loginData)
    //                             .expect(200)
    //                             .expect('Content-Type',/application\/json/)
    //   token = loginResult.body.token
    // })
    //test part 4.10
    test(' a valid blog can be added', async () => {



      const userOne = (await helper.usersInDb())[0]
      // console.log(userOne)

      //login
      const loginResult = await api
        .post('/api/login')
        .send({
          username: userOne.username,
          password: '123456'
        })
        .expect(200)
        .expect('Content-Type', /application\/json/)
      const token = loginResult.body.token
      //login, get token

      const newBlog = {
        title: 'Third Blog',
        author: 'Fan',
        user: userOne.id,
        url: 'http://test.com/3',
        likes: 30
      }
      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)


      const response = await helper.blogsInDb()
      assert.strictEqual(response.length, helper.initialBlogs.length + 1)
      const contents = response.map(r => r.title)
      // console.log(contents)
      assert(contents.includes('Third Blog'))
    })



    test('blog without title is not added', async () => {
      const userOne = (await helper.usersInDb())[0]
      //login
      const loginResult = await api
        .post('/api/login')
        .send({
          username: userOne.username,
          password: '123456'
        })
        .expect(200)
        .expect('Content-Type', /application\/json/)
      const token = loginResult.body.token
      //login, get token
      const newBlog = {
        title: '',
        author: 'Fan',
        user: userOne.id,
        url: 'http://empty.com',
        likes: 0
      }
      await api
        .post('/api/blogs/')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(400)

      const response = await helper.blogsInDb()
      assert.strictEqual(response.length, helper.initialBlogs.length)


    })



    //test part 4.11
    test('a blog with no likes property default to 0', async () => {
      const userOne = (await helper.usersInDb())[0]
      const loginData = await api.post('/api/login')
        .send({
          username: userOne.username,
          password: '123456'
        })
        .expect(200)
        .expect('Content-Type', /application\/json/)
      const token = loginData.body.token
      const newBlog = {
        title: 'blog with no likes property',
        author: 'Fan',
        user: userOne.id,
        url: 'test.com/1118'
      }

      const savedBlog = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const response = await helper.blogsInDb()
      assert.strictEqual(response.length, helper.initialBlogs.length + 1)

      assert.strictEqual(savedBlog.body.likes, 0)
    })

    //test part 4.12
    test('blog without title or url return 400', async () => {
      const users = await helper.usersInDb()
      const userOne = users[0]
      const loginData = await api.post('/api/login')
        .send({
          username: userOne.username,
          password: '123456'
        })
        .expect(200)
        .expect('Content-Type', /application\/json/)
      const token = loginData.body.token
      const newBlog_noTitle = {
        author: 'fan',
        url: 'http://test.com/123',
      }
      const newBlog_noUrl = {
        title: 'no_url',
        author: 'fan',
      }
      // const a = await api
      await api
        .post('/api/blogs')
        .send(newBlog_noTitle)
        .set('Authorization', `Bearer ${token}`)
        .expect(400)
        .expect('Content-Type', /application\/json/)
      // console.log('look here')
      // console.log(a)

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog_noUrl)
        .expect(400)
        .expect('Content-Type', /application\/json/)
    })

    test('blog without token can not be added and return 401', async () => {
      const users = await helper.usersInDb()
      const userOne = users[0]
      const newBlog = {
        title: 'Third Blog',
        author: 'Fan',
        user: userOne.id,
        url: 'http://test.com/3',
        likes: 30
      }
      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)
        .expect('Content-Type', /application\/json/)



    })
  })

  describe('update of a blog', () => {
    test('succeds updates a blog likes', async () => {
      const blogs = await helper.blogsInDb()


      const newBlog = blogs[0]
      const userData = {
        username: newBlog.user.username,
        password: '123456'
      }
      const loginData = await api.post('/api/login').send(userData).expect(200).expect('Content-Type', /application\/json/)
      const token = loginData.body.token

      newBlog.likes = 100
      const updateBlog = await api
        .put(`/api/blogs/${newBlog.id}`)
        .send(newBlog)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
      assert.strictEqual(updateBlog.body.likes, 100)


    })
  })

  describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {

      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]
      const userData = {
        username: blogToDelete.user.username,
        password: '123456'
      }
      const loginData = await api.post('/api/login')
        .send(userData)
        .expect(200)
        .expect('Content-Type', /application\/json/)
      const token = loginData.body.token

      await api.delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)
      const blogsAtEnd = await helper.blogsInDb()
      const ids = blogsAtEnd.map(b => b.id)
      assert(!ids.includes(blogToDelete.id))
      assert.strictEqual(blogsAtStart.length, blogsAtEnd.length + 1)
    })
  })
})

//part 4.15
describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('123456', 10)
    const user = new User({ username: 'root', name: 'admin', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'fan',
      name: 'fan fan',
      password: '123456'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtStart.length + 1, usersAtEnd.length)

    const usernames = usersAtEnd.map(u => u.username)
    usersAtEnd.forEach(u => console.log(u.username))


    assert(usernames.includes(newUser.username))
  })
  test('creation need valid username and password', async () => {
    const usersAtStart = await helper.usersInDb()
    const newUser_noUsername = {
      name: 'no username',
      password: '123456'
    }
    const newUser_noPassword = {
      username: 'no password',
      name: 'no password'
    }
    await api
      .post('/api/users')
      .send(newUser_noUsername)
      .expect(400)
    await api
      .post('/api/users')
      .send(newUser_noPassword)
      .expect(400)
    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtStart.length, usersAtEnd.length)
  })
  test('creation need username and password at least 3 characters long', async () => {
    const usersAtStart = await helper.usersInDb()
    const newUser_shortUsername = {
      username: 'ab',
      name: 'short username',
      password: '123456'
    }
    const newUser_shortPassword = {
      username: 'short password',
      name: 'short password',
      password: '12'
    }
    await api
      .post('/api/users')
      .send(newUser_shortUsername)
      .expect(400)
    await api
      .post('/api/users')
      .send(newUser_shortPassword)
      .expect(400)
    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtStart.length, usersAtEnd.length)
  })
})
after(async () => {
  await mongoose.connection.close()
}) 