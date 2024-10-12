const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Rota para buscar eventos
router.get('/eventos', async (req, res) => {
    try {
        const [eventos] = await pool.query('SELECT * FROM eventos');
        res.json(eventos);
    } catch (error) {
        console.error('Erro ao buscar eventos:', error);
        res.status(500).json({ error: 'Erro ao buscar eventos' });
    }
});

// Rota para buscar torneios
router.get('/torneios', async (req, res) => {
    try {
        const [torneios] = await pool.query('SELECT id, nome FROM torneios');
        res.json(torneios);
    } catch (error) {
        console.error('Erro ao buscar torneios:', error);
        res.status(500).json({ error: 'Erro ao buscar torneios' });
    }
});

// Rota para obter provas filtradas por sexo
router.get('/provas', async (req, res) => {
    try {
      const sexo = req.query.sexo; // Obtém o parâmetro 'sexo' da query string
      let query = 'SELECT id, estilo, distancia, tipo FROM provas';
  
      if (sexo) {
        query += ' WHERE sexo = ?'; // Adiciona a cláusula WHERE se 'sexo' for fornecido
        const [rows] = await pool.query(query, [sexo]); // Passa o parâmetro 'sexo' como valor
        res.json(rows);
      } else {
        // Caso não seja fornecido o parâmetro 'sexo', retorna todas as provas
        const [rows] = await pool.query(query);
        res.json(rows);
      }
    } catch (error) {
      console.error('Erro ao carregar provas:', error);
      res.status(500).json({ error: 'Erro ao carregar provas' });
    }
  });

router.post('/cadastrar', async (req, res) => {
    const { nome, data, cidade, sede, endereco, Torneios_id, provas } = req.body;

    try {
        // Cria o evento na tabela eventos
        const [result] = await pool.query('INSERT INTO eventos (nome, data, cidade, sede, endereco, Torneios_id) VALUES (?, ?, ?, ?, ?, ?)', [nome, data, cidade, sede, endereco, Torneios_id]);
        const eventoId = result.insertId; //vai retornar o id desse novo evento (ferramenta do driver mysql2)

        // Inserir as provas na tabela provas
        for (const prova of provas) {
            await pool.query('INSERT INTO eventos_provas (eventos_id, provas_id) VALUES (?, ?)', [eventoId, prova.provas_id]);        
        }

        // Buscar o evento cadastrado junto com as provas
        const [evento] = await pool.query('SELECT * FROM eventos WHERE id = ?', [eventoId]);
        const [provasCadastradas] = await pool.query('SELECT * FROM eventos_provas WHERE Eventos_id = ?', [eventoId]);

        res.json({ ...evento[0], provas: provasCadastradas });
    } catch (error) {
        console.error('Erro ao cadastrar etapa:', error);
        res.status(500).json({ error: 'Erro ao cadastrar etapa' });
    }
});


module.exports = router;
