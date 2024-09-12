const ensureAuthenticated = require('../middlewares/authMiddleware');
const express = require('express');
const router = express.Router();
const pool = require('../config/db'); // Ajuste o caminho conforme necessário

router.post('/cadastrarUsuario', async (req, res) => {
  const { nome, cpf, celular, email, senha, perfis, equipeId, ativo } = req.body;

  console.log('Dados recebidos para cadastro:', req.body); // Verifique os dados recebidos

  try {
    // VERIFICAÇÃO SE JÁ NÃO ESTÁ CADASTRADO
    const [cpfRepetido] = await pool.query('SELECT id FROM usuarios WHERE cpf = ?', [cpf]);
    if (cpfRepetido.length > 0) {
      return res.status(400).json({ message: 'CPF já registrado' });
    }

    // VERIFICA SE OS CAMPOS OBRIGATÓRIOS ESTÃO PREENCHIDOS (SEM EQUIPEID)
    if (!nome || !cpf || !celular || !email || !senha || perfis.length === 0) {
      return res.status(400).send('Todos os campos são obrigatórios');
    }

    // INSERE O USUÁRIO NA TABELA usuarios
    const [userResult] = await pool.query(
      'INSERT INTO usuarios (nome, cpf, celular, email, senha, ativo) VALUES (?, ?, ?, ?, ?, ?)',
      [nome, cpf, celular, email, senha, ativo]
    );

    const userId = userResult.insertId;

    // INSERE OS PERFIS ASSOCIADOS AO USUÁRIO
    const perfilPromises = perfis.map(perfilId => {
      return pool.query('INSERT INTO usuarios_perfis (usuarios_id, perfis_id) VALUES (?, ?)', [userId, perfilId]);
    });

    await Promise.all(perfilPromises);

    // INSERE NA TABELA usuarios_equipes SOMENTE SE equipeId FOR FORNECIDO
    if (equipeId !== null) {
      await pool.query('INSERT INTO usuarios_equipes (usuarios_id, equipes_id) VALUES (?, ?)', [userId, equipeId]);
    }
    

    res.status(201).send('Usuário cadastrado com sucesso');
  } catch (error) {
    console.error('Erro ao cadastrar usuário:', error);
    res.status(500).send('Erro ao cadastrar usuário');
  }
});


router.put('/atualizarUsuario/:id', async (req, res) => {
  const userId = req.params.id;
  const { nome, cpf, celular, email, senha, perfis, equipeId } = req.body;

  try {
    // Cria a query de atualização base
    let query = 'UPDATE usuarios SET nome = ?, cpf = ?, celular = ?, email = ?';
    const params = [nome, cpf, celular, email];
    
    // Adiciona o campo equipe_id se não estiver vazio
    if (equipeId) {
      query += ', equipe_id = ?';
      params.push(equipeId);
    }

    // Se a senha foi enviada, adiciona à query
    if (senha) {
      query += ', senha = ?';
      params.push(senha);
    }
    
    query += ' WHERE id = ?';
    params.push(userId);

    await pool.query(query, params);

    // Remove os perfis antigos
    await pool.query('DELETE FROM usuarios_perfis WHERE usuarios_id = ?', [userId]);

    // Adiciona os perfis novos
    const perfilPromises = perfis.map(perfilId => {
      return pool.query('INSERT INTO usuarios_perfis (usuarios_id, perfis_id) VALUES (?, ?)', [userId, perfilId]);
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
      SELECT u.id, u.nome, u.cpf, u.celular, u.email,
             COALESCE(GROUP_CONCAT(DISTINCT p.nome SEPARATOR ', '), '') AS perfis,
             COALESCE(GROUP_CONCAT(DISTINCT e.nome SEPARATOR ', '), '') AS equipes
      FROM usuarios u
      LEFT JOIN usuarios_perfis up ON u.id = up.usuarios_id
      LEFT JOIN perfis p ON up.perfis_id = p.id
      LEFT JOIN usuarios_equipes ue ON u.id = ue.usuarios_id
      LEFT JOIN equipes e ON ue.equipes_id = e.id
      GROUP BY u.id, u.nome, u.cpf, u.celular, u.email
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

router.get('/buscarUsuario/:id', async (req, res) => {
  try {
    const userId = req.params.id;

    const query = `
      SELECT u.id, u.nome, u.cpf, u.celular, u.email,
             COALESCE(GROUP_CONCAT(DISTINCT p.nome SEPARATOR ', '), '') AS perfis,
             COALESCE(GROUP_CONCAT(DISTINCT e.nome SEPARATOR ', '), '') AS equipes
      FROM usuarios u
      LEFT JOIN usuarios_perfis up ON u.id = up.usuarios_id
      LEFT JOIN perfis p ON up.perfis_id = p.id
      LEFT JOIN usuarios_equipes ue ON u.id = ue.usuarios_id
      LEFT JOIN equipes e ON ue.equipes_id = e.id
      WHERE u.id = ?
      GROUP BY u.id, u.nome, u.cpf, u.celular, u.email
    `;

    const [usuario] = await pool.query(query, [userId]);

    if (usuario.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    const user = usuario[0];

    res.json({
      nome: user.nome,
      cpf: user.cpf,
      celular: user.celular,
      email: user.email,
      equipeId: user.equipes, // Substitua por como você quer manipular as equipes
      perfis: user.perfis.split(', '), // Assumindo que os perfis são separados por vírgula
    });
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).send('Erro ao buscar usuário');
  }
});





module.exports = router;
