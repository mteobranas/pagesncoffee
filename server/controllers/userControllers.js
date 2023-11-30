const userModel = require('../models/userModels')

const getUser = async (req, res) => {
  try {
    const users = await userModel.getUser()
    if (users.length === 0) {
      return res.status(404).send('No users found')
    }
    res.json({ users })
  } catch (error) {
    console.log(error)
  }
}