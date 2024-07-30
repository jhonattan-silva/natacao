const express = require('express');
const router = express.Router();
const ensureAuthenticated = require('../middlewares/authMiddleware');
const pool = require('../config/db'); // Certifique-se de ajustar o caminho conforme necessário

// Rota para buscar eventos
router.get('/buscarEventos', async (req, res) => {
    try {
      const [eventos] = await pool.query('SELECT * FROM eventos');
      res.json(eventos);
    } catch (error) {
      console.error('Erro ao buscar eventos:', error);
      res.status(500).send('Erro ao buscar eventos');
    }
  });

// Rota para buscar provas de um evento específico
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

// Rota para buscar baterias e suas inscrições
router.get('/buscarBaterias', async (req, res) => {
  const provaId = req.query.provaId;
  try {
      const baterias = await pool.query('SELECT * FROM baterias WHERE provas_id = ?', [provaId]);

      // Buscar inscrições associadas a cada bateria
      for (let bateria of baterias) {
          bateria.nadadores = await pool.query(
            `SELECT n.nome, b.piscina, b.raia
            FROM baterias_inscricoes b
            JOIN inscricoes i ON b.Inscricoes_id = i.id
            JOIN nadadores n ON i.Nadadores_id = n.id
            WHERE b.Baterias_id = ?`,
              [bateria.id]
          );
      }

      res.json(baterias);
  } catch (error) {
      console.error('Erro ao buscar baterias:', error);
      res.status(500).send('Erro ao buscar baterias');
  }
});

module.exports = router;