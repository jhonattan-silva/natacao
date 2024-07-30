const express = require('express');
const router = express.Router();
const pool = require('../config/db'); // Ajuste o caminho conforme necessário

// Rota para obter as equipes
router.get('/buscarEquipes', async (req, res) => {
    try {
        const [equipes] = await pool.query('SELECT * FROM equipes');
        res.json(equipes);
    } catch (error) {
        console.error('Erro ao buscar equipes:', error);
        res.status(500).send('Erro ao buscar equipes');
    }
});

// Rota para obter os nadadores de uma equipe específica
router.get('/buscarNadadores', async (req, res) => {
    const equipeId = req.query.equipeId;
    if (!equipeId) {
        return res.status(400).send('Equipe ID é necessário');
    }

    try {
        const [nadadores] = await pool.query('SELECT * FROM nadadores WHERE equipes_id = ?', [equipeId]);
        res.json(nadadores);
    } catch (error) {
        console.error('Erro ao buscar nadadores:', error);
        res.status(500).send('Erro ao buscar nadadores');
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


router.get('/buscarEventos', async (req, res) => {
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
        const [provas] = await pool.query('SELECT * FROM provas WHERE eventos_id = ?', [eventoId]);
        res.json(provas);
    } catch (error) {
        console.error('Erro ao buscar provas:', error);
        res.status(500).send('Erro ao buscar provas');
    }
});

// Rota para salvar a inscrição dos nadadores nas provas
router.post('/salvarInscricao', async (req, res) => {
    const { eventoId, inscricoes } = req.body;

    try {
        for (const inscricao of inscricoes) {
            const { nadadorId, provaId } = inscricao;
            await pool.query('INSERT INTO inscricoes (nadadores_id, provas_id, eventos_id) VALUES (?, ?, ?)', [nadadorId, provaId, eventoId]);
        }
        res.sendStatus(200);
    } catch (error) {
        console.error('Erro ao salvar inscrição:', error);
        res.status(500).send('Erro ao salvar inscrição');
    }
});



module.exports = router;
