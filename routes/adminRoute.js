const ensureAuthenticated = require('../middlewares/authMiddleware');
const express = require('express');
const router = express.Router();
const pool = require('../config/db'); // Ajuste o caminho conforme necessário

router.post('/cadastrarUsuario', async (req, res) => {
  const { nome, cpf, fone, email, senha, perfis, equipeId } = req.body;

  console.log('Dados recebidos para cadastro:', req.body); // Verifique os dados recebidos

  try {
    //VERIFICAÇÃO SE JÁ NÃO ESTÁ CADASTRADO
    const [cpfRepetido] = await pool.query('SELECT id FROM usuarios WHERE cpf = ?', [cpf]);
    if (cpfRepetido.length > 0) {
      return res.status(400).json({ message: 'CPF já registrado' });
    }

    // VERIFICA SE ALGUM CAMPO OBRIGATÓRIO ESTÁ EM BRANCO
    if (!nome || !cpf || !fone || !email || !senha || perfis.length === 0) {
      return res.status(400).send('Todos os campos são obrigatórios');
    }

    const [userResult] = await pool.query(
      'INSERT INTO usuarios (nome, cpf, fone, email, senha) VALUES (?, ?, ?, ?, ?)',
      [nome, cpf, fone, email, senha]
    );

    const userId = userResult.insertId;

    const perfilPromises = perfis.map(perfilId => {
      return pool.query('INSERT INTO usuario_perfis (usuario_id, perfil_id) VALUES (?, ?)', [userId, perfilId]);
    });

    const equipePromise = pool.query('INSERT INTO usuario_equipes (usuario_id, equipe_id) VALUES (?, ?)', [userId, equipeId]);

    await Promise.all(perfilPromises);
    await equipePromise;

    res.status(201).send('Usuário cadastrado com sucesso');
  } catch (error) {
    console.error('Erro ao cadastrar usuário:', error);
    res.status(500).send('Erro ao cadastrar usuário');
  }
});


router.put('/atualizarUsuario/:id', async (req, res) => {
  const userId = req.params.id;
  const { nome, cpf, fone, email, senha, perfis, equipeId } = req.body;

  try {
      // Cria a query de atualização base
      let query = 'UPDATE usuarios SET nome = ?, cpf = ?, fone = ?, email = ?, equipe_id = ? WHERE id = ?';
      const params = [nome, cpf, fone, email, equipeId, userId];

      // Se a senha foi enviada, adiciona à query
      if (senha) {
          query = 'UPDATE usuarios SET nome = ?, cpf = ?, fone = ?, email = ?, senha = ?, equipe_id = ? WHERE id = ?';
          params.splice(4, 0, senha); // Adiciona a senha na posição correta
      }

      await pool.query(query, params);

      // Remove os perfis antigos
      await pool.query('DELETE FROM usuario_perfis WHERE usuario_id = ?', [userId]);

      // Adiciona os perfis novos
      const perfilPromises = perfis.map(perfilId => {
          return pool.query('INSERT INTO usuario_perfis (usuario_id, perfil_id) VALUES (?, ?)', [userId, perfilId]);
      });

      await Promise.all(perfilPromises);

      res.send('Usuário atualizado com sucesso');
  } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      res.status(500).send('Erro ao atualizar usuário');
  }
});


router.get('/buscaUsuarios', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT u.id, u.nome, u.cpf, u.fone, u.email,
             COALESCE(GROUP_CONCAT(DISTINCT p.nome SEPARATOR ', '), '') AS perfis,
             COALESCE(GROUP_CONCAT(DISTINCT e.nome SEPARATOR ', '), '') AS equipes
      FROM usuarios u
      LEFT JOIN usuario_perfis up ON u.id = up.usuario_id
      LEFT JOIN perfis p ON up.perfil_id = p.id
      LEFT JOIN usuario_equipes ue ON u.id = ue.usuario_id
      LEFT JOIN equipes e ON ue.equipe_id = e.id
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

router.get('/buscarEquipes', async (req, res) => {
  try {
    const [equipes] = await pool.query('SELECT id, nome FROM equipes');
    res.json(equipes);
  } catch (error) {
    console.error('Erro ao buscar equipes:', error);
    res.status(500).send('Erro ao buscar equipes');
  }
});
module.exports = router;
