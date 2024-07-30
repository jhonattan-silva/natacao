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

// Rota para obter todas as provas
router.get('/provas', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT id, estilo, distancia, tipo FROM tipoprovas');
        res.json(rows);
    } catch (error) {
        console.error('Erro ao carregar provas:', error);
        res.status(500).json({ error: 'Erro ao carregar provas' });
    }
});

router.post('/cadastrar', async (req, res) => {
    const { nome, data, cidade, sede, endereco, Torneios_id, provas } = req.body;

    try {
        // Inserir o evento na tabela eventos
        const [result] = await pool.query('INSERT INTO eventos (nome, data, cidade, sede, endereco, Torneios_id) VALUES (?, ?, ?, ?, ?, ?)', [nome, data, cidade, sede, endereco, Torneios_id]);
        const eventoId = result.insertId;

        // Inserir as provas na tabela provas
        for (const prova of provas) {
            // Buscar informações da prova da tabela tipoprovas para concatenar no nome
            const [tipoProva] = await pool.query('SELECT estilo, distancia, tipo FROM tipoprovas WHERE id = ?', [prova.TipoProvas_id]);

            // Construir o nome concatenando os valores
            const nomeProva = `${tipoProva[0].estilo} ${tipoProva[0].distancia}m (${tipoProva[0].tipo}) ${prova.sexo}`;

            await pool.query('INSERT INTO provas (TipoProvas_id, Eventos_id, sexo, nome) VALUES (?, ?, ?, ?)', [prova.TipoProvas_id, eventoId, prova.sexo, nomeProva]);
        }

        // Buscar o evento cadastrado junto com as provas
        const [evento] = await pool.query('SELECT * FROM eventos WHERE id = ?', [eventoId]);
        const [provasCadastradas] = await pool.query('SELECT * FROM provas WHERE Eventos_id = ?', [eventoId]);

        res.json({ ...evento[0], provas: provasCadastradas });
    } catch (error) {
        console.error('Erro ao cadastrar etapa:', error);
        res.status(500).json({ error: 'Erro ao cadastrar etapa' });
    }
});


module.exports = router;
