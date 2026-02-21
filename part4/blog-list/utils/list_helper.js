const _ = require('lodash')

const dummy = (blogs) => {
  return blogs ? 1 : 1
}

const totalLikes = (blogs) => {
  // console.log(blogs.reduce((sum, b) => sum + b.likes, 0))
  return blogs.reduce((sum, b) => sum + b.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (!blogs.length) return null

  return blogs.reduce(
    (favorite, blog) => (favorite.likes > blog.likes ? favorite : blog),
    blogs[0],
  )
}
const mostBlogs = (blogs) => {
  if (!blogs.length) return null

  const grouped = _.groupBy(blogs, 'author')
  const mapped = Object.entries(grouped).map(([author, blogs]) => ({
    author,
    blogs: blogs.length,
  }))
  return _.maxBy(mapped, 'blogs')
}
module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
}
