const express = require('express');
const app = express();

// Route pour gérer les requêtes GET à la racine de l'API
app.get('/', (req, res) => {
  res.send('Bonjour, ceci est la racine de mon API.');
});

// Autres routes et middleware...

// Démarrer le serveur sur le port 3000
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
