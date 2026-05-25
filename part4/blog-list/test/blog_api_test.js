const {test,after, beforeEach, describe} = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const assert = require('node:assert')
const { before } = require('lodash')
const Blog = require('../models/blog')
const { title } = require('node:process')
const helper = require('./blog_api_test_helper')

const api = supertest(app)

describe('when there is initially some blogs saved',()=>{    

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


  // test part 4.8
  test('all blogs are returned', async()=>{
      const response = await api.get('/api/blogs')
      assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('a specific blog is within the returned blogs',async()=>{
    // const response = await api.get('/api/blogs')
    const blogs = await helper.blogsInDb()
    const titles = blogs.map(b => b.title)
    assert(titles.includes('First Blog'))

  })

  describe('viewing a specific blog',()=>{
    // test part 4.9
    test('blogs have id instead of _id', async ()=>{
        let blogs = await helper.blogsInDb() 
        blogs.forEach(obj => {
            assert.ok(obj.id!==undefined,'id should be defined')
            assert.ok(obj._id===undefined,'_id should not be defined')
        });
    })
    
    test('a specific blog can be viewed', async()=>{
        const blogAtStart = await helper.blogsInDb()
        const blogToView = blogAtStart[0]
        // console.log('test start')
        // console.log(blogToView)
        // console.log('test end')
        const resultBlog = await api
            .get(`/api/blogs/${blogToView.id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        assert.deepStrictEqual(resultBlog.body,blogToView)
    })
  })

  describe('addition of a new blog',()=>{
    //test part 4.10
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

    

    //test part 4.11
    test('a blog with no likes property default to 0',async()=>{
        const newBlog = {
            title: 'blog with no likes property',
            author: 'Fan',
            url: 'test.com/1118'
        }
        const savedBlog = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

        const response = await helper.blogsInDb()
        assert.strictEqual(response.length, helper.initialBlogs.length+1)

        assert.strictEqual(savedBlog.body.likes,0)
    })

    //test part 4.12
    test('blog without title or url return 400', async()=>{
        const newBlog_noTitle = {
            author:'fan',
            url:'http://test.com/123',
        }
        const newBlog_noUrl = {
            title:'no_url',
            author:'fan',
        }
        // const a = await api
        await api
        .post('/api/blogs')
        .send(newBlog_noTitle)
        .expect(400)
        .expect('Content-Type',/application\/json/)
        // console.log('look here')
        // console.log(a)

        await api
        .post('/api/blogs')
        .send(newBlog_noUrl)
        .expect(400)
        .expect('Content-Type',/application\/json/)
    })
  })

  describe('update of a blog',()=>{
    test('succeds updates a blog likes',async()=>{
      const blogs = await helper.blogsInDb()
      const newBlog = blogs[0]
      newBlog.likes = 100
      const updateBlog = await api
                              .put(`/api/blogs/${newBlog.id}`)
                              .send(newBlog)
                              .expect(200)
                              .expect('Content-Type',/application\/json/)
      assert.strictEqual(updateBlog.body.likes,100)
      

    })
  })

  describe('deletion of a blog',()=>{
    test('succeeds with status code 204 if id is valid', async()=>{
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)
      const blogsAtEnd = await helper.blogsInDb()
      const ids = blogsAtEnd.map(b=>b.id)
      assert(!ids.includes(blogToDelete.id))
      assert.strictEqual(blogsAtStart.length,blogsAtEnd.length+1)
    })
  })
})
after(async() => { 
    await mongoose.connection.close()
}) 