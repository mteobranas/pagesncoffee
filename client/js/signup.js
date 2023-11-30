document.getElementById('signup').addEventListener('submit', (e) => {
  e.preventDefault()

  const username = document.getElementById('username').value
  const email = document.getElementById('email').value
  const password = document.getElementById('password').value

  if (!username || !email || !password) {
    return alert('Username, email and password are required')
  }

  fetch('http://localhost:3000/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, email, password }),
  })
})
