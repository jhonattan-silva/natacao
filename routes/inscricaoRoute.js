module.exports = function(app, db) { //tudo que usa o app do express aqui dentro e o app e o banco como parametros
    app.get('/buscarEquipes', function(req, res) {
        var equipe = req.query.equipe;
        var sql = 'SELECT nome FROM equipes WHERE nome LIKE ?';
        db.query(sql, ['%' + equipe + '%'], function(err, results) {
        if(err) {
            console.error(err);
            res.status(500).send('Erro ao buscar equipes');
        } else {
            res.json(results);
        }
        });
    });
}