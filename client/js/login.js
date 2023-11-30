document.getElementById('login').addEventListener('submit', (e) => {
  e.preventDefault()

  const email = document.getElementById('email').value
  const password = document.getElementById('password').value

  if (!email || !password) {
    return alert('Email and password are required')
  }

  fetch('http://localhost:3000/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })
    .then((res) => res.json())
    .then((data) => {
      localStorage.setItem('token', data.token)
      window.location.href = './index.html'
    })
})
