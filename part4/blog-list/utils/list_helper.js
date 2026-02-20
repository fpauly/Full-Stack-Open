const dummy = (blogs) => {
  return blogs ? 1 : 1
}

const totalLikes = (blogs) => {
  // console.log(blogs.reduce((sum, b) => sum + b.likes, 0))
  return blogs.reduce((sum, b) => sum + b.likes, 0)
}

module.exports = {
  dummy,
  totalLikes,
}
