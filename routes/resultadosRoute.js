const express = require('express');
const router = express.Router();
const ensureAuthenticated = require('../middlewares/authMiddleware');
const db = require('../config/db'); // Certifique-se de ajustar o caminho conforme necessário

// Rota para buscar eventos
router.get('/buscarEventos', ensureAuthenticated, (req, res) => {
    const query = 'SELECT id, nome, data, cidade FROM eventos';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Erro ao buscar eventos:', err);
            res.status(500).send('Erro ao buscar eventos');
        } else {
            res.json(results);
        }
    });
});

// Rota para buscar torneios
router.get('/buscarTorneios', ensureAuthenticated, (req, res) => {
    const query = 'SELECT id, nome FROM torneios';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Erro ao buscar torneios:', err);
            res.status(500).send('Erro ao buscar torneios');
        } else {
            res.json(results);
        }
    });
});

module.exports = router;
