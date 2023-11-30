const postModel = require('../models/postModels')

const getPosts = async (req, res) => {
  try {
    const posts = await postModel.getPosts()
    if (posts.length === 0) {
      return res.status(404).send('No posts found')
    }
    res.json({ posts })
  } catch (error) {
    console.log(error)
  }
}

module.exports = { getPosts }