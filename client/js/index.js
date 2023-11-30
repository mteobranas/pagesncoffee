document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('postForm').addEventListener('submit', (e) => {
    e.preventDefault()
    post()
  })

  getPosts()
})

function getPosts() {
  fetch('http://localhost:3000/posts', {
    method: 'GET',
    headers: {
      authorization: localStorage.getItem('token'),
    },
  })
    .then((res) => res.json())
    .then((data) => {
      const root = document.getElementById('root')
      root.innerHTML = ''
      data.posts.forEach((post) => {
        root.innerHTML += `
          <div>
            <h1>${post.title}</h1>
            <p>${post.content}</p>
            <p>${post.publish_date}</p>
            <p>${post.username}</p>
          </div>
        `
      })
    })
}

function post() {
  const title = document.getElementById('title').value
  const content = document.getElementById('content').value

  fetch('http://localhost:3000/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      authorization: localStorage.getItem('token'),
    },
    body: JSON.stringify({ title, content }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log('Response from server:', data)
      getPosts()
    })
    .catch((error) => {
      console.error('Error:', error)
    })

  document.getElementById('title').value = ''
  document.getElementById('content').value = ''
}
