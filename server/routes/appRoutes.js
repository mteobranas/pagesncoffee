const express = require('express')
const cors = require('cors')

const postController = require('../controllers/postControllers')
const userController = require('../controllers/userControllers')

const router = express.Router()
router.use(cors())
router.use(express.json())

router.get('/posts', postController.getPosts)

module.exports = router