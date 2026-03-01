fetch('http://localhost:3000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        email: 'bademail',
        password: '123',
        full_name: 'Hacker',
        bio: 'a'
    })
})
    .then(res => res.json().then(data => ({ status: res.status, body: data })))
    .then(console.log)
    .catch(console.error);
