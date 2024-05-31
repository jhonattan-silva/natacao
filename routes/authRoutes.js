// Importando módulos necessários
const express = require('express'); // Framework web para Node.js
const passport = require('passport'); // Módulo para autenticação
const bcrypt = require('bcrypt'); // Módulo para criptografia de senha
const db = require('../config/db'); // Importa configurações do banco de dados

const router = express.Router(); // Cria um novo roteador Express
const SALT_ROUNDS = 10; // Define o número de rodadas de sal para a criptografia bcrypt

// Rota de registro
router.post('/register', async (req, res) => {
  const { username, password } = req.body; // Extrai o nome de usuário e a senha do corpo da requisição
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS); // Criptografa a senha usando bcrypt

  // Insere o novo usuário no banco de dados
  db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (err, result) => {
    if (err) { // Se houver um erro
      console.error('Erro ao registrar usuário:', err); // Loga o erro no console
      res.status(500).send('Erro ao registrar usuário'); // Envia uma resposta de erro
    } else { // Se não houver erro
      res.redirect('/login'); // Redireciona para a página de login
    }
  });
});

// Rota de login
router.post('/login', passport.authenticate('local', { // Usa a estratégia de autenticação local do Passport
  successRedirect: '/pagina-protegida', // Redireciona para a página protegida em caso de sucesso
  failureRedirect: '/login', // Redireciona para a página de login em caso de falha
  failureFlash: true // Habilita mensagens flash para erros de autenticação
}));

// Rota de logout
router.get('/logout', (req, res) => {
  req.logout(() => { // Faz logout do usuário
    res.redirect('/'); // Redireciona para a página inicial
  });
});

// Exporta o roteador
module.exports = router;
