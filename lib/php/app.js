const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const app = express();
app.use(bodyParser.json());

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'mybase'
});

connection.connect();

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Veuillez fournir un nom d\'utilisateur et un mot de passe' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    connection.query('SELECT * FROM tableuser WHERE username = ?', [username], async (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erreur de connexion à la base de données' });
      }

      if (results.length === 0) {
        return res.status(401).json({ error: 'Nom d\'utilisateur ou mot de passe incorrect' });
      }

      const user = results[0];
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Nom d\'utilisateur ou mot de passe incorrect' });
      }

      const token = jwt.sign({ username: user.username, id: user.id }, 'secret_key');
      connection.query('UPDATE tableuser SET token = ? WHERE id = ?', [token, user.id], (updateErr) => {
        if (updateErr) {
          console.error(updateErr);
          return res.status(500).json({ error: 'Erreur de mise à jour du token' });
        }

        res.json({ token });
      });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erreur lors du traitement de la requête' });
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
