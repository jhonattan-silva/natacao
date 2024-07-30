const ensureAuthenticated = require('../middlewares/authMiddleware');
const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Rota para obter todos os eventos disponíveis
router.get('/buscarEventos', async (req, res) => {
    try {
      const [eventos] = await pool.query('SELECT * FROM eventos');
      res.json(eventos);
    } catch (error) {
      console.error('Erro ao buscar eventos:', error);
      res.status(500).send('Erro ao buscar eventos');
    }
  });


  router.get('/buscarProvas', async (req, res) => {
    const eventoId = req.query.eventoId;
    if (!eventoId) {
        return res.status(400).send('Evento ID é necessário');
    }

    try {
        const [provas] = await pool.query('SELECT * FROM provas WHERE eventos_id = ?', [eventoId]);
        console.log('Provas encontradas:', provas);
        res.json(provas);
    } catch (error) {
        console.error('Erro ao buscar provas:', error);
        res.status(500).send('Erro ao buscar provas');
    }
});


// Rota para obter os nadadores inscritos em uma prova específica com seus records e tipo de prova
router.get('/buscarInscritos', async (req, res) => {
    const provaId = req.query.provaId;
    if (!provaId) {
        return res.status(400).send('Prova ID é necessário');
    }

    try {
        const [inscritos] = await pool.query(`
            SELECT 
                nadadores.id AS nadador_id, 
                nadadores.nome, 
                records.tempo AS record, 
                provas.tipoprovas_id, 
                provas.nome AS prova_nome,
                inscricoes.id AS Inscricoes_id  -- Certifique-se de selecionar o Inscricoes_id aqui
            FROM 
                inscricoes 
            INNER JOIN 
                nadadores ON inscricoes.Nadadores_id = nadadores.id 
            LEFT JOIN 
                records ON nadadores.id = records.Nadadores_id 
            LEFT JOIN 
                provas ON inscricoes.Provas_id = provas.id
            LEFT JOIN 
                provas AS provas_records ON records.Provas_id = provas_records.id
            WHERE 
                inscricoes.Provas_id = ? 
                AND (provas_records.tipoprovas_id = provas.tipoprovas_id OR records.tempo IS NULL);
        `, [provaId]);        
        console.log('Nadadores inscritos encontrados:', inscritos);
        res.json(inscritos);
    } catch (error) {
        console.error('Erro ao buscar inscritos:', error);
        res.status(500).send('Erro ao buscar inscritos');
    }
});


router.post('/salvarBaterias', async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const { Provas_id, numero, nadadores } = req.body;
        console.log('Dados dos nadadores recebidos:', nadadores);

        // Inserir uma nova bateria
        const [result] = await connection.execute(
            'INSERT INTO baterias (Provas_id, numero) VALUES (?, ?)',
            [Provas_id, numero]
        );

        const Baterias_id = result.insertId; // ID da bateria recém-criada

        // Inserir os nadadores nas baterias_inscricoes
        const valoresNadadores = nadadores.map(nadador => [
            Baterias_id,
            nadador.Inscricoes_id,
            numero,
            nadador.raia
        ]);

        await connection.query(
            'INSERT INTO baterias_inscricoes (Baterias_id, Inscricoes_id, piscina, raia) VALUES ?',
            [valoresNadadores]
        );

        res.status(201).json({ message: 'Baterias salvas com sucesso' });
    } catch (error) {
        console.error('Erro ao salvar baterias:', error);
        res.status(500).json({ message: 'Erro ao salvar baterias' });
    } finally {
        connection.release();
    }
});


  module.exports = router;
