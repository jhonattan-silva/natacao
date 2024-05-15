module.exports = function(app, db) { //tudo que usa o app do express aqui dentro e o app e o banco como parametros
    app.get('/buscarEquipes', function(req, res) {
        var equipe = req.query.equipe;
        var sql = 'SELECT id, nome FROM equipes WHERE nome LIKE ?';
        db.query(sql, ['%' + equipe + '%'], function(err, results) {
        if(err) {
            console.error(err);
            res.status(500).send('Erro ao buscar equipes');
        } else {
            const idEquipe = results[0].id; //pega o id para vincular ao nadador
            res.json(results);
        }
        });
    });



app.post('/salvarNadador', function(req, res) {
    var nome = req.body.nome;
    var cpf = req.body.cpf;
    var dtnasc = req.body.dtnasc;
    var telefone = req.body.fone;
    var equipes_id = req.body.idEquipe; // Lembre-se de obter o id da equipe escolhida anteriormente

    // Execute a consulta SQL para inserir os dados na tabela de nadadores
    var sql = 'INSERT INTO nadadores (nome, cpf, dtnasc, telefone, equipes_id) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [nome, cpf, dtnasc, telefone, equipes_id], function(err, result) {
        if (err) {
            console.error(err);
            res.status(500).send('Erro ao salvar nadador');
        } else {
            res.json({ message: 'Nadador salvo com sucesso!' });
        }
    });
});

}//FECHA O MODULE EXPORTS