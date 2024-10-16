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

router.get('/listarInscritos/', async (req, res) => {
    const eventoId = req.query.eventoId;
    if (!eventoId) {
        return res.status(400).send('Evento ID é necessário');
    }
    try {
        const [rows] = await pool.query(`
            SELECT 
                CONCAT(p.estilo, ' ', p.distancia, 'm ', p.tipo, ' ', p.sexo) AS nome_prova,  -- Concatena as colunas para formar o nome da prova
                n.nome AS nome_nadador,
                COALESCE(r.tempo, 'Sem recorde') AS melhor_tempo
            FROM
                inscricoes i
            INNER JOIN nadadores n ON i.nadadores_id = n.id
            INNER JOIN eventos_provas ep ON i.eventos_provas_id = ep.id
            INNER JOIN provas p ON ep.provas_id = p.id
            LEFT JOIN records r ON n.id = r.nadadores_id AND ep.provas_id = r.provas_id
            WHERE
                i.eventos_id = ?
            ORDER BY p.estilo, p.distancia, p.tipo, p.sexo, r.tempo;
        `, [eventoId]);

        res.json(rows);
    } catch (error) {
        console.error('Erro ao buscar inscritos:', error);
        res.status(500).send('Erro ao buscar inscrições');
    }
});

router.post('/salvarBaterias', async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const { baterias, eventos_id, tipoProvas_id } = req.body; // Recebe os dados das baterias, eventos e tipo de provas

        // Para cada prova/bateria, vamos salvar as informações
        for (const bateria of baterias) {
            const { Provas_id, numero, nadador } = bateria;

            // Inserir uma nova bateria
            const [result] = await connection.execute(
                'INSERT INTO baterias (descricao, eventos_id, tipoProvas_id, Nadadores_id, provas_id) VALUES (?, ?, ?, ?, ?)',
                [
                    `Bateria ${numero}`,   // descricao
                    eventos_id,            // eventos_id
                    tipoProvas_id,          // tipoProvas_id
                    nadador.Inscricoes_id,  // Nadadores_id (associando o nadador)
                    Provas_id               // provas_id
                ]
            );

            const Baterias_id = result.insertId; // ID da bateria recém-criada

            // Inserir o nadador na tabela baterias_inscricoes
            await connection.execute(
                'INSERT INTO baterias_inscricoes (baterias_id, inscricoes_id, piscina, raia) VALUES (?, ?, ?, ?)',
                [
                    Baterias_id,            // baterias_id (ID da bateria recém-criada)
                    nadador.Inscricoes_id,  // inscricoes_id
                    numero,                 // piscina (número da bateria)
                    nadador.raia            // raia
                ]
            );
        }

        res.status(201).json({ message: 'Baterias salvas com sucesso' });
    } catch (error) {
        console.error('Erro ao salvar baterias:', error);
        res.status(500).json({ message: 'Erro ao salvar baterias' });
    } finally {
        connection.release();
    }
});



/* router.post('/salvarBaterias', async (req, res) => {
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
 */

module.exports = router;
