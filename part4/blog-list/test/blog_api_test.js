const {test,after, beforeEach} = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const assert = require('node:assert')
const { before } = require('lodash')
const Blog = require('../models/blog')
const { title } = require('node:process')
const helper = require('./blog_api_test_helper')

const api = supertest(app)

 
beforeEach(async() => {
    await Blog.deleteMany({})
    const blogObjs = helper.initialBlogs.map(blog => new Blog(blog))
    const promiseArray = blogObjs.map(blog=>blog.save())
    await Promise.all(promiseArray)

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

test('all blogs are returned', async()=>{
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
})
test(' a valid blog can be added', async()=>{
    const newBlog = {
        title: 'Third Blog',
        author: 'Fan',
        url: 'http://test.com/3',
        likes: 30
    }
    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    
    const response = await helper.blogsInDb()
    assert.strictEqual(response.length, helper.initialBlogs.length+1)
    const contents = response.map(r=>r.title)
    console.log(contents)
    assert(contents.includes('Third Blog'))
})

test('blog without title is not added', async()=>{
    const newBlog = {
        title:'',
        author: 'Fan',
        url: 'http://empty.com',
        likes: 0
    }
    await api
        .post('/api/blogs/')
        .send(newBlog)
        .expect(400)
        
    const response = await helper.blogsInDb()
    assert.strictEqual(response.length,helper.initialBlogs.length)


})

test('a specific blog can be viewed', async()=>{
    const blogAtStart = await helper.blogsInDb()
    const blogToView = blogAtStart[0]
    console.log('test start')
    console.log(blogToView)
    console.log('test end')
    const resultBlog = await api
        .get(`/api/blogs/${blogToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    assert.deepStrictEqual(resultBlog.body,blogToView)
})
after(async() => { 
    await mongoose.connection.close()
}) 