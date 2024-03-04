fetch('http://localhost:3000/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ username: 'wardia', password: '123' })
})
.then(response => {
  if (!response.ok) {
    throw new Error('Erreur lors de la requête');
  }
  return response.json();
})
.then(data => {
  console.log(data);
})
.catch(error => {
  console.error('Erreur:', error);
});
