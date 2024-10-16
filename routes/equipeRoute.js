const express = require('express');
const router = express.Router();
const pool = require('../config/db'); // Ajuste o caminho conforme necessário


router.post('/adicionarEquipe', async (req, res) => {
    const { nome, treinadorId } = req.body;

    if (!treinadorId) {
        return res.status(400).send('Treinador não foi selecionado');
    }

    try {
        // Iniciar uma transação para garantir que ambas as operações sejam feitas
        await pool.query('START TRANSACTION');

        // Insere a equipe e obtém o ID gerado
        const [resultEquipe] = await pool.query('INSERT INTO equipes (nome) VALUES (?)', [nome]);
        const equipeId = resultEquipe.insertId;

        // Insere o treinador (usuario_id) na tabela usuarios_equipes com a equipe recém-criada
        const [resultUsuarioEquipe] = await pool.query(
            'INSERT INTO usuarios_equipes (usuarios_id, equipes_id) VALUES (?, ?)', 
            [treinadorId, equipeId]
        );

        // Confirma a transação se tudo ocorrer bem
        await pool.query('COMMIT');

        res.status(201).json({ message: 'Equipe e associação com treinador adicionadas com sucesso', nome });
    } catch (error) {
        // Se houver erro, desfaz a transação
        await pool.query('ROLLBACK');
        console.error('Erro ao adicionar equipe:', error);
        res.status(500).json({ error: 'Ocorreu um erro ao adicionar a equipe. Por favor, tente novamente mais tarde.' });
       }
});



// Rota para editar uma equipe existente
router.put('/editarEquipe/:id', async (req, res) => {
    const equipeId = req.params.id;
    const { nome } = req.body;
    try {
        await pool.query('UPDATE equipes SET nome = ? WHERE id = ?', [nome, equipeId]);
        res.send('Equipe atualizada com sucesso');
    } catch (error) {
        console.error('Erro ao atualizar equipe:', error);
        res.status(500).send('Erro ao atualizar equipe');
    }
});


// Rota para obter as equipes e seus respectivos treinadores
router.get('/listarEquipes', async (req, res) => {
    try {
        const [equipes] = await pool.query('SELECT e.nome AS equipe, e.id AS id, u.nome AS treinador FROM equipes e JOIN usuarios_equipes ue ON e.id = ue.equipes_id JOIN usuarios u ON ue.usuarios_id = u.id');
        res.json(equipes);
    } catch (error) {
        console.error('Erro ao buscar equipes:', error);
        res.status(500).send('Erro ao buscar equipes');
    }
});


//Rota para buscar treinadores por nome
router.get('/buscarTreinadores', async (req, res) => {
    const query = req.query.query;
    try {
        const [treinadores] = await pool.query(`
            SELECT id, nome
            FROM usuarios
            WHERE nome LIKE ?
        `, [`%${query}%`]);

        res.json(treinadores);
    } catch (error) {
        console.error('Erro ao buscar treinadores:', error);
        res.status(500).send('Erro ao buscar treinadores');
    }
});


// Rota para obter os nadadores de uma equipe específica
router.get('/buscarNadadores', async (req, res) => {
    const equipeId = parseInt(req.query.equipeId);
  
    if (!equipeId || equipeId <= 0) {
      return res.status(400).send('Equipe ID inválido');
    }
  
    try {
      const [nadadores] = await pool.query('SELECT id, nome FROM nadadores WHERE equipes_id = ?', [equipeId]);
      res.json(nadadores);
    } catch (error) {
      console.error('Erro ao buscar nadadores:', error);
      res.status(500).send('Erro ao buscar nadadores: ' + error.message);
    }
  });

// Rota para obter os dados de um nadador específico
router.get('/buscarNadador', async (req, res) => {
    const id = req.query.id;
    if (!id) {
        return res.status(400).send('ID do nadador é necessário');
    }

    try {
        const [nadador] = await pool.query('SELECT * FROM nadadores WHERE id = ?', [id]);
        res.json(nadador[0]);
    } catch (error) {
        console.error('Erro ao buscar nadador:', error);
        res.status(500).send('Erro ao buscar nadador');
    }
});


//Rota para adicionar Nadador
router.post('/adicionarNadador', async (req, res) => {
    const { nome, cpf, data_nasc, telefone, sexo, equipeId } = req.body;

    const cpfNumeros = cpf.replace(/\D/g, '');

    try {
        // Insere um novo registro no banco de dados
        const [result] = await pool.query('INSERT INTO nadadores (nome, cpf, data_nasc, telefone, sexo, equipes_id) VALUES (?, ?, ?, ?, ?, ?)', [nome, cpfNumeros, data_nasc, telefone, sexo, equipeId]);
        res.status(201).json({ id: result.insertId }); // Retorna o ID do novo nadador
    } catch (error) {
        console.error('Erro ao adicionar nadador:', error);
        res.status(500).send('Erro ao adicionar nadador');
    }
});


// Rota para editar um nadador
router.put('/editarNadador/:id', async (req, res) => {
    const id = req.params.id;
    const { nome, cpf, data_nasc, telefone, sexo } = req.body;
        // Logando os dados recebidos
        console.log('ID:', id);
        console.log('Nome:', nome);
        console.log('CPF:', cpf);
        console.log('Data de Nascimento:', data_nasc);
        console.log('Telefone:', telefone);
        console.log('Sexo:', sexo);
    try {
        await pool.query('UPDATE nadadores SET nome = ?, cpf = ?, data_nasc = ?, telefone = ?, sexo = ? WHERE id = ?', [nome, cpf, data_nasc, telefone, sexo, id]);
        res.sendStatus(200);
    } catch (error) {
        console.error('Erro ao editar nadador:', error);
        res.status(500).send('Erro ao editar nadador');
    }
});

// Rota para remover um nadador
router.delete('/removerNadador/:id', async (req, res) => {
    const id = req.params.id;

    try {
        await pool.query('DELETE FROM nadadores WHERE id = ?', [id]);
        res.sendStatus(200);
    } catch (error) {
        console.error('Erro ao remover nadador:', error);
        res.status(500).send('Erro ao remover nadador');
    }
});


router.get('/listarEventos', async (req, res) => {
    try {
        const [eventos] = await pool.query('SELECT * FROM eventos');
        res.json(eventos);
    } catch (error) {
        console.error('Erro ao buscar eventos:', error);
        res.status(500).send('Erro ao buscar eventos');
    }
});

// Rota para obter as provas de um evento específico
router.get('/buscarProvas', async (req, res) => {
    const eventoId = req.query.eventoId;
    if (!eventoId) {
        return res.status(400).send('Evento ID é necessário');
    }

    try {
        const [provas] = await pool.query('SELECT * FROM eventos_provas WHERE eventos_id = ?', [eventoId]);
        res.json(provas);
    } catch (error) {
        console.error('Erro ao buscar provas:', error);
        res.status(500).send('Erro ao buscar provas');
    }
});


// Rota para obter as provas de um evento específico e os nadadores da equipe para inscrição
router.get('/eventoEquipe', async (req, res) => {
    const eventoId = req.query.eventoId;
    const equipeId = req.query.equipeId;

    if (!eventoId || !equipeId) {
        return res.status(400).send('Evento e Equipe ID são necessários');
    }

    try {
        // Buscar provas do evento com detalhes das provas
        const [provas] = await pool.query(`
            SELECT p.*, ep.* 
            FROM eventos_provas ep
            JOIN provas p ON ep.provas_id = p.id
            WHERE ep.eventos_id = ?`, [eventoId]);

        // Buscar nadadores da equipe
        const [nadadores] = await pool.query('SELECT * FROM nadadores WHERE equipes_id = ?', [equipeId]);
        
        // Retornar os dados em um objeto
        res.json({ provas, nadadores });
    } catch (error) {
        console.error('Erro ao buscar provas e nadadores:', error);
        res.status(500).send('Ocorreu um erro ao buscar os dados.');
    }
});



// Rota para salvar a inscrição dos nadadores nas provas
router.post('/salvarInscricao',  async (req, res) => {
    const nadadoresInscritos = req.body; // Espera receber um array de objetos
    console.log(nadadoresInscritos);
    

    try {
        // Aqui você deve inserir os dados no banco de dados
        for (const inscricao of nadadoresInscritos) {
            const { nadadorId, provaId, eventoId } = inscricao;

            // Insira a lógica para salvar a inscrição no banco de dados
            await pool.query('INSERT INTO inscricoes (Nadadores_id, Eventos_id, Eventos_Provas_id) VALUES (?, ?, ?)', [nadadorId, eventoId, provaId]);
        }

        res.json({ message: 'Inscrições realizadas com sucesso!' });
    } catch (error) {
        console.error('Erro ao realizar inscrição:', error);
        res.status(500).send('Erro ao realizar inscrição.');
    }
});

//Rota para verificar nadadores já inscritos
router.post('/verificarInscricao', async (req, res) => {
    try {
      const { nadadorId, provaId, eventoId } = req.body;
  
      const inscricao = await Inscricao.findOne({
        where: {
          nadadorId,
          provaId,
          eventoId
        }
      });
  
      res.json({ inscrito: !!inscricao });
    } catch (error) {
      console.error('Erro ao verificar inscrição:', error);
      res.status(500).json({ error: 'Erro ao verificar inscrição' });
    }
  });

module.exports = router;
