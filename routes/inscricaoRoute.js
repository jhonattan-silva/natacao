const express = require('express');
const router = express.Router();
const ensureAuthenticated = require('../middlewares/authMiddleware');
const db = require('../config/db'); // Certifique-se de ajustar o caminho conforme necessário

// Rota para buscar equipes
router.get('/buscarEquipes', ensureAuthenticated, (req, res) => {
    const equipe = req.query.equipe;
    const sql = 'SELECT id, nome FROM equipes WHERE nome LIKE ?';
    db.query(sql, ['%' + equipe + '%'], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Erro ao buscar equipes');
            return;
        }
        const equipes = results.map(equipe => ({
            id: equipe.id,
            nome: equipe.nome
        }));
        res.json(equipes);
    });
});

// Rota para salvar nadador
router.post('/salvarNadador', ensureAuthenticated, (req, res) => {
    const { nome, cpf, sexo, data_nasc, telefone, idEquipe } = req.body;
    
    // Verifica se o CPF já está cadastrado
    const duplicado = 'SELECT id FROM nadadores WHERE cpf = ?';
    db.query(duplicado, [cpf], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Erro ao verificar CPF');
            return;
        }
        
        if (results.length > 0) {
            // CPF já está cadastrado
            res.status(400).json({ message: 'CPF já cadastrado' });
        } else {
            // CPF não está cadastrado, prossegue com a inserção
            const insertSql = 'INSERT INTO nadadores (nome, cpf, sexo, data_nasc, telefone, equipes_id) VALUES (?, ?, ?, ?, ?, ?)';
            db.query(insertSql, [nome, cpf, sexo, data_nasc, telefone, idEquipe], (err, results) => {
                if (err) {
                    console.error(err);
                    res.status(500).send('Erro ao salvar nadador');
                } else {
                    res.json({ message: 'Nadador salvo com sucesso!' });
                }
            });
        }
    });
});

module.exports = router;
