require('dotenv').config()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const Blog = require('./models/blog')
const User = require('./models/user')

const MONGODB_URI = process.env.MONGODB_URI

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('Connected to MongoDB')

    await User.deleteMany({})
    await Blog.deleteMany({})

    const passwordHash = await bcrypt.hash('123456', 10)

    const fan = await new User({
      username: 'fan',
      name: 'fan',
      passwordHash,
    }).save()
    console.log(`Created user: ${fan.username}`)

    const root = await new User({
      username: 'root',
      name: 'root',
      passwordHash,
    }).save()
    console.log(`Created user: ${root.username}`)


    const blogs = await Blog.insertMany([
      { title: 'First Blog', author: 'Fan', url: 'http://test.com/1', likes: 5, user: root.id },
      { title: 'Second Blog', author: 'Fan', url: 'http://test.com/2', likes: 10, user: root.id },
    ])
    console.log(`Created ${blogs.length} blogs`)

    fan.blogs = blogs.map(b => b._id)
    await fan.save()

    console.log('Seeding complete: root / 123456')
  } catch (error) {
    console.error('Seeding failed:', error)
  } finally {
    await mongoose.connection.close()
  }
}

seed()