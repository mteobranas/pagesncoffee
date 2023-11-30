const express = require('express')
const db = require('mariadb')
const cors = require('cors')
const jwt = require('jsonwebtoken')

const router = require('./routes/appRoutes')

const app = express()
const port = process.env.PORT ?? 3000
const secretKey = 'mysecretkey'

const pool = db.createPool({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'blog',
  connectionLimit: 5,
})

app.use(express.json())
app.use(cors())

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']
  try {
    if (!token) {
      throw new Error('Token not provided')
    }
    const decoded = jwt.verify(token, secretKey)
    req.user_id = decoded
    next()
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).send('Token has expired')
    }
    return res.status(401).send('Unauthorized')
  }
}

app.post('/signup', async (req, res) => {
  let conn
  try {
    conn = await pool.getConnection()
    const { username, email, password } = req.body
    if (!username || !email || !password) {
      return res.status(400).send('Username and password is required')
    }
    let query, queryParams
    query = 'INSERT INTO users (username, email, password) VALUES (?, ?)'
    queryParams = [username, email, password]
    await conn.query(query, queryParams)
    res.status(201).send('User created')
  } catch (error) {
    console.error(error)
    res.status(500).send('Internal Server Error')
  } finally {
    if (conn) {
      conn.release()
    }
  }
})

app.post('/login', async (req, res) => {
  let conn
  try {
    conn = await pool.getConnection()
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).send('Username and password is required')
    }
    let query, queryParams
    query = 'SELECT * FROM users WHERE email = ? AND password = ?'
    queryParams = [email, password]
    const rows = await conn.query(query, queryParams)
    if (rows.length === 0) {
      return res.status(401).send('Wrong username or password')
    }
    const user_id = rows[0].id
    const token = jwt.sign({ user_id }, secretKey)
    res.json({ token })
  } catch (error) {
    console.error(error)
    res.status(500).send('Internal Server Error')
  } finally {
    if (conn) {
      conn.release()
    }
  }
})

app.use('/posts', verifyToken)

app.use('/', router)

app.get('/posts', async (req, res) => {
  console.log("get")
  let conn
  try {
    conn = await pool.getConnection()
    const rows = await conn.query('SELECT p.title, p.content, p.publish_date, u.username FROM posts p JOIN users u ON p.author = u.id')
    res.json(rows)
  } catch (error) {
    console.log(error)
  } finally {
    if (conn) conn.end()
  }
})

app.post('/posts', async (req, res) => {
  console.log("post")
  let conn
  try {
    conn = await pool.getConnection()
    const { title, content } = req.body
    console.log(title, content)
    const user_id = req.user_id.user_id
    await conn.query('INSERT INTO posts (title, content, author) VALUES (?, ?, ?)', [
      title,
      content,
      user_id,
    ])
    res.status(201).json({message: 'Post created'})
  } catch (error) {
    console.log(error)
  } finally {
    if (conn) conn.end()
  }
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
