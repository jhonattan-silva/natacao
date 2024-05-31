const ensureAuthenticated = require('../middlewares/authMiddleware');
const express = require('express');
const router = express.Router();
const pool = require('../config/db'); // Ajuste o caminho conforme necessário

router.post('/cadastrarUsuario', async (req, res) => {
  const { nome, cpf, fone, email, senha, perfis } = req.body;

  console.log('Dados recebidos para cadastro:', req.body); // Verifique os dados recebidos

  try {
    const [userResult] = await pool.query(
      'INSERT INTO usuarios (nome, cpf, fone, email, senha) VALUES (?, ?, ?, ?, ?)',
      [nome, cpf, fone, email, senha]
    );

    const userId = userResult.insertId;

    const perfilPromises = perfis.map(perfilId => {
      return pool.query('INSERT INTO usuario_perfis (usuario_id, perfil_id) VALUES (?, ?)', [userId, perfilId]);
    });

    await Promise.all(perfilPromises);

    res.status(201).send('Usuário cadastrado com sucesso');
  } catch (error) {
    console.error('Erro ao cadastrar usuário:', error);
    res.status(500).send('Erro ao cadastrar usuário');
  }
});

router.get('/buscaUsuarios', async (req, res) => {
  try {
    const [rows] = await pool.query(`
    SELECT u.id, u.nome, u.cpf, u.fone, u.email,
           GROUP_CONCAT(p.nome SEPARATOR ', ') AS perfis
    FROM usuarios u
    LEFT JOIN usuario_perfis up ON u.id = up.usuario_id
    LEFT JOIN perfis p ON up.perfil_id = p.id
    GROUP BY u.id, u.nome, u.cpf, u.fone, u.email
  `);
      res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).send('Erro ao buscar usuários');
  }
});

router.get('/buscarPerfis', async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT id, nome FROM perfis');
      res.json(rows);
    } catch (error) {
      console.error('Erro ao buscar perfis:', error);
      res.status(500).send('Erro ao buscar perfis');
    }
  });
  

module.exports = router;
