const db = require('mariadb')

const pool = db.createPool({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'blog',
  connectionLimit: 5,
})

const getUser = async () => {
  let conn
  try {
    conn = await pool.getConnection()
    const rows = await conn.query('SELECT * FROM users')
    return rows
  } catch (error) {
    console.log(error)
  } finally {
    if (conn) conn.end()
  }
}