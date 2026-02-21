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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
}
