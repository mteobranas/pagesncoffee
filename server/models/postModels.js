const db = require('mariadb')

const pool = db.createPool({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'blog',
  connectionLimit: 5,
})

const getPosts = async () => {
  let conn
  try {
    conn = await pool.getConnection()
    const rows = await conn.query(
      'SELECT p.title, p.content, p.publish_date, u.username FROM posts p JOIN users u ON p.author = u.id'
    )
    return rows
  } catch (error) {
    console.log(error)
  } finally {
    if (conn) conn.end()
  }
}

module.exports = { getPosts }